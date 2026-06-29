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
  <div className="overflow-auto max-h-[600px]">
  <table className="w-full text-sm border-collapse">
    <thead>
      {/* First header row */}
      <tr>
        <th className="sticky left-0 p-3 bg-white dark:bg-zinc-900 border-b text-left z-20" colSpan={1}>
          Element
        </th>
        
        {/* Initial */}
        <th colSpan={2} className="p-3 bg-white dark:bg-zinc-900 border-b text-center font-semibold border-r">
          Initial
        </th>

        {/* Months */}
        {months.map((monthName) => (
          <th 
            key={monthName} 
            colSpan={2} 
            className="p-3 bg-white dark:bg-zinc-900 border-b text-center font-semibold border-r"
          >
            {monthName}
          </th>
        ))}
      </tr>

      {/* Second header row - Sub headers */}
      <tr>
        <th className="sticky left-0 p-2 bg-white dark:bg-zinc-900 border-b z-20"></th>

        {/* Initial sub-headers */}
        <th className="p-2 bg-white dark:bg-zinc-900 border-b text-center text-xs">Inv</th>
        <th className="p-2 bg-white dark:bg-zinc-900 border-b text-center text-xs border-r">Real</th>

        {/* Monthly sub-headers */}
        {months.map((monthName) => (
          <>
            <th key={`${monthName}-inv`} className="p-2 bg-white dark:bg-zinc-900 border-b text-center text-xs">Inv</th>
            <th key={`${monthName}-real`} className="p-2 bg-white dark:bg-zinc-900 border-b text-center text-xs border-r">Real</th>
          </>
        ))}
      </tr>
    </thead>

    <tbody>
      {portfolio.map((element) => {
        const yearData = element.monthlyValues?.[year] || {};
        const initial = yearData[0] || { invested: 0, value: 0 };

        return (
          <tr key={element.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            {/* Element Name + Delete Icon (same sticky cell) */}
            <td className="sticky left-0 p-3 bg-white dark:bg-zinc-900 font-medium border-r z-20 flex items-center gap-2">
              <button
                onClick={() => deleteElement(element.id)}
                className="text-zinc-400 hover:text-red-500 p-1"
                title="Delete element"
              >
                🗑️
              </button>
              {element.name}
            </td>

            {/* Initial Inv */}
            <td className="p-2 border-b">
              <input
                type="number"
                value={initial.invested || ''}
                onChange={(e) => updateValue(element.id, year, 0, 'invested', Number(e.target.value))}
                className="modern-input w-24 text-center"
              />
            </td>

            {/* Initial Real */}
            <td className="p-2 border-b border-r">
              <input
                type="number"
                value={initial.value || ''}
                onChange={(e) => updateValue(element.id, year, 0, 'value', Number(e.target.value))}
                className="modern-input w-24 text-center"
              />
            </td>

            {/* Monthly columns */}
            {months.map((_, index) => {
              const month = index + 1;
              const data = yearData[month] || { invested: 0, value: 0 };

              return (
                <>
                  <td key={`${month}-inv`} className="p-2 border-b">
                    <input
                      type="number"
                      value={data.invested || ''}
                      onChange={(e) => updateValue(element.id, year, month, 'invested', Number(e.target.value))}
                      className="modern-input w-24 text-center"
                    />
                  </td>
                  <td key={`${month}-real`} className="p-2 border-b border-r">
                    <input
                      type="number"
                      value={data.value || ''}
                      onChange={(e) => updateValue(element.id, year, month, 'value', Number(e.target.value))}
                      className="modern-input w-24 text-center"
                    />
                  </td>
                </>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
)};