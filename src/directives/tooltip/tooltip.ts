import { Directive, HostListener, Input, OnChanges, OnDestroy } from '@angular/core';

import {ITooltipOptions, TooltipPlacement} from '../../components/tooltip/tooltip';
import {TooltipService} from './tooltip-service';

@Directive({
    selector: '[tooltip]'
})
export class TooltipDirective implements OnChanges, OnDestroy {
    
    public hovering: boolean = false;
    @Input('maxWidth') public maxWidth: number = 200;
    @Input('tooltip') public content: string = '';
    @Input('tooltipEnabled') public enabled: boolean = true;
    @Input('tooltipPlacement') public placement: TooltipPlacement = 'top';
    public target: HTMLElement = undefined;

    @HostListener('mouseenter', ['$event'])
    public onMouseEnter(event: MouseEvent) {
        this.target = event.target as HTMLElement;
        this.hovering = true;
        this.notifyTooltipComponent();
    }

    @HostListener('mouseleave')
    public onMouseLeave() {
        this.hovering = false;
        this.notifyTooltipComponent();
    }
    
    constructor(private service: TooltipService) {}
    
    private notifyTooltipComponent(): void {
        const options: ITooltipOptions = {
            content: this.content,
            enabled: this.enabled,
            hovering: this.hovering,
            maxWidth: this.maxWidth,
            placement: this.placement,
            target: this.target
        };
        this.service.notify(options);
    }
    
    public ngOnChanges(): void {
        this.notifyTooltipComponent();
    }
    
    public ngOnDestroy(): void {
        this.target = undefined;
        this.hovering = false;
        this.notifyTooltipComponent();
    }
    
}
