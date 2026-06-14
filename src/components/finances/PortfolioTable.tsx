import type { PortfolioElement } from '../../types/portfolio';

type Props = {
  portfolio: PortfolioElement[];

  year: number;

  updateValue: (
    id: string,
    year: number,
    month: number,
    field: 'invested' | 'value',
    amount: number
  ) => void;

  renameElement: (
    id: string,
    name: string
  ) => void;

  deleteElement: (
    id: string
  ) => void;
};

export default function PortfolioTable({
  portfolio,
  year,
  updateValue,
  renameElement,
  deleteElement
}: Props) {
  const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

 return (
  <div className="overflow-auto max-h-[600px]"> {/* Adjust max-h as needed */}
    <table className="w-full text-sm border-collapse">
      <thead>
        {/* First header row - Month names */}
        <tr>
          <th
            rowSpan={2}
            className="sticky left-0 top-0 p-2 text-left bg-white dark:bg-zinc-900 z-30 border-r border-gray-200 dark:border-zinc-700 shadow-[2px_0_4px_rgba(0,0,0,0.1)]"
          >
            Element
          </th>

          {months.map((monthName) => (
            <th
              key={monthName}
              colSpan={2}
              className="sticky top-0 p-2 text-center border-b pb-2 font-semibold bg-white dark:bg-zinc-900 z-20"
            >
              {monthName}
            </th>
          ))}
        </tr>

        {/* Second header row - Inv / Real */}
        <tr>
          {months.flatMap((month) => [
            <th
              key={`${month}-inv`}
              className="sticky top-0 left-0 p-2 text-center bg-white dark:bg-zinc-900 z-20 border-r border-gray-200 dark:border-zinc-700"
            >
              Inv
            </th>,
            <th
              key={`${month}-real`}
              className="sticky top-0 p-2 text-center bg-white dark:bg-zinc-900 z-20"
            >
              Real
            </th>,
          ])}
        </tr>
      </thead>

      <tbody>
        {portfolio.map((element) => (
          <tr key={element.id}>
            {/* Frozen first column */}
            <td className="sticky left-0 p-2 bg-white dark:bg-zinc-900 z-10 border-r border-gray-200 dark:border-zinc-700 shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
              <div className="flex items-center gap-2 min-w-[220px]">
                <input
                  value={element.name}
                  onChange={(e) => renameElement(element.id, e.target.value)}
                  className="flex-1 rounded-lg border px-3 py-2 bg-transparent"
                />
                <button
                  onClick={() => deleteElement(element.id)}
                  className="text-zinc-500 hover:text-red-500"
                >
                  🗑️
                </button>
              </div>
            </td>

            {/* Monthly data columns */}
            {months.map((_, index) => {
              const month = index + 1;
              const data = element.monthlyValues?.[year]?.[month];

              return (
                <>
                  <td className="p-2">
                    <input
                      type="number"
                      value={data?.invested || ''}
                      onChange={(e) =>
                        updateValue(
                          element.id,
                          year,
                          month,
                          'invested',
                          Number(e.target.value)
                        )
                      }
                      className="w-24 border rounded px-2 py-1"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      value={data?.value || ''}
                      onChange={(e) =>
                        updateValue(
                          element.id,
                          year,
                          month,
                          'value',
                          Number(e.target.value)
                        )
                      }
                      className="w-24 border rounded px-2 py-1"
                    />
                  </td>
                </>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)};