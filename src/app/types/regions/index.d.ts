declare interface OrderModel {
  id: string;
  phone: string | null;
  incomeUzs: string;
  expenseUzs: string;
  incomeUsd: string;
  expenseUsd: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  is_deleted: boolean;
}

declare interface RegionModel {
  id: string;
  name: string;

  totalBalanceUzs: string;
  totalBalanceUsd: string;
  balanceIncomeUzs: string;
  balanceIncomeUsd: string;
  balanceExpenseUzs: string;
  balanceExpenseUsd: string;

  created_at: string; // ISO date string
  updated_at: string; // ISO date string

  outgoingOrders: OrderModel[];
  incomingOrders: OrderModel[];
}

declare type RegionListResponse = RegionModel[];
