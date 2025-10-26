import { Injectable } from '@angular/core';
import { Password } from '../interfaces/password.interface';
import { PasswordPolicyService } from './password-policy.service';

export interface SecurityIssue {
  type: 'weak' | 'reused' | 'expired' | 'no_2fa' | 'old';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  items: Password[];
  recommendation: string;
}

export interface SecurityReport {
  overallScore: number;
  totalIssues: number;
  issuesBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  issues: SecurityIssue[];
  summary: string;
  lastAudit: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SecurityAuditService {
  private readonly COMMON_PASSWORDS = [
    '123456', 'password', '12345678', 'qwerty', '123456789',
    '12345', '1234', '111111', '1234567', 'dragon',
    '123123', 'baseball', 'abc123', 'football', 'monkey',
    'letmein', 'shadow', 'master', '666666', 'qwertyuiop'
  ];

  constructor(private passwordPolicyService: PasswordPolicyService) {}

  runSecurityAudit(passwords: Password[]): SecurityReport {
    const issues: SecurityIssue[] = [];

    // Verificar senhas fracas
    const weakPasswords = this.findWeakPasswords(passwords);
    if (weakPasswords.length > 0) {
      issues.push({
        type: 'weak',
        severity: weakPasswords.length > 5 ? 'high' : 'medium',
        title: 'Senhas Fracas Detectadas',
        description: `${weakPasswords.length} senhas não atendem às políticas de segurança`,
        items: weakPasswords,
        recommendation: 'Use o gerador de senhas para criar senhas fortes e únicas'
      });
    }

    // Verificar senhas reutilizadas
    const reusedPasswords = this.findReusedPasswords(passwords);
    if (reusedPasswords.length > 0) {
      issues.push({
        type: 'reused',
        severity: 'high',
        title: 'Senhas Reutilizadas',
        description: `${reusedPasswords.length} senhas estão sendo usadas em múltiplas contas`,
        items: reusedPasswords,
        recommendation: 'Crie senhas únicas para cada conta importante'
      });
    }

    // Verificar senhas expiradas
    const expiredPasswords = this.findExpiredPasswords(passwords);
    if (expiredPasswords.length > 0) {
      issues.push({
        type: 'expired',
        severity: 'medium',
        title: 'Senhas Expiradas',
        description: `${expiredPasswords.length} senhas não foram alteradas há muito tempo`,
        items: expiredPasswords,
        recommendation: 'Atualize senhas antigas regularmente'
      });
    }

    // Verificar senhas muito antigas
    const oldPasswords = this.findOldPasswords(passwords);
    if (oldPasswords.length > 0) {
      issues.push({
        type: 'old',
        severity: 'low',
        title: 'Senhas Antigas',
        description: `${oldPasswords.length} senhas foram criadas há mais de 1 ano`,
        items: oldPasswords,
        recommendation: 'Considere atualizar senhas muito antigas'
      });
    }

    // Calcular score geral
    const overallScore = this.calculateSecurityScore(issues, passwords.length);

    return {
      overallScore,
      totalIssues: issues.length,
      issuesBySeverity: this.countIssuesBySeverity(issues),
      issues,
      summary: this.generateSummary(issues, overallScore),
      lastAudit: new Date()
    };
  }

  private findWeakPasswords(passwords: Password[]): Password[] {
    return passwords.filter(password => {
      // Verificar contra senhas comuns
      if (this.COMMON_PASSWORDS.includes(password.password.toLowerCase())) {
        return true;
      }

      // Verificar políticas
      const validation = this.passwordPolicyService.validatePassword(password.password);
      return !validation.isValid;
    });
  }

  private findReusedPasswords(passwords: Password[]): Password[] {
    const passwordCount = new Map<string, Password[]>();
    
    passwords.forEach(password => {
      if (!passwordCount.has(password.password)) {
        passwordCount.set(password.password, []);
      }
      passwordCount.get(password.password)!.push(password);
    });

    const reused: Password[] = [];
    passwordCount.forEach((items, pwd) => {
      if (items.length > 1) {
        reused.push(...items);
      }
    });

    return reused;
  }

  private findExpiredPasswords(passwords: Password[]): Password[] {
    return passwords.filter(password => 
      this.passwordPolicyService.isPasswordExpired(new Date(password.createdAt))
    );
  }

  private findOldPasswords(passwords: Password[]): Password[] {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    return passwords.filter(password => 
      new Date(password.createdAt) < oneYearAgo
    );
  }

  private calculateSecurityScore(issues: SecurityIssue[], totalPasswords: number): number {
    if (totalPasswords === 0) return 100;

    let penalty = 0;
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': penalty += issue.items.length * 10; break;
        case 'high': penalty += issue.items.length * 5; break;
        case 'medium': penalty += issue.items.length * 3; break;
        case 'low': penalty += issue.items.length * 1; break;
      }
    });

    const maxPenalty = totalPasswords * 10;
    const score = Math.max(0, 100 - (penalty / maxPenalty) * 100);
    
    return Math.round(score);
  }

  private countIssuesBySeverity(issues: SecurityIssue[]): any {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    
    issues.forEach(issue => {
      counts[issue.severity]++;
    });
    
    return counts;
  }

  private generateSummary(issues: SecurityIssue[], score: number): string {
    if (score >= 90) return 'Excelente! Sua segurança está muito boa.';
    if (score >= 70) return 'Bom. Algumas melhorias podem ser feitas.';
    if (score >= 50) return 'Razoável. Recomendamos melhorias de segurança.';
    return 'Atenção! Sua segurança precisa de melhorias urgentes.';
  }

  getSecurityTips(): string[] {
    return [
      'Use senhas com pelo menos 12 caracteres',
      'Não reutilize senhas entre contas importantes',
      'Ative autenticação de dois fatores sempre que possível',
      'Atualize senhas a cada 3-6 meses',
      'Use um gerenciador de senhas para senhas únicas e complexas',
      'Evite informações pessoais em senhas',
      'Use uma combinação de letras, números e símbolos'
    ];
  }
}