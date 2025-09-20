import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toast()) {
      <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
        <div
          class="rounded-xl shadow-lg px-5 py-4 text-white flex items-start gap-3 animate-fade-in pointer-events-auto"
          [ngClass]="toast()?.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'"
        >
          <div class="pt-0.5">
            @if (toast()?.type === 'success') {
              <span class="font-semibold">✔</span>
            } @else {
              <span class="font-semibold">!</span>
            }
          </div>
          <div class="flex-1 text-sm leading-5">{{ toast()?.message }}</div>
          <button
            type="button"
            class="text-white/80 hover:text-white text-lg leading-none"
            (click)="clear()"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        pointer-events: none;
      }
      .animate-fade-in {
        animation: fade-in 0.25s ease-out;
      }
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  readonly toast = this.toastService.toast;

  clear() {
    this.toastService.clear();
  }
}
