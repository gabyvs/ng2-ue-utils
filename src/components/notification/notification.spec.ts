import {
    ComponentFixture,
    TestBed }                   from '@angular/core/testing';
import { By }                   from '@angular/platform-browser';

import { Notification }         from './notification';
import { NotificationService }  from './notification-service';
import {
    APP_CONFIG,
    IAppConfig }                from '../../services/context/app-config';
import { GTMService }           from '../../services/context/gtm';
import {
    WindowRef,
    WindowMock }                from '../../services/window-ref';

declare const beforeEach, describe, expect, it, jasmine, spyOn;
const apiBasePath = 'apiproducts';
const appBasePath = 'products';
const appName = 'ProductsSPA';
const appConfig: IAppConfig = {
    apiBasePath: apiBasePath,
    appBasePath: appBasePath,
    gtmAppName: appName
};

describe('Component: Notification', () => {
    let notification:   Notification;
    let fixture:        ComponentFixture<Notification>;

    let rootElement, textElement, iconElement, window;
    const message = 'The message';

    const initializeDebugElements = () => {
        rootElement = fixture.debugElement.query(By.css('.ut-root-element')).nativeElement;
        textElement = fixture.debugElement.query(By.css('.ut-main-text')).nativeElement;
        iconElement = fixture.debugElement.query(By.css('.ut-icon')).nativeElement;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:   [ Notification ],
            providers:      [
                NotificationService,
                GTMService,
                { provide: WindowRef, useClass: WindowMock },
                { provide: APP_CONFIG, useValue: appConfig }
            ]
        });

        fixture = TestBed.createComponent(Notification);
        window = TestBed.get(WindowRef);
        notification = fixture.componentInstance;
        fixture.detectChanges();
        initializeDebugElements();
    });

    it('should initialize element', () => {
        expect(notification).toBeDefined();
        expect(rootElement.classList.contains('empty')).toBe(true);
        expect(rootElement.classList.contains('show')).toBe(false);
        expect(rootElement.classList.contains('hide')).toBe(false);
        expect(textElement.textContent).toBe('');
        expect(notification['serviceSubscription']).toBeDefined();
    });

    it('should show error notification', () => {
        notification.show(message);
        fixture.detectChanges();
        expect(rootElement.classList.contains('error')).toBe(true);
        expect(textElement.textContent).toBe(message);
        expect(iconElement.classList.contains('glyphicon')).toBe(true);
        expect(iconElement.classList.contains('glyphicon-alert')).toBe(true);
    });

    it('should show warning notification', () => {
        notification.show(message, 'warning');
        fixture.detectChanges();
        expect(rootElement.classList.contains('warning')).toBe(true);
        expect(textElement.textContent).toBe(message);
        expect(iconElement.classList.contains('glyphicon')).toBe(true);
        expect(iconElement.classList.contains('glyphicon-alert')).toBe(true);
    });

    it('should show success notification', () => {
        notification.show(message, 'success');
        fixture.detectChanges();
        expect(rootElement.classList.contains('success')).toBe(true);
        expect(textElement.textContent).toBe(message);
        expect(iconElement.classList.contains('glyphicon')).toBe(true);
        expect(iconElement.classList.contains('glyphicon-ok')).toBe(true);
    });

    it('should auto-close if success', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        notification.show(message, 'success');
        fixture.detectChanges();
        expect(textElement.textContent).toBe(message);
        expect(rootElement.classList.contains('hide')).toBe(false);
        jasmine.clock().tick(4001);
        fixture.detectChanges();
        expect(rootElement.classList.contains('hide')).toBe(true);
        jasmine.clock().tick(1001);
        fixture.detectChanges();
        expect(rootElement.classList.contains('hide')).toBe(false);
        expect(rootElement.classList.contains('empty')).toBe(true);
        expect(textElement.textContent).toBe('');
        jasmine.clock().uninstall();
    });

    it('should not auto-close if mouseover', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        notification.show(message, 'success');
        fixture.detectChanges();
        expect(textElement.textContent).toBe(message);
        expect(rootElement.classList.contains('hide')).toBe(false);
        jasmine.clock().tick(2000);
        notification.resetTimer();
        fixture.detectChanges();
        expect(rootElement.classList.contains('hide')).toBe(false);
        jasmine.clock().tick(4001);
        fixture.detectChanges();
        expect(rootElement.classList.contains('hide')).toBe(false);
        notification.restartTimer();
        jasmine.clock().tick(4001);
        fixture.detectChanges();
        expect(rootElement.classList.contains('hide')).toBe(true);
        jasmine.clock().tick(1001);
        fixture.detectChanges();
        expect(rootElement.classList.contains('hide')).toBe(false);
        expect(rootElement.classList.contains('empty')).toBe(true);
        expect(textElement.textContent).toBe('');
        jasmine.clock().uninstall();
    });

    it('should close notification', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        notification.show(message);
        jasmine.clock().tick(1);
        notification.close();
        fixture.detectChanges();
        expect(rootElement.classList.contains('hide')).toBe(true);
        jasmine.clock().tick(1001);
        fixture.detectChanges();
        expect(rootElement.classList.contains('hide')).toBe(false);
        expect(rootElement.classList.contains('empty')).toBe(true);
        expect(textElement.textContent).toBe('');
        jasmine.clock().uninstall();
    });

    it('should start on emission with error state', () => {
        let errorNotification: NotificationService.INotification = {
            message: 'an error message',
            type: 'error' as NotificationService.NotificationType
        };
        spyOn(notification, 'show');
        const notificationService = TestBed.get(NotificationService);
        notificationService.notify(errorNotification);
        expect(notification.show).toHaveBeenCalledWith(errorNotification.message, errorNotification.type);
    });

    it('should push user visible errors to GTM', () => {
        let errorNotification: NotificationService.INotification = {
            message: 'an error message',
            type: 'error' as NotificationService.NotificationType
        };
        spyOn(notification, 'show').and.callThrough();
        const notificationService = TestBed.get(NotificationService);
        notificationService.notify(errorNotification);
        expect(notification.show).toHaveBeenCalledWith(errorNotification.message, errorNotification.type);
        expect(window.dataLayer).toBeDefined();
        expect(window.dataLayer.length).toBe(1);
        expect(window.dataLayer[0]['event']).toBe('interaction');
        expect(window.dataLayer[0]['target']).toBe('Edge_userVisibleError');
        expect(window.dataLayer[0]['action']).toBe(errorNotification.message);
        expect(window.dataLayer[0]['target-properties']).toBeDefined();
        expect(window.dataLayer[0]['target-properties'][0]).toBe('/');
        expect(window.dataLayer[0]['value']).toBe();
        expect(window.dataLayer[0]['interaction-type']).toBeUndefined();
    });
});
