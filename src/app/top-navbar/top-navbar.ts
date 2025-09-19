import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleLeft, faCircleRight, faUser } from '@fortawesome/free-solid-svg-icons';
import { SidebarService } from '../sidebar/sidebar.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadMe, logout } from '../store/auth/auth.actions';
import { Observable } from 'rxjs';
import { selectUsername, selectRole } from '../store/auth/auth.selector';

@Component({
  selector: 'app-top-navbar',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './top-navbar.html',
  styleUrl: './top-navbar.css',
})
export class TopNavbar {
  faUser = faUser;
  faCircleLeft = faCircleLeft;
  faCircleRight = faCircleRight;

  sidebarService = inject(SidebarService);
  private store = inject(Store);

  dropdownOpen = false;

  username$: Observable<string | null> = this.store.select(selectUsername);
  role$: Observable<string | null> = this.store.select(selectRole);

  get collapsed() {
    return this.sidebarService.collapsed();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToProfile() {
    console.log('Profilega o‘tildi');
    this.dropdownOpen = false;
  }

  logout() {
    this.store.dispatch(logout());
    this.dropdownOpen = false;
  }

  ngOnInit() {
    this.store.dispatch(loadMe());
  }
}
