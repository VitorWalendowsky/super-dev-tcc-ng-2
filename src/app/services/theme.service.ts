import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'securevault_theme';
  private currentTheme = new BehaviorSubject<string>('light');

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) || 'light';
    this.setTheme(savedTheme);
  }

  setTheme(theme: string): void {
    this.currentTheme.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  getCurrentTheme() {
    return this.currentTheme.asObservable();
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}