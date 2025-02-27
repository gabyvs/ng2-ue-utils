## [3.9.1](https://github.com/gabyvs/ng2-ue-utils/compare/3.9.0...3.9.1) (2017-04-17)

### Features

* **Client:** Adding X-Apigee-App-Version header to all client calls to identify SPA version that is making the call.
* **GTMService:** Adding webapp.version to GTM context to identify SPA version that is setting GTM events
* **IAppConfig:** Adding optional appVersion to the AppConfig interface. This version is the version that will be used in the previously mentioned features. 
See an example of the full AppConfig object on `src/services/context/app-config.mock.ts` file

**Note:** although IAppConfig.appVersion property is optional now, it might be enforced in future releases. 

### Dependency Changes

* **PhantomJS:** Removing PhantomJS dependency. Now all tests are run against Chrome browser. 

## [3.9.0](https://github.com/gabyvs/ng2-ue-utils/compare/3.8.1...3.9.0) (2017-04-07)

### Features

* **Client:** Adding X-Apigee-App-Id header to all client calls to identify SPA that is making the call.

### Breaking changes for tests and development environment configuration

* **ApiRoutes:** Use `organization` query param in permissions call

The change on the ApiRoutes will break any of your application tests that are mocking permissions response. 
If your application is using a local router (like Nezaldi), depending on the configuration of your routes
you probably would need to change the route for the permissions call there as well. 


## [3.8.1](https://github.com/gabyvs/ng2-ue-utils/compare/3.8.0...3.8.1) (2017-03-29)

### Features

* **GTMService:** Adding specific method for Google Analytics timing events 
* **Notifications:** Logging user visible errors to Google Analytics now includes the current location pathName
* **Client:** Better error parsing, logging malformed errors to Google Analytics

## [3.8.0](https://github.com/gabyvs/ng2-ue-utils/compare/3.7.0...3.8.0) (2017-03-24)

### Features

* **ListHeaders:** Adding support for table markup 

### Bug Fixes
* **Storage:** Fix case where filtering on pattern and field skips falsey values
 
<a name="3.7.0"></a>
## [3.7.0](https://github.com/gabyvs/ng2-ue-utils/compare/3.6.1...3.7.0) (2017-03-17)

### Features

* **ContextHelper:** Reading user context from cookie, supporting jwt for local development. 
* **Client:** Adding X-Requested-With header to all client calls. Tracking all client calls response times to GTM.
* **Notification:** Tracking all user visible errors to GTM.
* **ObservableClient:** Reading user permissions from user calls instead of roles calls.
* **Router:** Exposing new route for user permissions 
 
<a name="3.6.1"></a>
## [3.6.1](https://github.com/gabyvs/ng2-ue-utils/compare/3.6.0...3.6.1) (2017-03-07)

### Features

* **Filtering:** Exposing missing interface for its event emitter. 
* **Pagination:** Exposing missing interface for its event emitter. 
* **ListHeaders:** Exposing missing interface for its event emitter. 

<a name="3.6.0"></a>
## [3.6.0](https://github.com/gabyvs/ng2-ue-utils/compare/3.5.0...3.6.0) (2017-03-07)

### Features

* **GTM:** Adding a service and interfaces to track virtual page views and events to Google Analytics.
 
### Breaking changes

* **Client:** Adding dependency on GTMService, import `GTMService` from `ng2-ue-utils` and add to the `providers` field of your app.module

<a name="3.5.0"></a>
## [3.5.0](https://github.com/gabyvs/ng2-ue-utils/compare/3.4.0...3.5.0) (2017-02-28)

### Features

* **ContextHelper:** Context helper service is now public. You can use this to get context information of the logged in user. 

<a name="3.4.0"></a>
## [3.4.0](https://github.com/gabyvs/ng2-ue-utils/compare/3.3.1...3.4.0) (2017-02-27)

### Features

* **ClientObserver:** New reset method.
* **ModalBase:** More flexible modal.

<a name="3.3.1"></a>
## [3.3.1](https://github.com/gabyvs/ng2-ue-utils/compare/3.3.0...3.3.1) (2017-02-22)

### Changes

* **BaseModal:** Removed hard-coded DOM from base modal header to make it more flexible.  Implemented instead in the **Modal** component.

<a name="3.3.0"></a>
## [3.3.0](https://github.com/gabyvs/ng2-ue-utils/compare/3.2.0...3.3.0) (2017-02-21)

### Features

* **BaseModal:** A more flexible modal which allows consumers to define contents via transcludes and emits when the modal closes.
* **Modal:** Refactored Modal to use the new BaseModal.  Added optional input `cancelLabel` for defining the text content of the cancel button.

<a name="3.2.0"></a>
## [3.2.0](https://github.com/gabyvs/ng2-ue-utils/compare/3.1.2...3.2.0) (2017-02-17)

### Features

* **ClientObserver:** Now accepts a path returns the path to the reported events as part of the interface IClientEvent. 
* **IClientEvent:** Now includes path for all HTTP call events. In case of an HTTP error it also includes the original error object. 

<a name="3.1.2"></a>
## [3.1.2](https://github.com/gabyvs/ng2-ue-utils/compare/3.1.1...3.1.2) (2017-02-15)

### Bug Fixes

* **Tooltip:** Added missing styles.  Tooltip component content now has `overflow-wrap: break-word;` in order to handle very long content with no line breaks.

<a name="3.1.1"></a>
## [3.1.1](https://github.com/gabyvs/ng2-ue-utils/compare/3.1.0...3.1.1) (2017-02-15)

### Bug Fixes

* **Tooltip:** Added missing styles.  Tooltip component content now has `z-index` of 10 and initializes to `top: 0; left: 0;`. 

<a name="3.1.0"></a>
## [3.1.0](https://github.com/gabyvs/ng2-ue-utils/compare/3.0.0...3.1.0) (2017-02-03)

### Changes
* **Ng2-Bootstrap:** This peer dependency has been removed.  You may continue to use it in your applications, but it is no longer required. 

### Features
* **Dropdown** Added a dropdown directives which can be used in the same way as the ones in ng2-bootstrap, which has been removed as a required dependency.
* **Tooltip** Added tooltip attribute directive, along with component and service.  See source files for usage documentation.  Now using new tooltip in value-handler component.

<a name="3.0.0"></a>
## [3.0.0](https://github.com/gabyvs/ng2-ue-utils/compare/2.1.2...3.0.0) (2016-12-05)

### Breaking Changes
* **ClientObserver** Removed `observe()` method and made this class injectable so components can directly access its new `clientEvents` stream. Checkout the example in the comments of the file clientObserver.ts
* **Repository** Removed `observe()` method. Since`ClientObserver` is now injectable, users should inject it and access its publicly exposed `clientEvents` stream.
* **ObservableClient** Removed `observe()` method. Since`ClientObserver` is now injectable, users should inject it and access its publicly exposed `clientEvents` stream.
* **ClientMock** Now get/post/put/delete methods run asynchronously. If you had tests that used the mock and were relying on it being synchronous, they will break.

### Features
* **ObservableClient** Dependency on `ClientObserver` now optional.  If provided, will provide event stream to spy on network calls
* **ObservableClientBase** Split base functionality of `ObservableClient` into a base class which has no dependency on `ContextService` (via `ApiRoutes`).  This is useful if you want to use the `ClientObserver`, but will not be using `Repository` (it requires `ObservableClient`) or `ApiRoutes`.
* **Progress/ProgressService** By default, progress bar does not restart on each ajax call.  
* **Progress/ProgressService** Added optional `restartOnAjax` attribute which, when passed, restarts the progress bar on each spied call.  This affords you complete control over the progress bar by filtering the client events which are sent to the `ProgressService` in your app.
* **ContextService** Added public `userEmail` getter. 

### Bug Fixes
* **Client** Fix bug where an empty string as response body would cause JS error.

<a name="2.1.2"></a>
## [2.1.2](https://github.com/gabyvs/ng2-ue-utils/compare/2.1.1...2.1.2) (2017-01-26)

### Bug Fixes

* **HintScroll:** Some browsers where showing scrolls even when they were not needed. 

<a name="2.1.1"></a>
## [2.1.1](https://github.com/gabyvs/ng2-ue-utils/compare/2.1.0...2.1.1) (2016-12-06)

### Improvements

* **datepicker:** Improves accessibility by adding new styles to datepicker and datepicker wrapper.

<a name="2.1.0"></a>
## [2.1.0](https://github.com/gabyvs/ng2-ue-utils/compare/2.0.0...2.1.0) (2016-12-05)

### Improvements

* **datepicker:** Now contains new date/range picker component.
 
<a name="2.0.0"></a>
## [2.0.0](https://github.com/gabyvs/ng2-ue-utils/compare/1.10.1...2.0.0) (2016-10-31)

### Breaking Changes

* **All:** Now components library only works with Angular 2.1.2
 
<a name="1.10.1"></a>
## [1.10.1](https://github.com/gabyvs/ng2-ue-utils/compare/1.10.0...1.10.1) (2016-10-20)

### Bug Fixes

* **Context Service:** Forcing redirection to no-org.
 
<a name="1.10.0"></a>
## [1.10.0](https://github.com/gabyvs/ng2-ue-utils/compare/1.9.0...1.10.0) (2016-10-20)

### Changes

* **Context Service:** This service has changed its redirection logic. 

Previously context service looked for the organization in the URL, then in Local Storage, and finally in the organizations that the user had access to.
Now if the organization is not in the URL nor in Local Storage, it will redirect to the new no-organization page `/no-org`. 

<a name="1.9.0"></a>
## [1.9.0](https://github.com/gabyvs/ng2-ue-utils/compare/1.8.0...1.9.0) (2016-10-14)

### Features

* **pagination:** directive now does not show semi empty string when there are no elements to paginate over. It also accepts parameter `emptyMessage` that let users configure a message for empty collection.

### Breaking Changes

* **notification:** Position on the window has been removed from component styles. 
* **progress:** Position on the window has been removed from component styles.

Previously these components included their position fixed in the window (top 56px).
Now the position must be provided by the consumer if it's different than the position of the parent element,
otherwise it will take position top 0 from the parent element.

<a name="1.8.0"></a>
## [1.8.0](https://github.com/gabyvs/ng2-ue-utils/compare/1.7.1...1.8.0) (2016-10-13)

### Features

* **toogle-on-hover:** directive now accepts parameter `showToggle` with values `style` or `class` that let users select how the directive will hide/show sub elements.

* **notification:** A class icon prefix can be used. This allows to use _Fontawesome_ instead of _glyphicons_.

### Bug Fixes

* **notification:** Coming soon message was removed.

<a name="1.7.1"></a>
## [1.7.1](https://github.com/gabyvs/ng2-ue-utils/compare/1.7.0...1.7.1) (2016-10-06)

### Bug Fixes

* **value-handler:** Listening to escape keyup event to cancel changes on the input field.