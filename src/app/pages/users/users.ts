import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from '../../shared/toast.service';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader';
import * as UsersActions from '../../store/users/users.actions';
import {
  selectAllUsers,
  selectUsersLoading,
  selectUsersError,
} from '../../store/users/users.selectors';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, SkeletonLoaderComponent],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class UsersPage implements OnInit {
  private store = inject(Store);
  private fb = inject(NonNullableFormBuilder);
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);
  private toast = inject(ToastService);

  users$ = this.store.select(selectAllUsers);
  loading$ = this.store.select(selectUsersLoading);
  error$ = this.store.select(selectUsersError);

  isCreateModalOpen = signal(false);
  isEditModalOpen = signal(false);
  showDeleteModal = false;
  deleteId: string | null = null;
  editingUserId = signal<string | null>(null);
  creatingUser = signal(false);
  updatingUser = signal(false);

  showCreatePassword = signal(false);
  showCreateSecretKey = signal(false);
  showEditPassword = signal(false);

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  createUserForm = this.fb.group({
    username: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    phone: this.fb.control('', {
      validators: [Validators.required, Validators.pattern(/^\+998\d{9}$/)],
    }),
    phoneDisplay: this.fb.control(''),
    password: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    role: this.fb.control<'admin' | 'operator' | 'user'>('user', {
      validators: [Validators.required],
    }),
    secretKey: this.fb.control('', { validators: [Validators.required] }),
  });

  editUserForm = this.fb.group({
    username: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    phone: this.fb.control('', {
      validators: [Validators.required, Validators.pattern(/^\+998\d{9}$/)],
    }),
    phoneDisplay: this.fb.control(''),
    password: this.fb.control(''),
    role: this.fb.control<'admin' | 'operator' | 'user'>('user', {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.loadUsers();

    this.createUserForm.controls.phoneDisplay.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        const ui = this.formatPhoneUi(v ?? '');
        if (v !== ui) this.createUserForm.controls.phoneDisplay.setValue(ui, { emitEvent: false });
        const normalized = this.normalizePhone(ui);
        if (this.createUserForm.controls.phone.value !== normalized) {
          this.createUserForm.controls.phone.setValue(normalized, { emitEvent: false });
        }
      });

    this.editUserForm.controls.phoneDisplay.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        const ui = this.formatPhoneUi(v ?? '');
        if (v !== ui) this.editUserForm.controls.phoneDisplay.setValue(ui, { emitEvent: false });
        const normalized = this.normalizePhone(ui);
        if (this.editUserForm.controls.phone.value !== normalized) {
          this.editUserForm.controls.phone.setValue(normalized, { emitEvent: false });
        }
      });

    this.actions$
      .pipe(ofType(UsersActions.createUserSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ user }) => {
        this.creatingUser.set(false);
        this.isCreateModalOpen.set(false);
        this.createUserForm.reset({
          username: '',
          phone: '',
          phoneDisplay: '',
          password: '',
          role: 'user',
          secretKey: '',
        });
        this.loadUsers();
        this.toast.show('success', `${user?.username ?? 'Foydalanuvchi'} qo'shildi`);
      });

    this.actions$
      .pipe(ofType(UsersActions.createUserFailure), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ error }) => {
        this.creatingUser.set(false);
        this.toast.show('error', error ?? "Foydalanuvchi qo'shib bo'lmadi");
      });

    this.actions$
      .pipe(ofType(UsersActions.updateUserSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ user }) => {
        this.updatingUser.set(false);
        this.isEditModalOpen.set(false);
        this.editingUserId.set(null);
        this.editUserForm.reset();
        this.loadUsers();
        this.toast.show('success', `${user?.username ?? 'Foydalanuvchi'} yangilandi`);
      });

    this.actions$
      .pipe(ofType(UsersActions.updateUserFailure), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ error }) => {
        this.updatingUser.set(false);
        this.toast.show('error', error ?? 'Foydalanuvchi yangilashda xatolik');
      });

    this.actions$
      .pipe(ofType(UsersActions.deleteUserSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.closeDelete();
        this.loadUsers();
        this.toast.show('success', "Foydalanuvchi o'chirildi");
      });

    this.actions$
      .pipe(ofType(UsersActions.deleteUserFailure), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ error }) => {
        this.closeDelete();
        this.toast.show('error', error ?? "Foydalanuvchi o'chirishda xatolik");
      });
  }

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

  onPhoneFocus(form: 'create' | 'edit') {
    const formGroup = form === 'create' ? this.createUserForm : this.editUserForm;
    const cur = formGroup.controls.phoneDisplay.value ?? '';
    if (!cur) formGroup.controls.phoneDisplay.setValue('+998 ', { emitEvent: false });
  }

  loadUsers() {
    this.store.dispatch(UsersActions.loadUsers());
  }

  openCreateModal() {
    this.createUserForm.reset({
      username: '',
      phone: '',
      phoneDisplay: '',
      password: '',
      role: 'user',
      secretKey: '',
    });
    this.creatingUser.set(false);
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    if (this.creatingUser()) return;
    this.isCreateModalOpen.set(false);
  }

  submitCreateUser() {
    if (this.creatingUser()) return;

    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    const raw = this.createUserForm.getRawValue();
    const username = raw.username.trim();
    const secretKey = raw.secretKey.trim();

    if (!username || !secretKey) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.creatingUser.set(true);
    this.store.dispatch(
      UsersActions.createUser({
        user: {
          username,
          phone: raw.phone,
          password: raw.password,
          role: raw.role,
          secretKey,
        },
      }),
    );
  }

  openEditModal(user: any) {
    if (this.updatingUser()) return;

    this.editUserForm.reset({
      username: user?.username ?? '',
      phone: user?.phone ?? '',
      phoneDisplay: this.formatPhoneUi(user?.phone ?? ''),
      password: '',
      role: user?.role ?? 'user',
    });

    this.editingUserId.set(user?.id ?? null);
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    if (this.updatingUser()) return;
    this.isEditModalOpen.set(false);
    this.editingUserId.set(null);
  }

  submitUpdateUser() {
    if (this.updatingUser()) return;

    const userId = this.editingUserId();
    if (!userId) return;

    if (this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      return;
    }

    const raw = this.editUserForm.getRawValue();
    const username = raw.username.trim();

    if (!username) {
      this.editUserForm.markAllAsTouched();
      return;
    }

    const changes: any = {
      username,
      phone: raw.phone,
      role: raw.role,
    };

    if (raw.password && raw.password.trim()) {
      changes.password = raw.password;
    }

    this.updatingUser.set(true);
    this.store.dispatch(UsersActions.updateUser({ id: userId, changes }));
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
    this.store.dispatch(UsersActions.deleteUser({ id: this.deleteId }));
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'user':
        return 'Foydalanuvchi';
      default:
        return role;
    }
  }

  get skeletonArray() {
    return Array(6).fill(0);
  }
}
