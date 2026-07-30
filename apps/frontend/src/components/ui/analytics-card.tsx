import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

const iconVariants = cva("rounded-lg p-2 text-white", {
  variants: {
    variant: {
      default: "bg-sky-500",
      success: "bg-emerald-500",
      danger: "bg-red-500",
      warning: "bg-amber-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const cardTitleVariants = cva("text-sm font-medium text-gray-500", {
  variants: {
    variant: {
      default: "text-gray-500",
      success: "text-emerald-500",
      danger: "text-red-500",
      warning: "text-amber-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface AnalyticsCardProps extends VariantProps<typeof iconVariants> {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative";
  description?: string;
  className?: string;
}

export const AnalyticsCard = ({
  title,
  value,
  icon: Icon,
  variant,
  change,
  changeType,
  description,
  className,
}: AnalyticsCardProps) => {
  return (
    <Card className={cn("flex flex-col justify-between", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex flex-col space-y-1">
            <CardTitle className={cn(cardTitleVariants({ variant }))}>
              {title}
            </CardTitle>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={cn(iconVariants({ variant }))}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {change && (
          <div className="flex items-center space-x-1 text-sm">
            <p
              className={cn(
                "font-semibold",
                changeType === "positive" ? "text-green-600" : "text-red-600"
              )}
            >
              {change}
            </p>
            {description && <p className="text-gray-500">{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
