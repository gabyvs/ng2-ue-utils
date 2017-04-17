import { OpaqueToken } from '@angular/core';

export interface IAppConfig {
    apiBasePath: string;
    appBasePath: string;
    appVersion?: string;
    gtmAppName: string;
}

export const APP_CONFIG = new OpaqueToken('AppConfig');
