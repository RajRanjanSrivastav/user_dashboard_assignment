import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly STORAGE_KEY = 'users';

  // INITIAL USERS
  private initialUsers: User[] = [
    {
      id: 1,
      name: 'Raj Srivastav',
      email: 'srivastavrajranjan75@gmail.com',
      role: 'Admin',
    },
  ];

  // LOAD FROM SESSION STORAGE
  private getStoredUsers(): User[] {
    const storedUsers = sessionStorage.getItem(this.STORAGE_KEY);

    // NO DATA
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

    this.usersSubject.next(updatedUsers); // UPDATE STATE
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUsers));
  }
}
