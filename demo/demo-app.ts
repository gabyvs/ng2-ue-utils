import { Component } from '@angular/core';
import { LoadingDots } from '../src/components/loading-dots/loading-dots';
import { DateMomentPipe } from '../src/pipes/date-moment/date-moment.pipe';

declare const require: any;
const template: string = require('./demo.html');
const styles: any = require('!!css-loader!less-loader!./demo.less');

@Component({
    directives: [LoadingDots],
    pipes: [DateMomentPipe],
    selector: 'app',
    styles: [styles.toString()],
    template: template
})
export class AppComponent {
    public today = new Date().valueOf();
}
