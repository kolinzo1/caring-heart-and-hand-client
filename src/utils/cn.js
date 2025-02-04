export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

// Example usage:
// cn('btn', condition && 'btn-primary', 'mt-2');