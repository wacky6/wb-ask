import superagent from 'superagent'
import superagentPromise from 'superagent-promise'

export default function installPlugins(Vue, options) {
  Vue.prototype.$agent = superagentPromise(superagent, Promise)
}
