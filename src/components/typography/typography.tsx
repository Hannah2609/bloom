import { Heading } from "@/components/ui/heading/heading";

type TypographyExampleProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

function TypographyExample({
  label,
  children,
  className,
}: TypographyExampleProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-muted-foreground font-text">{label}</div>
      <div className={className}>{children}</div>
    </div>
  );
}

export function Typography() {
  return (
    <div className="space-y-12 p-6">
      {/* Headings */}
      <section>
        <h2 className="mb-6 text-lg font-semibold">Headings</h2>
        <div className="space-y-6">
          <TypographyExample label="Heading Level 1 (h1)">
            <Heading level="h1">Heading 1 - The quick brown fox</Heading>
          </TypographyExample>

          <TypographyExample label="Heading Level 2 (h2)">
            <Heading level="h2">Heading 2 - The quick brown fox</Heading>
          </TypographyExample>
          <TypographyExample label="Heading Level 3 (h3)">
            <Heading level="h3">Heading 3 - The quick brown fox</Heading>
          </TypographyExample>
          <TypographyExample label="Heading Level 4 (h4)">
            <Heading level="h4">Heading 4 - The quick brown fox</Heading>
          </TypographyExample>
        </div>
      </section>

      {/* Text Sizes */}
      <section>
        <h2 className="mb-6 text-lg font-semibold">Text Sizes</h2>
        <div className="space-y-6">
          <TypographyExample label="text-3xl">
            <p className="text-3xl">
              The quick brown fox jumps over the lazy dog
            </p>
          </TypographyExample>
          <TypographyExample label="text-2xl">
            <p className="text-2xl">
              The quick brown fox jumps over the lazy dog
            </p>
          </TypographyExample>
          <TypographyExample label="text-xl">
            <p className="text-xl">
              The quick brown fox jumps over the lazy dog
            </p>
          </TypographyExample>
          <TypographyExample label="text-lg">
            <p className="text-lg">
              The quick brown fox jumps over the lazy dog
            </p>
          </TypographyExample>
          <TypographyExample label="text-base (default)">
            <p className="text-base">
              The quick brown fox jumps over the lazy dog
            </p>
          </TypographyExample>
          <TypographyExample label="text-sm">
            <p className="text-sm">
              The quick brown fox jumps over the lazy dog
            </p>
          </TypographyExample>
          <TypographyExample label="text-xs">
            <p className="text-xs">
              The quick brown fox jumps over the lazy dog
            </p>
          </TypographyExample>
        </div>
      </section>
    </div>
  );
}
