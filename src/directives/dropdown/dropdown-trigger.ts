import { Directive, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';

@Directive({
    selector: '[ueDropdownTrigger]'
})
export class DropdownTriggerDirective {
    
    public clickStream: Observable<MouseEvent> = 
        Observable.fromEvent(this.el.nativeElement, 'click') as Observable<MouseEvent>;
    
    constructor(private el: ElementRef) {}
    
}
