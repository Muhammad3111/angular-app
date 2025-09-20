import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit, inject, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { login, register } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './login.html',
})
export class Login implements AfterViewInit {
  private fb = inject(NonNullableFormBuilder);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  @ViewChild('card', { static: true }) cardRef!: ElementRef<HTMLDivElement>;
  @ViewChild('cardInner', { static: true }) innerRef!: ElementRef<HTMLDivElement>;

  cardHeight: number | null = null;
  activeTab: 'signin' | 'signup' = 'signin';

  // Sign In form (phone/password string bo‘lib chiqadi, null emas)
  signInForm = this.fb.group({
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Sign Up form (hammasi string tipida)
  signUpForm = this.fb.group({
    username: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['user', [Validators.required]],
    secretKey: ['', [Validators.required, Validators.minLength(6)]],
  });

  showSignInPassword = signal(false);
  showSignUpPassword = signal(false);
  showSignUpSecret = signal(false);

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor() {
    this.initializePhoneControl(this.signInForm.controls.phone);
    this.initializePhoneControl(this.signUpForm.controls.phone);
  }

  toggleSignInPassword() {
    this.showSignInPassword.update((v: boolean) => !v);
  }

  toggleSignUpPassword() {
    this.showSignUpPassword.update((v: boolean) => !v);
  }

  toggleSignUpSecret() {
    this.showSignUpSecret.update((v: boolean) => !v);
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.cardHeight = this.innerRef.nativeElement.scrollHeight;
      setTimeout(() => (this.cardHeight = null), 0);
    });
  }

  switchTab(tab: 'signin' | 'signup') {
    if (this.activeTab === tab) return;

    const cardEl = this.cardRef.nativeElement;
    const innerEl = this.innerRef.nativeElement;

    const start = cardEl.getBoundingClientRect().height;
    this.cardHeight = start;

    this.activeTab = tab;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const end = innerEl.scrollHeight;
        this.cardHeight = end;
      });
    });
  }

  onHeightTransitionEnd() {
    this.cardHeight = null;
  }

  // Kirish
  submitSignIn() {
    if (this.signInForm.invalid) return;
    const dto = this.signInForm.getRawValue(); // { phone: string, password: string }
    const normalizedPhone = this.normalizePhone(dto.phone);
    if (!this.isPhoneComplete(normalizedPhone)) {
      this.signInForm.controls.phone.setErrors({ invalidPhone: true });
      this.signInForm.controls.phone.markAsTouched();
      return;
    }

    this.store.dispatch(login({ phone: normalizedPhone, password: dto.password }));
  }

  // Ro‘yxatdan o‘tish
  submitSignUp() {
    if (this.signUpForm.invalid) return;
    const dto = this.signUpForm.getRawValue();
    const normalizedPhone = this.normalizePhone(dto.phone);
    if (!this.isPhoneComplete(normalizedPhone)) {
      this.signUpForm.controls.phone.setErrors({ invalidPhone: true });
      this.signUpForm.controls.phone.markAsTouched();
      return;
    }

    this.store.dispatch(register({ ...dto, phone: normalizedPhone }));
  }

  private initializePhoneControl(control: FormControl<string>) {
    if (!control.value) {
      control.setValue('+998 ', { emitEvent: false });
    }

    control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      const formatted = this.formatPhoneUi(value ?? '');
      if (value !== formatted) {
        control.setValue(formatted, { emitEvent: false });
      }

      const normalized = this.normalizePhone(formatted);
      if (this.isPhoneComplete(normalized)) {
        const errors = control.errors;
        if (errors && 'invalidPhone' in errors) {
          const { invalidPhone, ...rest } = errors as Record<string, unknown>;
          control.setErrors(Object.keys(rest).length ? (rest as any) : null, {
            emitEvent: false,
          });
        }
      }
    });
  }

  private normalizePhone(v: string): string {
    const digits = (v ?? '').replace(/\D/g, '');
    if (digits.startsWith('998')) {
      return '+998' + digits.slice(3, 12);
    }
    return '+998' + digits.slice(0, 9);
  }

  private formatPhoneUi(v: string): string {
    const digits = (v ?? '').replace(/\D/g, '');
    const tail = (digits.startsWith('998') ? digits.slice(3) : digits).slice(0, 9);
    let result = '+998';
    if (tail.length > 0) result += ' ' + tail.slice(0, 2);
    if (tail.length > 2) result += ' ' + tail.slice(2, 5);
    if (tail.length > 5) result += ' ' + tail.slice(5, 7);
    if (tail.length > 7) result += ' ' + tail.slice(7, 9);
    return result;
  }

  private isPhoneComplete(v: string): boolean {
    return v.length === 13; // +998 + 9 digits
  }
}
