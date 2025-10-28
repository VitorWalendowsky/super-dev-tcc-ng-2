import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Importe o service
import { 
  SharedVaultService, 
  SharedItem, 
  ShareGroup, 
  AccessRequest 
} from '../../services/shared-vault.service';

@Component({
  selector: 'app-shared-vault',
  templateUrl: './shared-vault.component.html',
  imports: [CommonModule, FormsModule, ButtonModule]
})
export class SharedVaultComponent implements OnInit, OnDestroy {
  // Dados
  sharedItems: SharedItem[] = [];
  filteredSharedItems: SharedItem[] = [];
  groups: ShareGroup[] = [];
  accessRequests: AccessRequest[] = [];

  // Estatísticas
  stats = [
    { label: 'Itens Compartilhados', value: 0 },
    { label: 'Compartilhamentos Ativos', value: 0 },
    { label: 'Grupos', value: 0 },
    { label: 'Membros', value: 0 }
  ];

  // UI
  tabs = [
    { id: 'items', label: 'Itens Compartilhados' },
    { id: 'groups', label: 'Grupos' },
    { id: 'requests', label: 'Solicitações' }
  ];
  activeTab = 'items';
  searchTerm = '';
  selectedFilter = 'all';

  // Diálogos
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

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private sharedVaultService: SharedVaultService // Injete o service
  ) {
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit() {
    this.loadSharedVaultData();
    this.loadStatistics();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadSharedVaultData(): void {
    // Carregar itens compartilhados
    const itemsSub = this.sharedVaultService.getSharedItems().subscribe(items => {
      this.sharedItems = items;
      this.filterItems();
    });

    // Carregar grupos
    const groupsSub = this.sharedVaultService.getGroups().subscribe(groups => {
      this.groups = groups;
    });

    // Carregar solicitações
    const requestsSub = this.sharedVaultService.getAccessRequests().subscribe(requests => {
      this.accessRequests = requests;
    });

    this.subscriptions.push(itemsSub, groupsSub, requestsSub);
  }

  private loadStatistics(): void {
    const statsSub = this.sharedVaultService.getStatistics().subscribe(stats => {
      this.stats[0].value = stats.totalSharedItems;
      this.stats[1].value = stats.activeShares;
      this.stats[2].value = stats.totalGroups;
      this.stats[3].value = stats.totalMembers;
    });

    this.subscriptions.push(statsSub);
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

  // Métodos atualizados para usar o service
  showShareDialog(): void {
    this.availableItems = [
      { id: '1', title: 'Conta AWS - Produção', type: 'password' },
      { id: '2', title: 'Database Credentials', type: 'password' },
      { id: '3', title: 'Documentação API', type: 'note' }
    ];

    this.availableUsers = [
      { id: '1', name: 'João Silva', type: 'user' },
      { id: '2', name: 'Maria Santos', type: 'user' },
      { id: '3', name: 'Equipe Dev', type: 'group' }
    ];

    this.showShareModal = true;
  }

  confirmShare(): void {
    if (this.selectedItem && this.selectedUsers.length > 0) {
      // Usar o service para compartilhar
      const shareSub = this.sharedVaultService.shareItem({
        itemId: this.selectedItem.id,
        itemTitle: this.selectedItem.title,
        itemType: this.selectedItem.type,
        sharedWith: this.selectedUsers[0].name,
        sharedWithId: this.selectedUsers[0].id,
        permission: this.selectedPermission,
        expiresAt: this.expirationDate,
        owner: 'Você', // Em produção, pegar do usuário logado
        ownerId: 'user1' // Em produção, pegar do usuário logado
      }).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Item Compartilhado',
            detail: `${this.selectedItem.title} foi compartilhado com sucesso`
          });
          this.showShareModal = false;
          this.resetShareForm();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao compartilhar item: ' + error.message
          });
        }
      });

      this.subscriptions.push(shareSub);
    }
  }

  revokeAccess(item: SharedItem): void {
    const revokeSub = this.sharedVaultService.revokeShare(item.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Acesso Revogado',
          detail: `Acesso a ${item.title} foi revogado`
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao revogar acesso: ' + error.message
        });
      }
    });

    this.subscriptions.push(revokeSub);
  }

  approveRequest(request: AccessRequest): void {
    const approveSub = this.sharedVaultService.approveAccessRequest(
      request.id, 
      'user1' // Em produção, pegar do usuário logado
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Solicitação Aprovada',
          detail: `Acesso concedido para ${request.requester}`
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao aprovar solicitação: ' + error.message
        });
      }
    });

    this.subscriptions.push(approveSub);
  }

  rejectRequest(request: AccessRequest): void {
    const rejectSub = this.sharedVaultService.rejectAccessRequest(
      request.id,
      'user1' // Em produção, pegar do usuário logado
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Solicitação Recusada',
          detail: `Acesso recusado para ${request.requester}`
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao recusar solicitação: ' + error.message
        });
      }
    });

    this.subscriptions.push(rejectSub);
  }

  // ... (mantenha os outros métodos utilitários como getInitials, formatDate, etc.)
}