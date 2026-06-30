import React from 'react';
import type { Category, PortfolioElement } from '../../types/portfolio';

type Props = {
  portfolio: PortfolioElement[];
  

  year: number;

  categories: Category;

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
  categories, 
  year,
  updateValue,
  renameElement,
  deleteElement,
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

const CATEGORY_WIDTH = "120px";
const ELEMENT_WIDTH = "120px";

 return (
    <div className="overflow-auto max-h-[400px] border border-zinc-200 dark:border-zinc-700 rounded-2xl">
      <table className="w-full text-sm border-collapse whitespace-nowrap">
  <colgroup>
    {/* Sticky columns */}
    <col style={{ width: CATEGORY_WIDTH }} />
    <col style={{ width: ELEMENT_WIDTH }} />

    {/* Initial */}
    <col style={{ width: 120 }} />
    <col style={{ width: 120 }} />

    {/* Months */}
    {months.map((_, i) => (
      <React.Fragment key={i}>
        <col style={{ width: 120 }} />
        <col style={{ width: 120 }} />
      </React.Fragment>
    ))}
  </colgroup>

  <thead>
    {/* HEADER ROW 1 */}
    <tr>
      <th
        colSpan={2}
        className="
          sticky left-0 z-40
          bg-white dark:bg-zinc-900
          border-b border-r
          text-center font-semibold p-3
        "
      >
        Portfolio
      </th>

      <th
        colSpan={2}
        className="p-3 bg-white dark:bg-zinc-900 border-b text-center font-semibold border-r"
      >
        Initial
      </th>

      {months.map((month) => (
        <th
          key={month}
          colSpan={2}
          className="p-3 bg-white dark:bg-zinc-900 border-b text-center font-semibold border-r"
        >
          {month}
        </th>
      ))}
    </tr>

    {/* HEADER ROW 2 */}
    <tr>
      <th
        className="
          sticky left-0 z-50
          bg-white dark:bg-zinc-900
          border-b text-xs
        "
        style={{
          width: CATEGORY_WIDTH,
          minWidth: CATEGORY_WIDTH,
        }}
      >
        Category
      </th>

      <th
        className="
          sticky z-50
          bg-white dark:bg-zinc-900
          border-b border-r text-xs
        "
        style={{
          left: CATEGORY_WIDTH,
          width: ELEMENT_WIDTH,
          minWidth: ELEMENT_WIDTH,
        }}
      >
        Element
      </th>

      <th className="p-2 bg-white dark:bg-zinc-900 border-b text-center text-xs">
        Inv
      </th>
      <th className="p-2 bg-white dark:bg-zinc-900 border-b text-center text-xs border-r">
        Real
      </th>

      {months.map((month) => (
        <React.Fragment key={month}>
          <th className="p-2 bg-white dark:bg-zinc-900 border-b text-center text-xs">
            Inv
          </th>
          <th className="p-2 bg-white dark:bg-zinc-900 border-b text-center text-xs border-r">
            Real
          </th>
        </React.Fragment>
      ))}
    </tr>
  </thead>
      <tbody>
    {portfolio.map((element) => {
      const yearData = element.monthlyValues?.[year] || {};
      const initial = yearData[0] || { invested: 0, value: 0 };

      const categoryName =
        categories.find((c) => c.id === element.categoryId)?.name || "—";

      return (
        <tr
          key={element.id}
          className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
        >
          {/* =========================
              STICKY COLUMN 1: CATEGORY
          ========================== */}
          <td
            className="
              sticky left-0 z-20
              bg-white dark:bg-zinc-900
              border-b border-r
            "
            style={{
              width: CATEGORY_WIDTH,
              minWidth: CATEGORY_WIDTH,
            }}
          >
            <div className="px-3 py-3 text-sm text-zinc-500">
              {categoryName}
            </div>
          </td>

          {/* =========================
              STICKY COLUMN 2: ELEMENT
          ========================== */}
          <td
            className="
              sticky z-20
              bg-white dark:bg-zinc-900
              border-b border-r
            "
            style={{
              left: CATEGORY_WIDTH,
              width: ELEMENT_WIDTH,
              minWidth: ELEMENT_WIDTH,
            }}
          >
            <div className="flex items-center gap-2 px-3 py-3 font-medium">
              <button
                onClick={() => deleteElement(element.id)}
                className="text-zinc-400 hover:text-red-500 p-1"
                title="Delete element"
              >
                🗑️
              </button>

              <span className="whitespace-nowrap">
                {element.name}
              </span>
            </div>
          </td>

          {/* =========================
              INITIAL COLUMNS
          ========================== */}
          <td className="p-2 border-b text-center">
            <input
              type="number"
              value={initial.invested || ""}
              onChange={(e) =>
                updateValue(
                  element.id,
                  year,
                  0,
                  "invested",
                  Number(e.target.value)
                )
              }
              className="modern-input w-full min-w-[90px] text-center"
            />
          </td>

          <td className="p-2 border-b border-r text-center">
            <input
              type="number"
              value={initial.value || ""}
              onChange={(e) =>
                updateValue(
                  element.id,
                  year,
                  0,
                  "value",
                  Number(e.target.value)
                )
              }
              className="modern-input w-full min-w-[90px] text-center"
            />
          </td>

          {/* =========================
              MONTHLY COLUMNS
          ========================== */}
          {months.map((_, index) => {
            const month = index + 1;
            const data = yearData[month] || {
              invested: 0,
              value: 0,
            };

            return (
              <React.Fragment key={month}>
                <td className="p-2 border-b text-center">
                  <input
                    type="number"
                    value={data.invested || ""}
                    onChange={(e) =>
                      updateValue(
                        element.id,
                        year,
                        month,
                        "invested",
                        Number(e.target.value)
                      )
                    }
                    className="modern-input w-full min-w-[90px] text-center"
                  />
                </td>

                <td className="p-2 border-b border-r text-center">
                  <input
                    type="number"
                    value={data.value || ""}
                    onChange={(e) =>
                      updateValue(
                        element.id,
                        year,
                        month,
                        "value",
                        Number(e.target.value)
                      )
                    }
                    className="modern-input w-full min-w-[90px] text-center"
                  />
                </td>
              </React.Fragment>
            );
          })}
        </tr>
      );
    })}
  </tbody>
</table>
</div>
)};