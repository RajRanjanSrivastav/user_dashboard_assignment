import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { PaginationComponent } from '../../common/pagination/pagination.component';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTableComponent {
  users = input.required<User[]>();
  searchText = signal('');
  currentPage = signal(1);
  itemsPerPage = 5;

  // for searching
  filteredUsers = computed(() => {
    const search = this.searchText().trim().toLowerCase();

    if (!search) {
      return this.users();
    }

    return this.users().filter(
      (user) =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search),
    );
  });

  //For pagination
  paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;

    const end = start + this.itemsPerPage;

    return this.filteredUsers().slice(start, end);
  });

  updatePage(page: number): void {
    this.currentPage.set(page);
  }
}
