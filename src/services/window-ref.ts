import { Injectable } from '@angular/core';
import { IGAEventProps, IGAPageView, IGAEvent, IGTMContext } from './context/gtm';

interface IWindow {
    location: any;
    localStorage: any;
    dataLayer: any;
}

interface IDocument {
    cookie: string;
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

    public registerPageTrack (path: string) {
        if (window && window.dataLayer) {
            window.dataLayer.push({
                'event': 'content-view',
                'content-name': path
            });
        }
    }

    public registerEventTrack (action: string, properties: IGAEventProps = {}) {
        if (window && window.dataLayer) {
            window.dataLayer.push({
                'event': properties.event || 'interaction',
                'target': properties.category,
                'action': action,
                'target-properties': properties.label,
                'value': properties.value,
                'interaction-type': properties.noninteraction
            });
        }
    }
}

@Injectable()
export class WindowMock implements WindowRef {
    public locationPath: string;
    public cookieString: string;
    public dataLayer: Array<IGTMContext | IGAEvent | IGAPageView>;
    public local: any;

    constructor () {
        this.local = {};
        this.dataLayer = [];
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
        this.dataLayer.push(context);
    }

    public cookies (): string {
        return this.cookieString;
    }

    public registerPageTrack (path: string) {
        this.dataLayer.push({
            'event': 'content-view',
            'content-name': path
        });
    }

    public registerEventTrack (action: string, properties: IGAEventProps = {}) {
        this.dataLayer.push({
            'event': properties.event || 'interaction',
            'target': properties.category,
            'action': action,
            'target-properties': properties.label,
            'value': properties.value,
            'interaction-type': properties.noninteraction
        });
    }
}
