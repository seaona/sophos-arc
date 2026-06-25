import { useLocalStorage } from './useLocalStorage';

export type Mortgage = {
  id: string;
  name: string;
  loanAmount: number;
  annualInterestRate: number;
  totalYears: number;
  startDate: string; // format: "YYYY-MM"
};

export type MortgageMonthlyData = {
  mortgageId: string;
  year: number;
  month: number;
  extraPayment: number;
  extraInstallments: number;
  savedThisMonth: number;
  remainingInstallments: number;
};

export function useMortgage() {
  const [mortgages, setMortgages] = useLocalStorage<Mortgage[]>('mortgages', []);
  const [monthlyData, setMonthlyData] = useLocalStorage<MortgageMonthlyData[]>('mortgage-monthly-data', []);

  // Add a new mortgage
  const addMortgage = (mortgage: Omit<Mortgage, 'id'>) => {
    const newMortgage: Mortgage = {
      ...mortgage,
      id: crypto.randomUUID(),
    };
    setMortgages((prev) => [...prev, newMortgage]);
  };

  // Delete a mortgage and all its monthly data
  const deleteMortgage = (mortgageId: string) => {
    setMortgages((prev) => prev.filter((m) => m.id !== mortgageId));
    setMonthlyData((prev) => prev.filter((d) => d.mortgageId !== mortgageId));
  };

  // Update mortgage setup
  const updateMortgageSetup = (mortgageId: string, updates: Partial<Omit<Mortgage, 'id'>>) => {
    setMortgages((prev) =>
      prev.map((m) =>
        m.id === mortgageId ? { ...m, ...updates } : m
      )
    );
  };

  // Update monthly data for a specific mortgage + month
  const updateMonthlyData = (
    mortgageId: string,
    year: number,
    month: number,
    updates: Partial<Omit<MortgageMonthlyData, 'mortgageId' | 'year' | 'month'>>
  ) => {
    setMonthlyData((prev) => {
      const existingIndex = prev.findIndex(
        (d) => d.mortgageId === mortgageId && d.year === year && d.month === month
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...updates,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            mortgageId,
            year,
            month,
            extraPayment: 0,
            extraInstallments: 0,
            savedThisMonth: 0,
            remainingInstallments: 0,
            ...updates,
          },
        ];
      }
    });
  };

  // Get monthly data for a specific mortgage + year
  const getMonthlyDataForMortgage = (mortgageId: string, year: number) => {
    return monthlyData.filter(
      (d) => d.mortgageId === mortgageId && d.year === year
    );
  };

  return {
    mortgages,
    monthlyData,
    addMortgage,
    deleteMortgage,
    updateMortgageSetup,
    updateMonthlyData,
    getMonthlyDataForMortgage,
  };
}