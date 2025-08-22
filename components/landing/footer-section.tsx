import Link from "next/link";

interface FooterLink {
  name: string;
  href: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

interface FooterConfig {
  companyName: string;
  tagline: string;
  description: string;
  links: {
    product: FooterLink[];
    company: FooterLink[];
    support: FooterLink[];
  };
  socialLinks: SocialLink[];
}

interface FooterSectionProps {
  config: FooterConfig;
}

export function FooterSection({ config }: FooterSectionProps) {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  LB
                </span>
              </div>
              <span className="font-bold text-xl">{config.companyName}</span>
            </div>
            <p className="text-sm font-medium text-primary">{config.tagline}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 grid sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold">
                {config.headings?.product || "Product"}
              </h4>
              <ul className="space-y-2">
                {config.links.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">
                {config.headings?.company || "Company"}
              </h4>
              <ul className="space-y-2">
                {config.links.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">
                {config.headings?.support || "Support"}
              </h4>
              <ul className="space-y-2">
                {config.links.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 {config.companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {config.socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">{social.name}</span>
                <div className="w-5 h-5 bg-muted-foreground rounded" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
