<a name="1.9.0"></a>
## [1.9.0](https://github.com/gabyvs/ng2-ue-utils/compare/1.9.0...1.8.0) (2016-10-14)

### Improvements

* **pagination:** directive now does not show semi empty string when there are no elements to paginate over. It also accepts parameter `emptyMessage` that let users configure a message for empty collection.

### Breaking Changes

* **notification:** Position on the window has been removed from component styles. 
* **progress:** Position on the window has been removed from component styles.

Previously these components included their position fixed in the window (top 56px).
Now the position must be provided by the consumer if it's different than the position of the parent element,
otherwise it will take position top 0 from the parent element.

<a name="1.8.0"></a>
## [1.8.0](https://github.com/gabyvs/ng2-ue-utils/compare/1.8.0...1.7.1) (2016-10-13)

### Improvements

* **toogle-on-hover:** directive now accepts parameter `showToggle` with values `style` or `class` that let users select how the directive will hide/show sub elements.

* **notification:** A class icon prefix can be used. This allows to use _Fontawesome_ instead of _glyphicons_.

### Bug Fixes

* **notification:** Coming soon message was removed.

<a name="1.7.1"></a>
## [1.7.1](https://github.com/gabyvs/ng2-ue-utils/compare/1.7.0...1.7.1) (2016-10-06)

### Bug Fixes

* **value-handler:** Listening to escape keyup event to cancel changes on the input field.