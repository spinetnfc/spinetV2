'use client';

import * as React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define props to mimic DayPicker for compatibility
export interface CalendarProps {
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  mode?: 'single'; // Support single mode
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  mode = 'single',
}: CalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    selected ? new Date(selected) : new Date(),
  );

  // Ensure currentMonth doesn't exceed today
  React.useEffect(() => {
    if (currentMonth > today) {
      setCurrentMonth(new Date(today));
    }
  }, [currentMonth]);

  // Month and year options
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ].filter((_, index) =>
    currentMonth.getFullYear() === today.getFullYear()
      ? index <= today.getMonth()
      : true,
  );

  const years = Array.from({ length: 121 }, (_, i) => today.getFullYear() - 120 + i).filter(
    (year) => year <= today.getFullYear(),
  );

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      // Prevent going beyond current month
      return newDate > today ? new Date(today) : newDate;
    });
  };

  const handleMonthChange = (month: string) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      const newMonthIndex = months.indexOf(month);
      // Only set month if it's valid (not after current month in current year)
      if (
        newDate.getFullYear() === today.getFullYear() &&
        newMonthIndex > today.getMonth()
      ) {
        return new Date(today);
      }
      newDate.setMonth(newMonthIndex);
      return newDate;
    });
  };

  const handleYearChange = (year: string) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      const newYear = parseInt(year);
      // Cap at current year
      if (newYear > today.getFullYear()) {
        return new Date(today);
      }
      newDate.setFullYear(newYear);
      // If current year, ensure month doesn't exceed current month
      if (newYear === today.getFullYear() && newDate.getMonth() > today.getMonth()) {
        newDate.setMonth(today.getMonth());
      }
      return newDate;
    });
  };

  // Generate days for the current month
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: { date: Date; isOutside: boolean }[] = [];

    // Add days from previous month if showOutsideDays
    if (showOutsideDays) {
      const firstDayOfWeek = firstDay.getDay();
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month, -i);
        days.push({ date, isOutside: true });
      }
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isOutside: false });
    }

    // Add days from next month if showOutsideDays
    if (showOutsideDays) {
      const lastDayOfWeek = lastDay.getDay();
      for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
        const date = new Date(year, month + 1, i);
        days.push({ date, isOutside: true });
      }
    }

    return days;
  };

  // Handle day selection
  const handleDayClick = (date: Date) => {
    if (onSelect && date <= today) {
      onSelect(date);
    }
  };

  // Get weeks for rendering
  const days = getDaysInMonth();
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className={cn('p-3', className, classNames?.root)}>
      <div className={cn('flex justify-center pt-1 relative items-center', classNames?.caption)}>
        <button
          className={cn(
            buttonVariants(),
            'h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-[-5px]',
            classNames?.nav_button_previous,
          )}
          onClick={goToPreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className={cn('flex justify-center gap-1', classNames?.caption_dropdowns)}>
          <Select
            value={months[currentMonth.getMonth()] || months[today.getMonth()]}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="pr-1 focus:ring-0 w-[120px]">
              <SelectValue>{months[currentMonth.getMonth()] || months[today.getMonth()]}</SelectValue>
            </SelectTrigger>
            <SelectContent position="popper">
              <ScrollArea className="h-80">
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          <Select
            value={currentMonth.getFullYear().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="pr-1 focus:ring-0 w-[80px]">
              <SelectValue>{currentMonth.getFullYear()}</SelectValue>
            </SelectTrigger>
            <SelectContent position="popper">
              <ScrollArea className="h-80">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        <button
          className={cn(
            buttonVariants(),
            'h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-[-5px]',
            classNames?.nav_button_next,
            // Disable next button if current month is the current month/year
            currentMonth.getFullYear() === today.getFullYear() &&
            currentMonth.getMonth() === today.getMonth() &&
            'opacity-30 pointer-events-none',
          )}
          onClick={goToNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <table className={cn('w-full border-collapse space-y-1', classNames?.table)}>
        <thead>
          <tr className={cn('flex', classNames?.head_row)}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <th
                key={day}
                className={cn(
                  'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                  classNames?.head_cell,
                )}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i} className={cn('flex w-full mt-2', classNames?.row)}>
              {week.map(({ date, isOutside }) => {
                const isSelected =
                  selected &&
                  date.getDate() === selected.getDate() &&
                  date.getMonth() === selected.getMonth() &&
                  date.getFullYear() === selected.getFullYear();
                const isToday =
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear();
                const isFuture = date > today;

                return (
                  <td
                    key={date.toISOString()}
                    className={cn(
                      'text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
                      isSelected && 'bg-accent',
                      isSelected && mode === 'single' && 'rounded-md',
                      classNames?.cell,
                    )}
                  >
                    <button
                      className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
                        isSelected &&
                        'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                        isToday && !isSelected && 'bg-accent text-accent-foreground',
                        isOutside && 'text-muted-foreground opacity-50',
                        isFuture && 'text-muted-foreground opacity-50',
                        classNames?.day,
                        {
                          'day_selected': isSelected,
                          'day_today': isToday && !isSelected,
                          'day_outside': isOutside,
                          'day_disabled': isFuture,
                        },
                      )}
                      onClick={() => handleDayClick(date)}
                      aria-selected={isSelected}
                      disabled={isFuture}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };