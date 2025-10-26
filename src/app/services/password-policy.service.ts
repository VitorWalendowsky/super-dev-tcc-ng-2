import { Injectable } from "@angular/core";

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: boolean;
  maxAgeDays: number;
}

export interface PasswordStrength {
  score: number; // 0-4
  label: "Muito Fraca" | "Fraca" | "Boa" | "Forte" | "Muito Forte";
  feedback: string[];
}

@Injectable({
  providedIn: "root",
})
export class PasswordPolicyService {
  private defaultPolicy: PasswordPolicy = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventReuse: true,
    maxAgeDays: 90,
  };

  private specialCharacters = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Validar senha contra políticas
  validatePassword(
    password: string,
    previousPasswords: string[] = []
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const policy = this.getPolicy();

    if (password.length < policy.minLength) {
      errors.push(`A senha deve ter pelo menos ${policy.minLength} caracteres`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra maiúscula");
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra minúscula");
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push("A senha deve conter pelo menos um número");
    }

    if (
      policy.requireSpecialChars &&
      !new RegExp(`[${this.escapeRegExp(this.specialCharacters)}]`).test(
        password
      )
    ) {
      errors.push("A senha deve conter pelo menos um caractere especial");
    }

    if (policy.preventReuse && previousPasswords.includes(password)) {
      errors.push("Esta senha já foi utilizada anteriormente");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Calcular força da senha
  calculateStrength(password: string): PasswordStrength {
    let score = 0;
    const feedback: string[] = [];

    // Critérios de pontuação
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (
      new RegExp(`[${this.escapeRegExp(this.specialCharacters)}]`).test(
        password
      )
    )
      score += 1;

    // Labels baseados na pontuação
    const labels: PasswordStrength["label"][] = [
      "Muito Fraca",
      "Fraca",
      "Boa",
      "Forte",
      "Muito Forte",
    ];

    // Feedback específico
    if (password.length < 8) {
      feedback.push("Tente uma senha mais longa");
    }
    if (!/[A-Z]/.test(password)) {
      feedback.push("Adicione letras maiúsculas");
    }
    if (!/\d/.test(password)) {
      feedback.push("Inclua números");
    }
    if (
      !new RegExp(`[${this.escapeRegExp(this.specialCharacters)}]`).test(
        password
      )
    ) {
      feedback.push("Use caracteres especiais");
    }

    return {
      score: Math.min(score, 4),
      label: labels[Math.min(score, 4)],
      feedback,
    };
  }

  // Verificar se senha está expirada
  isPasswordExpired(createdAt: Date): boolean {
    const policy = this.getPolicy();
    const expirationDate = new Date(createdAt);
    expirationDate.setDate(expirationDate.getDate() + policy.maxAgeDays);

    return new Date() > expirationDate;
  }

  // Gerar senha forte baseada na política
  generateStrongPassword(): string {
    const policy = this.getPolicy();
    const charset = {
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      special: this.specialCharacters,
    };

    let password = "";
    const required = [];

    if (policy.requireLowercase) {
      password += this.getRandomChar(charset.lowercase);
      required.push(charset.lowercase);
    }
    if (policy.requireUppercase) {
      password += this.getRandomChar(charset.uppercase);
      required.push(charset.uppercase);
    }
    if (policy.requireNumbers) {
      password += this.getRandomChar(charset.numbers);
      required.push(charset.numbers);
    }
    if (policy.requireSpecialChars) {
      password += this.getRandomChar(charset.special);
      required.push(charset.special);
    }

    // Completar com caracteres aleatórios
    const allChars = required.join("");
    while (password.length < policy.minLength) {
      password += this.getRandomChar(allChars);
    }

    // Embaralhar a senha
    return this.shuffleString(password);
  }

  // Obter política atual
  getPolicy(): PasswordPolicy {
    const savedPolicy = localStorage.getItem("securevault_password_policy");
    return savedPolicy
      ? { ...this.defaultPolicy, ...JSON.parse(savedPolicy) }
      : this.defaultPolicy;
  }

  // Atualizar política
  updatePolicy(newPolicy: Partial<PasswordPolicy>): void {
    const currentPolicy = this.getPolicy();
    const updatedPolicy = { ...currentPolicy, ...newPolicy };
    localStorage.setItem(
      "securevault_password_policy",
      JSON.stringify(updatedPolicy)
    );
  }

  // Métodos auxiliares
  private getRandomChar(charset: string): string {
    return charset[Math.floor(Math.random() * charset.length)];
  }

  private shuffleString(str: string): string {
    const array = str.split("");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  }

  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
