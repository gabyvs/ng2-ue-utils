import { OpaqueToken } from '@angular/core';

export interface IAppConfig {
    appBasePath: string;
    apiBasePath: string;
    gtmAppName: string;
}

export const APP_CONFIG = new OpaqueToken('AppConfig');
