import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 border-b border-border/55 pb-6 mb-8 mt-4">
      <div className="space-y-2 text-left">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
            <Link href="/" className="hover:text-primary transition-colors flex items-center">
              <Home className="h-3.5 w-3.5" />
            </Link>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.label}>
                <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                {item.href ? (
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
          {title}
        </h1>

        {/* Description */}
        {description && <p className="text-muted-foreground text-sm max-w-2xl">{description}</p>}
      </div>

      {/* Action Button */}
      {action && <div className="flex items-center space-x-2">{action}</div>}
    </div>
  );
}
export default PageHeader;
