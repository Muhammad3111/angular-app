import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { TopNavbar } from '../top-navbar/top-navbar';
import { ToastComponent } from '../shared/toast/toast.component';
import { SidebarService } from '../sidebar/sidebar.service';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const DESKTOP_BREAKPOINT = 1024; // Tailwind `lg`

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, TopNavbar, ToastComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  private readonly sidebar = inject(SidebarService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    fromEvent(window, 'resize')
      .pipe(
        map((event) => (event.target as Window).innerWidth),
        startWith(window.innerWidth),
        map((width) => width >= DESKTOP_BREAKPOINT),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((isDesktop) => {
        if (isDesktop) {
          this.sidebar.open();
        } else {
          this.sidebar.close();
        }
      });
  }
}
