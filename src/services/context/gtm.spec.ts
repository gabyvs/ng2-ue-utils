import { TestBed }      from '@angular/core/testing';

import {
    APP_CONFIG,
    IAppConfig }        from './app-config';
import { GTMService }   from './gtm';
import {
    WindowMock,
    WindowRef }         from '../window-ref';

declare const beforeEach, describe, expect, it;

const apiBasePath = 'apiproducts';
const appBasePath = 'products';
const appName = 'ProductsSPA';
const appConfig: IAppConfig = {
    apiBasePath: apiBasePath,
    appBasePath: appBasePath,
    gtmAppName: appName
};

describe('Context Helper', () => {

    let gtmService: GTMService;
    let window: WindowMock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:      [
                { provide: WindowRef, useClass: WindowMock },
                { provide: APP_CONFIG, useValue: appConfig },
                { provide: GTMService, useClass: GTMService }
            ]
        });

        window = TestBed.get(WindowRef);
        gtmService = TestBed.get(GTMService);
    });

    it('Sets context for Google Tag Manager', () => {
        const org = 'apigeeui';
        const id = 'theid';
        const internalEmail = 'theemail@apigee.com';
        const externalEmail = 'theemail@test.com';
        gtmService.updateGtmContext(org, id, internalEmail);
        expect(window.dataLayer).toBeDefined();
        expect(window.dataLayer.length).toBe(1);
        expect(window.dataLayer[0]['organization.name']).toBe(org);
        expect(window.dataLayer[0]['webapp.name']).toBe(appName);
        expect(window.dataLayer[0]['user.internal']).toBe('internal');
        expect(window.dataLayer[0]['user.email']).toBe(internalEmail);
        expect(window.dataLayer[0]['user.uuid']).toBe(id);
        gtmService.updateGtmContext(org, id, externalEmail);
        expect(window.dataLayer.length).toBe(2);
        expect(window.dataLayer[1]['organization.name']).toBe(org);
        expect(window.dataLayer[1]['webapp.name']).toBe(appName);
        expect(window.dataLayer[1]['user.internal']).toBeUndefined();
        expect(window.dataLayer[1]['user.email']).toBe(externalEmail);
        expect(window.dataLayer[1]['user.uuid']).toBe(id);
    });

    it('Pushes virtual page views to data layer object', () => {
        const path = 'my/path/to/page';
        gtmService.registerPageTrack(path);
        expect(window.dataLayer).toBeDefined();
        expect(window.dataLayer.length).toBe(1);
        expect(window.dataLayer[0]['event']).toBe('content-view');
        expect(window.dataLayer[0]['content-name']).toBe(path);
    });

    it('Pushes events to data layer object', () => {
        const props = { action: 'the action', category: 'random category', label: 'myLabel', noninteraction: true, value: 'thevalue' };
        gtmService.registerEventTrack(props);
        expect(window.dataLayer).toBeDefined();
        expect(window.dataLayer.length).toBe(1);
        expect(window.dataLayer[0]['event']).toBe('interaction');
        expect(window.dataLayer[0]['target']).toBe(props.category);
        expect(window.dataLayer[0]['action']).toBe(props.action);
        expect(window.dataLayer[0]['target-properties']).toBe(props.label);
        expect(window.dataLayer[0]['value']).toBe(props.value);
        expect(window.dataLayer[0]['interaction-type']).toBe(true);
    });

    it('Pushes events to data layer object marking them as SPA events', () => {
        const props = { action: 'the action', category: 'override', label: 'myLabel', noninteraction: true, value: 'thevalue' };
        gtmService.registerSPAEvent(props);
        expect(window.dataLayer).toBeDefined();
        expect(window.dataLayer.length).toBe(1);
        expect(window.dataLayer[0]['event']).toBe('interaction');
        expect(window.dataLayer[0]['target']).toBe(appConfig.gtmAppName);
        expect(window.dataLayer[0]['action']).toBe(props.action);
        expect(window.dataLayer[0]['target-properties']).toBe(props.label);
        expect(window.dataLayer[0]['value']).toBe(props.value);
        expect(window.dataLayer[0]['interaction-type']).toBe(true);
    });

    it('Registers client calls', () => {
        const path = 'my/path/to/page';
        const code = 200;
        gtmService.registerClientCall(code, path, 111);
        expect(window.dataLayer).toBeDefined();
        expect(window.dataLayer.length).toBe(1);
        expect(window.dataLayer[0]['event']).toBe('timing');
        expect(window.dataLayer[0]['target']).toBe('Edge_APICall');
        expect(window.dataLayer[0]['action']).toBe(code);
        expect(window.dataLayer[0]['target-properties']).toBe(path);
        expect(window.dataLayer[0]['value']).toBe(111);
        expect(window.dataLayer[0]['interaction-type']).toBe(true);
    });

    it('Registers user visible errors', () => {
        const message = 'Some message';
        const action = 'Action that caused message';
        gtmService.registerUserVisibleError(message, action);
        expect(window.dataLayer).toBeDefined();
        expect(window.dataLayer.length).toBe(1);
        expect(window.dataLayer[0]['event']).toBe('interaction');
        expect(window.dataLayer[0]['target']).toBe('Edge_userVisibleError');
        expect(window.dataLayer[0]['action']).toBe(action);
        expect(window.dataLayer[0]['target-properties']).toBe(message);
        expect(window.dataLayer[0]['interaction-type']).toBe(true);
    });
});
