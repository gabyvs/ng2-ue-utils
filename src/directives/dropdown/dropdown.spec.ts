import { Component, ViewChild, AfterContentChecked } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownDirective } from './dropdown';
import { DropdownTriggerDirective } from './dropdown-trigger';

declare const beforeEach, describe, expect, it, jasmine, spyOn;

@Component({
    selector: 'host',
    template: `
    <div ueDropdown>
        <button id="trigger" ueDropdownTrigger></button>
    </div>
`
})
export class Host {
    @ViewChild(DropdownDirective) public dropdown: DropdownDirective;
    @ViewChild(DropdownTriggerDirective) public dropdownTrigger: DropdownTriggerDirective;
}

@Component({
    selector: 'delay-trigger-host',
    template: `
    <div ueDropdown>
        <button *ngIf="condition" id="trigger" ueDropdownTrigger></button>
    </div>
`
})
export class DelayTriggerHost implements AfterContentChecked {
    
    public condition: boolean = false;
    @ViewChild(DropdownDirective) public dropdown: DropdownDirective;
    @ViewChild(DropdownTriggerDirective) public dropdownTrigger: DropdownTriggerDirective;
    
    public ngAfterContentChecked() {
        this.condition = true;    
    }
}

describe('Directive: ueDropdown and ueDropdownTarget', () => {
    let fixture: ComponentFixture<Host>;
    let host: Host;
    let hostEl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ Host, DropdownDirective, DropdownTriggerDirective ]
        });

        fixture = TestBed.createComponent(Host);
        host = fixture.componentInstance;
        hostEl = fixture.nativeElement;
    });

    it('Should initialize', () => {
        expect(fixture).toBeDefined();
        expect(host).toBeDefined();
        expect(hostEl).toBeDefined();
        fixture.detectChanges();
        expect(host.dropdown).toBeDefined();
        expect(host.dropdownTrigger).toBeDefined();
    });
    
    it('Should open a subscription on trigger element clicks and set \'dropdown\' class on the host element', () => {
        const dropdownAttrEl = hostEl.children[0];
        const subscribeToTriggerSpy = spyOn(host.dropdown, 'subscribeToTriggerClickStream');
        fixture.detectChanges();
        expect(dropdownAttrEl.classList.contains('dropdown')).toBe(true);
        expect(subscribeToTriggerSpy).toHaveBeenCalledTimes(1);
        expect(subscribeToTriggerSpy).toHaveBeenCalledWith(host.dropdownTrigger);
    });
    
    it('Should open the dropdown on trigger clicks and close it on any other clicks', () => {
        const dropdownAttrEl = hostEl.children[0];
        const triggerEl = document.getElementById('trigger');
        const toggleShowSpy = spyOn(host.dropdown, 'toggleShow').and.callThrough();
        const clickEvent = () => new Event('click', { bubbles: true });
        fixture.detectChanges();
        expect(dropdownAttrEl.classList.contains('open')).toBe(false);
        triggerEl.dispatchEvent(clickEvent());
        expect(toggleShowSpy).toHaveBeenCalledTimes(1);
        expect(dropdownAttrEl.classList.contains('open')).toBe(true);
        expect(host.dropdown.documentClickSubscription.closed).toBe(false);
        document.body.dispatchEvent(clickEvent());
        expect(toggleShowSpy).toHaveBeenCalledTimes(2);
        expect(dropdownAttrEl.classList.contains('open')).toBe(false);
        expect(host.dropdown.documentClickSubscription.closed).toBe(true);
        triggerEl.dispatchEvent(clickEvent());
        expect(toggleShowSpy).toHaveBeenCalledTimes(3);
        expect(dropdownAttrEl.classList.contains('open')).toBe(true);
        expect(host.dropdown.documentClickSubscription.closed).toBe(false);
    });
    
    it('Should unsubscribe from all subscriptions on destroy', () => {
        const dropdownAttrEl = hostEl.children[0];
        const triggerEl = document.getElementById('trigger');
        const clickEvent = () => new Event('click', { bubbles: true });
        fixture.detectChanges();
        triggerEl.dispatchEvent(clickEvent());
        expect(dropdownAttrEl.classList.contains('open')).toBe(true);
        expect(host.dropdown.contentChildrenSubscription.closed).toBe(false);
        expect(host.dropdown.triggerClickSubscription.closed).toBe(false);
        expect(host.dropdown.documentClickSubscription.closed).toBe(false);
        host.dropdown.ngOnDestroy();
        expect(host.dropdown.contentChildrenSubscription.closed).toBe(true);
        expect(host.dropdown.triggerClickSubscription.closed).toBe(true);
        expect(host.dropdown.documentClickSubscription.closed).toBe(true);
    });
});

describe('Directive: ueDropdown and ueDropdownTarget', () => {
    let fixture: ComponentFixture<Host>;
    let delayTriggerHost: Host;
    let delayTriggerHostEl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ DelayTriggerHost, DropdownDirective, DropdownTriggerDirective ]
        });

        fixture = TestBed.createComponent(DelayTriggerHost);
        delayTriggerHost = fixture.componentInstance;
        delayTriggerHostEl = fixture.nativeElement;
    });

    it('Should initialize', () => {
        expect(fixture).toBeDefined();
        expect(delayTriggerHost).toBeDefined();
        expect(delayTriggerHostEl).toBeDefined();
        fixture.detectChanges();
        expect(delayTriggerHost.dropdown).toBeDefined();
        expect(delayTriggerHost.dropdownTrigger).toBeDefined();
    });
    
    it('Should handle case where trigger content child is not available in the OnContentInit hook', () => {
        const subscribeToTriggerSpy = spyOn(delayTriggerHost.dropdown, 'subscribeToTriggerClickStream');
        fixture.detectChanges();
        expect(subscribeToTriggerSpy).toHaveBeenCalledTimes(1);
        expect(subscribeToTriggerSpy).toHaveBeenCalledWith(delayTriggerHost.dropdownTrigger);
    });
});
