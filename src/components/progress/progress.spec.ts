import {
    ComponentFixture,
    TestBed
}                           from '@angular/core/testing';
import { By }               from '@angular/platform-browser';

import { Progress }         from './progress';
import { ProgressService }  from './progress-service';

declare const beforeEach, describe, expect, it, jasmine, spyOn;

describe('Component: Progress', () => {
    let fixture:    ComponentFixture<Progress>;
    let progress:   Progress;
    let rootElement, reporterElement;

    const initializeDebugElements = () => {
        rootElement = fixture.debugElement.query(By.css('.ut-root')).nativeElement;
        reporterElement = fixture.debugElement.query(By.css('.ut-reporter')).nativeElement;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:   [ Progress ],
            providers:      [ ProgressService ]
        });

        fixture = TestBed.createComponent(Progress);
        progress = fixture.componentInstance;
        fixture.detectChanges();
        initializeDebugElements();
    });

    it('should initialize element', () => {
        expect(progress).toBeDefined();
        expect(rootElement.classList.contains('empty')).toBe(true);
        expect(reporterElement.classList.contains('empty')).toBe(true);
        expect(progress['progress']).toBe(0);
        expect(progress['intervalId']).toBeUndefined();
    });

    it('should start on emission with start state', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        const theSpy = spyOn(progress, 'start').and.callThrough();
        progress.progressService.notify({
            event: 'start' as ProgressService.EventType,
            method: 'get' as ProgressService.EventMethod,
            stackCount: 1
        });
        expect(theSpy).toHaveBeenCalled();
        expect(rootElement.classList.contains('on')).toBe(true);
        expect(reporterElement.classList.contains('default')).toBe(true);
        expect(progress['progress']).toBe(0);
        expect(progress['intervalId']).toBeDefined();
        jasmine.clock().tick(501);
        expect(progress['progress']).not.toBe(0);
        jasmine.clock().uninstall();
    });

    it('should set progress and finish in emission without pending count', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        const theSpy = spyOn(progress, 'end').and.callThrough();
        progress.progressService.notify({
            event: 'start' as ProgressService.EventType,
            method: 'get' as ProgressService.EventMethod,
            stackCount: 1
        });
        fixture.detectChanges();
        progress.progressService.notify({
            event: 'complete' as ProgressService.EventType,
            method: 'get' as ProgressService.EventMethod,
            stackCount: 0
        });
        jasmine.clock().tick(501);
        fixture.detectChanges();
        expect(progress['status']).toBeUndefined();
        expect(theSpy).toHaveBeenCalled();
        expect(rootElement.classList.contains('empty')).toBe(true);
        expect(reporterElement.classList.contains('empty')).toBe(true);
        expect(progress['progress']).toBe(100);
        jasmine.clock().uninstall();
    });

    it('should set higher status only', () => {
        progress.setStatus('complete', 'delete');
        expect(progress['status']).toBe('success');
        progress.setStatus('warning', 'get');
        expect(progress['status']).toBe('warning');
        progress.setStatus('error', 'get');
        expect(progress['status']).toBe('error');
        progress.setStatus('complete', 'get');
        expect(progress['status']).toBe('error');
    });

    it('should set progress in emission with pending count', () => {
        const theSpy = spyOn(progress, 'end');
        progress.progressService.notify({
            event: 'error' as ProgressService.EventType,
            method: 'get' as ProgressService.EventMethod,
            stackCount: 1
        });
        fixture.detectChanges();
        expect(progress['status']).toBe('error');
        expect(theSpy).not.toHaveBeenCalled();
    });

    it('should end progress and finish in emission without pending count', () => {
        const theSpy = spyOn(progress, 'end');
        progress.progressService.notify({
            event: 'complete' as ProgressService.EventType,
            method: 'put' as ProgressService.EventMethod,
            stackCount: 0
        });
        fixture.detectChanges();
        expect(progress['status']).toBe('success');
        expect(theSpy).toHaveBeenCalled();
    });

    it('should control state in several consecutive calls', () => {
        const theStartSpy = spyOn(progress, 'start');
        const theEndSpy = spyOn(progress, 'end');
        progress.progressService.notify({
            event: 'start' as ProgressService.EventType,
            method: 'get' as ProgressService.EventMethod,
            stackCount: 1
        });
        progress.progressService.notify({
            event: 'start' as ProgressService.EventType,
            method: 'put' as ProgressService.EventMethod,
            stackCount: 2
        });
        expect(theStartSpy).toHaveBeenCalledTimes(2);

        progress.progressService.notify({
            event: 'error' as ProgressService.EventType,
            method: 'get' as ProgressService.EventMethod,
            stackCount: 1
        });
        expect(progress['status']).toBe('error');
        expect(theEndSpy).not.toHaveBeenCalled();

        progress.progressService.notify({
            event: 'complete' as ProgressService.EventType,
            method: 'put' as ProgressService.EventMethod,
            stackCount: 0
        });
        expect(progress['status']).toBe('error');
        expect(theEndSpy).toHaveBeenCalled();
    });
});
