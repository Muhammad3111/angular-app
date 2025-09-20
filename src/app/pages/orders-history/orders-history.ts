import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import * as OrdersActions from '../../store/orders/order.actions';
import {
  selectAllOrders,
  selectOrdersLoading,
  selectOrdersError,
} from '../../store/orders/order.selectors';

import { MoneyPipe } from '../../shared/money.pipe';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CommonModule, AsyncPipe, ReactiveFormsModule, MoneyPipe],
  templateUrl: './orders-history.html',
  styleUrls: ['./orders-history.css'],
})
export class OrdersHistory implements OnInit {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);

  /** Pagination (har sahifada 15 ta) */
  page = 1;
  limit = 12;

  /** Filterlar */
  searchCtrl = new FormControl<string>('', { nonNullable: true });
  fromDate: string | null = null; // 'YYYY-MM-DD'
  toDate: string | null = null; // 'YYYY-MM-DD'

  /** UI: delete modal */
  showDeleteModal = false;
  deleteId: string | null = null;

  /** Selectors */
  orders$ = this.store.select(selectAllOrders);
  loading$ = this.store.select(selectOrdersLoading);
  error$ = this.store.select(selectOrdersError);

  get hasSearch(): boolean {
    return !!this.searchCtrl.value?.trim();
  }

  get hasDateRange(): boolean {
    return !!this.fromDate && !!this.toDate;
  }

  ngOnInit(): void {
    this.fetch(); // initial

    // Delete success -> modal yopish va ayni sahifani qayta yuklash
    this.actions$
      .pipe(ofType(OrdersActions.deleteOrderSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.closeDelete();
        this.fetch();
      });

    // 3s debounce bilan search
    this.searchCtrl.valueChanges
      .pipe(debounceTime(3000), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.page = 1;
        this.fetch();
      });
  }

  /** Umumiy fetch */
  private fetch() {
    const search = this.searchCtrl.value?.trim();
    const params: LoadOrdersParams = {
      page: this.page,
      limit: this.limit,
      search: search ? search : undefined,
      // Sana: faqat IKKALASI bor bo‘lsa yuboramiz
      dateFrom: this.fromDate && this.toDate ? this.fromDate : undefined,
      dateTo: this.fromDate && this.toDate ? this.toDate : undefined,
    };
    this.store.dispatch(OrdersActions.loadOrders({ params }));
  }

  /** Sana tanlash handlerlari (ikkalasi to‘lganida fetch) */
  onFromDate(v: string) {
    this.fromDate = v || null;
    if (this.fromDate && this.toDate) {
      this.page = 1;
      this.fetch();
    } else if (!this.fromDate && !this.toDate) {
      this.page = 1;
      this.fetch();
    }
  }
  onToDate(v: string) {
    this.toDate = v || null;
    if (this.fromDate && this.toDate) {
      this.page = 1;
      this.fetch();
    } else if (!this.fromDate && !this.toDate) {
      this.page = 1;
      this.fetch();
    }
  }

  clearSearch() {
    if (!this.hasSearch) return;
    this.searchCtrl.setValue('', { emitEvent: false });
    this.page = 1;
    this.fetch();
  }

  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.clearSearch();
    }
  }

  clearDates() {
    if (!this.hasDateRange) return;
    this.fromDate = null;
    this.toDate = null;
    this.page = 1;
    this.fetch();
  }

  onDateKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.clearDates();
    }
  }

  /** Pagination */
  prev() {
    if (this.page > 1) {
      this.page--;
      this.fetch();
    }
  }
  next(currentCount: number) {
    // total meta saqlamayapmiz, shuning uchun "keyingi sahifa bor" deb
    // faqat joriy sahifada limitga teng miqdor qaytganda qaror qilamiz
    if (currentCount >= this.limit) {
      this.page++;
      this.fetch();
    }
  }

  /** Delete modal ochish/yopish/confirm */
  openDelete(id: string) {
    this.deleteId = id;
    this.showDeleteModal = true;
  }
  closeDelete() {
    this.showDeleteModal = false;
    this.deleteId = null;
  }
  confirmDelete() {
    if (!this.deleteId) return;
    this.store.dispatch(OrdersActions.deleteOrder({ id: this.deleteId }));
  }

  /** Helperlar */
  fromName(o: OrderEntity) {
    return o?.from_region?.name ?? '—';
  }
  toName(o: OrderEntity) {
    return o?.to_region?.name ?? '—';
  }
  flowClass(v: number) {
    return v > 0 ? 'text-green-600' : v < 0 ? 'text-red-600' : 'text-gray-700';
  }
}
