import { Component, OnInit } from '@angular/core';
import { PasswordService } from '../../services/password.service';
import { Password, Note } from '../../interfaces/password.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalPasswords = 0;
  totalNotes = 0;
  recentItems: any[] = [];

  constructor(private passwordService: PasswordService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const passwords = this.passwordService.getPasswords();
    const notes = this.passwordService.getNotes();

    this.totalPasswords = passwords.length;
    this.totalNotes = notes.length;

    // Combine and sort by date
    const allItems = [
      ...passwords.map(p => ({ ...p, type: 'password', icon: 'pi-key' })),
      ...notes.map(n => ({ ...n, type: 'note', icon: 'pi-file' }))
    ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
     .slice(0, 5);

    this.recentItems = allItems;
  }

  formatDate(date: any): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR');
  }
}