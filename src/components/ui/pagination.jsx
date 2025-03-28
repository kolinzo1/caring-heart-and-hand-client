import React from "react";
import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const Pagination = ({ className, ...props }) => {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
};
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
});
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <li ref={ref} className={cn("", className)} {...props} />
  );
});
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-background",
        className
      )}
      {...props}
    />
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}) => {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}) => {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}) => {
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
};
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};