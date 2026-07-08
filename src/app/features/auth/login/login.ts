import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';
import { LoginCredentials } from '../../../core/models/auth.models';
import { Spinner } from "../../../shared/ui/spinner/spinner";
import { InputPasswordModule } from 'primeng/inputpassword';
import { LanguageSwitcher } from "../../../shared/ui/language-switcher/language-switcher";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LanguageSwitcher,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    TranslatePipe,
    MessageModule,
    Spinner,
    InputPasswordModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    this.errorMessage.set(null);
    if (this.loginForm.invalid) {
      return;
    }

    const credentials = this.loginForm.getRawValue() as LoginCredentials;
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'An unexpected error occurred');
      }
    });

  }
}