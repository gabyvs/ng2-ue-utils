import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable }    from 'rxjs';
import { ITooltipOptions } from '../../components/tooltip/tooltip';

@Injectable()
export class TooltipService {
    
    private observer = new BehaviorSubject<ITooltipOptions>(undefined);
    public tooltipOptions: Observable<ITooltipOptions> = this.observer.asObservable();

    public notify (options: ITooltipOptions) {
        this.observer.next(options);
    }
    
}
