import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { loadMe, updateProfile } from '../store/auth/auth.actions';
import { selectProfile } from '../store/auth/auth.selector';

type ProfileViewModel = {
  username: string;
  phone: string;
  role: string;
  secretKey: string;
  password: string;
};

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private store = inject(Store);
  private fb = inject(NonNullableFormBuilder);

  editing = false;
  showSecretKey = false;
  showPassword = false;

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  profile: ProfileViewModel | null = null;

  profileForm = this.fb.group({
    username: this.fb.control('', { validators: [Validators.required] }),
    phone: this.fb.control('', { validators: [Validators.required] }),
    role: this.fb.control('', { validators: [Validators.required] }),
    secretKey: this.fb.control('', { validators: [Validators.required, Validators.minLength(6)] }),
    password: this.fb.control('', { validators: [Validators.minLength(6)] }),
  });

  constructor() {
    this.store
      .select(selectProfile)
      .pipe(takeUntilDestroyed())
      .subscribe((profile) => {
        const normalized: ProfileViewModel = {
          username: profile.username ?? '',
          phone: profile.phone ?? '',
          role: profile.role ?? '',
          secretKey: profile.secretKey ?? '',
          password: '',
        };

        this.profile = normalized;

        if (!this.editing) {
          this.profileForm.reset(normalized, { emitEvent: false });
        }
      });
  }

  ngOnInit(): void {
    this.store.dispatch(loadMe());
  }

  startEdit() {
    if (!this.profile) {
      return;
    }

    this.showSecretKey = false;
    this.showPassword = false;
    this.profileForm.setValue(this.profile);
    this.profileForm.controls.password.setValue('');
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
    this.showSecretKey = false;
    this.showPassword = false;

    if (this.profile) {
      this.profileForm.setValue(this.profile);
    } else {
      this.profileForm.reset({ username: '', phone: '', role: '', secretKey: '', password: '' });
    }
  }

  submit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const updated = this.profileForm.getRawValue();
    const payload = {
      username: updated.username.trim(),
      phone: updated.phone.trim(),
      role: updated.role.trim(),
      secretKey: updated.secretKey.trim(),
      ...(updated.password ? { password: updated.password.trim() } : {}),
    };
    this.store.dispatch(updateProfile({ profile: payload }));
    this.editing = false;
  }
}
