import { Injectable } from '@angular/core';
import { Password, Note } from '../interfaces/password.interface'; // ← Note deve estar aqui

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private readonly PASSWORDS_KEY = 'securevault_passwords';
  private readonly NOTES_KEY = 'securevault_notes';

  constructor() { }

  getPasswords(): Password[] {
    const passwords = localStorage.getItem(this.PASSWORDS_KEY);
    return passwords ? JSON.parse(passwords) : [];
  }

  savePassword(password: Omit<Password, 'id' | 'createdAt' | 'updatedAt'>): void {
    const passwords = this.getPasswords();
    const newPassword: Password = {
      ...password,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    passwords.push(newPassword);
    localStorage.setItem(this.PASSWORDS_KEY, JSON.stringify(passwords));
  }

  updatePassword(id: string, password: Partial<Password>): void {
    const passwords = this.getPasswords();
    const index = passwords.findIndex(p => p.id === id);
    if (index !== -1) {
      passwords[index] = {
        ...passwords[index],
        ...password,
        updatedAt: new Date()
      };
      localStorage.setItem(this.PASSWORDS_KEY, JSON.stringify(passwords));
    }
  }

  deletePassword(id: string): void {
    const passwords = this.getPasswords().filter(p => p.id !== id);
    localStorage.setItem(this.PASSWORDS_KEY, JSON.stringify(passwords));
  }

  getNotes(): Note[] {
    const notes = localStorage.getItem(this.NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
  }

  saveNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): void {
    const notes = this.getNotes();
    const newNote: Note = {
      ...note,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    notes.push(newNote);
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
  }

  updateNote(id: string, note: Partial<Note>): void {
    const notes = this.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        ...note,
        updatedAt: new Date()
      };
      localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
    }
  }

  deleteNote(id: string): void {
    const notes = this.getNotes().filter(n => n.id !== id);
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}