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
} from '../../store/regions/region.selectors';

import * as OrdersActions from '../../store/orders/order.actions';
import { MoneyPipe } from '../../shared/money.pipe';

type Region = {
  id: string;
  name?: string;
  region?: string;
  balanceUzs?: string;
  balanceUsd?: string;
  balanceIncomeUzs?: string;
  balanceIncomeUsd?: string;
  balanceExpenseUzs?: string;
  balanceExpenseUsd?: string;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe, MoneyPipe],
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
  regions$ = this.store.select(selectAllRegions);
  loading$ = this.store.select(selectRegionsLoading);
  error$ = this.store.select(selectRegionsError);

  // Tanlov holati
  firstStep = signal<'income' | 'expense' | null>(null);
  selectedIncomeId = signal<string | null>(null);
  selectedExpenseId = signal<string | null>(null);

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

  // "Bo'sh emas" degani: "+998" prefiksidan keyin kamida 1 ta raqam bo'lsin
  private phoneHasAnyDigit = computed(() => {
    const v = (this.phoneValue() ?? '') as string;
    return v.length > 4; // "+998" uzunligi 4, shundan keyin raqam kiritilishi shart
  });

  // Ogohlantirish statuslari (submitga ta'sir qilmaydi)
  usdStatus = signal<'ok' | 'too_high' | 'too_low' | 'incomplete'>('incomplete');
  uzsStatus = signal<'ok' | 'too_low' | 'diff_too_big' | 'incomplete'>('incomplete');

  showActions = computed(() => !!this.fromRegionId() && !!this.toRegionId());

  // ✅ Submit faqat ikkala region tanlangan VA telefon bo'sh bo'lmaganda aktiv
  canSubmit = computed(() => this.showActions() && this.phoneHasAnyDigit());

  ngOnInit(): void {
    // Sahifa ochilganda regionlar
    this.store.dispatch(RegionsActions.loadRegions());

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
        this.store.dispatch(RegionsActions.loadRegions()); // balanslarni yangilash
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
  selectIncomeRegion(id: string) {
    this.selectedIncomeId.set(id);
    if (!this.firstStep()) this.firstStep.set('income');
    this.toRegionId.set(id);
  }

  selectExpenseRegion(id: string) {
    this.selectedExpenseId.set(id);
    if (!this.firstStep()) this.firstStep.set('expense');
    this.fromRegionId.set(id);
  }

  // —— Input handler’lar —— //
  setIncomeUzs(v: string) {
    if (!this.selectedIncomeId()) return;
    this.form.patchValue({ incomeUzs: v === '' ? null : +v }, { emitEvent: false });
    this.computeUzsStatus();
  }

  setIncomeUsd(v: string) {
    if (!this.selectedIncomeId()) return;
    this.form.patchValue({ incomeUsd: v === '' ? null : +v }, { emitEvent: false });
    this.computeUsdStatus();
  }

  setExpenseUzs(v: string) {
    if (!this.selectedExpenseId()) return;
    this.form.patchValue({ expenseUzs: v === '' ? null : +v }, { emitEvent: false });
    this.computeUzsStatus();
  }

  setExpenseUsd(v: string) {
    if (!this.selectedExpenseId()) return;
    this.form.patchValue({ expenseUsd: v === '' ? null : +v }, { emitEvent: false });
    this.computeUsdStatus();
  }

  cancelIncome() {
    const id = this.selectedIncomeId();
    if (!id) return;

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
    if (!this.showActions() || !this.canSubmit()) return;

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
}
