import type { Property } from "@/types";

interface PropertyTableProps {
  properties: Property[];
}

export function PropertyTable({ properties }: PropertyTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-muted">
          <tr>
            <th className="px-4 py-3 font-medium text-foreground">Название</th>
            <th className="px-4 py-3 font-medium text-foreground">Тип</th>
            <th className="px-4 py-3 font-medium text-foreground">Цена</th>
            <th className="px-4 py-3 font-medium text-foreground">Статус</th>
          </tr>
        </thead>
        <tbody>
          {properties.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-muted">
                Объекты не найдены
              </td>
            </tr>
          ) : (
            properties.map((property) => (
              <tr key={property.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{property.title}</td>
                <td className="px-4 py-3 text-muted">{property.type}</td>
                <td className="px-4 py-3 text-muted">
                  {property.price.toLocaleString()} {property.currency}
                </td>
                <td className="px-4 py-3 text-muted">{property.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
