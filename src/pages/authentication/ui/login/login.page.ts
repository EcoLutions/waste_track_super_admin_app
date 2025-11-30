import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { AuthStore } from '@shared/model/stores/auth.store';
import { AuthenticationService, SignInCredentials } from '@entities/user/api';
import { firstValueFrom } from 'rxjs';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, InputText, Password, MessageModule, NgClass],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthenticationService);

  readonly authStore = inject(AuthStore);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  });

  readonly showForgot = signal(false);
  readonly forgotLoading = signal(false);
  readonly forgotError = signal<string | null>(null);
  readonly forgotSuccess = signal<string | null>(null);

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  emailControl = computed(() => this.loginForm.get('email')!);
  passwordControl = computed(() => this.loginForm.get('password')!);
  forgotEmailControl = computed(() => this.forgotForm.get('email')!);

  constructor() {
    effect(() => {
      if (this.loginForm.valueChanges) {
        this.authStore.clearError();
      }
    });
  }

  ngOnInit(): void {
    if (this.authStore.isAuthenticated()) {
      this.router.navigate(['/districts']).then();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: SignInCredentials = {
      email: this.emailControl().value.trim(),
      password: this.passwordControl().value
    };

    this.authStore.signIn(credentials);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.loginForm.valid) {
      this.onSubmit();
    }
  }

  clearError(): void {
    this.authStore.clearError();
  }

  openForgot(): void {
    this.forgotForm.reset();
    this.forgotError.set(null);
    this.forgotSuccess.set(null);
    this.showForgot.set(true);
  }

  closeForgot(): void {
    this.showForgot.set(false);
    this.forgotForm.reset();
    this.forgotError.set(null);
    this.forgotSuccess.set(null);
  }

  async submitForgot(): Promise<void> {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const email = this.forgotEmailControl().value.trim();

    try {
      this.forgotLoading.set(true);
      this.forgotError.set(null);
      this.forgotSuccess.set(null);

      await firstValueFrom(this.authService.forgotPassword(email));

      this.forgotSuccess.set(
        'Si existe una cuenta con ese email, recibirás instrucciones para restablecer tu contraseña.'
      );

      this.forgotLoading.set(false);

      // Auto-cerrar modal
      setTimeout(() => this.closeForgot(), 3000);

    } catch (error: any) {
      this.forgotLoading.set(false);
      this.forgotError.set(
        error?.message || 'Error al solicitar restablecimiento de contraseña'
      );
    }
  }
}
