import '@unocss/reset/tailwind.css'
import 'floating-vue/dist/style.css'
import 'markdown-it-github-alerts/styles/github-colors-light.css'
import 'markdown-it-github-alerts/styles/github-colors-dark-class.css'
import 'markdown-it-github-alerts/styles/github-base.css'
import '@shikijs/twoslash/style-rich.css'
import 'shiki-magic-move/style.css'
import './styles/main.css'
import './styles/prose.css'
import './styles/markdown.css'

import 'uno.css'

import { routes } from 'vue-router/auto-routes'
import NProgress from 'nprogress'
import { ViteSSG } from 'vite-ssg'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat.js'
import { setupRouterScroller } from 'vue-router-better-scroller'
import FloatingVue from 'floating-vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'
import App from './App.vue'

const MyPreset = definePreset(Lara, {
  semantic: {
    // primary: {
    //   50: '{black.50}',
    //   100: '{black.100}',
    //   200: '{black.200}',
    //   300: '{black.300}',
    //   400: '{black.400}',
    //   500: '{black.500}',
    //   600: '{black.600}',
    //   700: '{black.700}',
    //   800: '{black.800}',
    //   900: '{black.900}',
    //   950: '{black.950}',
    // },
  },
})

export const createApp = ViteSSG(
  App,
  {
    routes,
  },
  ({ router, app, isClient }) => {
    dayjs.extend(LocalizedFormat)

    app.use(FloatingVue)
    app.use(createPinia())
    app.use(PrimeVue, {
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark',
        },
      },
    })

    if (isClient) {
      const html = document.querySelector('html')!
      setupRouterScroller(router, {
        selectors: {
          html(ctx) {
            // only do the sliding transition when the scroll position is not 0
            // Disable sliding transition on Dev Mode
            if (ctx.savedPosition?.top || import.meta.hot)
              html.classList.add('no-sliding')
            else
              html.classList.remove('no-sliding')
            return true
          },
        },
        behavior: 'auto',
      })

      router.beforeEach(() => {
        NProgress.start()
      })
      router.afterEach(() => {
        NProgress.done()
      })
    }
  },
)
