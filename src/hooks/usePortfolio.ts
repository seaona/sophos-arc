import { useState } from 'react';

import { useLocalStorage } from './useLocalStorage';

import type { PortfolioElement, PortfolioAllocation } from '../types/portfolio';

export function usePortfolio() {
  const [portfolio, setPortfolio] =
    useLocalStorage<PortfolioElement[]>(
      'portfolio-elements',
      []
    );

    const [allocations, setAllocations] = useLocalStorage<PortfolioAllocation[]>(
        'financial-allocations',
        []
        );

    const [year, setYear] = useState(new Date().getFullYear());

  function addElement(name: string) {
    setPortfolio((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        createdAt:
          new Date().toISOString(),
        monthlyValues: {}
      }
    ]);
  }

  function deleteElement(id: string) {
    setPortfolio((prev) =>
      prev.filter(
        (element) =>
          element.id !== id
      )
    );
  }

  function renameElement(
  id: string,
  name: string
) {
  setPortfolio((prev) =>
    prev.map((element) =>
      element.id === id
        ? {
            ...element,
            name
          }
        : element
    )
  );
}

    function deleteElement(
    id: string
    ) {
    setPortfolio((prev) =>
        prev.filter(
        (element) =>
            element.id !== id
        )
    );
    }

  function updateValue(
    elementId: string,
    year: number,
    month: number,
    field: 'invested' | 'value',
    amount: number
  ) {
    setPortfolio((prev) =>
      prev.map((element) => {
        if (
          element.id !== elementId
        ) {
          return element;
        }

        return {
          ...element,
          monthlyValues: {
            ...element.monthlyValues,

            [year]: {
              ...(element
                .monthlyValues?.[
                year
              ] || {}),

              [month]: {
                invested:
                  field ===
                  'invested'
                    ? amount
                    : element
                        .monthlyValues?.[
                        year
                      ]?.[
                        month
                      ]
                        ?.invested ||
                      0,

                value:
                  field ===
                  'value'
                    ? amount
                    : element
                        .monthlyValues?.[
                        year
                      ]?.[
                        month
                      ]?.value ||
                      0
              }
            }
          }
        };
      })
    );
  }

  function addAllocation(name: string) {
    setAllocations((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        percentage: 0,
      },
    ]);
  }

  function updateAllocation(id: string, name: string, percentage: number) {
    setAllocations((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, name, percentage: Math.max(0, percentage) } : a
      )
    );
  }

  function deleteAllocation(id: string) {
    setAllocations((prev) => prev.filter((a) => a.id !== id));
  }

  const totalAllocation = allocations.reduce((sum, a) => sum + a.percentage, 0);

  return {
    portfolio,
    year,
    setYear,
    addElement,
    deleteElement,
    renameElement,
    updateValue,
    allocations,
    totalAllocation,
    addAllocation,
    updateAllocation,
    deleteAllocation,
  };
}