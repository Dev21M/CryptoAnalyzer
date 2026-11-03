import React, { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export const Table = React.forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className = '', ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={`w-full caption-bottom text-xs font-mono text-left ${className}`} {...props} />
    </div>
  )
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <thead ref={ref} className={`bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[10px] uppercase tracking-wider font-mono ${className}`} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <tbody ref={ref} className={`divide-y divide-slate-800/60 ${className}`} {...props} />
  )
);
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className = '', ...props }, ref) => (
    <tr ref={ref} className={`transition-colors hover:bg-slate-800/40 data-[state=selected]:bg-slate-800 ${className}`} {...props} />
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <th ref={ref} className={`h-10 px-4 text-left align-middle font-medium text-slate-400 [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
  )
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <td ref={ref} className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
  )
);
TableCell.displayName = 'TableCell';
