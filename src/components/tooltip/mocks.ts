import { BehaviorSubject, Observable } from 'rxjs';
import {ITooltipOptions} from './tooltip';

export class TooltipServiceMock {

    public observer = new BehaviorSubject<ITooltipOptions>(undefined);
    public tooltipOptions: Observable<ITooltipOptions> = this.observer.asObservable();

    public notify (options: ITooltipOptions) {
        this.observer.next(options);
    }
}

export function mockRectGenerator(top: number, left: number, width: number, height: number ): ClientRect {
    return {
        bottom: 100,
        height: height,
        left: left,
        right: 100,
        top: top,
        width: width
    } as ClientRect;
}

export function mockOffsetGenerator(top: number, left: number, height: number, width: number): IElementOffsets {
    return {
        offsetHeight: height,
        offsetLeft: left,
        offsetTop: top,
        offsetWidth: width
    };
}
// Generates a random integer between bounds, can pass `negative` for chance of generating a negative number
export function r (limit: number, negatives?: boolean): number  {
    return negatives && Math.random() > 0.5 ? -Math.floor(Math.random() * limit) : Math.floor(Math.random() * limit);
}

export interface IElementOffsets {
    offsetLeft: number;
    offsetTop: number;
    offsetHeight: number;
    offsetWidth: number;
}

export function mockTargetElementGenerator(clientRect: ClientRect, offsets: IElementOffsets) {
    const el = {} as HTMLElement;
    Object.keys(offsets).forEach(key => el[key] = offsets[key]);
    el.getBoundingClientRect = () => clientRect;
    return el;
}
