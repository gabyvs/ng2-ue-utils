import { Injectable }                   from '@angular/core';
import { Observable, BehaviorSubject }  from 'rxjs';
import { IClientEvent }                 from '../../services/client/clientObserver';

/**
 * This service is used alongside the Progress component provided in this library to indicate that an SPA event is in 
 * progress (e.g. an ajax call has been sent and it is in-flight). If you are using the ClientObserver from this library
 * to spy on your calls, its public `clientEvents` stream can be used as the input to this service's `notify` method 
 * to easily display your calls' progress in the UI.
 *
 * ### Simple Example
 *
 * To use it on your SPA:
 *
 * Add it to your app module so it can be injected on your components
 * ```
 * @NgModule({
 *   bootstrap:     [ AppComponent ],
 *   declarations:  [ AppComponent ],
 *   imports:       [ Ng2UEUtilsModule ],
 *   providers:     [ ProgressService, ClientObserver ]
 * })
 * ```
 *
 * And in your component
 * ```
 * import { ProgressService, IClientEvent, ClientEvent, ClientMethod } from 'ng2-ue-utils';
 *
 * @Component({
 *     selector: 'my-content',
 *     template: template
 * })
 * class MyContent {
 *
 *     constructor(private progressService: ProgressService, private spy: ClientObserver){}
 *
 *     // Use with ClientObserver
 *     private subscribeToServerCallsEvents () {
 *       this.spy.clientEvents
 *          .filter(status => status.event !== 'next')
 *          .subscribe((event: IClientEvent) => {
 *               this.progressService.notify(event);
 *           });
 *     }
 *
 *     // Use without ClientObserver
 *     private updateProgressBarManually(event: string, method: string, stackCount: number){
 *         const event: IClientEvent = {
 *             event: event as ClientEvent,
 *             method: method as ClientMethod,
 *             stackCount: number // This should be a zero if no pending calls, so progress can be shown as finished.
 *         }
 *         this.progressService.notify(event);
 *     }
 * }
 * ```
 */

@Injectable()
export class ProgressService {
    
    private observer: BehaviorSubject<IClientEvent> = new BehaviorSubject(undefined);

    public observe$: Observable<IClientEvent> = this.observer.asObservable();

    public notify (event: IClientEvent) {
        this.observer.next(event);
    }
}
