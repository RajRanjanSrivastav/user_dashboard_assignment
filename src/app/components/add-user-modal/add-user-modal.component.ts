import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  output,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserModalComponent {
  @HostListener('document:keydown.escape')
  close = output<void>();
  isSubmitting = false;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  userForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', [Validators.required]],
  });

  submit(): void {
    if (this.userForm.invalid || this.isSubmitting) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.userForm.getRawValue();

    this.userService.addUser({
      id: Date.now(),
      name: formValue.name,
      email: formValue.email,
      role: formValue.role as 'Admin' | 'Editor' | 'Viewer',
    });

    this.isSubmitting = false;
    this.close.emit();
  }

  closeModal(): void {
    this.close.emit();
  }

  handleEscapeKey(): void {
    this.closeModal();
  }
}
