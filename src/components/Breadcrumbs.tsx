"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { ChevronRight } from "lucide-react";

type BreadcrumbsProps = {
  dynamicLabels?: Record<string, string>;
};

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ dynamicLabels = {} }) => {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  const pathArray = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    const label = dynamicLabels[segment] || formatSegment(segment);

    return {
      href,
      label,
      isLast,
    };
  });

  return (
    <nav
      aria-label="breadcrumbs"
      className="py-4 text-base font-medium text-gray-600 flex items-center flex-wrap gap-x-2"
    >
      <Link href="/" className="text-gray-700 hover:text-black transition-colors">
        Home
      </Link>

      {pathArray.map(({ href, label, isLast }) => (
        <span key={href} className="flex items-center gap-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {isLast ? (
            <span className="text-gray-900">{label}</span>
          ) : (
            <Link href={href} className="text-gray-700 hover:text-black transition-colors">
              {label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

const formatSegment = (segment: string): string =>
  segment.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
