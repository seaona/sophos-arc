import { useLocalStorage } from './useLocalStorage';

export type Mortgage = {
  id: string;
  name: string;
  loanAmount: number;
  annualInterestRate: number;
  totalYears: number;
  startDate: string; // "YYYY-MM"
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

  // ==================== ADD MORTGAGE ====================
  const addMortgage = (mortgageData: Omit<Mortgage, 'id'>) => {
    const newMortgage: Mortgage = {
      ...mortgageData,
      id: crypto.randomUUID(),
    };

    setMortgages((prev) => [...prev, newMortgage]);

    // Pre-fill first month of the current year with initial remaining payments
    const currentYear = new Date().getFullYear();
    const initialRemaining = calculateInitialRemaining(newMortgage, currentYear);

    // Create default monthly data for current year
    const initialMonthlyData: MortgageMonthlyData[] = Array.from({ length: 12 }, (_, i) => ({
      mortgageId: newMortgage.id,
      year: currentYear,
      month: i + 1,
      extraPayment: 0,
      extraInstallments: 0,
      savedThisMonth: 0,
      remainingInstallments: Math.max(0, initialRemaining - i),
    }));

    setMonthlyData((prev) => [...prev, ...initialMonthlyData]);
  };

  // ==================== DELETE MORTGAGE ====================
  const deleteMortgage = (mortgageId: string) => {
    setMortgages((prev) => prev.filter((m) => m.id !== mortgageId));
    setMonthlyData((prev) => prev.filter((d) => d.mortgageId !== mortgageId));
  };

  // ==================== UPDATE MORTGAGE SETUP ====================
  const updateMortgageSetup = (mortgageId: string, updates: Partial<Omit<Mortgage, 'id'>>) => {
    setMortgages((prev) =>
      prev.map((m) => (m.id === mortgageId ? { ...m, ...updates } : m))
    );
  };

  // ==================== UPDATE MONTHLY DATA ====================
  const updateMonthlyData = (
    mortgageId: string,
    year: number,
    month: number,
    updates: Partial<Pick<MortgageMonthlyData, 'extraPayment' | 'extraInstallments' | 'savedThisMonth'>>
  ) => {
    setMonthlyData((prev) => {
      const index = prev.findIndex(
        (d) => d.mortgageId === mortgageId && d.year === year && d.month === month
      );

      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...updates };
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

  // ==================== GET DATA FOR YEAR (with calculated remaining) ====================
  const getMonthlyDataForYear = (mortgageId: string, year: number): MortgageMonthlyData[] => {
    const mortgage = mortgages.find((m) => m.id === mortgageId);
    if (!mortgage) return [];

    // Get all historical data for this mortgage
    const allData = monthlyData
      .filter((d) => d.mortgageId === mortgageId)
      .sort((a, b) => a.year - b.year || a.month - b.month);

    // Calculate starting remaining for this year
    let currentRemaining = calculateInitialRemaining(mortgage, year);

    const result: MortgageMonthlyData[] = [];

    for (let month = 1; month <= 12; month++) {
      const existing = allData.find((d) => d.year === year && d.month === month);

      const extraInstallments = existing?.extraInstallments || 0;

      const remainingThisMonth = Math.max(0, currentRemaining - extraInstallments);

      result.push({
        mortgageId,
        year,
        month,
        extraPayment: existing?.extraPayment || 0,
        extraInstallments,
        savedThisMonth: existing?.savedThisMonth || 0,
        remainingInstallments: remainingThisMonth,
      });

      // Prepare for next month
      currentRemaining = remainingThisMonth - 1;
    }

    return result;
  };

  // ==================== HELPER: Calculate initial remaining ====================
  function calculateInitialRemaining(mortgage: Mortgage, targetYear: number): number {
    const totalPayments = mortgage.totalYears * 12;

    const startDate = new Date(mortgage.startDate);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;

    let monthsPassed = 0;

    if (targetYear > startYear) {
      monthsPassed = (targetYear - startYear) * 12 - (startMonth - 1);
    } else if (targetYear === startYear) {
      monthsPassed = 0;
    } else {
      return totalPayments; // Before mortgage started
    }

    return Math.max(0, totalPayments - monthsPassed);
  }

  return {
    mortgages,
    addMortgage,
    deleteMortgage,
    updateMortgageSetup,
    updateMonthlyData,
    getMonthlyDataForYear,
  };
}