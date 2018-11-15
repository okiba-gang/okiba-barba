import {BaseView, Dispatcher} from 'barba.js'
import Component from '@okiba/component'
import {mixin} from '@okiba/class-utils'

export class BarbaPage {
  constructor({namespace, ui, components, transitions = {}}) {
    this.namespace = namespace
    this.transitions = transitions
    this.bindings = {ui, components}

    BaseView.init.call(this)
  }

  initComponent() {
    mixin(Component, this, {
      ...this.bindings,
      el: this.container
    })

    if (this._isComponentinit) return
    this._isComponentinit = true

    const self = this
    Dispatcher.on('transitionCompleted',
      (_, oldStatus) => {
        if (oldStatus && oldStatus.namespace === this.namespace) {
          self.destroy()
        }
      }
    )
  }

  onEnter() {}
  onEnterCompleted() {}
  onLeave() {}
  onLeaveCompleted() {}
}

import {HistoryManager, Pjax, Prefetch} from 'barba.js'

function getTransition(pages, defaultTransition) {
  const { namespace } = HistoryManager.prevStatus()
  const { url } = HistoryManager.currentStatus()
  const { transitions } = pages[namespace]

  const pageName = url.replace(/(#.*|\?.*)/, '')
  return transitions[pageName] || transitions.default || defaultTransition
}

export function setupBarba(pages, defaultTransition) {
  Pjax.getTransition = function() {
    return getTransition(pages, defaultTransition)
  }

  Pjax.start()
  Prefetch.init()
}
