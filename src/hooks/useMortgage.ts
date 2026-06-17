// hooks/useMortgage.ts
import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type Mortgage = {
  id: string;
  loanAmount: number;
  annualInterestRate: number; // e.g. 3.25
  totalYears: number;
  startDate: string; // YYYY-MM
};

export type MonthlyMortgageData = {
  month: number;
  extraPayment: number;
  extraInstallments: number;
  savedThisMonth: number;
  remainingInstallments: number;
};

export function useMortgage() {
  const [mortgage, setMortgage] = useLocalStorage<Mortgage | null>(
    'mortgage',
    null
  );

  const [monthlyData, setMonthlyData] = useLocalStorage<MonthlyMortgageData[]>(
    'mortgage-monthly-data',
    []
  );

  // Setup mortgage
  function updateMortgageSetup(data: Partial<Mortgage>) {
    setMortgage((prev) => ({
      ...(prev || {
        id: crypto.randomUUID(),
        loanAmount: 0,
        annualInterestRate: 0,
        totalYears: 0,
        startDate: `${new Date().getFullYear()}-01`,
      }),
      ...data,
    }));
  }

  // Update monthly data for a specific month
  function updateMonthlyData(month: number, data: Partial<MonthlyMortgageData>) {
    setMonthlyData((prev) => {
      const existing = prev.findIndex((m) => m.month === month);
      const newEntry: MonthlyMortgageData = {
        month,
        extraPayment: 0,
        extraInstallments: 0,
        savedThisMonth: 0,
        remainingInstallments: 0,
        ...prev[existing],
        ...data,
      };

      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newEntry;
        return updated;
      } else {
        return [...prev, newEntry].sort((a, b) => a.month - b.month);
      }
    });
  }

  const currentYearData = monthlyData.filter(
    (m) => Math.floor((m.month - 1) / 12) + new Date(mortgage?.startDate || '2025-01').getFullYear() === 
          // Simplified: we'll filter properly in the page
          new Date().getFullYear() // We'll handle year filtering in component
  );

  return {
    mortgage,
    monthlyData,
    updateMortgageSetup,
    updateMonthlyData,
  };
}