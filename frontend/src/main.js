// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'vuetify/dist/vuetify.min.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import VueNativeSock from 'vue-native-websocket'
import Default from "./layouts/Default.vue"
import Config from "./layouts/Config.vue"

toastr.options.closeButton = true;

const requireComponent = require.context(
    // The relative path of the components folder
    './components',
    // Whether or not to look in subfolders
    false,
    // The regular expression used to match base component filenames
    /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
    // Get component config
    const componentConfig = requireComponent(fileName)

    // Get PascalCase name of component
    const componentName = upperFirst(
        camelCase(
            // Gets the file name regardless of folder depth
            fileName
            .split('/')
            .pop()
            .replace(/\.\w+$/, '')
        )
    )

    // Register component globally
    Vue.component(
        componentName,
        // Look for the component options on `.default`, which will
        // exist if the component was exported with `export default`,
        // otherwise fall back to module's root.
        componentConfig.default || componentConfig
    )
})


Vue.component('Default-Layout', Default)
Vue.component('Config-Layout', Config)
Vue.use(Vuelidate)

if (process.env.NODE_ENV == 'development') {
    Vue.use(VueNativeSock, `ws://${window.location.hostname}/websocket/status`, {
        reconnection: true, // (Boolean) whether to reconnect automatically (false)
        reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
        reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
    })
} else {
    Vue.use(VueNativeSock, `wss://${window.location.hostname}/websocket/status`, {
        reconnection: true, // (Boolean) whether to reconnect automatically (false)
        reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
        reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
    })
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    vuetify,
    template: '<App/>'
})