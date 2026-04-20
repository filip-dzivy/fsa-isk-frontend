import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloak = new Keycloak({
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId,
  });

  async init(): Promise<void> {
    await this.keycloak.init({ checkLoginIframe: false });
  }

  login(): void {
    this.keycloak.login({ redirectUri: window.location.href });
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  isLoggedIn(): boolean {
    return !!this.keycloak.authenticated;
  }

  getUsername(): string {
    return (this.keycloak.tokenParsed?.['preferred_username'] as string) ?? '';
  }

  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }
}
