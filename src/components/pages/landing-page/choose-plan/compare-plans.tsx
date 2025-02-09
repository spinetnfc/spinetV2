import React from 'react';

import GreenCheckIcon from '@/components/icons/green-check';
import RedDashIcon from '@/components/icons/red-dash';

function ComparePlans() {
  const plans = [
    {
      title: 'free',

      features: [
        { name: 'feature 1', exist: true },
        { name: 'feature 2', exist: false },
        { name: 'feature 3', exist: false },
        { name: 'feature 4', exist: false },
        { name: 'feature 5', exist: false },
      ],
    },
    {
      title: 'plus',
      features: [
        { name: 'feature 1', exist: true },
        { name: 'feature 2', exist: true },
        { name: 'feature 3', exist: false },
        { name: 'feature 4', exist: false },
        { name: 'feature 5', exist: false },
      ],
    },
    {
      title: 'pro',
      features: [
        { name: 'feature 1', exist: true },
        { name: 'feature 2', exist: true },
        { name: 'feature 3', exist: true },
        { name: 'feature 4', exist: true },
        { name: 'feature 5', exist: false },
      ],
    },
    {
      title: 'company',
      features: [
        { name: 'feature 1', exist: true },
        { name: 'feature 2', exist: true },
        { name: 'feature 3', exist: true },
        { name: 'feature 4', exist: true },
        { name: 'feature 5', exist: true },
      ],
    },
  ];
  return (
    <div className="w-full ">
      <table className="compare-plans-table w-full border-collapse">
        <thead>
          <tr className="compare-plans-header-row bg-gray-100 text-black">
            <th className="compare-plans-header-cell p-4 text-left font-semibold">
              Features
            </th>
            {plans.map((plan) => (
              <th
                key={plan.title}
                className="compare-plans-header-cell p-4 text-center font-semibold"
              >
                {plan.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plans[0].features.map((feature, featureIndex) => (
            <tr
              key={feature.name}
              className="compare-plans-row hover:cursor-pointer hover:bg-gray-50 hover:text-black"
            >
              <td className="compare-plans-cell p-4 font-medium">
                {feature.name}
              </td>
              {plans.map((plan) => (
                <td
                  key={plan.title}
                  className="compare-plans-cell p-4 text-center"
                >
                  {plan.features[featureIndex].exist ? (
                    <GreenCheckIcon />
                  ) : (
                    <RedDashIcon />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComparePlans;
