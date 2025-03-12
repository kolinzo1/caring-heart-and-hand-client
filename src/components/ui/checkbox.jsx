import * as React from "react"
import { Check } from "lucide-react"

const Checkbox = React.forwardRef(({ className = "", checked, onCheckedChange, ...props }, ref) => {
  return (
    <div
      className={`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${className}`}
      ref={ref}
      role="checkbox"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onCheckedChange(!checked)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onCheckedChange(!checked)
        }
      }}
      {...props}
    >
      {checked && (
        <Check className="h-3 w-3 text-current" />
      )}
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }