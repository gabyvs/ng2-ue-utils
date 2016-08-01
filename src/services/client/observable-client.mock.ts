import { Observable, Subject } from 'rxjs/Rx';

import { IClientEvent } from './clientObserver';

export class ObservableClientMock {
    public emitter: Subject<IClientEvent> = new Subject<IClientEvent>();

    public observe = (): Observable<IClientEvent> => Observable.from<IClientEvent>(this.emitter);
}
