import { Injectable } from '@angular/core';

interface IWindow {
    location: any;
    localStorage: any;
    dataLayer: any;
}

interface IDocument {
    cookie: string;
}

export interface IGTMContext {
    'user.uuid'?: string;
    'user.email'?: string;
    'user.internal'?: string;
    'organization.name'?: string;
    'organization.type'?: string;
    'webapp.name': string;
    'webapp.version'?: string;
    'event'?: string;
}

declare const window: IWindow;
declare const document: IDocument;

@Injectable()
export class WindowRef {
    public location(path: string): void {
        if (window && window.location) {
            console.log('Redirecting to:', path);
            window.location.assign(path);
        }
    }

    public getLocal(key: string) {
        if (window && window.localStorage && window.localStorage.getItem) {
            return window.localStorage.getItem(key);
        }
    }

    public setLocal(key: string, value: any) {
        if (window && window.localStorage && window.localStorage.setItem) {
            return window.localStorage.setItem(key, value);
        }
    }

    public cookies(): string {
        if (document) {
            return document.cookie;
        }
    }

    public gtmContext(context: IGTMContext) {
        if (window && window.dataLayer) {
            window.dataLayer.push(context);
        }
    }
}

@Injectable()
export class WindowMock implements WindowRef {
    public locationPath: string;
    public cookieString: string;
    public gtmContexts: IGTMContext[];
    public local: any;

    constructor () {
        this.local = {};
        this.gtmContexts = [];
    }

    public location (path: string): void {
        this.locationPath = path;
    }

    public getLocal (key: string): any {
        return this.local[key];
    }

    public setLocal (key: string, value: any) {
        this.local[key] = value;
    }

    public gtmContext (context: IGTMContext) {
        this.gtmContexts.push(context);
    }

    public cookies (): string {
        return this.cookieString;
    }
}
