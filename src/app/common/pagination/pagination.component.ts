import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalItems = input.required<number>();
  itemsPerPage = input<number>(5);
  pageChange = output<number>();

  // TOTAL PAGES
  totalPages = computed(() => {
    return Math.ceil(this.totalItems() / this.itemsPerPage());
  });

  // PAGE ARRAY
  pages = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, index) => index + 1);
  });

  // PREVIOUS
  previousPage(): void {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  // NEXT
  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  // GO TO PAGE
  goToPage(page: number): void {
    this.pageChange.emit(page);
  }
}
