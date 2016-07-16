import { addProviders, async, beforeEach, inject } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing/component_fixture';
import { TestComponentBuilder } from '@angular/core/testing/test_component_builder';
import { Notification } from './notification';
import { NotificationService } from './notification-service';

describe('Component: Notification', () => {
    let fixture: ComponentFixture<Notification>;
    let notification;
    let element;
    const error = 'An error string';

    beforeEach(() => {
        addProviders([
            TestComponentBuilder,
            NotificationService
        ]);
    });

    beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(Notification)
            .then((f: ComponentFixture<Notification>) => {
                fixture = f;
                notification = f.componentInstance;
                element = f.nativeElement;
                notification.ngOnInit();
            });
    })));

    it('should initialize element', () => {
        expect(notification).toBeDefined();
        expect(notification.baseColor).toBe('empty');
        expect(notification.notification).toBeUndefined();
        expect(notification.hide).toBe(false);
        expect(notification.serviceSubscription).toBeDefined();
    });

    it('should show notification', () => {
        notification.show(error);
        expect(notification.baseColor).toBe('error');
        expect(notification.notification).toBe(error);
    });

    it('should close notification', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        notification.show(error);
        jasmine.clock().tick(1);
        notification.close();
        expect(notification.hide).toBe(true);
        jasmine.clock().tick(1001);
        expect(notification.hide).toBe(false);
        expect(notification.baseColor).toBe('empty');
        expect(notification.notification).toBe(undefined);
        jasmine.clock().uninstall();
    });

    it('should start on emission with error state', () => {
        let errorNotification: NotificationService.INotification = {
            message: 'an error message', 
            type: 'error' as NotificationService.NotificationType
        };
        spyOn(notification, 'show');
        notification.notificationService.notify(errorNotification);
        expect(notification.show).toHaveBeenCalledWith(errorNotification.message, errorNotification.type);
    });

    it('should unsubscribe', () => {
        notification.ngOnDestroy();
        expect(notification.serviceSubscription).toBeUndefined();
        expect(notification.clientSubscription).toBeUndefined();
    });
});
