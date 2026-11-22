import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  breadcrumbs,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-7 mb-7 border-b border-slate-200/80 ${className}`}
    >
      <div className="min-w-0 flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Đường dẫn trang" className="mb-2">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={idx} className="flex items-center gap-1.5">
                    {idx > 0 && <span className="text-slate-300">/</span>}
                    {crumb.href && !isLast ? (
                      <a
                        href={crumb.href}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span className={isLast ? 'text-slate-700 font-medium' : ''}>
                        {crumb.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        <h1 className="text-2xl font-medium tracking-[-0.035em] text-slate-900 sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-slate-500 leading-6 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="flex shrink-0 items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
