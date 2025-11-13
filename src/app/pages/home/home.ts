import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  selectAllRegions,
  selectRegionsLoading,
} from '../../store/regions/region.selectors';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as RegionsActions from '../../store/regions/region.action';
import * as AnalyticsActions from '../../store/analytics/analytics.actions';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MoneyPipe } from '../../shared/money.pipe';
import {
  selectAnalytics,
  selectAnalyticsError,
  selectAnalyticsLoading,
} from '../../store/analytics/analytics.selectors';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../shared/toast.service';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe,
    CommonModule,
    FontAwesomeModule,
    MoneyPipe,
    ReactiveFormsModule,
    SkeletonLoaderComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private store = inject(Store);
  private fb = inject(NonNullableFormBuilder);
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);
  private toast = inject(ToastService);
  showDeleteModal = false;
  deleteId: string | null = null;

  regions$ = this.store.select(selectAllRegions);
  loading$ = this.store.select(selectRegionsLoading);

  analytics$ = this.store.select(selectAnalytics);
  analyticsLoading$ = this.store.select(selectAnalyticsLoading);
  analyticsError$ = this.store.select(selectAnalyticsError);

  createRegionForm = this.fb.group({
    name: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  editRegionForm = this.fb.group({
    name: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    balanceIncomeUzs: this.fb.control('', { validators: [Validators.required] }),
    balanceIncomeUsd: this.fb.control('', { validators: [Validators.required] }),
    balanceExpenseUzs: this.fb.control('', { validators: [Validators.required] }),
    balanceExpenseUsd: this.fb.control('', { validators: [Validators.required] }),
  });

  // Number formatting utilities
  private formatNumberForDisplay(value: string | number): string {
    if (!value && value !== 0) return '';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';
    return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  private parseNumberFromDisplay(value: string): string {
    if (!value) return '';
    return value.replace(/\s/g, '');
  }

  // Input handlers for formatted inputs
  onBalanceIncomeUzsInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const rawValue = this.parseNumberFromDisplay(input.value);
    const formattedValue = this.formatNumberForDisplay(rawValue);
    input.value = formattedValue;
    this.editRegionForm.patchValue({ balanceIncomeUzs: rawValue }, { emitEvent: false });
  }

  onBalanceIncomeUsdInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const rawValue = this.parseNumberFromDisplay(input.value);
    const formattedValue = this.formatNumberForDisplay(rawValue);
    input.value = formattedValue;
    this.editRegionForm.patchValue({ balanceIncomeUsd: rawValue }, { emitEvent: false });
  }

  onBalanceExpenseUzsInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const rawValue = this.parseNumberFromDisplay(input.value);
    const formattedValue = this.formatNumberForDisplay(rawValue);
    input.value = formattedValue;
    this.editRegionForm.patchValue({ balanceExpenseUzs: rawValue }, { emitEvent: false });
  }

  onBalanceExpenseUsdInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const rawValue = this.parseNumberFromDisplay(input.value);
    const formattedValue = this.formatNumberForDisplay(rawValue);
    input.value = formattedValue;
    this.editRegionForm.patchValue({ balanceExpenseUsd: rawValue }, { emitEvent: false });
  }

  // Method to set formatted values in the form
  private setFormattedValues() {
    setTimeout(() => {
      const incomeUzsInput = document.querySelector(
        'input[name="balanceIncomeUzs"]'
      ) as HTMLInputElement;
      const incomeUsdInput = document.querySelector(
        'input[name="balanceIncomeUsd"]'
      ) as HTMLInputElement;
      const expenseUzsInput = document.querySelector(
        'input[name="balanceExpenseUzs"]'
      ) as HTMLInputElement;
      const expenseUsdInput = document.querySelector(
        'input[name="balanceExpenseUsd"]'
      ) as HTMLInputElement;

      if (incomeUzsInput) {
        incomeUzsInput.value = this.formatNumberForDisplay(
          this.editRegionForm.value.balanceIncomeUzs || ''
        );
      }
      if (incomeUsdInput) {
        incomeUsdInput.value = this.formatNumberForDisplay(
          this.editRegionForm.value.balanceIncomeUsd || ''
        );
      }
      if (expenseUzsInput) {
        expenseUzsInput.value = this.formatNumberForDisplay(
          this.editRegionForm.value.balanceExpenseUzs || ''
        );
      }
      if (expenseUsdInput) {
        expenseUsdInput.value = this.formatNumberForDisplay(
          this.editRegionForm.value.balanceExpenseUsd || ''
        );
      }
    }, 0);
  }

  isCreateModalOpen = signal(false);
  creatingRegion = signal(false);
  editingRegionId = signal<string | null>(null);
  updatingRegion = signal(false);

  ngOnInit(): void {
    // Sahifaga kirilganda cache'dan yuklanadi (agar cache valid bo'lsa)
    // force: true qo'shsangiz, cache'ni ignore qiladi
    this.loadRegions();
    this.store.dispatch(AnalyticsActions.loadAnalytics());

    this.actions$
      .pipe(ofType(RegionsActions.createRegionSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ region }) => {
        this.creatingRegion.set(false);
        this.isCreateModalOpen.set(false);
        this.createRegionForm.reset({ name: '' });
        this.store.dispatch(AnalyticsActions.loadAnalytics());
        this.loadRegions();
        this.toast.show('success', `${region?.name ?? 'Viloyat'} qo'shildi`);
      });

    this.actions$
      .pipe(ofType(RegionsActions.createRegionFailure), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ error }) => {
        this.creatingRegion.set(false);
        this.toast.show('error', error ?? "Viloyat qo'shib bo'lmadi");
      });

    this.actions$
      .pipe(ofType(RegionsActions.updateRegionSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ region }) => {
        if (this.editingRegionId() === region.id) {
          this.editingRegionId.set(null);
        }
        this.updatingRegion.set(false);
        this.editRegionForm.reset({
          name: '',
          balanceIncomeUzs: '',
          balanceIncomeUsd: '',
          balanceExpenseUzs: '',
          balanceExpenseUsd: '',
        });
        this.store.dispatch(AnalyticsActions.loadAnalytics());
        this.toast.show('success', `${region?.name ?? 'Viloyat'} yangilandi`);
      });

    this.actions$
      .pipe(ofType(RegionsActions.updateRegionFailure), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ error }) => {
        this.updatingRegion.set(false);
        this.toast.show('error', error ?? 'Viloyat yangilashda xatolik');
      });

    this.actions$
      .pipe(ofType(RegionsActions.deleteRegionSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.closeDelete();
        this.store.dispatch(AnalyticsActions.loadAnalytics());
        this.loadRegions();
        this.toast.show('success', "Viloyat o'chirildi");
      });

    this.actions$
      .pipe(ofType(RegionsActions.deleteRegionFailure), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ error }) => {
        this.closeDelete();
        this.toast.show('error', error ?? "Viloyat o'chirishda xatolik");
      });
  }

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
    this.store.dispatch(RegionsActions.deleteRegion({ id: this.deleteId }));
  }

  openCreateRegionModal() {
    this.createRegionForm.reset({ name: '' });
    this.creatingRegion.set(false);
    this.isCreateModalOpen.set(true);
  }

  closeCreateRegionModal() {
    if (this.creatingRegion()) {
      return;
    }
    this.isCreateModalOpen.set(false);
  }

  submitCreateRegion() {
    if (this.creatingRegion()) {
      return;
    }

    if (this.createRegionForm.invalid) {
      this.createRegionForm.markAllAsTouched();
      return;
    }

    const name = this.createRegionForm.controls.name.value.trim();
    if (!name) {
      this.createRegionForm.controls.name.setErrors({ required: true });
      this.createRegionForm.markAllAsTouched();
      return;
    }

    this.creatingRegion.set(true);
    this.store.dispatch(RegionsActions.createRegion({ region: { name } }));
  }

  startEditRegion(region: any) {
    if (this.updatingRegion()) {
      return;
    }

    this.editRegionForm.reset({
      name: region?.name ?? '',
      balanceIncomeUzs: this.normalizeMetric(region?.balanceIncomeUzs),
      balanceIncomeUsd: this.normalizeMetric(region?.balanceIncomeUsd),
      balanceExpenseUzs: this.normalizeMetric(region?.balanceExpenseUzs),
      balanceExpenseUsd: this.normalizeMetric(region?.balanceExpenseUsd),
    });

    this.editRegionForm.markAsPristine();
    this.editingRegionId.set(region?.id ?? null);
    this.setFormattedValues();
  }

  cancelEditRegion() {
    if (this.updatingRegion()) {
      return;
    }

    this.editRegionForm.reset({
      name: '',
      balanceIncomeUzs: '',
      balanceIncomeUsd: '',
      balanceExpenseUzs: '',
      balanceExpenseUsd: '',
    });

    this.editingRegionId.set(null);
  }

  submitUpdateRegion(regionId: string) {
    if (this.updatingRegion()) {
      return;
    }

    if (!regionId) {
      return;
    }

    if (this.editRegionForm.invalid) {
      this.editRegionForm.markAllAsTouched();
      return;
    }

    const raw = this.editRegionForm.getRawValue();

    const numericFields: Array<keyof typeof raw> = [
      'balanceIncomeUzs',
      'balanceIncomeUsd',
      'balanceExpenseUzs',
      'balanceExpenseUsd',
    ];

    let hasError = false;

    numericFields.forEach((field) => {
      const control = this.editRegionForm.controls[field];
      const value = raw[field];
      if (!control) {
        return;
      }
      if (value === null || value === undefined || value === '') {
        control.setErrors({ required: true });
        hasError = true;
      } else if (!Number.isFinite(Number(value))) {
        control.setErrors({ number: true });
        hasError = true;
      }
    });

    const name = raw.name?.trim();
    if (!name) {
      this.editRegionForm.controls.name.setErrors({ required: true });
      hasError = true;
    }

    if (hasError) {
      this.editRegionForm.markAllAsTouched();
      return;
    }

    const payload: Partial<RegionModel> = {
      name,
      balanceIncomeUzs: Number(raw.balanceIncomeUzs).toString(),
      balanceIncomeUsd: Number(raw.balanceIncomeUsd).toString(),
      balanceExpenseUzs: Number(raw.balanceExpenseUzs).toString(),
      balanceExpenseUsd: Number(raw.balanceExpenseUsd).toString(),
    };

    this.updatingRegion.set(true);
    this.store.dispatch(RegionsActions.updateRegion({ id: regionId, changes: payload }));
  }

  private normalizeMetric(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value.toString() : '';
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return '';
      }
      const numeric = Number(trimmed);
      return Number.isFinite(numeric) ? numeric.toString() : trimmed;
    }
    return '';
  }

  // Load all regions without pagination
  loadRegions() {
    this.store.dispatch(RegionsActions.loadRegions({ page: 1, limit: 1000 }));
  }

  get skeletonArray() {
    return Array(9).fill(0);
  }
}
