export type Category = {
  id: string;
  name: string;
};

export type PortfolioElement = {
  id: string;
  name: string;
  categoryId: string;           // ← New field
  createdAt: string;
  monthlyValues: {
    [year: number]: {
      [month: number]: {
        invested: number;
        value: number;
      };
    };
  };
};

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

export type PortfolioAllocation = {
  id: string;
  name: string;
  percentage: number;
};

export type Mortgage = {
  id: string;
  loanAmount: number;
  annualInterestRate: number;
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