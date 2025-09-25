// src/app/store/orders/orders.types.ts

/** Region qisqa ma'lumotlari (API dagi from_region/to_region obyektlari) */
declare interface RegionBrief {
  id: string;
  name: string;

  // Backendda string sifatida keladi:
  totalBalanceUzs: string; // "4700000.00"
  totalBalanceUsd: string; // "-1030.00"
  balanceIncomeUzs: string; // "11500000.00"
  balanceIncomeUsd: string; // "750.00"
  balanceExpenseUzs: string; // "4800000.00"
  balanceExpenseUsd: string; // "2280.00"

  created_at: string; // ISO
  updated_at: string; // ISO
}

/** Bitta order yozuvi (API response ichidagi element) */
declare interface OrderEntity {
  id: string;
  phone: string;

  // CHIQIM va KIRIM regionlari
  from_region: RegionBrief; // chiqim
  to_region: RegionBrief; // kirim

  // Summalar backendda string (".00" bilan) bo‘lib keladi
  incomeUzs: string; // "5000000.00"
  expenseUzs: string; // "5500000.00"
  incomeUsd: string; // "500.00"
  expenseUsd: string; // "520.00"

  created_at: string; // ISO
  updated_at: string; // ISO
  is_deleted: boolean;

  // Flow balanslar number sifatida keladi (namunada shunday)
  flowBalanceUzs: number; // -500000
  flowBalanceUsd: number; // -20
}

/** Pagination bilan keladigan javob */
declare interface OrdersPaginatedResponse {
  data: OrderEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** GET uchun parametrlar (effectda ishlatish qulay) */
declare interface LoadOrdersParams {
  page?: number; // default: 1
  limit?: number; // default: 15
  // kerak bo‘lsa qo‘shimcha filtrlar:
  search?: string;
  fromRegionId?: string;
  toRegionId?: string;
  dateFrom?: string; // ISO
  dateTo?: string; // ISO
}

/** Create uchun DTO (senda allaqachon bor, to‘liq bo‘lishi uchun qo‘ydim) */
declare interface CreateOrderDto {
  fromRegionId: string; // CHIQIM
  toRegionId: string; // KIRIM
  phone: string; // +998999999999
  incomeUzs: number;
  expenseUzs: number;
  incomeUsd: number;
  expenseUsd: number;
}
