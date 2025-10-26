import { Injectable } from '@angular/core';
import { Password, Note } from '../interfaces/password.interface';

export interface Tag {
  name: string;
  color: string;
  count: number;
}

export interface SearchFilters {
  query: string;
  tags: string[];
  category: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  type: 'all' | 'passwords' | 'notes';
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private readonly TAGS_KEY = 'securevault_tags';
  private readonly SAVED_FILTERS_KEY = 'securevault_saved_filters';

  constructor() {}

  // Gerenciamento de Tags
  getTags(): Tag[] {
    const saved = localStorage.getItem(this.TAGS_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  saveTags(tags: Tag[]): void {
    localStorage.setItem(this.TAGS_KEY, JSON.stringify(tags));
  }

  addTagToItem(item: Password | Note, tagName: string, color: string = this.generateColor()): void {
    if (!item.tags) {
      item.tags = [];
    }
    
    if (!item.tags.includes(tagName)) {
      item.tags.push(tagName);
      this.updateTagCount(tagName, color, 1);
    }
  }

  removeTagFromItem(item: Password | Note, tagName: string): void {
    if (item.tags) {
      item.tags = item.tags.filter(tag => tag !== tagName);
      this.updateTagCount(tagName, '', -1);
    }
  }

  private updateTagCount(tagName: string, color: string, increment: number): void {
    const tags = this.getTags();
    const existingTag = tags.find(t => t.name === tagName);
    
    if (existingTag) {
      existingTag.count += increment;
      if (existingTag.count <= 0) {
        // Remove tag se não tiver mais itens
        this.saveTags(tags.filter(t => t.name !== tagName));
        return;
      }
    } else if (increment > 0) {
      tags.push({ name: tagName, color, count: 1 });
    }
    
    this.saveTags(tags);
  }

  // Sistema de Busca
  searchItems(
    items: (Password | Note)[], 
    filters: SearchFilters
  ): (Password | Note)[] {
    return items.filter(item => {
      // Filtro por tipo
      if (filters.type !== 'all') {
        const isPassword = 'username' in item;
        if (filters.type === 'passwords' && !isPassword) return false;
        if (filters.type === 'notes' && isPassword) return false;
      }

      // Filtro por texto
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesContent = 'content' in item ? 
          item.content.toLowerCase().includes(query) : false;
        const matchesUsername = 'username' in item ? 
          item.username.toLowerCase().includes(query) : false;
        
        if (!matchesTitle && !matchesContent && !matchesUsername) {
          return false;
        }
      }

      // Filtro por tags
      if (filters.tags.length > 0) {
        if (!item.tags || !filters.tags.every(tag => item.tags!.includes(tag))) {
          return false;
        }
      }

      // Filtro por categoria
      if (filters.category && item.category !== filters.category) {
        return false;
      }

      // Filtro por data
      const itemDate = new Date(item.updatedAt);
      if (filters.dateFrom && itemDate < filters.dateFrom) return false;
      if (filters.dateTo && itemDate > filters.dateTo) return false;

      return true;
    });
  }

  // Filtros Salvos
  getSavedFilters(): SearchFilters[] {
    const saved = localStorage.getItem(this.SAVED_FILTERS_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  saveFilter(filter: SearchFilters, name: string): void {
    const saved = this.getSavedFilters();
    const existingIndex = saved.findIndex(f => f['name'] === name);
    
    const filterWithName = { ...filter, name };
    
    if (existingIndex >= 0) {
      saved[existingIndex] = filterWithName;
    } else {
      saved.push(filterWithName);
    }
    
    localStorage.setItem(this.SAVED_FILTERS_KEY, JSON.stringify(saved));
  }

  deleteSavedFilter(name: string): void {
    const saved = this.getSavedFilters().filter(f => f['name'] !== name);
    localStorage.setItem(this.SAVED_FILTERS_KEY, JSON.stringify(saved));
  }

  private generateColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}