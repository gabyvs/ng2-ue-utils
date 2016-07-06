import 'reflect-metadata';
import 'core-js';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './demo-app';
import './main.less';

bootstrap(AppComponent, [
    disableDeprecatedForms(),
    provideForms()
]);
