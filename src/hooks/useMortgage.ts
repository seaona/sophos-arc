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

function parseStartDate(startDate: string): { year: number; month: number } {
  const [year, month] = startDate.split('-').map(Number);
  return { year, month }; // month is 1–12
}

export function useMortgage() {
  const [mortgages, setMortgages] = useLocalStorage<Mortgage[]>('mortgages', []);
  const [monthlyData, setMonthlyData] = useLocalStorage<MortgageMonthlyData[]>(
    'mortgage-monthly-data',
    []
  );

  // ==================== ADD MORTGAGE ====================
  const addMortgage = (mortgageData: Omit<Mortgage, 'id'>) => {
    const newMortgage: Mortgage = {
      ...mortgageData,
      id: crypto.randomUUID(),
    };

    setMortgages((prev) => [...prev, newMortgage]);

    // Seed empty monthly rows for the current calendar year.
    // remainingInstallments is always recalculated in getMonthlyDataForYear.
    const currentYear = new Date().getFullYear();
    const initialMonthlyData: MortgageMonthlyData[] = Array.from(
      { length: 12 },
      (_, i) => ({
        mortgageId: newMortgage.id,
        year: currentYear,
        month: i + 1,
        extraPayment: 0,
        extraInstallments: 0,
        savedThisMonth: 0,
        remainingInstallments: 0,
      })
    );

    setMonthlyData((prev) => [...prev, ...initialMonthlyData]);
  };

  // ==================== DELETE MORTGAGE ====================
  const deleteMortgage = (mortgageId: string) => {
    setMortgages((prev) => prev.filter((m) => m.id !== mortgageId));
    setMonthlyData((prev) => prev.filter((d) => d.mortgageId !== mortgageId));
  };

  // ==================== UPDATE MORTGAGE SETUP ====================
  const updateMortgageSetup = (
    mortgageId: string,
    updates: Partial<Omit<Mortgage, 'id'>>
  ) => {
    setMortgages((prev) =>
      prev.map((m) => (m.id === mortgageId ? { ...m, ...updates } : m))
    );
  };

  // ==================== UPDATE MONTHLY DATA ====================
  const updateMonthlyData = (
    mortgageId: string,
    year: number,
    month: number,
    updates: Partial<
      Pick<
        MortgageMonthlyData,
        'extraPayment' | 'extraInstallments' | 'savedThisMonth'
      >
    >
  ) => {
    setMonthlyData((prev) => {
      const index = prev.findIndex(
        (d) =>
          d.mortgageId === mortgageId && d.year === year && d.month === month
      );

      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...updates };
        return updated;
      }

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
    });
  };

  // ==================== GET DATA FOR YEAR (with calculated remaining) ====================
  const getMonthlyDataForYear = (
    mortgageId: string,
    year: number
  ): MortgageMonthlyData[] => {
    const mortgage = mortgages.find((m) => m.id === mortgageId);
    if (!mortgage) return [];

    const { year: startYear, month: startMonth } = parseStartDate(
      mortgage.startDate
    );
    const totalPayments = mortgage.totalYears * 12;

    const allData = monthlyData
      .filter((d) => d.mortgageId === mortgageId)
      .sort((a, b) => a.year - b.year || a.month - b.month);

    // Remaining installments at the start of this calendar year
    // (before January's scheduled payment), respecting the real start date.
    let currentRemaining = remainingAtStartOfYear(
      totalPayments,
      startYear,
      startMonth,
      year
    );

    const result: MortgageMonthlyData[] = [];

    for (let month = 1; month <= 12; month++) {
      const existing = allData.find((d) => d.year === year && d.month === month);
      const extraInstallments = existing?.extraInstallments || 0;

      const hasStarted =
        year > startYear || (year === startYear && month >= startMonth);

      let remainingThisMonth: number;

      if (!hasStarted) {
        // Mortgage not active yet — full term, no monthly decay
        remainingThisMonth = totalPayments;
        currentRemaining = totalPayments;
      } else {
        remainingThisMonth = Math.max(0, currentRemaining - extraInstallments);
        // One scheduled payment after this month
        currentRemaining = Math.max(0, remainingThisMonth - 1);
      }

      result.push({
        mortgageId,
        year,
        month,
        extraPayment: existing?.extraPayment || 0,
        extraInstallments,
        savedThisMonth: existing?.savedThisMonth || 0,
        remainingInstallments: remainingThisMonth,
      });
    }

    return result;
  };

  return {
    mortgages,
    addMortgage,
    deleteMortgage,
    updateMortgageSetup,
    updateMonthlyData,
    getMonthlyDataForYear,
  };
}

/**
 * Remaining installments at the beginning of `targetYear` (before Jan payment).
 *
 * Example: start July 2026, 30 years (360 payments)
 * - 2026 → 360 (nothing paid yet before July)
 * - 2027 → 360 - 6 = 354 (Jul–Dec 2026 paid)
 */
function remainingAtStartOfYear(
  totalPayments: number,
  startYear: number,
  startMonth: number,
  targetYear: number
): number {
  if (targetYear < startYear) {
    return totalPayments;
  }

  if (targetYear === startYear) {
    // Payments have not started yet as of Jan 1 of the start year
    return totalPayments;
  }

  // Full years after start: months paid = from startMonth..Dec of start year
  // plus 12 * (targetYear - startYear - 1)
  const monthsInStartYear = 12 - startMonth + 1;
  const fullYearsBetween = targetYear - startYear - 1;
  const monthsPassed = monthsInStartYear + fullYearsBetween * 12;

  return Math.max(0, totalPayments - monthsPassed);
}