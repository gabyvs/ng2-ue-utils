import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

/**
 * This directive is meant to be used for cases where elements must be toggled between visible and hidden on hover events.
 * This will toggle an element's display between none/block.
 *
 * Use the directive identifier in the element that will react to hover events.
 * Use class `show-on-hover` to identify an element that will be shown on hover
 * Use class `hide-on-hover` to identify an element that will be hidden on hover
 *
 * ### Simple Example
 *
 * ```
 * <div toggleOnHover>
 *      <div class="show-on-hover">This has the class `show-on-hover`</div>
 *      <div class="hide-on-hover">This has the class `hide-on-hover`</div>
 * </div>
 * ```
 */
@Directive({
    selector: '[toggleOnHover]'
})
export class ToggleOnHover implements OnInit {

    private showOnHover: HTMLElement;
    private hideOnHover: HTMLElement;

    constructor(private el: ElementRef) {}

    @HostListener('mouseenter') public onMouseEnter() {
        if (this.showOnHover) {
            this.showOnHover.style.display = 'block';
        }
        if (this.hideOnHover) {
            this.hideOnHover.style.display = 'none';
        }
    }

    @HostListener('mouseleave') public onMouseLeave() {
        if (this.showOnHover) {
            this.showOnHover.style.display = 'none';
        }
        if (this.hideOnHover) {
            this.hideOnHover.style.display = 'block';
        }
    }

    public ngOnInit () {
        this.showOnHover = this.el.nativeElement.getElementsByClassName('show-on-hover')[0];
        this.showOnHover.style.display = 'none';

        this.hideOnHover = this.el.nativeElement.getElementsByClassName('hide-on-hover')[0];
        this.hideOnHover.style.display = 'block';
    }
}
