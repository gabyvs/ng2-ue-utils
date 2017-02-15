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