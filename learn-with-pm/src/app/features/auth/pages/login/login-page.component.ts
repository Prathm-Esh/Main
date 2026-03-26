import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_NAME, TEMPORARY_CREDENTIALS } from '../../../../core/constants/auth.constants';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  readonly appName = APP_NAME;
  readonly tempUserId = TEMPORARY_CREDENTIALS.userId;
  readonly tempPassword = TEMPORARY_CREDENTIALS.password;
  readonly loginError = signal('');

  userId = '';
  password = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    this.loginError.set('');
    const result = this.authService.login({ userId: this.userId, password: this.password });

    if (!result.success) {
      this.loginError.set(result.message);
      return;
    }

    void this.router.navigate(['/dashboard']);
  }
}
