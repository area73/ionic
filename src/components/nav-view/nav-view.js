import {DynamicComponent, Parent, NgElement} from 'angular2/angular2'
import {Optional} from 'angular2/src/di/annotations'
import {NavViewport} from 'ionic2/components/nav-viewport/nav-viewport'
import {Tab} from 'ionic2/components/tabs/tab'
import {PrivateComponentLoader} from 'angular2/src/core/compiler/private_component_loader'
import {PrivateComponentLocation} from 'angular2/src/core/compiler/private_component_location'

@DynamicComponent({
  selector: '.nav-view',
  bind: {
    item: 'item'
  }
})
export class NavView {
  constructor(
    loader: PrivateComponentLoader,
    location: PrivateComponentLocation,
    @NgElement() element: NgElement,

    // FIXME: this is temporary until ng2 lets us inject tabs as a NavViewport
    @Optional() @Parent() viewportNav: NavViewport,
    @Optional() @Parent() viewportTab: Tab
  ) {
    this.loader = loader
    this.location = location
    this.viewport = viewportTab || viewportNav
    this.domElement = element.domElement
  }

  set item(navItem) {
    if (this.initialized) return;
    this.initialized = true;
    this.loader.load(navItem.Class, this.location).then(instance => {
      navItem.finishSetup(this, instance)
    })
  }

  /**
   * Push out of this view into another view
   */
  push(Class: Function, opts = {}) {
    return this.viewport.push(Class, opts)
  }

  /**
   * Go back
   */
  pop() {
    return this.viewport.pop()
  }

  popTo(index: Number) {
    if (this._stack.length < index + 1) return
    while (tab._stack.length > index + 1) {
      tab.pop({ sync: true }) // pop with no animation
    }
    return tab.pop() //pop last one with animation
  }
}

/*
beforePush()
beforePop()
beforeReenter()
beforePushedOut()

beforeEnter()
afterEnter()
beforeLeave()
afterLeave()

splitView:

 beforeEnter: setup this view as the side view, next view in main area.

 - any time a push happens in this view, bring the new component into the main view.
 - any time a pop happens in this view, actually pop the stack (if we can).

 any time a push happens in the main view, act normally.
 the main view thinks it is the first component in the stack (does it have its own nav-viewport?)
 */