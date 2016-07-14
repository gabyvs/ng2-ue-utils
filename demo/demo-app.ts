import { Component } from '@angular/core';

import { DateMomentPipe } from '../src/pipes/date-moment/date-moment.pipe';
import { FromNowPipe } from '../src/pipes/from-now/from-now.pipe';
import { LoadingDots } from '../src/components/loading-dots/loading-dots';
import { Filtering, IFilterField } from '../src/components/filtering/filtering';
import { HintScroll } from '../src/components/hint-scroll/hint-scroll';
import { Modal } from '../src/components/modal/modal';
import { ToggleOnHover } from '../src/directives/toggle-on-hover/toggle-on-hover';
import { FocusOnInit } from '../src/directives/focus-on-init/focus-on-init';

declare const require: any;
const template: string = require('./demo.html');
const styles: any = require('!!css-loader!less-loader!./demo.less');

@Component({
    directives: [LoadingDots, ToggleOnHover, FocusOnInit, Filtering, HintScroll, Modal],
    pipes: [DateMomentPipe, FromNowPipe],
    selector: 'app',
    styles: [styles.toString()],
    template: template
})
export class AppComponent {
    public today = new Date().valueOf();
    public recent = this.today - (1000 * 60 * 10);
    public emitFilterCriteria: any;
    public customFilterFields: IFilterField[] = [
        { field: 'ny', label: 'New York' },
        { field: 'nj', label: 'New Jersey' },
        { field: 'ca', label: 'California' }
    ];
    public classForE2E: string = 'classForE2E';

    public onFilter(emitFilterCriteria): void {
        this.emitFilterCriteria = emitFilterCriteria;
    }
    
    public openModal(myModal: Modal): void {
        myModal.open();
    }
    
    public resolveModal(submitted): void {
        let message: string = submitted ? 'Modal was submitted!' : 'Cancelled.';
        alert(message);
    }
}
