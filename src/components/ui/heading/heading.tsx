import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("tracking-tight", {
  variants: {
    level: {
      h1: "text-4xl lg:text-5xl font-regular",
      h2: "text-3xl lg:text-4xl font-regular",
      h3: "text-2xl lg:text-3xl font-extralight",
      h4: "text-xl lg:text-2xl font-extralight",
      h5: "text-lg lg:text-xl font-extralight",
      h6: "text-base lg:text-lg font-extralight",
    },
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    level: "h1",
    variant: "default",
  },
});

interface HeadingProps
  extends
    React.ComponentPropsWithoutRef<"h1">,
    VariantProps<typeof headingVariants> {}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = "h1", variant, ...props }, ref) => {
    const Element = level || "h1";

    return (
      <Element
        ref={ref}
        className={cn(headingVariants({ level, variant, className }))}
        {...props}
      />
    );
  }
);

Heading.displayName = "Heading";

export { Heading, headingVariants };
