import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { toSignal } from '@angular/core/rxjs-interop';

import { UserService } from '../services/user.service';

import { UserTableComponent } from '../components/user-table/user-table.component';
import { RoleChartComponent } from '../components/role-chart/role-chart.component';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [CommonModule, UserTableComponent, RoleChartComponent],

  templateUrl: './dashboard.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private userService = inject(UserService);

  users = toSignal(this.userService.users$, {
    initialValue: [],
  });

  @ViewChild('modalContainer', {
    read: ViewContainerRef,
    static: true,
  })
  modalContainer!: ViewContainerRef;

  async openModal(): Promise<void> {
    this.modalContainer.clear();

    const component =
      await import('../components/add-user-modal/add-user-modal.component');

    const modalRef = this.modalContainer.createComponent(
      component.AddUserModalComponent,
    );

    modalRef.changeDetectorRef.detectChanges();

    modalRef.instance.close.subscribe(() => {
      this.modalContainer.clear();
    });
  }
}
