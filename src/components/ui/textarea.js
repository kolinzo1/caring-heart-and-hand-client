import * as React from "react";
import { cn } from "../../utils/cn";

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="relative">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0">
          {error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
