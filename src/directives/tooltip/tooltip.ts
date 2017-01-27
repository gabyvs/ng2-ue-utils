import { Directive, HostListener, Input, OnChanges, OnDestroy } from '@angular/core';

import { ITooltipOptions, TooltipPlacement } from '../../components/tooltip/tooltip';
import { TooltipService } from './tooltip-service';

/**
 * This attribute directive is your interface for positioning and controlling the state of the tooltip component
 * included in this library.  See the below for usage instructions.
 *
 * @input tooltip: string
 *  This is the content of your tooltip
 *  
 * @input tooltipEnabled: boolean
 *  This determines whether your tooltip will be displayed or not.  When it is dynamically set to true, it will fade in.
 *  When it is dynamically set to false, it will immediately disappear.
 *  
 * @input tooltipPlacement: TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'
 *  This determines on which side of the host element your tooltip will appear.  **BUG** When dynamically changing this
 *  value there may be positioning inaccuracies until the user mouses out and back into the host element, especially in Safari.
 *
 * @input maxWidth: number
 *  This determines the maximum width of the content.  **BUG** When dynamically changing this value there may be 
 *  positioning inaccuracies until the user mouses out and back into the host element, especially in Safari.
 *
 *  **USAGE**:
 * 
 * 1) Include TooltipService in the `providers` section of ngModule, in app.module.ts for example:
 * 
 * ```
 *  @NgModule({
 *     bootstrap:    [ AppComponent ],
 *     declarations: [
 *         AppsMain,
 *         ContextBar,
 *         Row
 *     ],
 *     imports:      [
 *         BrowserModule,
 *         HttpModule,
 *         Ng2UEUtilsModule,
 *         RouterModule.forRoot(appLocalRoutes)
 *     ],
 *     providers: [
 *         AppClient,
 *         AppRepository,
 *         NotificationService,
 *         TooltipService, // ** HERE **
 *         ProgressService,
 *         Location,
 *         WindowRef,
 *         { provide: APP_CONFIG, useValue: appConfig }
 *     ]
 * })
 *  export class AppModule {}
 * ```
 * 
 * 2) Add the tooltip component to your root component's template, eg: app.component.ts:
 * 
 * ```
 * import { Component } from '@angular/core';
 *
 * @Component({
 *    selector: 'app',
 *    template: `
 *        <router-outlet></router-outlet>
 *        <ue-tooltip></ue-tooltip>
 *    `
 * })
 * export class AppComponent {}
 *
 * ```
 *
 * **Important** The tooltip component should be included in your root component template and not any lower.  It relies
 * on this placement to properly position itself around the page.
 *
 *
 * 3) Finally, use the directive somewhere in your app:
 * 
 *  * ```
 * import { Component } from '@angular/core';
 *
 * @Component({
 *    selector: 'app',
 *    template: `
 *        <div ue-tooltip="This is a div"></div>
 *    `
 * })
 * export class AppComponent {}
 *
 * ```
 * 
 *   ** SEE THE DEMO for examples of more advanced usage **
 */

@Directive({
    selector: '[ueTooltip]'
})
export class TooltipDirective implements OnChanges, OnDestroy {
    
    public hovering: boolean = false;
    @Input('ueTooltipMaxWidth') public maxWidth: number = 200;
    @Input('ueTooltip') public content: string = '';
    @Input('ueTooltipEnabled') public enabled: boolean = true;
    @Input('ueTooltipPlacement') public placement: TooltipPlacement = 'top';
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
