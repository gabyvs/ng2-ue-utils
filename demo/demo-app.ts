import { Component } from '@angular/core';

import { DateMomentPipe } from '../src/pipes/date-moment/date-moment.pipe';
import { FromNowPipe } from '../src/pipes/from-now/from-now.pipe';
import { LoadingDots } from '../src/components/loading-dots/loading-dots';
import { Filtering, FilterField } from '../src/components/filtering/filtering';
import { HintScroll } from '../src/components/hint-scroll/hint-scroll';
import { ToggleOnHover } from '../src/directives/toggle-on-hover/toggle-on-hover';
import { FocusOnInit } from '../src/directives/focus-on-init/focus-on-init';

declare const require: any;
const template: string = require('./demo.html');
const styles: any = require('!!css-loader!less-loader!./demo.less');

@Component({
    directives: [LoadingDots, ToggleOnHover, FocusOnInit, Filtering, HintScroll],
    pipes: [DateMomentPipe, FromNowPipe],
    selector: 'app',
    styles: [styles.toString()],
    template: template
})
export class AppComponent {
    public today = new Date().valueOf();
    public recent = this.today - (1000 * 60 * 10);
    public emitFilterCriteria: any;
    public customFilterFields: FilterField[] = [
        { field: 'ny', label: 'New York' },
        { field: 'nj', label: 'New Jersey' },
        { field: 'ca', label: 'California' }
    ];

    public onFilter(emitFilterCriteria): void {
        this.emitFilterCriteria = emitFilterCriteria;
    }
}
