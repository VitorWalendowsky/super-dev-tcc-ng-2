import { Component, EventEmitter, Output } from '@angular/core';
import { PasswordGeneratorService, PasswordOptions, PasswordStrength } from '../../services/password-generator.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-password-generator',
  templateUrl: './password-generator.component.html',
  styles: [`
    .password-generator {
      display: flex;
      align-items: center;
    }
    
    .p-button.p-button-text.p-button-plain {
      background: transparent !important;
      border: none !important;
      color: var(--text-color-secondary) !important;
      width: 2rem;
      height: 2rem;
    }
    
    .p-button.p-button-text.p-button-plain:hover {
      background: var(--surface-hover) !important;
      color: var(--primary-color) !important;
    }
    
    .p-button.p-button-text.p-button-plain:focus {
      box-shadow: none !important;
    }
    
    /* Ajustes para o diálogo */
    :host ::ng-deep .p-dialog .p-dialog-content {
      background: var(--surface-card) !important;
    }
    
    :host ::ng-deep .p-password {
      flex: 1;
    }
  `]
})
export class PasswordGeneratorComponent {
  @Output() passwordGenerated = new EventEmitter<string>();
  
  options: PasswordOptions;
  generatedPassword = '';
  passwordStrength: PasswordStrength = { score: 0, label: '', color: '' };
  showGenerator = false;

  presetOptions = {
    strong: { length: 12, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: true },
    veryStrong: { length: 16, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: true },
    memorable: { length: 14, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: false }
  };

  constructor(
    private passwordGenerator: PasswordGeneratorService,
    private messageService: MessageService
  ) {
    this.options = this.passwordGenerator.getDefaultOptions();
  }

  quickGenerate(): void {
    this.generatedPassword = this.passwordGenerator.generatePassword(this.options);
    this.passwordGenerated.emit(this.generatedPassword);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Senha Gerada',
      detail: 'Nova senha foi aplicada',
      life: 2000
    });
  }

  generatePassword(): void {
    this.generatedPassword = this.passwordGenerator.generatePassword(this.options);
    this.passwordStrength = this.passwordGenerator.calculateStrength(this.generatedPassword);
  }

  usePreset(preset: keyof typeof this.presetOptions): void {
    this.options = { ...this.options, ...this.presetOptions[preset] };
    this.generatePassword();
  }

  copyToClipboard(): void {
    if (this.generatedPassword) {
      navigator.clipboard.writeText(this.generatedPassword).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Copiado!',
          detail: 'Senha copiada para a área de transferência'
        });
      });
    }
  }

  usePassword(): void {
    if (this.generatedPassword) {
      this.passwordGenerated.emit(this.generatedPassword);
      this.showGenerator = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Senha Aplicada',
        detail: 'A senha foi aplicada ao campo de senha'
      });
    }
  }

  onOptionsChange(): void {
    this.passwordGenerator.updateDefaultOptions(this.options);
    if (this.generatedPassword) {
      this.generatePassword();
    }
  }
}