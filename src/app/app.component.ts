import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SecureVault';
  menuItems: MenuItem[] = [];
  isLoggedIn = false;
  currentTheme = 'light';

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.authService.getAuthStatus().subscribe(status => {
      this.isLoggedIn = status;
      this.updateMenuItems();
    });

    this.themeService.getCurrentTheme().subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  private updateMenuItems(): void {
    if (this.isLoggedIn) {
      this.menuItems = [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: ['/dashboard']
        },
        {
          label: 'Senhas',
          icon: 'pi pi-key',
          routerLink: ['/passwords']
        },
        {
          label: 'Notas',
          icon: 'pi pi-file',
          routerLink: ['/notes']
        },
        {
          label: 'Configurações',
          icon: 'pi pi-cog',
          routerLink: ['/settings']
        },
        {
          label: 'Sair',
          icon: 'pi pi-sign-out',
          command: () => this.logout()
        }
      ];
    } else {
      this.menuItems = [];
    }
  }

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}