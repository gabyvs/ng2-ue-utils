[![Build Status](https://travis-ci.org/gabyvs/ng2-ue-utils.svg?branch=master)](https://travis-ci.org/gabyvs/ng2-ue-utils)
[![npm version](https://badge.fury.io/js/ng2-ue-utils.svg)](https://badge.fury.io/js/ng2-ue-utils)

# ng2-ue-utils
Set of angular2 components, directives, pipes and services that will be shared among unified experience SPAs.

## To use it as a dependency

### Install from npm

```bash
npm install ng2-ue-utils --save
```

### Prerequisites

This package is intended to be used only in Angular2/Webpack projects. The following tools are set as peer dependencies:

* @angular/common: 2.1.2
* @angular/compiler: 2.1.2
* @angular/core: 2.1.2
* @angular/forms: 2.1.2
* @angular/http: 2.1.2
* @angular/platform-browser: 2.1.2
* @angular/platform-browser-dynamic: 2.1.2
* @angular/router: 3.1.2
* bootstrap: ^3.3.7
* es6-shim: ^0.35.1
* lodash: 4.16.4
* moment: ^2.15.2
* ng2-bootstrap: ^1.1.16
* reflect-metadata: ^0.1.8
* rbac-abacus: "^0.1.0",
* rxjs: ^5.0.0-beta.12
* zone.js: ^0.6.26

### Usage

In your app.module or feature.module import Ng2UEUtilsModule and make all relevant services available for injection

```
import { 
    APP_CONFIG,
    ContextService,
    Client,
    ClientObserver,
    ContextService,
    IAppConfig,
    NotificationService,
    ProgressService,
    WindowRef,
    Ng2UEUtilsModule } from 'ng2-ue-utils';
    
    .
    . more imports
    .
    
const appConfig: IAppConfig = {
    apiBasePath: 'myProduct',
    appBasePath: 'myProduct',
    gtmAppName: 'myProduct'
};

@NgModule({
    bootstrap:    [ AppComponent ],
    declarations: [
        AppComponent,
        MyComponent
    ],
    imports:      [
        BrowserModule,
        HttpModule,
        Ng2UEUtilsModule,
        RouterModule.forRoot(appLocalRoutes)
    ],
    providers: [
       Client,
       ClientObserver,
       ContextService,
       NotificationService,
       MyProductClient,
       MyProductRepository,
       MyProductStorage,
       MyProductsApiRoutes,
       ProgressService,
       Location,
       WindowRef,
       { provide: APP_CONFIG, useValue: appConfig }
    ]
})
export class AppModule {}
```

Use the library components, directives and pipes as you regularly do

``` ts
@Component({
  selector: 'my-component',
  template: `<span>{{ timestamp | dateMoment }}</span><loading-dots></loading-dots>`
})
export class MyComponent {
}
```

Update your component definition file to have service or interface types available

```ts
import { ContextService, IAppConfig } from 'ng2-ue-utils';
```

And you are ready to go! :)

### What's included

#### Components

* Filtering
* Hint scroll
* Loading dots
* Modal
* Notification
* Pagination
* Progress bar
* Value handler
* Date Picker

####Directives

* Toggle on hover
* Focus on init

#### Pipes

* Date moment
* From now

#### Services

* ApiRoutes
* Client
* ClientObserver
* Context
* ObservableClient
* ObservableClientBase
* Repository
* Storage
* ValueStorage

Unfortunately, not all services are documented yet.
Client and Context are intended to help an SPA making client calls and getting the org and user context in which the SPA is being used.
Router helps as a single point for routes being built according to the context. It includes some shared routes/route templates that all the ALM UE SPAs are using.
Repository and Storage are intended to help a listing page to handle storage and manipulation of the objects. 

**Note** You may not need or want to use all of these services.
For instance, if your application is logically scoped by the user context, you may not want the Apigee/Google Edge `organization`-scoped methods built into the `ObservableClient` -
in such case you might do better by using either `ObservableClientBase` or the `Client` itself, depending on the feature set you require of them.

The best way to see how to integrate these resources is to have a look at the [getting started guide](https://revision.aeip.apigee.net/alm/getting-started) one of the SPAs that are using them. 
For example, [alm-apps](https://revision.aeip.apigee.net/alm/alm-apps), [alm-developers](https://revision.aeip.apigee.net/oponce/alm-developers), [alm-products](https://revision.aeip.apigee.net/alm/alm-products), [proxies](https://revision.aeip.apigee.net/alm/proxies) or [alm-orgHistory](https://revision.aeip.apigee.net/alm/alm-orgHistory).  

## To run in development mode

This is a TypeScript/Angular2 project and its NPM root will be the directory were you cloned the repo and
where this README file is located. All `npm` commands are expected to be used at this _root_ directory.

### Setting up your environment

* If you don't have it, install or update NodeJS 6.x
* Install Typings (npm -g install typings)
* Clone this repository and run

```bash
npm install
typings install
```

Start the demo app by running (will use ports 8080 and 3000 by default)
```bash
npm start
```
This will start webpack devserver and a node server too. Go to localhost:3000 to see the demo app running in your machine.

### Running tests

Run tests locally by running
```bash
npm test
```

or for debugging tests
```bash
npm run test:debug
```

### Contributing
Create a feature branch. In `/src`, find the appropriate directory for your new component(or directive/pipe/service)
and create a new directory there.

Include your source code and any applicable tests. Document usage instructions for your
component in the source code. Ensure tests pass. Exclude your tests files on the file `/tsconfig.json` inside the root folder
 of this project so your tests are not transpiled in later stages.

If you are adding a component, directive or pipe, declare and export it in ng2-ue-utils.module.ts

For any new class, type or interface that you create, extend `index.ts` in root with your new types.

At this point you might want to test your changes locally in an existing project. Follow instructions in the next section for that.

Add your changes in the `CHANGELOG.md` file in the root of this project categorized as Features, bug fixes, breaking changes, dependency changes.

If you created a visual component, extend demo.html with implementation of your component and
run `npm run build:ghp` to update Github demo page when your commit reaches master branch.

Generate a merge request from your branch to develop branch.
After the merge request is accepted, the team will publish a new version of the library to npm.

### Testing the components into another project locally

Build this repo into a tarball file that you can install in another project locally so you can test your changes in action.

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

## For pushing to NPM (to be done by contributors to NPM project only) 

Once a new version is ready in master branch with a version number bumped from previous version and changes included in the changelog file:
- Create a new release with the same version number included in the package.json file. You can add the same content added to the changelog in the description of the release
- Run `npm run build`. This will generate distribution files inside `build` folder
- Run `npm publish`. This will push the distribution file to npm project
