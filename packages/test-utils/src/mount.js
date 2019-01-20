// @flow

import './matches-polyfill'
import './object-assign-polyfill'
import Vue from 'vue'
import VueWrapper from './vue-wrapper'
import createInstance from 'create-instance'
import createElement from './create-element'
import {
  throwIfInstancesThrew,
  addGlobalErrorHandler
} from './error'
import { mergeOptions } from 'shared/merge-options'
import config from './config'
import warnIfNoWindow from './warn-if-no-window'
import createWrapper from './create-wrapper'
import createLocalVue from './create-local-vue'

Vue.config.productionTip = false
Vue.config.devtools = false

export default function mount (
  component: Component,
  options: Options = {}
): VueWrapper | Wrapper {
  warnIfNoWindow()

  addGlobalErrorHandler(Vue)

  const _Vue = createLocalVue(options.localVue)

  const mergedOptions = mergeOptions(options, config)

  const parentVm = createInstance(
    component,
    mergedOptions,
    _Vue
  )

  const el = options.attachToDocument ? createElement() : undefined
  const vm = parentVm.$mount(el).$refs.vm

  component._Ctor = {}

  throwIfInstancesThrew(vm)

  const wrapperOptions = {
    attachedToDocument: !!mergedOptions.attachToDocument,
    sync: mergedOptions.sync
  }

  const root = vm.$options._isFunctionalContainer
    ? vm._vnode
    : vm

  return createWrapper(root, wrapperOptions)
}
