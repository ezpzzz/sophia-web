import ChatWidget from './components/ChatWidget'
import VTooltip from 'v-tooltip'

import 'v-tooltip/dist/v-tooltip.css'

import emitter from './emitter'

const defaultComponentName = 'BeautifulChat'

const VueBeautifulChat = {
  install(app, options = {}) {
    /**
     * Makes sure that plugin can be installed only once
     */
    if (this.installed || app.prototype && app.prototype.$isServer) {
      return
    }

    this.installed = true
    app.config.globalProperties.$event = emitter

    this.componentName = options.componentName || defaultComponentName

    app.component(this.componentName, ChatWidget)
    app.use(VTooltip)
  }
}

export default VueBeautifulChat
