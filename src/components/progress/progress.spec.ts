import { provide } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing/component_fixture';
import { TestComponentBuilder } from '@angular/core/testing/test_component_builder';
import { Progress } from './progress';
import { ProgressService } from './progress-service';

declare const beforeEach, describe, expect, it, jasmine, spyOn;

describe('Component: Progress', () => {
    let fixture: ComponentFixture<Progress>;
    let progress;
    let element;

    beforeEach(() => {
        addProviders([
            TestComponentBuilder,
            provide(ProgressService, { useClass: ProgressService })
        ]);
    });

    beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(Progress)
            .then((f: ComponentFixture<Progress>) => {
                fixture = f;
                progress = f.componentInstance;
                element = f.nativeElement;
                progress.ngOnInit();
            });
    })));

    it('should initialize element', () => {
        expect(progress).toBeDefined();
        expect(progress.baseColor).toBe('empty');
        expect(progress.progressColor).toBe('empty');
        expect(progress.progress).toBe(0);
        expect(progress.intervalId).toBeUndefined();
    });

    it('should start progress bar', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        progress.start();
        expect(progress.baseColor).toBe('on');
        expect(progress.progressColor).toBe('default');
        expect(progress.progress).toBe(0);
        expect(progress.intervalId).toBeDefined();
        jasmine.clock().tick(501);
        expect(progress.progress).not.toBe(0);
        progress.end();
        jasmine.clock().uninstall();
    });

    it('should end progress bar', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        progress.start();
        jasmine.clock().tick(101);
        progress.end();
        jasmine.clock().tick(501);
        expect(progress.baseColor).toBe('empty');
        expect(progress.progressColor).toBe('empty');
        expect(progress.progress).toBe(100);
        jasmine.clock().uninstall();
    });

    it('should set higher status only', () => {
        progress.setStatus('complete');
        expect(progress.status).toBe('success');
        progress.setStatus('warning');
        expect(progress.status).toBe('warning');
        progress.setStatus('error');
        expect(progress.status).toBe('error');
        progress.setStatus('complete');
        expect(progress.status).toBe('error');
    });

    it('should start on emission with start state', () => {
        spyOn(progress, 'start');
        progress.progressService.notify({
            event: 'start' as ProgressService.EventType,
            method: 'get' as ProgressService.EventMethod,
            stackCount: 1
        });
        expect(progress.start).toHaveBeenCalled();
    });

    it('should set progress in emission with pending count', () => {
        spyOn(progress, 'end');
        progress.progressService.notify({
            event: 'error' as ProgressService.EventType,
            method: 'get' as ProgressService.EventMethod,
            stackCount: 1
        });
        expect(progress.status).toBe('error');
        expect(progress.end).not.toHaveBeenCalled();
    });

    it('should set progress and finish in emission without pending count', () => {
        spyOn(progress, 'end');
        progress.progressService.notify({
            event: 'complete' as ProgressService.EventType,
            method: 'get' as ProgressService.EventMethod,
            stackCount: 0
        });
        expect(progress.status).toBeUndefined();
        expect(progress.end).toHaveBeenCalled();
    });

    it('should set progress and finish in emission without pending count', () => {
        spyOn(progress, 'end');
        progress.progressService.notify({
            event: 'complete' as ProgressService.EventType,
            method: 'put' as ProgressService.EventMethod,
            stackCount: 0
        });
        expect(progress.status).toBe('success');
        expect(progress.end).toHaveBeenCalled();
    });

    it('should control state in several consecutive calls', () => {
        spyOn(progress, 'start');
        spyOn(progress, 'end');
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
        expect(progress.start).toHaveBeenCalledTimes(2);

        progress.progressService.notify({
            event: 'error' as ProgressService.EventType,
            method: 'get' as ProgressService.EventMethod,
            stackCount: 1
        });
        expect(progress.status).toBe('error');
        expect(progress.end).not.toHaveBeenCalled();
        
        progress.progressService.notify({
            event: 'complete' as ProgressService.EventType,
            method: 'put' as ProgressService.EventMethod,
            stackCount: 0
        });
        expect(progress.status).toBe('error');
        expect(progress.end).toHaveBeenCalled();
    });
});
