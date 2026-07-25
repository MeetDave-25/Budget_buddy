import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-white/5 backdrop-blur-md border border-white/10 flex h-10 w-full min-w-0 rounded-md px-3 py-1 text-base transition-all duration-300 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:shadow-[0_0_15px_rgba(14,165,233,0.2)]",
        "aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:shadow-[0_0_15px_rgba(239,68,68,0.2)]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
