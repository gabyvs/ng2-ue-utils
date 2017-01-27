import { Directive, AfterContentInit, ContentChildren, ElementRef, Inject, QueryList, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';

import { DropdownTriggerDirective } from './dropdown-trigger';

/**
 * This is an attribute directive for dropdown menus, used in combination with the `ueDropdownTrigger` attribute 
 * and the `.dropdown-menu` css class.  It can be consumed in your apps and is also used internally in the `filtering` 
 * component's template.
 *
 * Simple usage example:
 *
 * ```
 * import { Component } from '@angular/core';
 *
 * @Component({
 *    selector: 'app',
 *    template: `
 *        <div ueDropdown>
 *            <button ueDropdownTrigger>Click to open dropdown</button>
 *            <ul class="dropdown-menu">
 *                <li>Option 1</li>
 *                <li>Option 2</li>
 *                <li>Option 3</li>
 *            </ul>
 *        </div>
 *    `
 * })
 * export class AppComponent {}
 *
 * ```
 *
 *   ** SEE THE DEMO for examples of more advanced usage **
 */

@Directive({
    selector: '[ueDropdown]'
})
export class DropdownDirective implements AfterContentInit, OnDestroy {
    
    private get classList(): DOMTokenList {
        return this.el.nativeElement.classList;
    }
    private documentClickStream: Observable<MouseEvent> =
        Observable.fromEvent(this.document, 'click') as Observable<MouseEvent>;
    public documentClickSubscription: Subscription;
    public triggerClickSubscription: Subscription;
    public contentChildrenSubscription: Subscription;
    @ContentChildren(DropdownTriggerDirective) private queryList: QueryList<DropdownTriggerDirective>;
    
    constructor(private el: ElementRef, @Inject(DOCUMENT) private document: any) {}
    
    public ngAfterContentInit() {
        const first: Observable<DropdownTriggerDirective> = Observable.of(this.queryList.first);
        const changes: Observable<DropdownTriggerDirective> = this.queryList.changes
            .flatMap(q => Observable.of(q.first)) as Observable<DropdownTriggerDirective>;
        
        this.contentChildrenSubscription = Observable.merge(first, changes)
            .filter((d: DropdownTriggerDirective) => !!d)
            .subscribe((d: DropdownTriggerDirective) => this.subscribeToTriggerClickStream(d));
        this.el.nativeElement.classList.add('dropdown');
    }
    
    private subscribeToTriggerClickStream(trigger: DropdownTriggerDirective) {
        if (this.triggerClickSubscription) { this.triggerClickSubscription.unsubscribe(); }
        this.triggerClickSubscription = trigger.clickStream.subscribe(click => this.toggleShow(click, true));
    }
    
    private toggleShow(event: MouseEvent, stopPropagation: boolean = false): void {
        if (stopPropagation) { event.stopPropagation(); }
        this.classList.toggle('open');
        
        if (this.classList.contains('open')) {
            this.documentClickSubscription = this.documentClickStream.subscribe(click => this.toggleShow(click));
        } else {
            this.documentClickSubscription.unsubscribe();
        }
    }
    
    public ngOnDestroy() {
        if (this.contentChildrenSubscription) { this.contentChildrenSubscription.unsubscribe(); }
        if (this.triggerClickSubscription) { this.triggerClickSubscription.unsubscribe(); }
        if (this.documentClickSubscription) { this.documentClickSubscription.unsubscribe(); }
    }
    
}
