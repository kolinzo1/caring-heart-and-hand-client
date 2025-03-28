import React from "react";
import { cn } from "../../lib/utils";

export const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "bg-primary text-primary-foreground hover:bg-primary/80",
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;