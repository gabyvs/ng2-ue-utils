import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipDirective } from './tooltip';
import { TooltipService } from './tooltip-service';
import { Host, BindingsHost, intializationValues } from './mocks';

declare const beforeEach, describe, expect, it, jasmine, spyOn;

describe('Directive: simple tooltip directive', () => {
    let fixture: ComponentFixture<Host>;
    let host: Host;
    let element;
    let service: TooltipService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ Host, TooltipDirective ],
            providers: [ TooltipService ]
        });

        fixture = TestBed.createComponent(Host);
        service = TestBed.get(TooltipService);
        host = fixture.componentInstance;
        element = fixture.nativeElement;
    });
    
    it('Should initialize', () => {
        fixture.detectChanges();
        expect(fixture).toBeDefined();
        expect(host).toBeDefined();
        expect(service).toBeDefined();
        fixture.detectChanges();
        expect(host.directive).toBeDefined();
    });
    
    it('Should notify the tooltip service with initialized data', () => {
        const notifySpy = spyOn(service, 'notify');
        fixture.detectChanges();
        expect(notifySpy).toHaveBeenCalledTimes(1);
        expect(notifySpy).toHaveBeenCalledWith({
            content: 'Tooltip Content',
            enabled: true,
            hovering: false,
            maxWidth: 200,
            placement: 'top',
            target: undefined
        });
    });
    
    it('Should notify service to conceal the tooltip when in ngOnDestroy hook', () => {
        const notifySpy = spyOn(service, 'notify');
        fixture.detectChanges();
        expect(notifySpy).toHaveBeenCalledTimes(1);
        notifySpy.calls.reset(); // ngOnDestroy hook triggers call with same args as initialization, 
        // clearing spy to ensure a distinct call is made on each lifecycle hook
        fixture.destroy();
        expect(notifySpy).toHaveBeenCalledTimes(1);
        expect(notifySpy).toHaveBeenCalledWith({
            content: 'Tooltip Content',
            enabled: true,
            hovering: false,
            maxWidth: 200,
            placement: 'top',
            target: undefined
        });
    });
    
    it('Should emit events on mouseenter and mouseleave events', () => {
        const notifySpy = spyOn(service, 'notify');
        const target = document.createElement('div');
        fixture.detectChanges();
        expect(notifySpy).toHaveBeenCalledTimes(1);
        notifySpy.calls.reset();
        host.directive.onMouseEnter({target: target} as any);
        expect(notifySpy).toHaveBeenCalledTimes(1);
        expect(notifySpy).toHaveBeenCalledWith({
            content: 'Tooltip Content',
            enabled: true,
            hovering: true,
            maxWidth: 200,
            placement: 'top',
            target: target
        });
        notifySpy.calls.reset();
        host.directive.onMouseLeave();
        expect(notifySpy).toHaveBeenCalledTimes(1);
        expect(notifySpy).toHaveBeenCalledWith({
            content: 'Tooltip Content',
            enabled: true,
            hovering: false,
            maxWidth: 200,
            placement: 'top',
            target: target
        });
    });
});

describe('Directive: tooltip directive with dynamic bindings', () => {
    let fixture: ComponentFixture<BindingsHost>;
    let host: BindingsHost;
    let element;
    let service: TooltipService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ BindingsHost, TooltipDirective ],
            providers: [ TooltipService ]
        });

        fixture = TestBed.createComponent(BindingsHost);
        service = TestBed.get(TooltipService);
        host = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('Should initialize', () => {
        fixture.detectChanges();
        expect(fixture).toBeDefined();
        expect(host).toBeDefined();
        expect(service).toBeDefined();
        fixture.detectChanges();
        expect(host.directive).toBeDefined();
    });
    
    it('Should notify service with initial tooltip state and then update when any bound input is changed', () => {
        const notifySpy = spyOn(service, 'notify');
        fixture.detectChanges();
        expect(notifySpy).toHaveBeenCalledTimes(1);
        expect(notifySpy).toHaveBeenCalledWith({
            content: intializationValues.tooltipContent,
            enabled: intializationValues.tooltipEnabled,
            hovering: false,
            maxWidth: intializationValues.maxWidth,
            placement: intializationValues.tooltipPlacement,
            target: undefined
        });
        host.tooltipPlacement = 'bottom';
        host.maxWidth = 150;
        host.tooltipContent = 'changed content';
        host.tooltipEnabled = true;
        fixture.detectChanges();
        expect(notifySpy).toHaveBeenCalledTimes(2);
        expect(notifySpy).toHaveBeenCalledWith({
            content: 'changed content',
            enabled: true,
            hovering: false,
            maxWidth: 150,
            placement: 'bottom',
            target: undefined
        });
    });
    
    it('Should not notify service with values when they are re-set but unchanged', () => {
        const notifySpy = spyOn(service, 'notify');
        fixture.detectChanges();
        expect(notifySpy).toHaveBeenCalledTimes(1);
        expect(notifySpy).toHaveBeenCalledWith({
            content: intializationValues.tooltipContent,
            enabled: intializationValues.tooltipEnabled,
            hovering: false,
            maxWidth: intializationValues.maxWidth,
            placement: intializationValues.tooltipPlacement,
            target: undefined
        });
        host.tooltipPlacement = intializationValues.tooltipPlacement;
        host.maxWidth = intializationValues.maxWidth;
        host.tooltipContent = intializationValues.tooltipContent;
        host.tooltipEnabled = intializationValues.tooltipEnabled;
        fixture.detectChanges();
        expect(notifySpy).toHaveBeenCalledTimes(1);
    });
});
