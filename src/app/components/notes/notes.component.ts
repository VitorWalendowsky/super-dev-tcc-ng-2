import { Component, OnInit } from '@angular/core';
import { Note } from '../../interfaces/password.interface';
import { PasswordService } from '../../services/password.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  displayDialog = false;
  selectedNote: Note = this.emptyNote();
  categories = ['Pessoal', 'Trabalho', 'Ideias', 'Lembretes', 'Outros'];

  constructor(
    private passwordService: PasswordService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadNotes();
  }

  private loadNotes(): void {
    this.notes = this.passwordService.getNotes();
  }

  private emptyNote(): any {
    return {
      title: '',
      content: '',
      category: 'Pessoal'
    };
  }

  showNewNoteDialog(): void {
    this.selectedNote = this.emptyNote();
    this.displayDialog = true;
  }

  showEditNoteDialog(note: Note): void {
    this.selectedNote = { ...note };
    this.displayDialog = true;
  }

  saveNote(): void {
    if (this.selectedNote.id) {
      this.passwordService.updateNote(this.selectedNote.id, this.selectedNote);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Nota atualizada com sucesso!'
      });
    } else {
      this.passwordService.saveNote(this.selectedNote);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Nota salva com sucesso!'
      });
    }

    this.displayDialog = false;
    this.loadNotes();
  }

  deleteNote(note: Note): void {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      this.passwordService.deleteNote(note.id);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Nota excluída com sucesso!'
      });
      this.loadNotes();
    }
  }
  formatDate(date: any): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('pt-BR');
}
}