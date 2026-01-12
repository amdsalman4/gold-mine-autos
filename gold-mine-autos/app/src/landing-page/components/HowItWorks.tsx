import SectionTitle from "./SectionTitle";

import { Search, Calculator, ShoppingCart } from "lucide-react";

import { LucideIcon } from "lucide-react";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

const steps: Step[] = [
  {
    id: 1,
    title: "We Scan Auctions",
    description:
      "We aggregate thousands of listings daily from major auctions and private sellers — filtering out 97% of the inventory that won't make you money.",
    icon: Search,
  },
  {
    id: 2,
    title: "We Crunch Numbers",
    description:
      "Market value, repair costs, safety estimates, profit margins — all analyzed and calculated.",
    icon: Calculator,
  },
  {
    id: 3,
    title: "You Browse & Buy",
    description:
      "500+ pre-vetted deals with complete breakdowns. Find your goldmine, contact the seller, double your margins.",
    icon: ShoppingCart,
  },
];

export default function HowItWorks() {
  return (
    <section
      aria-labelledby="howitworks-heading"
      className="mx-auto max-w-7xl px-4 py-12"
    >
      <SectionTitle
        title={"How it works"}
        description={
          "Three simple steps to double your margins and reclaim your time."
        }
      />

      <div className="mt-8 flex flex-col gap-8 md:flex-row md:center">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <article
              key={step.id}
              className="flex w-full flex-row items-start gap-4 rounded-lg border p-10 md:flex-1"
              aria-labelledby={`howitworks-step-${step.id}`}
            >
              <div className="from-accent to-secondary text-primary-foreground flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gradient-to-r">
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <h4
                  id={`howitworks-step-${step.id}`}
                  className="mb-1 text-lg font-semibold"
                >
                  <span className="mr-2 inline-block rounded-full bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground">
                    Step {step.id}
                  </span>
                  {step.title}
                </h4>
                <p className="text-muted-foreground text-m leading-6">
                  {step.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
