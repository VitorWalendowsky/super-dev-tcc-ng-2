import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';

// Components
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PasswordsComponent } from './components/passwords/passwords.component';
import { NotesComponent } from './components/notes/notes.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PasswordGeneratorComponent } from './components/password-generator/password-generator.component';

// Services
import { IconService } from './services/icon.service'; // ← Adicionar esta linha

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PasswordsComponent,
    NotesComponent,
    SettingsComponent,
    PasswordGeneratorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    
    // PrimeNG Modules
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    MenubarModule,
    SidebarModule,
    TableModule,
    DialogModule,
    InputTextareaModule,
    SelectButtonModule,
    ToggleButtonModule,
    DividerModule,
    TooltipModule,
    DropdownModule,
    CheckboxModule,
    InputNumberModule,
    TagModule,
    ToastModule,
    SliderModule,
    FileUploadModule,
    ProgressBarModule
  ],
  providers: [
    MessageService,
    IconService // ← Adicionar ao providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }