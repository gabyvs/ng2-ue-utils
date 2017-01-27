import { Component } from '@angular/core';

@Component({
    selector: 'app',
    template: `
        <h1>Demo App for Angular2 Unified Experience Utilities</h1>
        <router-outlet></router-outlet>
        <ue-tooltip></ue-tooltip>
    `
})
export class AppComponent {}
