# ng2-ue-utils
Set of angular2 components, directives, pipes and services that will be shared among unified experience SPAs.

## Install from npm

```bash
npm i ng2-bootstrap --save
```

## Prerequisites

This package is intended to be used only in Angular2/Webpack projects. The following tools are set as peer dependencies:

* @angular/common: 2.0.0-rc.4
* @angular/compiler: 2.0.0-rc.4
* @angular/core: 2.0.0-rc.4
* @angular/forms: 0.2.0
* bootstrap: ^3.3.6
* es6-shim: ^0.35.0
* lodash: 4.13.1
* moment: ^2.13.0
* ng2-bootstrap: ^1.0.17
* reflect-metadata: ^0.1.3
* rxjs: 5.0.0-beta.10
* zone.js: ^0.6.12

## Usage

Update your component definition to have following content:

```ts
import { DateMomentPipe, LoadingDots } from 'ng2-ue-utils';
```

And use the library components, directives, pipes and services as you regularly do

``` ts
@Component({
  selector: 'my-component',
  directives: [LoadingDots],
  pipes: [DateMomentPipe],
  template: `<span>{{ timestamp | dateMoment }}</span><loading-dots></loading-dots>`
})
export class MyComponent {
}
```

And you are ready to go! :)

## What's included

### Components

* Loading dots

### Pipes

* DateMomentPipe
