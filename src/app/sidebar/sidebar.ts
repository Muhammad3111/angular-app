import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGrip, faHouse, faClipboard, faLeaf, faGear } from '@fortawesome/free-solid-svg-icons';
import { SidebarService } from './sidebar.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectRole } from '../store/auth/auth.selector';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule, CommonModule, AsyncPipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  faClipboard = faClipboard;
  faHouse = faHouse;
  faGrip = faGrip;
  faLeaf = faLeaf;
  faSettings = faGear;
  sidebarService = inject(SidebarService);
  private store = inject(Store);

  role$ = this.store.select(selectRole);

  get collapsed() {
    return this.sidebarService.collapsed();
  }
}
