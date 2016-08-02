import { AfterViewInit, Component, ContentChild, ElementRef, Inject, Input, Output, EventEmitter } from '@angular/core';

import * as _ from 'lodash';

/**
 * A component which renders indicators when there is hidden content which can be scrolled to bring into view.  It wraps
 * your contents and adds arrows which display when the user has scrolled more than 10 pixels from the top or bottom of
 * the contents.
 *
 * IMPORTANT: If you need a buffer between the element upon which you attach the directive and the content (eg: for the 
 * table headers in a <table>):
 * 
 *      1) Attach the local var `#scrollableComponent` to the <scrollable-container> tag as shown below.
 * 
 *      2) Attach the local var `#scrollableContent` to the scrollable content's container.
 * 
 *      3) Add a `scroll` event handler which calls `scrollableComponent.onScroll()` to the same element with 
 *          `#scrollableContent`.
 *
 *      4) Add the `#scrollableTop` local var to the element directly above your scrollable content in the DOM tree,
 *          which will act as a buffer between the top of the `scrollable-container` tag and the scrollable content.
 * 
 * See demo implementation for styles.
 * 
 * ### Simple Example
 *
 * Using table, buffer needed for table headers:
 * ```
 *  <scrollable-container #scrollableComponent>
 *      <table>
 *          <thead #scrollableTop>
 *              <tr>...</tr>
 *              <tr>...</tr>
 *              <tr>...</tr>
 *          </thead>
 *          <tbody #scrollableContent (scroll)="scrollableComponent.onScroll()">
 *              <td>...</td>
 *              <td>...</td>
 *          </tbody>
 *      </table>
 *  </scrollable-container>
 * ```
 *
 * Using divs, no buffer needed for table headers:
 * ```
 *  <scrollable-container>
 *      <div>
 *          my content
 *      </div>
 *      <div>
 *          my content
 *      </div>
 *      <div>
 *          my content
 *      </div>
 *      <div>
 *          my content
 *      </div>
 *      <div>
 *          my content
 *      </div>
 *      <div>
 *          my content
 *      </div>
 *  </scrollable-container>
 * ```
 */
    
@Component({
    selector: 'scrollable-container',
    styles: [`
        :host { position: relative; display: block; }
        .hint-scroll {
            width: 100%;
            height: 20px;
            background-color: rgba(226, 226, 226, 0.70);
            position: absolute;
            display: flex;
            z-index: 2;
            cursor: default;
        }
        .arrow {
            margin: auto;
            color: white;
            transform: rotate(90deg) scale(3);
        }
        .bottom { bottom: 0; }
        .bottom-fix { bottom: -1px; }
        .content-wrapper {
            max-height: inherit;
            height: inherit;
            overflow-x: auto;
            overflow-y: scroll;
        }
    `],
    template: `
    <div class="hint-scroll" *ngIf="showTop()" [ngStyle]="{'top': fromTop}"><div class="arrow">&lsaquo;</div></div>
    <div [ngClass]="{ 'content-wrapper': !targetContainer }" (scroll)="onScroll()">
        <ng-content></ng-content>
    </div>
    <div class="hint-scroll bottom" [ngClass]="{ 'bottom-fix': !targetContainer }" *ngIf="showBottom()">
        <div class="arrow">&rsaquo;</div>
    </div>
    `
})
export class HintScroll implements AfterViewInit {

    @ContentChild('scrollableContent') private targetContainer: ElementRef;
    @ContentChild('scrollableTop') private top: ElementRef;
    
    @Output() public checkedVisibility = new EventEmitter();
    
    @Input() public set newContentLoaded (newContentLoaded: boolean) {
        if (newContentLoaded) {
            this.verifyVisibility();
            this.checkedVisibility.emit('success');
        }
    }
    
    private scrollableEl: HTMLElement;
    private fromTop: string;

    public onScroll = _.debounce(this.verifyVisibility, 500);
    
    constructor(@Inject(ElementRef) private el: ElementRef) {}

    public ngAfterViewInit () {
        setTimeout(() => {
            if (this.targetContainer) {
                this.scrollableEl = this.targetContainer.nativeElement;
                this.fromTop = this.top.nativeElement.clientHeight - 1 + 'px';
            } else {
                this.fromTop = '0px';
            }
            this.verifyVisibility();
        });
    }

    private showTop () {
        let firstElementTop: number;
        let bodyTop: number;
        let children: HTMLElement[] | HTMLCollection;
        if (this.targetContainer) {
            if (!this.scrollableEl || !this.scrollableEl.children.length) { return false; }
            children = this.scrollableEl.children;
            firstElementTop = children[0].getBoundingClientRect().top;
            bodyTop = this.scrollableEl.getBoundingClientRect().top;
        } else {
            if (!this.el.nativeElement || 
                !this.el.nativeElement.getElementsByClassName('content-wrapper')[0] ||
                !this.el.nativeElement.getElementsByClassName('content-wrapper')[0].children.length) { 
                return false; 
            }
            children = this.el.nativeElement.getElementsByClassName('content-wrapper')[0].children;
            firstElementTop = children[0].getBoundingClientRect().top;
            bodyTop = this.el.nativeElement.getBoundingClientRect().top;
        }
        return firstElementTop < (bodyTop - 10);
    }

    private showBottom () {
        let lastElementBottom: number;
        let bodyBottom: number;
        let children: HTMLElement[] | HTMLCollection;
        if (this.targetContainer) {
            if (!this.scrollableEl || !this.scrollableEl.children.length) { return false; }
            children = this.scrollableEl.children;
            lastElementBottom = children[children.length - 1].getBoundingClientRect().bottom;
            bodyBottom = this.scrollableEl.getBoundingClientRect().bottom;
        } else {
            if (!this.el.nativeElement ||
                !this.el.nativeElement.getElementsByClassName('content-wrapper')[0] ||
                !this.el.nativeElement.getElementsByClassName('content-wrapper')[0].children.length) { 
                return false; 
            }
            children = this.el.nativeElement.getElementsByClassName('content-wrapper')[0].children;
            lastElementBottom = children[children.length - 1].getBoundingClientRect().bottom;
            bodyBottom = this.el.nativeElement.getBoundingClientRect().bottom;
        }
        return lastElementBottom > (bodyBottom + 10);
    }

    private verifyVisibility () {
        this.showBottom();
        this.showTop();
    }
}
