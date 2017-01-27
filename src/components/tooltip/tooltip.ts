import { Component, AfterViewInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { TooltipService } from '../../directives/tooltip/tooltip-service';
import * as helpers from './position-helpers';

/**
 * This is a tooltip component which is intended to be placed in the template of the root component of your application.
 * It communicates with the tooltip directive included in this library via the tooltip service, also included in this
 * library.  When it receives new state from a tooltip directive via the service, it updates its position and content.
 * 
 * ** IMPORTANT ** It is important that this component be placed in the template of your app's root component!  The
 * positioning logic relies on this.
 *
 * Simple usage example:
 *
 * 1) Include TooltipService in the `providers` section of ngModule, in app.module.ts for example:
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

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

const positionKeys: any = {
    left: {
        edge: 'left',
        offsetEdge: 'offsetLeft',
        offsetSize: 'offsetWidth',
        size_: 'width'
    },
    top: {
        edge: 'top',
        offsetEdge: 'offsetTop',
        offsetSize: 'offsetHeight',
        size_: 'height'
    }
};

export interface IPositions {
    top: number;
    left: number;
}

export interface ITooltipOptions {
    content?: string;
    enabled?: boolean;
    hovering?: boolean;
    maxWidth?: number;
    placement?: TooltipPlacement;
    target?: HTMLElement;
}

declare const require: any;
const styles: string = require('!!css-loader!less-loader!./tooltip.less').toString();

@Component({
    selector: 'ue-tooltip',
    styles: [ styles ],
    template: `
        <div #tooltipContainer class="ue-tooltip-container" [ngClass]="{'ue-tooltip-show': showTooltip, 'ue-tooltip-disabled': disabled}">
            <div class="ue-tooltip-pointer ue-tooltip-pointer-{{ options.placement }}"></div>
            <div class="ue-tooltip-content ue-tooltip-content-{{ options.placement }}">{{ options.content }}</div>
        </div>
    `
})
export class Tooltip implements AfterViewInit {
    
    public options: ITooltipOptions = {};
    public showTooltip: boolean = false;
    public disabled: boolean = false;
    
    @ViewChild('tooltipContainer') public tooltipContainer: ElementRef;
    
    constructor(private service: TooltipService, private renderer: Renderer) {}
    public ngAfterViewInit() {
        this.service.tooltipOptions.subscribe((options: ITooltipOptions) => {
            this.setOptions(options);
            if (!this.options.target || !this.options.hovering) { return; }
            requestAnimationFrame(() => this.positionTooltip());
        });
    }
    
    private setOptions(options: ITooltipOptions): void {
        if (!options) { return; }
        this.options = options;
        this.showTooltip = options.enabled && options.hovering;
        this.disabled = !options.enabled;
        this.renderer.setElementStyle(this.tooltipContainer.nativeElement, 'maxWidth', options.maxWidth + 'px');
    }

    private positionTooltip(): void {
        const target: HTMLElement = this.options.target;
        const tooltip: HTMLElement = this.tooltipContainer.nativeElement;
        const newPositions: IPositions = this.calculatePositions(target, tooltip, this.options.placement);

        this.setNewPosition(tooltip, newPositions);
    }
    
    private setNewPosition(tooltip: HTMLElement, positions: IPositions): void {
        this.renderer.setElementStyle(tooltip, 'top', positions.top + 'px');
        this.renderer.setElementStyle(tooltip, 'left', positions.left + 'px');
    }

    private calculatePositions(target: HTMLElement, tooltip: HTMLElement, placement: TooltipPlacement): IPositions {
        const positions: IPositions = {} as IPositions;
        const verticalPlacement: boolean = placement === 'top' || placement === 'bottom';

        if (verticalPlacement) {
            positions.top = this.edgePosition(target, tooltip, placement, 'top');
            positions.left = this.centeredPosition(target, tooltip, 'left');
        } else {
            positions.top = this.centeredPosition(target, tooltip, 'top');
            positions.left = this.edgePosition(target, tooltip, placement, 'left');
        }

        return positions;
    }

    private edgePosition(target: HTMLElement, tooltip: HTMLElement, placement: TooltipPlacement,
                         styleProp: 'top' | 'left'): number {
        const edgeKey: string = positionKeys[styleProp].edge;
        const offsetEdgeKey: string = positionKeys[styleProp].offsetEdge;
        const offsetSizeKey: string = positionKeys[styleProp].offsetSize;
        const tooltipRect: ClientRect = tooltip.getBoundingClientRect();
        const targetEdge: number = target.getBoundingClientRect()[edgeKey];
        const tooltipEdge: number = tooltipRect[edgeKey];
        const tooltipOffsetSize: number = tooltip[offsetSizeKey];
        const tooltipOffsetEdge: number = tooltip[offsetEdgeKey];
        const targetSize: number = target[offsetSizeKey];
        const isNearSideTooltip: boolean = placement === 'left' || placement === 'top';
        
        return helpers.calculateEdgeOffsetPosition({
            contentEdge: tooltipEdge,
            contentOffsetEdge: tooltipOffsetEdge,
            contentOffsetSize: tooltipOffsetSize,
            positionNearSide: isNearSideTooltip,
            targetEdge: targetEdge,
            targetSize: targetSize
        });
    }

    private centeredPosition(target: HTMLElement, tooltip: HTMLElement, styleProp: 'top' | 'left'): number {
        const offsetSizeKey: string = positionKeys[styleProp].offsetSize;
        const offsetEdgeKey: string = positionKeys[styleProp].offsetEdge;
        const edgeKey: string = positionKeys[styleProp].edge;
        const tooltipRect: ClientRect = tooltip.getBoundingClientRect();
        const targetRect: ClientRect = target.getBoundingClientRect();
        const tooltipOffsetEdge: number = tooltip[offsetEdgeKey];
        const tooltipOffsetSize: number = tooltip[offsetSizeKey];
        const tooltipEdge: number = tooltipRect[edgeKey];
        const targetOffsetSize: number = target[offsetSizeKey];
        const targetEdge: number = targetRect[edgeKey];
        
        return helpers.calculateCenteredOffsetPosition({
            contentEdge: tooltipEdge,
            contentOffsetEdge: tooltipOffsetEdge,
            contentOffsetSize: tooltipOffsetSize,
            targetEdge: targetEdge,
            targetSize: targetOffsetSize
        });
    }
    
}
