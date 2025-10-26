import { Component, OnInit } from '@angular/core';
import { Password } from '../../interfaces/password.interface';
import { PasswordService } from '../../services/password.service';
import { IconService, BrandIcon } from '../../services/icon.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-passwords',
  templateUrl: './passwords.component.html',
  styleUrls: ['./passwords.component.scss']
})
export class PasswordsComponent implements OnInit {
  passwords: Password[] = [];
  displayDialog = false;
  selectedPassword: Password = this.emptyPassword();
  categories = ['Pessoal', 'Trabalho', 'Financeiro', 'Redes Sociais', 'Outros'];

  constructor(
    private passwordService: PasswordService,
    private iconService: IconService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadPasswords();
  }

  private loadPasswords(): void {
    this.passwords = this.passwordService.getPasswords().map(password => {
      if (!password.icon && password.website) {
        const brandIcon = this.iconService.getIconForUrl(password.website);
        password.icon = brandIcon.icon;
        password.iconColor = brandIcon.color;
      }
      return password;
    });
  }

  private emptyPassword(): any {
    return {
      title: '',
      username: '',
      password: '',
      website: '',
      category: 'Pessoal',
      notes: '',
      icon: 'pi pi-globe',
      iconColor: '#6B7280'
    };
  }

  showNewPasswordDialog(): void {
    this.selectedPassword = this.emptyPassword();
    this.displayDialog = true;
  }

  showEditPasswordDialog(password: Password): void {
    const brandIcon = this.iconService.getIconForUrl(password.website);
    this.selectedPassword = { 
      ...password,
      icon: password.icon || brandIcon.icon,
      iconColor: password.iconColor || brandIcon.color
    };
    this.displayDialog = true;
  }

  savePassword(): void {
    if (this.selectedPassword.website) {
      const brandIcon = this.iconService.getIconForUrl(this.selectedPassword.website);
      this.selectedPassword.icon = brandIcon.icon;
      this.selectedPassword.iconColor = brandIcon.color;
    }

    if (this.selectedPassword.id) {
      this.passwordService.updatePassword(this.selectedPassword.id, this.selectedPassword);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Senha atualizada com sucesso!'
      });
    } else {
      this.passwordService.savePassword(this.selectedPassword);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Senha salva com sucesso!'
      });
    }

    this.displayDialog = false;
    this.loadPasswords();
  }

  deletePassword(password: Password): void {
    if (confirm('Tem certeza que deseja excluir esta senha?')) {
      this.passwordService.deletePassword(password.id);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Senha excluída com sucesso!'
      });
      this.loadPasswords();
    }
  }

  copyToClipboard(text: string, type: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Copiado',
        detail: `${type} copiado para a área de transferência`
      });
    });
  }

  onPasswordGenerated(generatedPassword: string): void {
    this.selectedPassword.password = generatedPassword;
    this.messageService.add({
      severity: 'success',
      summary: 'Senha Aplicada',
      detail: 'Senha gerada foi aplicada ao campo'
    });
  }

  onWebsiteChange(): void {
    if (this.selectedPassword.website) {
      const brandIcon = this.iconService.getIconForUrl(this.selectedPassword.website);
      this.selectedPassword.icon = brandIcon.icon;
      this.selectedPassword.iconColor = brandIcon.color;
    }
  }
}