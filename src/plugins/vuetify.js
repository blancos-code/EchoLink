import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const echoLinkTheme = {
    dark: false,
    colors: {
        background: '#f8f8f8',
        primary: '#2196F3',
    },
}

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'echoLinkTheme',
        themes: {
            echoLinkTheme,
        },
    },
})
