import React from 'react';
import { FormattedMessage } from 'react-intl';

import ScratchIcon from '@/components/icons/scratch-icon';
import { Switch } from '@/components/ui/form';

type Props = {
  isYearly: boolean;
  setIsYearly: React.Dispatch<React.SetStateAction<boolean>>;
};
export const Options = ({ isYearly, setIsYearly }: Props) => {
  return (
    <div className="relative flex flex-col">
      <div className="flex flex-row items-center justify-between gap-4">
        {/* Monthly Text */}
        <span
          className={`text-sm font-medium ${!isYearly ? 'text-primary' : 'text-muted-foreground'} self-start`}
        >
          <FormattedMessage id="pay-monthly" />
        </span>

        {/* Switch Component */}
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          className="self-start"
        />

        {/* Yearly Text */}
        <div className="flex flex-col items-start gap-1 ">
          <span
            className={`text-sm font-medium ${isYearly ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <FormattedMessage id="pay-yearly" />
          </span>
          <ScratchIcon />
        </div>
      </div>
    </div>
  );
};

export default Options;
