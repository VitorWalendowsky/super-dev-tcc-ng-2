import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordService } from '../../services/password.service';
import { Password, Note } from '../../interfaces/password.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalPasswords = 0;
  totalNotes = 0;
  weakPasswordsCount = 0;
  expiredItemsCount = 0;
  passwordStrengthScore = 0;
  recentItems: any[] = [];

  constructor(
    private passwordService: PasswordService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const passwords = this.passwordService.getPasswords();
    const notes = this.passwordService.getNotes();

    this.totalPasswords = passwords.length;
    this.totalNotes = notes.length;
    this.weakPasswordsCount = this.calculateWeakPasswords(passwords);
    this.expiredItemsCount = this.calculateExpiredItems([...passwords, ...notes]);
    this.passwordStrengthScore = this.calculatePasswordStrengthScore(passwords);

    // Combine and sort by date
    const allItems = [
      ...passwords.map(p => ({ 
        ...p, 
        type: 'password', 
        icon: 'pi-key',
        id: p.id
      })),
      ...notes.map(n => ({ 
        ...n, 
        type: 'note', 
        icon: 'pi-file',
        id: n.id
      }))
    ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
     .slice(0, 5);

    this.recentItems = allItems;
  }

  private calculateWeakPasswords(passwords: Password[]): number {
    return passwords.filter(password => 
      password.password && password.password.length < 8
    ).length;
  }

  private calculateExpiredItems(items: any[]): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return items.filter(item => 
      new Date(item.updatedAt) < thirtyDaysAgo
    ).length;
  }

  private calculatePasswordStrengthScore(passwords: Password[]): number {
    if (passwords.length === 0) return 0;
    
    const strongPasswords = passwords.filter(password => 
      password.password && 
      password.password.length >= 12 &&
      /[A-Z]/.test(password.password) &&
      /[a-z]/.test(password.password) &&
      /[0-9]/.test(password.password) &&
      /[^A-Za-z0-9]/.test(password.password)
    ).length;
    
    return Math.round((strongPasswords / passwords.length) * 100);
  }

  // Navegação
  navigateToPasswords(): void {
    this.router.navigate(['/passwords']);
  }

  navigateToNotes(): void {
    this.router.navigate(['/notes']);
  }

  navigateToAllItems(): void {
    this.router.navigate(['/passwords']);
  }

  navigateToNewPassword(): void {
    this.router.navigate(['/passwords/new']);
  }

  navigateToNewNote(): void {
    this.router.navigate(['/notes/new']);
  }

  navigateToPasswordGenerator(): void {
    this.router.navigate(['/tools/password-generator']);
  }

  navigateToImportExport(): void {
    this.router.navigate(['/tools/import-export']);
  }

  navigateToSecurity(): void {
    this.router.navigate(['/settings']);
  }

  // Ações dos itens
  viewItem(item: any): void {
    if (item.type === 'password') {
      this.router.navigate(['/passwords', item.id]);
    } else {
      this.router.navigate(['/notes', item.id]);
    }
  }

  editItem(item: any): void {
    if (item.type === 'password') {
      this.router.navigate(['/passwords', item.id, 'edit']);
    } else {
      this.router.navigate(['/notes', item.id, 'edit']);
    }
  }

  formatDate(date: any): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}