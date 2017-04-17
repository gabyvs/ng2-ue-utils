import { Location }             from '@angular/common';
import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { RouterModule }         from '@angular/router';

import { AppComponent }         from './app.component';
import { Demo }                 from './demo';
import {
    APP_CONFIG,
    ContextService,
    GTMService,
    IAppConfig,
    Ng2UEUtilsModule,
    NotificationService,
    ProgressService,
    TooltipService,
    WindowRef
}  from '../src';

const appConfig: IAppConfig = {
    apiBasePath: 'demoapp',
    appBasePath: 'demoapp',
    appVersion: 'demoapp',
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
        Ng2UEUtilsModule
    ],
    providers: [
        ContextService,
        GTMService,
        Location,
        NotificationService,
        ProgressService,
        TooltipService,
        WindowRef,
        { provide: APP_CONFIG, useValue: appConfig }
    ]
})
export class AppModule {}
