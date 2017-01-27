import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable }    from 'rxjs';
import { ITooltipOptions } from '../../components/tooltip/tooltip';

/**
 * This is a simple service that allows any tooltip attribute directives that you use in your application to communicate
 * with the tooltip component in your root component template.
 * 
 * Simple tooltip usage example:
 *
 * 1) Include TooltipService in the `providers` section of ngModule, in app.module.ts for example:
 * ```
 *  @NgModule({
 *     bootstrap:    [ AppComponent ],
 *     declarations: [
 *         AppsMain,
 *         ContextBar,
 *         Row
 *     ],
 *     imports:      [
 *         BrowserModule,
 *         HttpModule,
 *         Ng2UEUtilsModule,
 *         RouterModule.forRoot(appLocalRoutes)
 *     ],
 *     providers: [
 *         AppClient,
 *         AppRepository,
 *         NotificationService,
 *         TooltipService, // ** HERE **
 *         ProgressService,
 *         Location,
 *         WindowRef,
 *         { provide: APP_CONFIG, useValue: appConfig }
 *     ]
 * })
 *  export class AppModule {}
 * ```
 *
 * 2) Add the tooltip component to your root component's template, eg: app.component.ts:
 * 
 * ```
 * import { Component } from '@angular/core';
 *
 * @Component({
 *    selector: 'app',
 *    template: `
 *        <router-outlet></router-outlet>
 *        <ue-tooltip></ue-tooltip>
 *    `
 * })
 * export class AppComponent {}
 *
 * ```
 *
 * **Important** The tooltip component should be included in your root component template and not any lower.  It relies
 * on this placement to properly position itself around the page.
 *
 *
 * 3) Finally, use the directive somewhere in your app:
 * 
 *  * ```
 * import { Component } from '@angular/core';
 *
 * @Component({
 *    selector: 'app',
 *    template: `
 *        <div ue-tooltip="This is a div"></div>
 *    `
 * })
 * export class AppComponent {}
 *
 * ```
 *
 *   ** SEE THE DEMO for examples of more advanced usage **
 */

@Injectable()
export class TooltipService {
    
    private observer = new BehaviorSubject<ITooltipOptions>(undefined);
    public tooltipOptions: Observable<ITooltipOptions> = this.observer.asObservable();

    public notify (options: ITooltipOptions) {
        this.observer.next(options);
    }
    
}
