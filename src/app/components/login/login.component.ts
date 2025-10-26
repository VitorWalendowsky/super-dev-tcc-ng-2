import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  masterPassword = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  login(): void {
    if (!this.masterPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, digite sua senha mestra'
      });
      return;
    }

    this.loading = true;
    
    // simula API call
    setTimeout(() => {
      if (this.authService.login(this.masterPassword)) {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Login realizado com sucesso!'
        });
        this.router.navigate(['/dashboard']);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Senha mestra deve ter pelo menos 8 caracteres'
        });
      }
      this.loading = false;
    }, 1000);
  }
}