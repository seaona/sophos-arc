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
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
    ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
            <tr>
                <th
                rowSpan={2}
                className="p-2 text-left"
                >
                Element
                </th>

                {months.map(
                    (monthName, index) => (
                        <th
                        key={monthName}
                        colSpan={2}
                        className="
                            text-center
                            border-b
                            pb-2
                            font-semibold
                        "
                        >
                        {monthName}
                        </th>
                    )
                    )}
            </tr>

            <tr>
                {months.flatMap(
                (month) => [
                    <th
                    key={`${month}-inv`}
                    >
                    Inv
                    </th>,

                    <th
                    key={`${month}-real`}
                    >
                    Real
                    </th>
                ]
                )}
            </tr>
            </thead>

        <tbody>
          {portfolio.map(
            (element) => (
              <tr
                key={
                  element.id
                }
              >
                <td className="p-2">
                    <div
                        className="
                        flex
                        items-center
                        gap-2
                        min-w-[220px]
                        "
                    >
                        <input
                        value={element.name}
                        onChange={(e) =>
                            renameElement(
                            element.id,
                            e.target.value
                            )
                        }
                        className="
                            flex-1
                            rounded-lg
                            border
                            px-3
                            py-2
                            bg-transparent
                        "
                        />

                        <button
                        onClick={() =>
                            deleteElement(
                            element.id
                            )
                        }
                        className="
                            text-zinc-500
                            hover:text-red-500
                        "
                        >
                        🗑️
                        </button>
                    </div>
                    </td>

                {months.map(
                    (_, index) => {
                        const month =
                        index + 1;
                    const data =
                      element
                        .monthlyValues?.[
                        year
                      ]?.[
                        month
                      ];

                    return (
                      <>
                        <td>
                          <input
                            type="number"
                            value={
                              data?.invested ||
                              ''
                            }
                            onChange={(
                              e
                            ) =>
                              updateValue(
                                element.id,
                                year,
                                month,
                                'invested',
                                Number(
                                  e
                                    .target
                                    .value
                                )
                              )
                            }
                            className="
                              w-24
                              border
                              rounded
                              px-2
                            "
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            value={
                              data?.value ||
                              ''
                            }
                            onChange={(
                              e
                            ) =>
                              updateValue(
                                element.id,
                                year,
                                month,
                                'value',
                                Number(
                                  e
                                    .target
                                    .value
                                )
                              )
                            }
                            className="
                              w-24
                              border
                              rounded
                              px-2
                            "
                          />
                        </td>
                      </>
                    );
                  }
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}