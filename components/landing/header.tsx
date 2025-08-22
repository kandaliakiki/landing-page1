import Link from "next/link";
import { Button } from "@/components/ui/button";

const ENABLE_EDITOR = process.env.NEXT_PUBLIC_ENABLE_EDITOR === "true";

interface HeaderConfig {
  brandName: string;
  brandInitials: string;
  nav: { name: string; href: string }[];
  ctaLabel: string;
  ctaHref?: string;
  showEditorLink?: boolean;
}

export function Header({ config }: { config: HeaderConfig }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                {config.brandInitials}
              </span>
            </div>
            <span className="font-bold text-xl">{config.brandName}</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {config.nav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {(ENABLE_EDITOR || config.showEditorLink) && (
            <Button variant="ghost" asChild>
              <Link href="/editor">Editor</Link>
            </Button>
          )}
          <Button asChild>
            <Link href={config.ctaHref || "#pricing"}>{config.ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
