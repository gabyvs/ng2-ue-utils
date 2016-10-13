import { Directive, ElementRef, HostListener, OnInit, Input } from '@angular/core';

type ToggleElement = 'normal'|'hover';

/**
 * This directive is meant to be used for cases where elements must be toggled between visible and hidden on hover events.
 * This will toggle an element's display between none/block.
 *
 * Use the directive identifier in the element that will react to hover events.
 * Use class `show-on-hover` to identify an element that will be shown on hover
 * Use class `hide-on-hover` to identify an element that will be hidden on hover
 *
 * @input You specify if the hide/show behavior is done using inline styles or class toggle: `showToggle = class|style`
 *
 * ### Simple Example
 *
 * ```
 * <div toggleOnHover showToggle="class">
 *      <div class="show-on-hover">This has the class `show-on-hover`</div>
 *      <div class="hide-on-hover">This has the class `hide-on-hover`</div>
 * </div>
 * ```
 */
@Directive({
    selector: '[toggleOnHover]'
})
export class ToggleOnHover implements OnInit {

    @Input() public showToggle: string = 'style';

    private showOnHover: HTMLElement;
    private hideOnHover: HTMLElement;

    constructor(private el: ElementRef) {}

    @HostListener('mouseenter') public onMouseEnter() {
        this.hideElement('normal');
        this.showElement('hover');
    }

    @HostListener('mouseleave') public onMouseLeave() {
        this.hideElement('hover');
        this.showElement('normal');
    }

    private showElement (element: ToggleElement) {
        const e = element === 'normal' ? this.hideOnHover : this.showOnHover;
        if (e) {
            if (this.showToggle === 'style') {
                e.style.display = 'block';
            } else {
                e.classList.remove('hidden');
            }
        }
    }
    private hideElement (element: ToggleElement) {
        const e = element === 'normal' ? this.hideOnHover : this.showOnHover;
        if (e) {
            if (this.showToggle === 'style') {
                e.style.display = 'none';
            } else {
                e.classList.add('hidden');
            }
        }
    }

    public ngOnInit () {
        this.showOnHover = this.el.nativeElement.getElementsByClassName('show-on-hover')[0];
        this.hideElement('hover');

        this.hideOnHover = this.el.nativeElement.getElementsByClassName('hide-on-hover')[0];
        this.showElement('normal');
    }
}
