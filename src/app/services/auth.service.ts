import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private readonly STORAGE_KEY = 'securevault_auth';

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const authData = localStorage.getItem(this.STORAGE_KEY);
    this.isAuthenticated.next(!!authData);
  }

  login(masterPassword: string): boolean {
    if (masterPassword && masterPassword.length >= 8) {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      this.isAuthenticated.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }

  getAuthStatus() {
    return this.isAuthenticated.asObservable();
  }
}