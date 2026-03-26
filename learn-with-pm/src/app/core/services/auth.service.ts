import { Injectable, computed, signal } from '@angular/core';
import { AuthSession, LoginRequest } from '../models/auth.models';
import { APP_NAME, TEMPORARY_CREDENTIALS } from '../constants/auth.constants';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionSignal = signal<AuthSession | null>(null);

  readonly session = computed(() => this.sessionSignal());
  readonly isAuthenticated = computed(() => this.sessionSignal() !== null);

  constructor(private readonly tokenStorageService: TokenStorageService) {
    this.restoreSession();
  }

  login(request: LoginRequest): { success: true } | { success: false; message: string } {
    const userId = request.userId.trim();
    const isValid =
      userId === TEMPORARY_CREDENTIALS.userId &&
      request.password === TEMPORARY_CREDENTIALS.password;

    if (!isValid) {
      return { success: false, message: 'Invalid user ID or password.' };
    }

    const expiresAt = Date.now() + 60 * 60 * 1000;
    const token = this.generateJwtToken(userId, Math.floor(expiresAt / 1000));
    this.tokenStorageService.setToken(token);
    this.sessionSignal.set({ userId, token, expiresAt });
    return { success: true };
  }

  logout(): void {
    this.tokenStorageService.clearToken();
    this.sessionSignal.set(null);
  }

  private restoreSession(): void {
    const token = this.tokenStorageService.getToken();
    if (!token) {
      return;
    }

    const payload = this.decodeJwtPayload(token);
    const subject = payload?.['sub'];
    const expiresAtSeconds = payload?.['exp'];

    if (!payload || typeof subject !== 'string' || typeof expiresAtSeconds !== 'number') {
      this.logout();
      return;
    }

    if (expiresAtSeconds * 1000 <= Date.now()) {
      this.logout();
      return;
    }

    this.sessionSignal.set({
      userId: subject,
      token,
      expiresAt: expiresAtSeconds * 1000
    });
  }

  private generateJwtToken(userId: string, exp: number): string {
    const header = this.base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = this.base64UrlEncode(
      JSON.stringify({
        sub: userId,
        app: APP_NAME,
        role: 'student',
        iat: Math.floor(Date.now() / 1000),
        exp
      })
    );
    const signature = this.base64UrlEncode('temp-signature');
    return `${header}.${payload}.${signature}`;
  }

  private decodeJwtPayload(token: string): Record<string, unknown> | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const decoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private base64UrlEncode(value: string): string {
    return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }
}
