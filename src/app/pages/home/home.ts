import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { selectAllRegions, selectRegionsLoading } from '../../store/regions/region.selectors';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
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

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, CommonModule, FontAwesomeModule, MoneyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private store = inject(Store);

  regions$ = this.store.select(selectAllRegions);
  loading$ = this.store.select(selectRegionsLoading);

  analytics$ = this.store.select(selectAnalytics);
  analyticsLoading$ = this.store.select(selectAnalyticsLoading);
  analyticsError$ = this.store.select(selectAnalyticsError);

  ngOnInit(): void {
    // Sahifaga kirilganda faqat bir marta chaqiramiz
    this.store.dispatch(RegionsActions.loadRegions());
    this.store.dispatch(AnalyticsActions.loadAnalytics());
  }
}
