import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { PasswordPolicyService, PasswordPolicy } from '../../services/password-policy.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  currentTheme = 'light';
  autoLock = true;
  autoLockTime = 5;
  passwordPolicy: PasswordPolicy;

  constructor(
    private themeService: ThemeService,
    private passwordPolicyService: PasswordPolicyService,
    private messageService: MessageService
  ) {
    this.passwordPolicy = this.passwordPolicyService.getPolicy();
  }

  ngOnInit() {
    this.themeService.getCurrentTheme().subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  onThemeChange(): void {
    this.themeService.setTheme(this.currentTheme);
  }

  updatePasswordPolicy(): void {
    this.passwordPolicyService.updatePolicy(this.passwordPolicy);
    this.messageService.add({
      severity: 'success',
      summary: 'Políticas Atualizadas',
      detail: 'As políticas de senha foram atualizadas com sucesso!',
      life: 3000
    });
  }

  generateExamplePassword(): void {
    const examplePassword = this.passwordPolicyService.generateStrongPassword();
    this.messageService.add({
      severity: 'info',
      summary: 'Senha de Exemplo',
      detail: `Senha gerada: ${examplePassword}`,
      life: 5000
    });
  }
}