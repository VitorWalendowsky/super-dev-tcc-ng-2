import { Component, OnInit } from '@angular/core';
import { PasswordService } from '../../services/password.service';
import { SecurityAuditService, SecurityReport, SecurityIssue } from '../../services/security-audit.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-security-audit',
  templateUrl: './security-audit.component.html',
  styleUrls: ['./security-audit.component.scss']
})
export class SecurityAuditComponent implements OnInit {
  securityReport: SecurityReport | null = null;
  loading = false;
  showDetails = false;
  selectedIssue: SecurityIssue | null = null;

  constructor(
    private passwordService: PasswordService,
    private securityAudit: SecurityAuditService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.runAudit();
  }

  runAudit(): void {
    this.loading = true;
    
    // Simular processamento
    setTimeout(() => {
      const passwords = this.passwordService.getPasswords();
      this.securityReport = this.securityAudit.runSecurityAudit(passwords);
      this.loading = false;
      
      this.messageService.add({
        severity: 'info',
        summary: 'Auditoria Concluída',
        detail: `Score de segurança: ${this.securityReport.overallScore}/100`
      });
    }, 1500);
  }

  getScoreColor(score: number): string {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#f39c12';
    if (score >= 40) return '#e67e22';
    return '#e74c3c';
  }

  showIssueDetails(issue: SecurityIssue): void {
    this.selectedIssue = issue;
    this.showDetails = true;
  }

  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'critical': return 'pi pi-exclamation-triangle';
      case 'high': return 'pi pi-exclamation-circle';
      case 'medium': return 'pi pi-info-circle';
      case 'low': return 'pi pi-flag';
      default: return 'pi pi-info';
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return '#e74c3c';
      case 'high': return '#e67e22';
      case 'medium': return '#f39c12';
      case 'low': return '#3498db';
      default: return '#95a5a6';
    }
  }
}