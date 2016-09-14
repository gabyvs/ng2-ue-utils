import { addProviders, async, inject } from '@angular/core/testing';
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
        expect(notification.icon).toBe('glyphicon-alert');
    });

    it('should show warning notification', () => {
        notification.show(error, 'warning');
        expect(notification.baseColor).toBe('warning');
        expect(notification.notification).toBe(error);
        expect(notification.icon).toBe('glyphicon-alert');
    });

    it('should show success notification', () => {
        notification.show(error, 'success');
        expect(notification.baseColor).toBe('success');
        expect(notification.notification).toBe(error);
        expect(notification.icon).toBe('glyphicon-ok');
    });

    it('should auto-close if success', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        notification.show(error, 'success');
        expect(notification.hide).toBe(false);
        jasmine.clock().tick(notification.fadeTime + 1);
        expect(notification.hide).toBe(true);
        jasmine.clock().tick(notification.hideTime + 1);
        expect(notification.hide).toBe(false);
        expect(notification.baseColor).toBe('empty');
        expect(notification.notification).toBe(undefined);
        jasmine.clock().uninstall();
    });

    it('should not auto-close if mouseover', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        notification.show(error, 'success');
        expect(notification.hide).toBe(false);
        jasmine.clock().tick(notification.fadeTime / 2);
        /*
          Have not found a way to simulate actual mouseover/mouseevent in Jasmine,
          so the reset timer and restart timer functions are called directly.
        */
        notification.resetTimer();
        jasmine.clock().tick(notification.fadeTime + 1);
        expect(notification.hide).toBe(false);
        notification.restartTimer();
        jasmine.clock().tick(notification.fadeTime + 1);
        expect(notification.hide).toBe(true);
        jasmine.clock().tick(notification.hideTime + 1);
        expect(notification.hide).toBe(false);
        expect(notification.baseColor).toBe('empty');
        expect(notification.notification).toBe(undefined);
        jasmine.clock().uninstall();
    });

    it('should close notification', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        notification.show(error);
        jasmine.clock().tick(1);
        notification.close();
        expect(notification.hide).toBe(true);
        jasmine.clock().tick(notification.hideTime + 1);
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
