import { Injectable } from '@angular/core';

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordGeneratorService {
  private readonly CHARACTER_SETS = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()/\'"`~,;:.<>\\'
  };

  private defaultOptions: PasswordOptions = {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true,
    excludeAmbiguous: false
  };

  generatePassword(options: PasswordOptions = this.defaultOptions): string {
    let charset = '';
    
    if (options.includeLowercase) {
      charset += this.CHARACTER_SETS.lowercase;
    }
    if (options.includeUppercase) {
      charset += this.CHARACTER_SETS.uppercase;
    }
    if (options.includeNumbers) {
      charset += this.CHARACTER_SETS.numbers;
    }
    if (options.includeSymbols) {
      charset += this.CHARACTER_SETS.symbols;
    }

    // Remover caracteres problemáticos
    if (options.excludeSimilar) {
      charset = this.removeCharacters(charset, this.CHARACTER_SETS.similar);
    }
    if (options.excludeAmbiguous) {
      charset = this.removeCharacters(charset, this.CHARACTER_SETS.ambiguous);
    }

    if (charset.length === 0) {
      charset = this.CHARACTER_SETS.lowercase + this.CHARACTER_SETS.uppercase;
    }

    // Garantir que pelo menos um caractere de cada tipo selecionado seja incluído
    let password = '';
    const requiredChars = [];

    if (options.includeLowercase) {
      const char = this.getRandomChar(this.CHARACTER_SETS.lowercase);
      password += char;
      requiredChars.push(char);
    }
    if (options.includeUppercase) {
      const char = this.getRandomChar(this.CHARACTER_SETS.uppercase);
      password += char;
      requiredChars.push(char);
    }
    if (options.includeNumbers) {
      const char = this.getRandomChar(this.CHARACTER_SETS.numbers);
      password += char;
      requiredChars.push(char);
    }
    if (options.includeSymbols) {
      const char = this.getRandomChar(this.CHARACTER_SETS.symbols);
      password += char;
      requiredChars.push(char);
    }

    // Completar o restante
    while (password.length < options.length) {
      password += this.getRandomChar(charset);
    }

    // Embaralhar a senha
    password = this.shuffleString(password);

    return password;
  }

  calculateStrength(password: string): PasswordStrength {
    let score = 0;
    
    // Comprimento
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Complexidade
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    // Entropia adicional
    const uniqueChars = new Set(password).size;
    if (uniqueChars / password.length > 0.7) score += 1;

    const strengths = [
      { score: 0, label: 'Muito Fraca', color: '#e74c3c' },
      { score: 1, label: 'Fraca', color: '#e67e22' },
      { score: 2, label: 'Razoável', color: '#f1c40f' },
      { score: 3, label: 'Boa', color: '#2ecc71' },
      { score: 4, label: 'Forte', color: '#27ae60' },
      { score: 5, label: 'Muito Forte', color: '#16a085' }
    ];

    return strengths[Math.min(score, 5)];
  }

  getDefaultOptions(): PasswordOptions {
    return { ...this.defaultOptions };
  }

  updateDefaultOptions(options: Partial<PasswordOptions>): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  private getRandomChar(charset: string): string {
    return charset[Math.floor(Math.random() * charset.length)];
  }

  private removeCharacters(source: string, charactersToRemove: string): string {
    return source.split('').filter(char => !charactersToRemove.includes(char)).join('');
  }

  private shuffleString(str: string): string {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }
}