import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login, register } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login implements AfterViewInit {
  private fb = inject(NonNullableFormBuilder);
  private store = inject(Store);

  @ViewChild('card', { static: true }) cardRef!: ElementRef<HTMLDivElement>;
  @ViewChild('cardInner', { static: true }) innerRef!: ElementRef<HTMLDivElement>;

  cardHeight: number | null = null;
  activeTab: 'signin' | 'signup' = 'signin';

  // Sign In form (phone/password string bo‘lib chiqadi, null emas)
  signInForm = this.fb.group({
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  // Sign Up form (hammasi string tipida)
  signUpForm = this.fb.group({
    username: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    role: ['user', [Validators.required]],
    secretKey: ['', [Validators.required]],
  });

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
    this.store.dispatch(login(dto));
  }

  // Ro‘yxatdan o‘tish
  submitSignUp() {
    if (this.signUpForm.invalid) return;
    const dto = this.signUpForm.getRawValue(); // { username, phone, password, role, secretKey }
    this.store.dispatch(register(dto));
  }
}
