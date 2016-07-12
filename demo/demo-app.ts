import { Component } from '@angular/core';

import { DateMomentPipe } from '../src/pipes/date-moment/date-moment.pipe';
import { LoadingDots } from '../src/components/loading-dots/loading-dots';
import { ToggleOnHover } from '../src/directives/toggle-on-hover/toggle-on-hover';

declare const require: any;
const template: string = require('./demo.html');
const styles: any = require('!!css-loader!less-loader!./demo.less');

@Component({
    directives: [LoadingDots, ToggleOnHover],
    pipes: [DateMomentPipe],
    selector: 'app',
    styles: [styles.toString()],
    template: template
})
export class AppComponent {
    public today = new Date().valueOf();
}
