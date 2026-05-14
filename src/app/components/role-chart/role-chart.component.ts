import { CommonModule } from '@angular/common';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  effect,
  inject,
  input,
} from '@angular/core';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-role-chart',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './role-chart.component.html',

  styleUrl: './role-chart.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleChartComponent implements AfterViewInit {
  users = input.required<User[]>();

  @ViewChild('chartCanvas')
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  private destroyRef = inject(DestroyRef);

  private chart: any;

  constructor() {
    // REACTIVE UPDATE

    effect(() => {
      const users = this.users();

      // WAIT UNTIL CHART EXISTS

      if (!this.chart) return;

      this.updateChart(users);
    });
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initializeChart();
  }

  async initializeChart(): Promise<void> {
    // SAFETY CHECK

    if (!this.chartCanvas) return;

    // LAZY LOAD CHART.JS

    const chartModule = await import('chart.js/auto');

    const Chart = chartModule.default;

    // GET CANVAS CONTEXT

    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    if (!ctx) return;

    // CREATE CHART

    this.chart = new Chart(ctx, {
      type: 'pie',

      data: {
        labels: ['Admin', 'Editor', 'Viewer'],

        datasets: [
          {
            data: [0, 0, 0],

            backgroundColor: [
              '#1976d2', // Admin → Blue
              '#7b1fa2', // Editor → Purple
              '#f57c00', // Viewer → Orange
            ],

            hoverBackgroundColor: ['#1565c0', '#6a1b9a', '#ef6c00'],

            borderWidth: 0,

            hoverOffset: 12,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            position: 'bottom',

            labels: {
              usePointStyle: true,

              padding: 20,

              font: {
                size: 12,
              },
            },
          },
        },

        animation: {
          duration: 700,
        },
      },
    });

    // INITIAL UPDATE

    this.updateChart(this.users());

    // CLEANUP

    this.destroyRef.onDestroy(() => {
      this.chart?.destroy();
    });
  }

  updateChart(users: User[]): void {
    if (!this.chart) return;

    const adminCount = users.filter((user) => user.role === 'Admin').length;

    const editorCount = users.filter((user) => user.role === 'Editor').length;

    const viewerCount = users.filter((user) => user.role === 'Viewer').length;

    this.chart.data.datasets[0].data = [adminCount, editorCount, viewerCount];

    this.chart.update();
  }
}
