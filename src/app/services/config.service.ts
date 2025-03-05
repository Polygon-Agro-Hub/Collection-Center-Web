import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  production: boolean;
  apiUrl: string;
  authUrl: string;
  marketPriceUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig = {
    production: false,
    apiUrl: '/agro-api/collection-center-api',
    authUrl: '/agro-api/auth',
    marketPriceUrl: '/agro-api/market-price'
  };

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    try {
      console.log('Loading configuration...');
      this.config = await firstValueFrom(this.http.get<AppConfig>('/assets/config.json'));
      console.log('Configuration loaded:', this.config);
    } catch (error) {
      console.error('Failed to load configuration:', error);
      // Config already has fallback values from initialization
    }
  }

  getConfig(): AppConfig {
    return this.config;
  }

  getApiUrl(): string {
    return this.config.apiUrl;
  }

  getAuthUrl(): string {
    return this.config.authUrl;
  }

  getMarketPriceUrl(): string {
    return this.config.marketPriceUrl;
  }
}
