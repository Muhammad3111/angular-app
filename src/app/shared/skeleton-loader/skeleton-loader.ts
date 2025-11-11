import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-pulse">
      @if (type === 'card') {
        <div class="bg-white rounded-lg shadow p-6 space-y-4">
          <div class="h-6 bg-gray-200 rounded w-1/3"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div class="flex gap-2 pt-4">
            <div class="h-10 bg-gray-200 rounded w-24"></div>
            <div class="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      }
      
      @if (type === 'region-card') {
        <div class="bg-white rounded-lg shadow-md p-6 space-y-4">
          <!-- Region name -->
          <div class="h-7 bg-gray-200 rounded w-2/3"></div>
          
          <!-- Balance items -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div class="flex justify-between items-center">
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div class="flex justify-between items-center">
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div class="flex justify-between items-center">
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="flex gap-2 pt-4 border-t">
            <div class="h-9 bg-gray-200 rounded w-20"></div>
            <div class="h-9 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      }
      
      @if (type === 'analytics-card') {
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white space-y-3">
          <div class="h-4 bg-blue-400 rounded w-2/3"></div>
          <div class="h-8 bg-blue-400 rounded w-1/2"></div>
        </div>
      }
      
      @if (type === 'table-row') {
        <tr class="border-b">
          <td class="px-6 py-4">
            <div class="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td class="px-6 py-4">
            <div class="h-4 bg-gray-200 rounded w-32"></div>
          </td>
          <td class="px-6 py-4">
            <div class="h-4 bg-gray-200 rounded w-28"></div>
          </td>
          <td class="px-6 py-4">
            <div class="h-4 bg-gray-200 rounded w-20"></div>
          </td>
        </tr>
      }
    </div>
  `,
})
export class SkeletonLoaderComponent {
  @Input() type: 'card' | 'region-card' | 'analytics-card' | 'table-row' = 'card';
}
