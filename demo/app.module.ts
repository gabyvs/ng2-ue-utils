import { Location }             from '@angular/common';
import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { RouterModule }         from '@angular/router';
import { Ng2BootstrapModule }   from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent }         from './app.component';
import { Demo }                 from './demo';
import {
    APP_CONFIG,
    ContextService,
    IAppConfig,
    Ng2UEUtilsModule,
    NotificationService,
    ProgressService,
    WindowRef,
    TooltipService
}  from '../src';

const appConfig: IAppConfig = {
    apiBasePath: 'demoapp',
    appBasePath: 'demoapp',
    gtmAppName: 'demoapp'
};

@NgModule({
    bootstrap:    [ AppComponent ],
    declarations: [
        AppComponent,
        Demo
    ],
    imports:      [
        BrowserModule,
        RouterModule.forRoot([
            { component: Demo, path: 'ng2-ue-utils' },
            { component: Demo, path: '' }
        ]),
        Ng2BootstrapModule,
        Ng2UEUtilsModule
    ],
    providers: [
        ContextService,
        Location,
        NotificationService,
        ProgressService,
        TooltipService,
        WindowRef,
        { provide: APP_CONFIG, useValue: appConfig }
    ]
})
export class AppModule {}
