// Table: scrolls sideways on phones (the wrapper handles it).
//
//   const columns = [
//     { key: 'name', label: 'Product' },
//     { key: 'price', label: 'Price', numeric: true },
//     { key: 'status', label: 'Status', render: (row) => <Tag status={row.status} /> },
//   ];
//   <Table columns={columns} rows={products} rowKey="id" caption="Products" />
//
// `numeric: true` right-aligns the column and uses tabular numbers.
// `render(row)` lets a column show anything (a Tag, buttons, a formatted price).
// When `rows` is empty the `emptyMessage` is shown.

export default function Table({
  columns,
  rows = [],
  rowKey = 'id',
  caption,
  emptyMessage = 'No items found.',
}) {
  return (
    <div className="table-wrap">
      <table className="table">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className={col.numeric ? 'num' : undefined}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="table__empty" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row[rowKey]}>
                {columns.map((col) => (
                  <td key={col.key} className={col.numeric ? 'num' : undefined}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
