import { AfterViewInit, Component, ContentChild, ElementRef, Input } from '@angular/core';

import * as _ from 'lodash';

/**
 * A component which renders indicators when there is hidden content which can be scrolled to bring into view.  It wraps
 * its contained elements in divs which display when the user has scrolled more than 10 pixels from the top or bottom of
 * its contents.
 * 
 * Attach the local var `#scrollableComponent` to the <scrollable-container> tag as shown below.
 *
 * Then attach the local var `#scrollableContent` to on scrollable content's container.  Also add a `scroll` event
 * handler which calls `scrollableComponent.onScroll()`.
 *
 * Finally, add the `#scrollableTop` local var to the element directly above your scrollable content in the DOM tree.
 * 
 * See demo implementation for styles.
 * 
 * ### Simple Example
 *
 * ```
 *  <scrollable-container #scrollableComponent>
 *      <table>
 *          <thead #scrollableTop>
 *              <tr>...</tr>
 *              <tr>...</tr>
 *              <tr>...</tr>
 *          </thead>
 *          <tbody #scrollableContent (scroll)="scrollableComponent.onScroll()>
 *              <td>...</td>
 *              <td>...</td>
 *          </tbody>
 *      </table>
 *  </scrollable-container>
 * ```
 *
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

    public onScroll = _.debounce(this.verifyVisibility, 500);

    public ngAfterViewInit () {
        setTimeout(() => {
            if (!this.content) { return; }
            this.scrollableEl = this.content.nativeElement;
            this.fromTop = this.top.nativeElement.clientHeight - 1 + 'px';
        });
    }

    private showTop () {
        if (!this.scrollableEl || !this.scrollableEl.children.length) { return false; }
        const firstElementTop = this.scrollableEl.children[0].getBoundingClientRect().top;
        const bodyTop = this.scrollableEl.getBoundingClientRect().top;
        return firstElementTop < (bodyTop - 10);
    }

    private showBottom () {
        if (!this.scrollableEl || !this.scrollableEl.children.length) { return false; }
        const lastElementBottom = this.scrollableEl.children[this.scrollableEl.children.length - 1].getBoundingClientRect().bottom;
        const bodyBottom = this.scrollableEl.getBoundingClientRect().bottom;
        return lastElementBottom > (bodyBottom + 10);
    }

    private verifyVisibility () {
        this.showBottom();
        this.showTop();
    }
}
