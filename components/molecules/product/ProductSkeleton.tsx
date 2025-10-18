"use client";

export default function ProductSkeleton() {
  const rows = Array.from({ length: 8 });

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted h-10">
          <tr>
            {Array.from({ length: 9 }).map((_, i) => (
              <th key={i} className="px-3 py-1">
                <div className="h-2 w-20 bg-muted-foreground/20 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((_, i) => (
            <tr key={i} className="border-b border-border">
              {Array.from({ length: 9 }).map((_, j) => (
                <td key={j} className="px-4 py-1">
                  <div className="h-2 w-full bg-muted-foreground/10 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
