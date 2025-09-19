import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { TopNavbar } from '../top-navbar/top-navbar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, TopNavbar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
