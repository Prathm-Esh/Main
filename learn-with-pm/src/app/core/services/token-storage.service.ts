import { Injectable } from '@angular/core';
import { TOKEN_STORAGE_KEY } from '../constants/auth.constants';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  getToken(): string {
    return localStorage.getItem(TOKEN_STORAGE_KEY) ?? '';
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}
