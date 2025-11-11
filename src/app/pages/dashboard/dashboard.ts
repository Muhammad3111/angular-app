import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';
import { startWith, map } from 'rxjs';

import * as RegionsActions from '../../store/regions/region.action';
import {
  selectAllRegions,
  selectRegionsLoading,
  selectRegionsError,
  selectRegionsPage,
  selectRegionsTotalPages,
} from '../../store/regions/region.selectors';

import * as OrdersActions from '../../store/orders/order.actions';
import { MoneyPipe } from '../../shared/money.pipe';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader';

type Region = {
  id: string;
  name?: string;
  region?: string;
  totalBalanceUzs?: string;
  totalBalanceUsd?: string;
  balanceIncomeUzs?: string;
  balanceIncomeUsd?: string;
  balanceExpenseUzs?: string;
  balanceExpenseUsd?: string;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe, MoneyPipe, SkeletonLoaderComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private actions$ = inject(Actions);

  public rName(r: { name?: string; region?: string }) {
    return r.name ?? r.region ?? '—';
  }

  // Thresholdlar (faqat ogohlantirish matnlari uchun)
  readonly MAX_USD_DIFF = 1000; // (incomeUsd - expenseUsd) > 1000 => juda katta
  readonly MAX_UZS_DIFF = 5_000_000; // (incomeUzs - expenseUzs) > 5M  => juda katta

  // Store selectors
  private storeRegions$ = this.store.select(selectAllRegions);
  loading$ = this.store.select(selectRegionsLoading);
  error$ = this.store.select(selectRegionsError);
  currentPage$ = this.store.select(selectRegionsPage);
  totalPages$ = this.store.select(selectRegionsTotalPages);

  currentPage = 1;
  limit = 8;

  // Tanlov holati
  firstStep = signal<'income' | 'expense' | null>(null);
  selectedIncomeId = signal<string | null>(null);
  selectedExpenseId = signal<string | null>(null);
  
  // Tanlangan viloyatlarni saqlab qolish
  selectedIncomeRegion = signal<any | null>(null);
  selectedExpenseRegion = signal<any | null>(null);
  
  // Tanlangan viloyat bilan birga barcha viloyatlarni ko'rsatish
  regions$ = toSignal(
    this.storeRegions$.pipe(
      map(regions => {
        const selected = this.selectedIncomeRegion();
        if (!selected) return regions;
        
        // Agar tanlangan viloyat listda bo'lmasa, uni qo'shamiz
        const exists = regions.some((r: any) => r.id === selected.id);
        if (!exists) {
          return [selected, ...regions];
        }
        return regions;
      })
    ),
    { initialValue: [] }
  );

  // Mapping: from = CHIQIM, to = KIRIM
  fromRegionId = signal<string | null>(null);
  toRegionId = signal<string | null>(null);

  // Toast
  toast = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  private showToast(type: 'success' | 'error', text: string, ms = 2000) {
    this.toast.set({ type, text });
    setTimeout(() => this.toast.set(null), ms);
  }

  // Form
  form = this.fb.group({
    phoneDisplay: [''], // UI input
    // Patternni qoldiramiz: xato format bo'lsa faqat ogohlantiradi, submitni bloklamaydi
    phone: ['', [Validators.pattern(/^\+998\d{9}$/)]], // normalized "+998#########"
    incomeUzs: [null as number | null],
    incomeUsd: [null as number | null],
    expenseUzs: [null as number | null],
    expenseUsd: [null as number | null],
  });

  // Telefon qiymatini signalga aylantirib olamiz
  private phoneValue = toSignal(
    this.form.controls.phone.valueChanges.pipe(startWith(this.form.controls.phone.value ?? '')),
    { initialValue: this.form.controls.phone.value ?? '' }
  );

  // Ogohlantirish statuslari (submitga ta'sir qilmaydi)
  usdStatus = signal<'ok' | 'too_high' | 'too_low' | 'incomplete'>('incomplete');
  uzsStatus = signal<'ok' | 'too_low' | 'diff_too_big' | 'incomplete'>('incomplete');

  showActions = computed(() => !!this.fromRegionId() && !!this.toRegionId());

  ngOnInit(): void {
    // Sahifa ochilganda regionlar
    this.loadRegions();

    // Phone UI -> normalize (phone)
    this.form.controls.phoneDisplay.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        const ui = this.formatPhoneUi(v ?? '');
        if (v !== ui) this.form.controls.phoneDisplay.setValue(ui, { emitEvent: false });

        const normalized = this.normalizePhone(ui);
        if (this.form.controls.phone.value !== normalized) {
          this.form.controls.phone.setValue(normalized, { emitEvent: false });
        }
      });

    // Order create natijalari
    this.actions$
      .pipe(ofType(OrdersActions.createOrderSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.showToast('success', 'Buyurtma yaratildi!');
        this.loadRegions(); // balanslarni yangilash
        this.resetAll();
      });

    this.actions$
      .pipe(ofType(OrdersActions.createOrderFailure), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ error }) => this.showToast('error', error || 'Buyurtma yaratishda xatolik.'));
  }

  // —— Phone helpers —— //
  private normalizePhone(v: string): string {
    const d = (v ?? '').replace(/\D/g, '');
    if (d.startsWith('998')) return '+998' + d.slice(3, 12);
    return '+998' + d.slice(0, 9);
  }

  private formatPhoneUi(v: string): string {
    const d = (v ?? '').replace(/\D/g, '');
    const tail = (d.startsWith('998') ? d.slice(3) : d).slice(0, 9);
    let ui = '+998';
    if (tail.length > 0) ui += ' ' + tail.slice(0, 2);
    if (tail.length > 2) ui += ' ' + tail.slice(2, 5);
    if (tail.length > 5) ui += ' ' + tail.slice(5, 7);
    if (tail.length > 7) ui += ' ' + tail.slice(7, 9);
    return ui;
  }

  onPhoneFocus() {
    const cur = this.form.controls.phoneDisplay.value ?? '';
    if (!cur) this.form.controls.phoneDisplay.setValue('+998 ', { emitEvent: false });
  }

  // —— OGＯHLANTIRISH HISOBLARI (submitga ta’sir qilmaydi) —— //
  private computeUsdStatus() {
    const inc = this.form.controls.incomeUsd.value;
    const exp = this.form.controls.expenseUsd.value;
    if (inc == null || exp == null) {
      this.usdStatus.set('incomplete');
      return;
    }
    const diff = (inc as number) - (exp as number); // income - expense
    if (diff < 0) {
      this.usdStatus.set('too_low'); // chiqim > kirim
      return;
    }
    if (diff > this.MAX_USD_DIFF) {
      this.usdStatus.set('too_high'); // xizmat haqi juda katta
      return;
    }
    this.usdStatus.set('ok');
  }

  private computeUzsStatus() {
    const inc = this.form.controls.incomeUzs.value;
    const exp = this.form.controls.expenseUzs.value;
    if (inc == null || exp == null) {
      this.uzsStatus.set('incomplete');
      return;
    }
    const diff = (inc as number) - (exp as number); // income - expense
    if (diff < 0) {
      this.uzsStatus.set('too_low'); // chiqim > kirim
      return;
    }
    if (diff > this.MAX_UZS_DIFF) {
      this.uzsStatus.set('diff_too_big'); // juda katta
      return;
    }
    this.uzsStatus.set('ok');
  }

  // —— Tanlash —— //
  selectIncomeRegion(id: string, region?: any) {
    this.selectedIncomeId.set(id);
    if (region) {
      this.selectedIncomeRegion.set(region);
    }
    if (!this.firstStep()) this.firstStep.set('income');
    this.toRegionId.set(id);
  }

  onIncomeCardKeydown(event: KeyboardEvent, id: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.selectedIncomeId() === id) {
        this.cancelIncome();
      } else {
        this.selectIncomeRegion(id);
      }
    } else if (event.key === 'Escape') {
      if (this.selectedIncomeId() === id) {
        event.preventDefault();
        this.cancelIncome();
      }
    }
  }

  selectExpenseRegion(id: string, region?: any) {
    this.selectedExpenseId.set(id);
    if (region) {
      this.selectedExpenseRegion.set(region);
    }
    if (!this.firstStep()) this.firstStep.set('expense');
    this.fromRegionId.set(id);
  }

  onExpenseCardKeydown(event: KeyboardEvent, id: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.selectedExpenseId() === id) {
        this.cancelExpense();
      } else {
        this.selectExpenseRegion(id);
      }
    } else if (event.key === 'Escape') {
      if (this.selectedExpenseId() === id) {
        event.preventDefault();
        this.cancelExpense();
      }
    }
  }

  // —— Number formatting utilities —— //
  private formatNumberForDisplay(value: string | number): string {
    if (!value && value !== 0) return '';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';
    return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  private parseNumberFromDisplay(value: string): string {
    if (!value) return '';
    return value.replace(/\s/g, '').replace(',', '.');
  }

  // —— Input handler'lar —— //
  setIncomeUzs(event: Event) {
    if (!this.selectedIncomeId()) return;
    const input = event.target as HTMLInputElement;
    const rawValue = this.parseNumberFromDisplay(input.value);
    const formattedValue = this.formatNumberForDisplay(rawValue);
    input.value = formattedValue;
    this.form.patchValue({ incomeUzs: rawValue === '' ? null : +rawValue }, { emitEvent: false });
    this.computeUzsStatus();
  }

  setIncomeUsd(event: Event) {
    if (!this.selectedIncomeId()) return;
    const input = event.target as HTMLInputElement;
    const rawValue = this.parseNumberFromDisplay(input.value);
    const formattedValue = this.formatNumberForDisplay(rawValue);
    input.value = formattedValue;
    this.form.patchValue({ incomeUsd: rawValue === '' ? null : +rawValue }, { emitEvent: false });
    this.computeUsdStatus();
  }

  setExpenseUzs(event: Event) {
    if (!this.selectedExpenseId()) return;
    const input = event.target as HTMLInputElement;
    const rawValue = this.parseNumberFromDisplay(input.value);
    const formattedValue = this.formatNumberForDisplay(rawValue);
    input.value = formattedValue;
    this.form.patchValue({ expenseUzs: rawValue === '' ? null : +rawValue }, { emitEvent: false });
    this.computeUzsStatus();
  }

  setExpenseUsd(event: Event) {
    if (!this.selectedExpenseId()) return;
    const input = event.target as HTMLInputElement;
    const rawValue = this.parseNumberFromDisplay(input.value);
    const formattedValue = this.formatNumberForDisplay(rawValue);
    input.value = formattedValue;
    this.form.patchValue({ expenseUsd: rawValue === '' ? null : +rawValue }, { emitEvent: false });
    this.computeUsdStatus();
  }

  cancelIncome() {
    const id = this.selectedIncomeId();

    this.cancelExpense();
    this.selectedIncomeId.set(null);
    if (this.toRegionId() === id) this.toRegionId.set(null);

    if (this.firstStep() === 'income') {
      this.form.patchValue({ phone: '', phoneDisplay: '' }, { emitEvent: false });
    }

    if (this.firstStep() === 'income' && !this.selectedExpenseId()) {
      this.firstStep.set(null);
    }

    this.form.patchValue({ incomeUzs: null, incomeUsd: null }, { emitEvent: false });
    this.computeUsdStatus();
    this.computeUzsStatus();
  }

  cancelExpense() {
    const id = this.selectedExpenseId();
    if (!id) return;

    this.selectedExpenseId.set(null);
    if (this.fromRegionId() === id) this.fromRegionId.set(null);

    if (this.firstStep() === 'expense') {
      this.form.patchValue({ phone: '', phoneDisplay: '' }, { emitEvent: false });
    }

    if (this.firstStep() === 'expense' && !this.selectedIncomeId()) {
      this.firstStep.set(null);
    }

    this.form.patchValue({ expenseUzs: null, expenseUsd: null }, { emitEvent: false });
    this.computeUsdStatus();
    this.computeUzsStatus();
  }

  // —— Reset —— //
  resetAll() {
    this.firstStep.set(null);
    this.selectedIncomeId.set(null);
    this.selectedExpenseId.set(null);
    this.fromRegionId.set(null);
    this.toRegionId.set(null);
    this.form.reset();
    this.usdStatus.set('incomplete');
    this.uzsStatus.set('incomplete');
  }

  // —— Submit —— //
  submit() {
    if (!this.showActions()) return;

    const v = this.form.value;

    const dto = {
      fromRegionId: this.fromRegionId()!,
      toRegionId: this.toRegionId()!,
      phone: this.form.controls.phone.value!,
      incomeUzs: v.incomeUzs ?? 0,
      expenseUzs: v.expenseUzs ?? 0,
      incomeUsd: v.incomeUsd ?? 0,
      expenseUsd: v.expenseUsd ?? 0,
    };

    this.store.dispatch(OrdersActions.createOrder({ dto }));
  }

  // Pagination methods
  loadRegions() {
    this.store.dispatch(RegionsActions.loadRegions({ page: this.currentPage, limit: this.limit }));
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadRegions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage() {
    this.currentPage++;
    this.loadRegions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRegions();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get skeletonArray() {
    return Array(this.limit).fill(0);
  }
}
