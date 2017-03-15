import { Inject, Injectable } from '@angular/core';
import { WindowRef } from '../window-ref';
import { APP_CONFIG, IAppConfig } from './app-config';

export interface IGAPageView {
    event: string;
    'content-name': string;
}

export interface IGAEventProps {
    action: string | number;
    event?: string;
    category?: string;
    label?: string | number;
    value?: any;
    noninteraction?: boolean;
}

export interface IGAEvent {
    event?: string;
    target?: string;
    action?: string | number;
    'target-properties'?: string | number;
    value?: string | number;
    'interaction-type'?: boolean;
}

export interface IGTMContext {
    'user.uuid'?: string;
    'user.email'?: string;
    'user.internal'?: string;
    'organization.name'?: string;
    'organization.type'?: string;
    'webapp.name': string;
    'webapp.version'?: string;
    'event'?: string;
}

/**
 * This service is used to track context, events and virtual page views into data layer object to be consumed by Google Tag Manager.
 *
 * Ideally, it should be included as part of your providers in your app.module file so all the application has access to it.
 * Its dependencies must be provided in app.component as well.
 * So, your app.module.ts should look something like this
 *
 * ```
 * import { NgModule } from '@angular/core';
 * import { APP_CONFIG, GTMService, IAppConfig, WindowRef, GTMService } from 'ng2-ue-utils';
 *
 * import { MyMainComponent } from './route/to/myMainComponent';
 *
 * const appConfig: IAppConfig = {
 *   apiBasePath: 'myapibasepath',
 *   appBasePath: 'myappbasepath',
 *   gtmAppName: 'nameforgoogletagmanager'
 * };
 *
 * @NgModule({
 *   bootstrap:    [ MyMainComponent ],
 *   declarations: [
 *       MyMainComponent
 *   ],
 *   imports: [ Ng2UEUtilsModule ],
 *   providers: [
 *       GTMService,
 *       WindowRef,
 *       { provide: APP_CONFIG, useValue: appConfig }
 *   ]
 * })
 * export class AppModule {}
 * ```
 *
 * The most common usages for this service is to set the context of the user for GTM.
 * To do that create it in the component or service constructor and use it as follows
 *
 * ```
 *  constructor (private gtmService: GTMService) {}
 *
 *  // to be called in a good place on your flow
 *  private setContext () {
 *      const userName = this.helper.getUser();
 *      const userId = this.helper.getUuid();
 *      this.gtmService.updateGtmContext('', userId, userName);
 *  }
 * ```
 *
 * You can use it to track virtual page views into Google Analytics. You can do it on your AppComponent once or in each of the pages that
 * are loaded with navigation events. Here is how to do it on your AppComponent
 *
 * export class AppComponent implements OnDestroy, OnInit {
 *   private subscription: Subscription;
 *
 *   constructor (private gtmService: GTMService) {}
 *
 *   public ngOnInit () {
 *       this.subscription = this.router.events
 *           .filter(e => e instanceof NavigationStart)
 *           .subscribe(_ => {
 *               this.gtmService.registerPageTrack(window.location.pathname)
 *           });
 *   }
 *
 *   public ngOnDestroy () {
 *       if (this.subscription) { this.subscription.unsubscribe(); }
 *   }
 * }
 *
 * It can also be used to track events into Google Analytics, like interactions that do not cause a navigation (saving, deploying)
 * or non-interaction events, like a user-visible errors.
 *
 * export class MyComponent {
 *
 *   constructor (
 *      @Inject(APP_CONFIG) appConfig: IAppConfig,
 *      window: WindowRef) {
 *          this.helper = new ContextHelper(window, appConfig.gtmAppName);
 *      }
 *
 *   public onSave (entity: MyEntityType) {
 *      this.helper.registerEventTrack('Save My Entity', { category: 'MySPA', label: 'myLabel', value: entity.name });
 *       this.myClient.saveMyEntity(entity)
 *           .subscribe(
 *              newEntity => { my successful save logic here },
 *              error => {
 *                  const props = { category: 'MySPA', label: 'myLabel', noninteraction: true, value: entity.name };
 *                  this.helper.registerEventTrack('user-visible-error', props);
 *             }
 *          );
 *   }
 * }
 *
 */
@Injectable()
export class GTMService {
    constructor(private window: WindowRef, @Inject(APP_CONFIG) private appConfig: IAppConfig) {}

    public registerPageTrack (path: string) {
        if (!path) { return; }
        this.window.registerPageTrack(path);
    }

    public registerEventTrack (properties: IGAEventProps) {
        this.window.registerEventTrack(properties);
    }

    public registerSPAEvent (properties: IGAEventProps) {
        const newProps = Object.assign({}, properties, { category: this.appConfig.gtmAppName });
        this.window.registerEventTrack(newProps);
    }

    public registerClientCall (responseCode: number, path: string, responseTime: number) {
        const props: IGAEventProps = {
            action: responseCode,
            category: 'Edge_APICall',
            event: 'timing',
            label: path,
            noninteraction: true,
            value: responseTime
        };
        this.window.registerEventTrack(props);
    }

    public updateGtmContext (orgName?: string, uuid?: string, email?: string) {
        const context = {
            'organization.name': orgName,
            'webapp.name': this.appConfig.gtmAppName,
            'event': 'Push Context'
        };
        if (/^[^@]+@apigee.com/.test(email || '')) {
            context['user.internal'] = 'internal';
        }
        if (uuid) {
            context['user.uuid'] = uuid;
        }
        if (email) {
            context['user.email'] = email;
        }
        this.window.gtmContext(context);
    }
}
