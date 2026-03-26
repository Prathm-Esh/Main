import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_NAME } from '../../../../core/constants/auth.constants';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly appName = APP_NAME;
  readonly session = this.authService.session;
  readonly token = computed(() => this.session()?.token ?? '');
  readonly userId = computed(() => this.session()?.userId ?? '');
  readonly expiryTime = computed(() => {
    const expiresAt = this.session()?.expiresAt ?? 0;
    return expiresAt ? new Date(expiresAt).toLocaleString() : '';
  });

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/auth/login']);
  }
}
