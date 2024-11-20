import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 flex-shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        main: "font-semibold text-white bg-primary hover:bg-[#2c74df] rounded-md shadow-sm transition duration-500 select-none",
        back: "flex items-center gap-3 font-medium py-4 border border-gray-300 rounded-md shadow-sm transition duration-500 select-none",
        cancel: "w-full sm:w-auto sm:min-w-[140px] border shadow-md transition duration-500",
        submit: "w-full sm:w-auto sm:min-w-[140px] text-white border bg-primary hover:bg-[#2c74df] shadow-md transition duration-500",
        upload: "flex items-center justify-start gap-3 w-full p-4 border border-dashed focus:border-primary focus:shadow-input-primary rounded-md transition duration-500",
        search: "relative w-full sm:w-[160px] lg:w-[13%] ml-auto lg:ml-0 text-base font-semibold text-white bg-primary hover:bg-[#2c74df] rounded-md transition duration-500"
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-10 rounded-md px-8",
        lg: "h-14",
        xl: "h-16 text-[17px]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };