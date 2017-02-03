import { Component, ViewChild, QueryList } from '@angular/core';

import { TooltipDirective } from './tooltip';
import { TooltipPlacement } from '../../components/tooltip/tooltip';

export const intializationValues: any = {
    maxWidth: 300,
    tooltipContent: 'bound tooltip content',
    tooltipEnabled: false,
    tooltipPlacement: 'left'
};

@Component({
    selector: 'host',
    template: `
    <div tooltip="Tooltip Content"></div>
`
})
export class Host {
    @ViewChild(TooltipDirective) public directive: TooltipDirective;
}

@Component({
    selector: 'bindings-host',
    template: `
    <div [tooltip]="tooltipContent"
        [tooltipPlacement]="tooltipPlacement"
        [tooltipEnabled]="tooltipEnabled"
        [maxWidth]="maxWidth"></div>
`
})
export class BindingsHost {
    public tooltipContent: string = intializationValues.tooltipContent;
    public tooltipEnabled: boolean = intializationValues.tooltipEnabled;
    public tooltipPlacement: TooltipPlacement = intializationValues.tooltipPlacement;
    public maxWidth: number = intializationValues.maxWidth;

    @ViewChild(TooltipDirective) public directive: QueryList<TooltipDirective>;
}