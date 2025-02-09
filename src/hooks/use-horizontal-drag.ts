'use client';
import { useCallback, useState } from 'react';

const useDrag = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (containerRef.current) {
        e.preventDefault();
        containerRef.current.scrollLeft += e.deltaY;
      }
    },
    [containerRef],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (containerRef.current) {
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
      }
    },
    [containerRef],
  );

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      e.preventDefault();
      const x = e.pageX - containerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      containerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft, containerRef],
  );

  return [
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
    handleWheel,
  ] as const;
};

export default useDrag;
