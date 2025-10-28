import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

// Importações dos módulos do PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface SharedItem {
  id: string;
  title: string;
  description: string;
  type: 'password' | 'note' | 'card';
  icon: string;
  sharedWith: string;
  permission: 'read_only' | 'read_write';
  sharedAt: Date;
  expiresAt: Date;
  owner: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  items: string[];
  createdBy: string;
  createdAt: Date;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

interface AccessRequest {
  id: string;
  requester: string;
  requesterEmail: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  itemId?: string;
}

@Component({
  selector: 'app-shared-vault',
  templateUrl: './shared-vault.component.html',
  styleUrls: ['./shared-vault.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    AvatarModule,
    AvatarGroupModule,
    TagModule,
    DialogModule,
    MultiSelectModule,
    SelectButtonModule,
    CalendarModule,
    InputTextareaModule,
    DividerModule
  ]
})
export class SharedVaultComponent implements OnInit {
tabs: any;
stats: any;
getExpirationClass(arg0: Date) {
throw new Error('Method not implemented.');
}
  // Dados principais
  sharedItems: SharedItem[] = [];
  filteredSharedItems: SharedItem[] = [];
  groups: Group[] = [];
  accessRequests: AccessRequest[] = [];

  // Estatísticas
  sharedItemsCount = 0;
  activeSharesCount = 0;
  groupsCount = 0;
  membersCount = 0;

  // Filtros e busca
  searchTerm = '';
  selectedFilter = 'all';
  filterOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Senhas', value: 'password' },
    { label: 'Notas', value: 'note' },
    { label: 'Cartões', value: 'card' },
    { label: 'Expirando em breve', value: 'expiring' }
  ];

  // Diálogo de compartilhamento
  showShareModal = false;
  availableItems: any[] = [];
  selectedItem: any;
  availableUsers: any[] = [];
  selectedUsers: any[] = [];
  selectedPermission: 'read_only' | 'read_write' = 'read_only';
  expirationDate: Date = new Date();
  shareMessage = '';
  minDate: Date = new Date();

  permissionOptions = [
    { label: 'Somente Leitura', value: 'read_only' },
    { label: 'Leitura e Escrita', value: 'read_write' }
  ];
activeTab: any;

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit() {
    this.loadSharedVaultData();
  }

  private loadSharedVaultData(): void {
    // Simular dados - em produção viria de um serviço
    this.sharedItems = [
      {
        id: '1',
        title: 'Conta do GitHub',
        description: 'Acesso à organização',
        type: 'password',
        icon: 'pi-github',
        sharedWith: 'João Silva',
        permission: 'read_write',
        sharedAt: new Date('2024-01-15'),
        expiresAt: new Date('2024-04-15'),
        owner: 'Você'
      },
      {
        id: '2',
        title: 'Notas da Reunião',
        description: 'Planejamento Q2',
        type: 'note',
        icon: 'pi-file',
        sharedWith: 'Equipe Dev',
        permission: 'read_only',
        sharedAt: new Date('2024-01-20'),
        expiresAt: new Date('2024-02-20'),
        owner: 'Você'
      }
    ];

    this.groups = [
      {
        id: '1',
        name: 'Equipe de Desenvolvimento',
        description: 'Time de desenvolvimento frontend e backend',
        members: [
          { id: '1', name: 'João Silva', email: 'joao@empresa.com', role: 'admin' },
          { id: '2', name: 'Maria Santos', email: 'maria@empresa.com', role: 'member' },
          { id: '3', name: 'Pedro Costa', email: 'pedro@empresa.com', role: 'member' }
        ],
        items: ['1', '2'],
        createdBy: 'Você',
        createdAt: new Date('2024-01-10')
      }
    ];

    this.accessRequests = [
      {
        id: '1',
        requester: 'Ana Oliveira',
        requesterEmail: 'ana@empresa.com',
        message: 'Preciso de acesso às credenciais do servidor de staging para deploy.',
        status: 'pending',
        requestedAt: new Date('2024-01-25')
      }
    ];

    this.calculateStatistics();
    this.filterItems();
  }

  private calculateStatistics(): void {
    this.sharedItemsCount = this.sharedItems.length;
    this.activeSharesCount = this.sharedItems.filter(item => !this.isExpired(item.expiresAt)).length;
    this.groupsCount = this.groups.length;
    this.membersCount = this.groups.reduce((total, group) => total + group.members.length, 0);
  }

  filterItems(): void {
    let filtered = this.sharedItems;

    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.sharedWith.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedFilter !== 'all') {
      if (this.selectedFilter === 'expiring') {
        filtered = filtered.filter(item => this.isExpiringSoon(item.expiresAt));
      } else {
        filtered = filtered.filter(item => item.type === this.selectedFilter);
      }
    }

    this.filteredSharedItems = filtered;
  }

  // Diálogos e ações
  showShareDialog(): void {
    // Carregar itens disponíveis para compartilhar
    this.availableItems = [
      { id: '1', title: 'Conta AWS - Produção', type: 'password' },
      { id: '2', title: 'Database Credentials', type: 'password' },
      { id: '3', title: 'Documentação API', type: 'note' }
    ];

    // Carregar usuários/grupos disponíveis
    this.availableUsers = [
      { id: '1', name: 'João Silva', type: 'user' },
      { id: '2', name: 'Maria Santos', type: 'user' },
      { id: '3', name: 'Equipe Dev', type: 'group' }
    ];

    this.showShareModal = true;
  }

  showGroupDialog(): void {
    // Implementar criação de grupo
    this.messageService.add({
      severity: 'info',
      summary: 'Criar Grupo',
      detail: 'Funcionalidade em desenvolvimento'
    });
  }

  confirmShare(): void {
    if (this.selectedItem && this.selectedUsers.length > 0) {
      // Implementar lógica de compartilhamento
      this.messageService.add({
        severity: 'success',
        summary: 'Item Compartilhado',
        detail: `${this.selectedItem.title} foi compartilhado com sucesso`
      });
      
      this.showShareModal = false;
      this.resetShareForm();
    }
  }

  private resetShareForm(): void {
    this.selectedItem = null;
    this.selectedUsers = [];
    this.selectedPermission = 'read_only';
    this.expirationDate = new Date();
    this.shareMessage = '';
  }

  // Ações dos itens
  viewItem(item: SharedItem): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Visualizar Item',
      detail: `Visualizando ${item.title}`
    });
  }

  editShare(item: SharedItem): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Editar Compartilhamento',
      detail: `Editando compartilhamento de ${item.title}`
    });
  }

  revokeAccess(item: SharedItem): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Acesso Revogado',
      detail: `Acesso a ${item.title} foi revogado`
    });
  }

  manageGroup(group: Group): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Gerenciar Grupo',
      detail: `Gerenciando grupo ${group.name}`
    });
  }

  deleteGroup(group: Group): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Grupo Excluído',
      detail: `Grupo ${group.name} foi excluído`
    });
  }

  approveRequest(request: AccessRequest): void {
    request.status = 'approved';
    this.messageService.add({
      severity: 'success',
      summary: 'Solicitação Aprovada',
      detail: `Acesso concedido para ${request.requester}`
    });
  }

  rejectRequest(request: AccessRequest): void {
    request.status = 'rejected';
    this.messageService.add({
      severity: 'error',
      summary: 'Solicitação Recusada',
      detail: `Acesso recusado para ${request.requester}`
    });
  }

  // Utilitários
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getPermissionLabel(permission: string): string {
    return permission === 'read_only' ? 'Somente Leitura' : 'Leitura e Escrita';
  }

  getRequestStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'rejected': 'Recusado'
    };
    return statusMap[status] || status;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  isExpired(expiresAt: Date): boolean {
    return new Date(expiresAt) < new Date();
  }

  isExpiringSoon(expiresAt: Date): boolean {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return new Date(expiresAt) <= sevenDaysFromNow && new Date(expiresAt) > new Date();
  }

  getExpirationText(expiresAt: Date): string {
    if (this.isExpired(expiresAt)) {
      return 'Expirado';
    }

    const diffTime = new Date(expiresAt).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '1 dia';
    } else if (diffDays <= 7) {
      return `${diffDays} dias`;
    } else {
      return this.formatDate(expiresAt);
    }
  }
}