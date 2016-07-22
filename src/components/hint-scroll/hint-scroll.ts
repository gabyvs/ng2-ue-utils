import { AfterViewInit, Component, ContentChild, ElementRef, Inject } from '@angular/core';

import * as _ from 'lodash';

/**
 * A component which renders indicators when there is hidden content which can be scrolled to bring into view.  It wraps
 * its contained elements in divs which display when the user has scrolled more than 10 pixels from the top or bottom of
 * its contents.
 * 
 * Attach the local var `#scrollableComponent` to the <scrollable-container> tag as shown below.
 *
 * If you need a buffer between the element upon which you attach the directive and the content (eg: for the table
 * headers in a <table>), then attach the local var `#scrollableContent` to the scrollable content's container.  Also 
 * 
 * Add a `scroll` event handler which calls `scrollableComponent.onScroll()`.
 *
 * Finally, add the `#scrollableTop` local var to the element directly above your scrollable content in the DOM tree.
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
 *  <scrollable-container (scroll)="scrollableComponent.onScroll()">
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
        }
        .arrow {
            margin: auto;
            color: white;
            transform: rotate(90deg) scale(3);
        }
        .bottom { bottom: 0; }
    `],
    template: `
    <div class="hint-scroll" *ngIf="showTop()" [ngStyle]="{'top': fromTop}"><div class="arrow">&lsaquo;</div></div>
    <ng-content></ng-content> 
    <div class="hint-scroll bottom" *ngIf="showBottom()"><div class="arrow">&rsaquo;</div></div>
    `
})
export class HintScroll implements AfterViewInit {

    @ContentChild('scrollableContent') private content: ElementRef;
    @ContentChild('scrollableTop') private top: ElementRef;

    private scrollableEl: HTMLElement;
    private fromTop: string;
    private hasTargetContainer: boolean = false;

    public onScroll = _.debounce(this.verifyVisibility, 500);
    
    constructor(@Inject(ElementRef) private el: ElementRef) {}

    public ngAfterViewInit () {
        setTimeout(() => {
            if (!this.content) { 
                this.fromTop = this.el.nativeElement.clientHeight - 1 + 'px';
                return; 
            }
            this.hasTargetContainer = true;
            this.scrollableEl = this.content.nativeElement;
            this.fromTop = this.top.nativeElement.clientHeight - 1 + 'px';
        });
    }

    private showTop () {
        let firstElementTop: number;
        let bodyTop: number;
        if (this.hasTargetContainer) {
            if (!this.scrollableEl || !this.scrollableEl.children.length) { return false; }
            firstElementTop = this.scrollableEl.children[0].getBoundingClientRect().top;
            bodyTop = this.scrollableEl.getBoundingClientRect().top;
        } else {
            firstElementTop = this.el.nativeElement.children[0].getBoundingClientRect().top;
            bodyTop = this.el.nativeElement.getBoundingClientRect().top;
        }
        return firstElementTop < (bodyTop - 10);
    }

    private showBottom () {
        let lastElementBottom: number;
        let bodyBottom: number;
        if (this.hasTargetContainer) {
            if (!this.scrollableEl || !this.scrollableEl.children.length) { return false; }
            lastElementBottom = this.scrollableEl.children[this.scrollableEl.children.length - 1].getBoundingClientRect().bottom;
            bodyBottom = this.scrollableEl.getBoundingClientRect().bottom;
        } else {
            lastElementBottom = this.el.nativeElement.children[this.el.nativeElement.children.length - 1].getBoundingClientRect().bottom;
            bodyBottom = this.el.nativeElement.getBoundingClientRect().bottom;
        }
        return lastElementBottom > (bodyBottom + 10);
    }

    private verifyVisibility () {
        this.showBottom();
        this.showTop();
    }
}
