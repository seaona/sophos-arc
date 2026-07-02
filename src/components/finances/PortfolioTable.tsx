import React, { useState } from 'react';
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
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const CATEGORY_WIDTH = "120px";
  const ELEMENT_WIDTH = "120px";

  // ==================== STATE ====================
  const [sortConfig, setSortConfig] = useState<{
    key: 'category' | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  // ==================== FILTERED + SORTED DATA ====================
  const filteredAndSortedPortfolio = React.useMemo(() => {
    let result = [...portfolio];

    // 1. Filter by selected categories
    if (selectedCategories.length > 0) {
      result = result.filter((element) =>
        selectedCategories.includes(element.categoryId)
      );
    }

    // 2. Sort by category
    if (sortConfig.key === 'category') {
      result.sort((a, b) => {
        const catA = categories.find((c) => c.id === a.categoryId)?.name || '';
        const catB = categories.find((c) => c.id === b.categoryId)?.name || '';

        if (catA < catB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (catA > catB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [portfolio, categories, selectedCategories, sortConfig]);

  // ==================== HANDLERS ====================
  const toggleSort = () => {
    if (sortConfig.key === 'category') {
      if (sortConfig.direction === 'asc') {
        setSortConfig({ key: 'category', direction: 'desc' });
      } else {
        setSortConfig({ key: null, direction: 'asc' }); // reset
      }
    } else {
      setSortConfig({ key: 'category', direction: 'asc' });
    }
  };

  const toggleCategoryFilter = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setShowFilter(false);
  };

  // ==================== RENDER ====================
  return (
    <div className="overflow-auto max-h-[400px] border border-zinc-200 dark:border-zinc-700 rounded-2xl">
      <table className="w-full text-sm border-collapse whitespace-nowrap">
        <colgroup>
          <col style={{ width: CATEGORY_WIDTH }} />
          <col style={{ width: ELEMENT_WIDTH }} />
          <col style={{ width: 120 }} />
          <col style={{ width: 120 }} />
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
              className="sticky left-0 z-40 bg-white dark:bg-zinc-900 border-b border-r text-center font-semibold p-3"
            >
              Portfolio
            </th>
            <th colSpan={2} className="p-3 bg-white dark:bg-zinc-900 border-b text-center font-semibold border-r">
              Initial
            </th>
            {months.map((month) => (
              <th key={month} colSpan={2} className="p-3 bg-white dark:bg-zinc-900 border-b text-center font-semibold border-r">
                {month}
              </th>
            ))}
          </tr>

          {/* HEADER ROW 2 - Category with Sort + Filter */}
          <tr>
            <th
              className="sticky left-0 z-50 bg-white dark:bg-zinc-900 border-b text-xs cursor-pointer select-none"
              style={{ width: CATEGORY_WIDTH, minWidth: CATEGORY_WIDTH }}
              onClick={toggleSort}
            >
              <div className="flex items-center justify-between px-3 py-2 group">
                                  {/* Sort Icon */}
                  <span className="text-zinc-400 group-hover:text-zinc-600 transition-colors">
                    {sortConfig.key === 'category' 
                      ? (sortConfig.direction === 'asc' ? '↑' : '↓') 
                      : '↕'}
                  </span>
                <span>Category</span>
                <div className="flex items-center gap-1">
                  {/* Filter Icon */}
                       <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFilter(!showFilter);
                        }}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                        title="Filter by category"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="w-3.5 h-3.5 text-zinc-500" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
                          />
                        </svg>
                      </button>
                </div>
              </div>

              {/* Filter Dropdown */}
              {showFilter && (
                <div className="absolute mt-1 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-50 p-2">
                  <div className="max-h-60 overflow-auto">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategoryFilter(category.id)}
                          className="accent-blue-600"
                        />
                        <span>{category.name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2 px-1">
                    <button
                      onClick={clearFilters}
                      className="text-xs text-zinc-500 hover:text-zinc-700"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </th>

            <th className="sticky z-50 bg-white dark:bg-zinc-900 border-b border-r text-xs" style={{ left: CATEGORY_WIDTH }}>
              Element
            </th>

            <th className="p-2 bg-white dark:bg-zinc-900 border-b text-center text-xs">Inv</th>
            <th className="p-2 bg-white dark:bg-zinc-900 border-b text-center text-xs border-r">Real</th>

            {months.map((month) => (
              <React.Fragment key={month}>
                <th className="p-2 bg-white dark:bg-zinc-900 border-b text-center text-xs">Inv</th>
                <th className="p-2 bg-white dark:bg-zinc-900 border-b text-center text-xs border-r">Real</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredAndSortedPortfolio.map((element) => {
            const yearData = element.monthlyValues?.[year] || {};
            const initial = yearData[0] || { invested: 0, value: 0 };
            const categoryName = categories.find((c) => c.id === element.categoryId)?.name || "—";

            return (
              <tr key={element.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                {/* Category */}
                <td className="sticky left-0 z-20 bg-white dark:bg-zinc-900 border-b border-r" style={{ width: CATEGORY_WIDTH }}>
                  <div className="px-3 py-3 text-sm text-zinc-500">{categoryName}</div>
                </td>

                {/* Element */}
                <td className="sticky z-20 bg-white dark:bg-zinc-900 border-b border-r" style={{ left: CATEGORY_WIDTH }}>
                  <div className="flex items-center gap-2 px-3 py-3 font-medium">
                    <button onClick={() => deleteElement(element.id)} className="text-zinc-400 hover:text-red-500 p-1">🗑️</button>
                    <span>{element.name}</span>
                  </div>
                </td>

                {/* Initial */}
                <td className="p-2 border-b text-center">
                  <input type="number" value={initial.invested || ""} onChange={(e) => updateValue(element.id, year, 0, 'invested', Number(e.target.value))} className="modern-input w-full min-w-[90px] text-center" />
                </td>
                <td className="p-2 border-b border-r text-center">
                  <input type="number" value={initial.value || ""} onChange={(e) => updateValue(element.id, year, 0, 'value', Number(e.target.value))} className="modern-input w-full min-w-[90px] text-center" />
                </td>

                {/* Monthly columns */}
                {months.map((_, index) => {
                  const month = index + 1;
                  const data = yearData[month] || { invested: 0, value: 0 };
                  return (
                    <React.Fragment key={month}>
                      <td className="p-2 border-b text-center">
                        <input type="number" value={data.invested || ""} onChange={(e) => updateValue(element.id, year, month, 'invested', Number(e.target.value))} className="modern-input w-full min-w-[90px] text-center" />
                      </td>
                      <td className="p-2 border-b border-r text-center">
                        <input type="number" value={data.value || ""} onChange={(e) => updateValue(element.id, year, month, 'value', Number(e.target.value))} className="modern-input w-full min-w-[90px] text-center" />
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
  );
}