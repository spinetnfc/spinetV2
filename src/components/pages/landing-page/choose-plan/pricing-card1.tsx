import { cn } from '@/utils/cn';

// Define a type for the pricing card props
type PricingCardProps = {
  title: string;
  price: string;
  features: string[];
  isMostPopular?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
};

// Pricing Card Component
const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
  isMostPopular = false,
  isDisabled = false,
  fullWidth = false,
}) => {
  return (
    <div
      className={cn(
        `
      relative flex flex-col w-[300px] min-h-[450px] p-6 rounded-xl border `,

        isMostPopular
          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-lg'
          : 'border-gray-200 dark:border-gray-700',
        isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-xl transition-all',

        { 'w-full': fullWidth },
      )}
    >
      {isMostPopular && (
        <div className="absolute right-0 top-0 rounded-bl-xl bg-blue-500 px-3 py-1 text-sm text-white">
          Most Popular
        </div>
      )}

      <div className="text-center">
        <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <div className="mb-6 text-4xl font-extrabold text-gray-900 dark:text-white">
          {price}
        </div>
      </div>

      <ul className="mb-8 grow space-y-4">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start space-x-3 text-gray-600 dark:text-gray-300"
          >
            <svg
              className="size-5 shrink-0 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        disabled={isDisabled}
        className={`
          w-full rounded-lg py-3 font-semibold transition-all
          ${
            isDisabled
              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }
        `}
      >
        {isDisabled ? 'Coming Soon' : 'Get Started'}
      </button>
    </div>
  );
};
export default PricingCard;
