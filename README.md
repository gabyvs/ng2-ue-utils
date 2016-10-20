[![Build Status](https://travis-ci.org/gabyvs/ng2-ue-utils.svg?branch=master)](https://travis-ci.org/gabyvs/ng2-ue-utils)
[![npm version](https://badge.fury.io/js/ng2-ue-utils.svg)](https://badge.fury.io/js/ng2-ue-utils)

# ng2-ue-utils
Set of angular2 components, directives, pipes and services that will be shared among unified experience SPAs.

## Install from npm

```bash
npm install ng2-ue-utils --save
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

* Filtering
* Hint scroll
* Loading dots
* Modal
* Notification
* Pagination
* Progress bar
* Value handler

### Directives

* Toggle on hover
* Focus on init

### Pipes

* Date moment
* From now

### Services

* Client
* Context
* Router
* Repository
* Storage

Unfortunately, services are not yet documented.
Client and Context are intended to help an SPA making client calls and getting the org and user context in which the SPA is being used.
Router helps as a single point for routes being built according to the context. It includes some shared routes/route templates that all the ALM UE SPAs are using.
Repository and Storage are intended to help a listing page to handle storage and manipulation of the objects. 

For now the best way to see how they integrate is to take a look at one of the SPAs that are using them. 
For example, alm-apps, alm-developers, alm-products or alm-orgHistory.  

## Running demo page locally

Clone the repository and run
```bash
npm install
```

Start the demo app by running (will use ports 8080 and 3000 by default)
```bash
npm start
```
This will start webpack devserver and a node server too. Go to localhost:3000 to see the demo app running in your machine.

## Running tests

Run tests locally by running
```bash
npm test
```

or for debugging tests
```bash
npm run test:debug
```

## Testing the components into another project locally

For creating the distribution files
```bash
npm run build
```
This will create a build folder in the root folder and store the transpiled javascript files and source maps there.

Test your changes on another project by creating a tarball
```bash
npm pack
```
This will generate a .tgz file in the root folder. 

In your other project, use the following command to install the tarball: (note - delete this repo's source files in `node_modules` before installing from tarball, if already present)
```bash
npm install /path/to/ng2-ue-utils-someversion.tgz
```
And you will be ready to use it locally!

## Contributing
Create a feature branch. In `/src`, find the appropriate directory for your new component(or directive/pipe/service)
and create a new directory there.

Include your source code and any applicable tests. Ensure tests pass.  Document usage instructions for your
component in the source code.

Extend demo.html with implementation of your component.

Extend `index.js` and `index.d.ts` in root with your component.

Build this repo into a tarball and run it locally in your other project using the directions above to verify implementation.

Generate a merge request from your branch to develop branch.
After the merge request is accepted, the team will publish a new version of the library to npm.
