import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const echoLinkTheme = {
    dark: false,
    colors: {
        background: '#f8f8f8',      // Warm paper background
        surface: '#ffffff',         // Clean white surface
        'surface-bright': '#ffffff', // Bright white surface
        'surface-light': '#fcfaf7',  // Slightly warm white
        'surface-variant': '#d3c5b6', // Warm gray variant
        'on-surface-variant': '#2c1810', // Dark warm brown for text
        primary: '#825d4d',         // Warm brown primary
        'primary-darken-1': '#5d3f33', // Darker warm brown
        secondary: '#9b8574',       // Muted warm taupe
        'secondary-darken-1': '#766354', // Darker taupe
        error: '#c64343',          // Muted red for errors
        info: '#617b9c',           // Muted blue for info
        success: '#687c58',        // Muted green for success
        warning: '#c99a3c',        // Warm amber for warnings
    },
    variables: {
        'border-color': '#2c1810',  // Dark warm brown
        'theme-kbd': '#f4f1ea',     // Keyboard key background
        'theme-on-kbd': '#2c1810',  // Text on keyboard key
        'theme-code': '#f8f5f0',    // Code block background
        'theme-on-code': '#2c1810', // Code text color
    }
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
