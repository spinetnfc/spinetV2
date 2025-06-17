import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import GreenCheckIcon from "@/components/icons/green-check"
import RedDashIcon from "@/components/icons/red-dash"

function ComparePlans() {
  const plans = [
    {
      title: "Free",
      features: [
        { name: "Basic Analytics", exist: true },
        { name: "Advanced Reports", exist: false },
        { name: "Team Collaboration", exist: false },
        { name: "Priority Support", exist: false },
        { name: "Custom Integrations", exist: false },
      ],
    },
    {
      title: "Plus",
      features: [
        { name: "Basic Analytics", exist: true },
        { name: "Advanced Reports", exist: true },
        { name: "Team Collaboration", exist: false },
        { name: "Priority Support", exist: false },
        { name: "Custom Integrations", exist: false },
      ],
    },
    {
      title: "Pro",
      features: [
        { name: "Basic Analytics", exist: true },
        { name: "Advanced Reports", exist: true },
        { name: "Team Collaboration", exist: true },
        { name: "Priority Support", exist: true },
        { name: "Custom Integrations", exist: false },
      ],
    },
    {
      title: "Company",
      features: [
        { name: "Basic Analytics", exist: true },
        { name: "Advanced Reports", exist: true },
        { name: "Team Collaboration", exist: true },
        { name: "Priority Support", exist: true },
        { name: "Custom Integrations", exist: true },
      ],
    },
  ]

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-azure hover:bg-gray-50 hover:dark:bg-navy">
            <TableHead className="font-semibold text-primary">Features</TableHead>
            {plans.map((plan) => (
              <TableHead key={plan.title} className="font-semibold text-primary">
                {plan.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans[0].features.map((feature, featureIndex) => (
            <TableRow key={feature.name} className="hover:bg-gray-50 hover:dark:bg-navy">
              <TableCell className="font-medium">{feature.name}</TableCell>
              {plans.map((plan) => (
                <TableCell key={plan.title} className="text-center">
                  {plan.features[featureIndex].exist ? <GreenCheckIcon className="h-6 w-6" /> : <RedDashIcon className="h-6 w-6" />}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ComparePlans
