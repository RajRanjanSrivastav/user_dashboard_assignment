import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly STORAGE_KEY = 'users';
  private platformId = inject(PLATFORM_ID);

  // INITIAL USERS
  private initialUsers: User[] = [
    {
      id: 1,
      name: 'Raj Srivastav',
      email: 'srivastavrajranjan75@gmail.com',
      role: 'Admin',
    },
  ];

  // CHECK BROWSER
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // LOAD FROM STORAGE
  private getStoredUsers(): User[] {
    if (!this.isBrowser()) {
      return this.initialUsers;
    }

    const storedUsers = sessionStorage.getItem(this.STORAGE_KEY);

    if (!storedUsers) {
      sessionStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.initialUsers),
      );
      return this.initialUsers;
    }

    try {
      return JSON.parse(storedUsers);
    } catch {
      sessionStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.initialUsers),
      );
      return this.initialUsers;
    }
  }

  // STATE
  private usersSubject = new BehaviorSubject<User[]>(this.getStoredUsers());
  users$ = this.usersSubject.asObservable();

  // ADD USER
  addUser(user: User): void {
    const currentUsers = this.usersSubject.value;
    const updatedUsers = [...currentUsers, user];
    this.usersSubject.next(updatedUsers);
    if (this.isBrowser()) {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUsers));
    }
  }
}
