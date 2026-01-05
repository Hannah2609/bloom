type ColorSwatchProps = {
  label: string;
  variable: string;
};

function ColorSwatch({ label, variable }: ColorSwatchProps) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-14 rounded-lg border"
        style={{ backgroundColor: `var(${variable})` }}
      />
      <div className="text-sm">
        <div className="font-medium">{label}</div>
        <div className="text-muted-foreground">{variable}</div>
      </div>
    </div>
  );
}

export function ColorPalette() {
  return (
    <div className="space-y-10 p-6">
      {/* colors */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Color palette</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <ColorSwatch label="Primary" variable="--primary" />
          <ColorSwatch label="Secondary" variable="--secondary" />
          <ColorSwatch label="Muted" variable="--muted" />
          <ColorSwatch label="Background" variable="--background" />
          <ColorSwatch
            label="Primary Foreground"
            variable="--primary-foreground"
          />
          <ColorSwatch
            label="Secondary Foreground"
            variable="--secondary-foreground"
          />
          <ColorSwatch label="Muted Foreground" variable="--muted-foreground" />
          <ColorSwatch label="Foreground" variable="--foreground" />
          <ColorSwatch label="Card" variable="--card" />
          <ColorSwatch label="Popover" variable="--popover" />
          <ColorSwatch label="Border" variable="--border" />
          <ColorSwatch label="Destructive" variable="--destructive" />
          <ColorSwatch label="Card Foreground" variable="--card-foreground" />
          <ColorSwatch
            label="Popover Foreground"
            variable="--popover-foreground"
          />
          <ColorSwatch label="Input" variable="--input" />
          <ColorSwatch label="Ring" variable="--ring" />
        </div>
      </section>

      {/* Primary scale */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Primary scale</h2>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {[
            "--primary-50",
            "--primary-100",
            "--primary-200",
            "--primary-300",
            "--primary-400",
            "--primary-500",
            "--primary-600",
            "--primary-700",
            "--primary-800",
            "--primary-900",
            "--primary-950",
            "--primary-1000",
          ].map((variable) => (
            <ColorSwatch
              key={variable}
              label={variable.replace("--", "")}
              variable={variable}
            />
          ))}
        </div>
      </section>

      {/* Secondary scale */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Secondary scale</h2>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {[
            "--secondary-50",
            "--secondary-100",
            "--secondary-200",
            "--secondary-300",
            "--secondary-400",
            "--secondary-500",
            "--secondary-600",
            "--secondary-700",
            "--secondary-800",
            "--secondary-900",
            "--secondary-950",
            "--secondary-1000",
          ].map((variable) => (
            <ColorSwatch
              key={variable}
              label={variable.replace("--", "")}
              variable={variable}
            />
          ))}
        </div>
      </section>

      {/* Base scale */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Base scale (Light)</h2>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {[
            "--base-50",
            "--base-100",
            "--base-200",
            "--base-300",
            "--base-400",
            "--base-500",
            "--base-600",
            "--base-700",
            "--base-800",
            "--base-900",
            "--base-950",
            "--base-1000",
          ].map((variable) => (
            <ColorSwatch
              key={variable}
              label={variable.replace("--", "")}
              variable={variable}
            />
          ))}
        </div>
      </section>

      {/* Dark base scale */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Dark base scale</h2>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {[
            "--dark-base-50",
            "--dark-base-100",
            "--dark-base-200",
            "--dark-base-300",
            "--dark-base-400",
            "--dark-base-500",
            "--dark-base-600",
            "--dark-base-700",
            "--dark-base-800",
            "--dark-base-900",
            "--dark-base-950",
          ].map((variable) => (
            <ColorSwatch
              key={variable}
              label={variable.replace("--", "")}
              variable={variable}
            />
          ))}
        </div>
      </section>

      {/* Sidebar colors */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Sidebar colors</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <ColorSwatch label="Sidebar" variable="--sidebar" />
          <ColorSwatch
            label="Sidebar Foreground"
            variable="--sidebar-foreground"
          />
          <ColorSwatch label="Sidebar Primary" variable="--sidebar-primary" />
          <ColorSwatch
            label="Sidebar Primary Foreground"
            variable="--sidebar-primary-foreground"
          />
          <ColorSwatch label="Sidebar Accent" variable="--sidebar-accent" />
          <ColorSwatch
            label="Sidebar Accent Foreground"
            variable="--sidebar-accent-foreground"
          />
          <ColorSwatch label="Sidebar Border" variable="--sidebar-border" />
          <ColorSwatch label="Sidebar Ring" variable="--sidebar-ring" />
        </div>
      </section>

      {/* Analytics colors */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Analytics colors</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          <ColorSwatch label="Analytics Red" variable="--analytics-red" />
          <ColorSwatch label="Analytics Amber" variable="--analytics-amber" />
          <ColorSwatch label="Analytics Yellow" variable="--analytics-yellow" />
          <ColorSwatch label="Analytics Lime" variable="--analytics-lime" />
          <ColorSwatch label="Analytics Green" variable="--analytics-green" />
        </div>
      </section>
    </div>
  );
}
