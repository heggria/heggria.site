import { basename, dirname, resolve } from 'node:path'
import { Buffer } from 'node:buffer'
import { defineConfig } from 'vite'
import fs from 'fs-extra'
import Inspect from 'vite-plugin-inspect'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import Vue from '@vitejs/plugin-vue'
import matter from 'gray-matter'
import AutoImport from 'unplugin-auto-import/vite'
import anchor from 'markdown-it-anchor'
import LinkAttributes from 'markdown-it-link-attributes'
import GitHubAlerts from 'markdown-it-github-alerts'
import UnoCSS from 'unocss/vite'
import SVG from 'vite-svg-loader'
import MarkdownItShiki from '@shikijs/markdown-it'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'
import MarkdownItMagicLink from 'markdown-it-magic-link'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Exclude from 'vite-plugin-optimize-exclude'
import { VitePluginRadar } from 'vite-plugin-radar'

// @ts-expect-error missing types
import TOC from 'markdown-it-table-of-contents'
// import sharp from 'sharp'
import { slugify } from './scripts/slugify'

const promises: Promise<any>[] = []

export default defineConfig({
  resolve: {
    alias: [
      { find: '~/', replacement: `${resolve(__dirname, 'src')}/` },
    ],
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'dayjs',
      'dayjs/plugin/localizedFormat',
    ],
  },
  plugins: [
    UnoCSS(),

    VueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'pages',
      logs: true,
      extendRoute(route) {
        const path = route.components.get('default')
        if (!path)
          return

        if (!path.includes('projects.md') && path.endsWith('.md')) {
          const { data } = matter(fs.readFileSync(path, 'utf-8'))
          route.addToMeta({
            frontmatter: data,
          })
        }
      },
    }),

    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Markdown({
      wrapperComponent: id => id.includes('/demo/')
        ? 'WrapperDemo'
        : 'WrapperPost',
      wrapperClasses: (id, code) => code.includes('@layout-full-width')
        ? ''
        : 'prose m-auto slide-enter-content',
      headEnabled: true,
      exportFrontmatter: false,
      exposeFrontmatter: false,
      exposeExcerpt: false,
      markdownItOptions: {
        quotes: '""\'\'',
      },
      async markdownItSetup(md) {
        md.use(await MarkdownItShiki({
          themes: {
            dark: 'vitesse-dark',
            light: 'vitesse-light',
          },
          defaultColor: false,
          cssVariablePrefix: '--s-',
          transformers: [
            transformerTwoslash({
              explicitTrigger: true,
              renderer: rendererRich(),
            }),
          ],
        }))

        md.use(anchor, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: () => ({ 'aria-hidden': 'true' }),
          }),
        })

        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })

        md.use(TOC, {
          includeLevel: [1, 2, 3, 4],
          slugify,
          containerHeaderHtml: '<div class="table-of-contents-anchor"><div class="i-ri-menu-2-fill" /></div>',
        })

        md.use(MarkdownItMagicLink, {
          linksMap: {
            'NuxtLabs': 'https://nuxtlabs.com',
            'Vitest': 'https://github.com/vitest-dev/vitest',
            'Slidev': 'https://github.com/slidevjs/slidev',
            'VueUse': 'https://github.com/vueuse/vueuse',
            'UnoCSS': 'https://github.com/unocss/unocss',
            'Elk': 'https://github.com/elk-zone/elk',
            'Type Challenges': 'https://github.com/type-challenges/type-challenges',
            'Vue': 'https://github.com/vuejs/core',
            'Nuxt': 'https://github.com/nuxt/nuxt',
            'Vite': 'https://github.com/vitejs/vite',
            'Shiki': 'https://github.com/shikijs/shiki',
            'Twoslash': 'https://github.com/twoslashes/twoslash',
            'ESLint Stylistic': 'https://github.com/eslint-stylistic/eslint-stylistic',
            'Unplugin': 'https://github.com/unplugin',
            'Nuxt DevTools': 'https://github.com/nuxt/devtools',
            'Vite PWA': 'https://github.com/vite-pwa',
            'i18n Ally': 'https://github.com/lokalise/i18n-ally',
            'ESLint': 'https://github.com/eslint/eslint',
            'Astro': 'https://github.com/withastro/astro',
            'React': 'https://github.com/meta/react',
            'TwoSlash': 'https://github.com/twoslashes/twoslash',
            'Heggria Collective': { link: 'https://opencollective.com/antfu', imageUrl: 'https://github.com/antfu-collective.png' },
            'Netlify': { link: 'https://netlify.com', imageUrl: 'https://github.com/netlify.png' },
            'Stackblitz': { link: 'https://stackblitz.com', imageUrl: 'https://github.com/stackblitz.png' },
            'Vercel': { link: 'https://vercel.com', imageUrl: 'https://github.com/vercel.png' },
          },
          imageOverrides: [
            ['https://github.com/vuejs/core', 'https://vuejs.org/logo.svg'],
            ['https://github.com/nuxt/nuxt', 'https://nuxt.com/assets/design-kit/icon-green.svg'],
            ['https://github.com/nuxt/nuxt', 'https://nuxt.com/assets/design-kit/icon-green.svg'],
            ['https://github.com/vitejs/vite', 'https://vitejs.dev/logo.svg'],
            ['https://github.com/sponsors', 'https://github.com/github.png'],
            ['https://github.com/sponsors/antfu', 'https://github.com/github.png'],
            ['https://nuxtlabs.com', 'https://github.com/nuxtlabs.png'],
            ['https://github.com/meta/react', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PGcgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9IiMyNDI5MzgiIHJ4PSI2MCIvPjxwYXRoIGZpbGw9IiMwMGQ4ZmYiIGQ9Ik0xMjguMDAxIDE0Ni45NTFjMTAuMzA0IDAgMTguNjU2LTguMzUzIDE4LjY1Ni0xOC42NTZzLTguMzUyLTE4LjY1Ni0xOC42NTYtMTguNjU2cy0xOC42NTYgOC4zNTMtMTguNjU2IDE4LjY1NnM4LjM1MyAxOC42NTYgMTguNjU2IDE4LjY1NiIvPjxwYXRoIHN0cm9rZT0iIzAwZDhmZiIgc3Ryb2tlLXdpZHRoPSI4LjkxIiBkPSJNMTI4LjAwMiA5MC4zNjNjMjUuMDQ4IDAgNDguMzE3IDMuNTk0IDY1Ljg2MiA5LjYzNUMyMTUuMDAzIDEwNy4yNzUgMjI4IDExOC4zMDYgMjI4IDEyOC4yOTVjMCAxMC40MDktMTMuNzc0IDIyLjEyOC0zNi40NzUgMjkuNjQ5Yy0xNy4xNjIgNS42ODYtMzkuNzQ2IDguNjU0LTYzLjUyMyA4LjY1NGMtMjQuMzc4IDAtNDcuNDYzLTIuNzg2LTY0LjgxOS04LjcxN0M0MS4yMjUgMTUwLjM3NiAyOCAxMzguNTA2IDI4IDEyOC4yOTVjMC05LjkwOCAxMi40MS0yMC44NTQgMzMuMjUyLTI4LjEyYzE3LjYxLTYuMTQgNDEuNDUzLTkuODEyIDY2Ljc0Ni05LjgxMnoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIHN0cm9rZT0iIzAwZDhmZiIgc3Ryb2tlLXdpZHRoPSI4LjkxIiBkPSJNOTQuOTgxIDEwOS40MzhjMTIuNTE0LTIxLjY5OCAyNy4yNTEtNDAuMDYgNDEuMjQ5LTUyLjI0YzE2Ljg2NC0xNC42NzcgMzIuOTE0LTIwLjQyNSA0MS41NjYtMTUuNDM2YzkuMDE3IDUuMiAxMi4yODggMjIuOTg4IDcuNDYzIDQ2LjQxYy0zLjY0NSAxNy43MDctMTIuMzU5IDM4Ljc1My0yNC4yMzggNTkuMzUxYy0xMi4xNzkgMjEuMTE4LTI2LjEyNCAzOS43MjQtMzkuOTMxIDUxLjc5MmMtMTcuNDcxIDE1LjI3Mi0zNC4zNjIgMjAuNzk5LTQzLjIwNyAxNS42OThjLTguNTgzLTQuOTQ2LTExLjg2NS0yMS4xNjctNy43NDctNDIuODUyYzMuNDc5LTE4LjMyMyAxMi4yMS00MC44MTIgMjQuODQxLTYyLjcyM3oiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIHN0cm9rZT0iIzAwZDhmZiIgc3Ryb2tlLXdpZHRoPSI4LjkxIiBkPSJNOTUuMDEyIDE0Ny41NzhjLTEyLjU0OS0yMS42NzQtMjEuMDkzLTQzLjYxNi0yNC42NTktNjEuODI2Yy00LjI5My0yMS45NDEtMS4yNTgtMzguNzE2IDcuMzg3LTQzLjcyYzkuMDA5LTUuMjE2IDI2LjA1Mi44MzQgNDMuOTM0IDE2LjcxMmMxMy41MiAxMi4wMDQgMjcuNDAzIDMwLjA2MSAzOS4zMTYgNTAuNjM5YzEyLjIxNCAyMS4wOTggMjEuMzY4IDQyLjQ3MyAyNC45MjkgNjAuNDYxYzQuNTA2IDIyLjc2NC44NTkgNDAuMTU3LTcuOTc4IDQ1LjI3MmMtOC41NzQgNC45NjQtMjQuMjY1LS4yOTEtNDAuOTk2LTE0LjY4OWMtMTQuMTM2LTEyLjE2NC0yOS4yNi0zMC45NTktNDEuOTMzLTUyLjg0OVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvZz48L3N2Zz4='],
            [/opencollective\.com\/vite/, 'https://github.com/vitejs.png'],
            [/opencollective\.com\/elk/, 'https://github.com/elk-zone.png'],
          ],
        })

        md.use(GitHubAlerts)
      },
      // frontmatterPreprocess(frontmatter, options, id, defaults) {
      //   (() => {
      //     if (!id.endsWith('.md'))
      //       return
      //     const route = basename(id, '.md')
      //     if (route === 'index' || frontmatter.image || !frontmatter.title)
      //       return
      //     const path = `og/${route}.png`
      //     promises.push(
      //       fs.existsSync(`${id.slice(0, -3)}.png`)
      //         ? fs.copy(`${id.slice(0, -3)}.png`, `public/${path}`)
      //         : generateOg(frontmatter.title!.replace(/\s-\s.*$/, '').trim(), `public/${path}`),
      //     )
      //     frontmatter.image = `https://heggria.site/${path}`
      //   })()
      //   const head = defaults(frontmatter, options)
      //   return { head, frontmatter }
      // },
    }),

    AutoImport({
      imports: [
        'vue',
        VueRouterAutoImports,
        '@vueuse/core',
      ],
    }),

    Components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),

    Inspect(),

    Icons({
      defaultClass: 'inline',
      defaultStyle: 'vertical-align: sub;',
    }),

    SVG({
      svgo: false,
      defaultImport: 'url',
    }),

    Exclude(),

    {
      name: 'await',
      async closeBundle() {
        await Promise.all(promises)
      },
    },

    VitePluginRadar({
      // Google Analytics tag injection
      analytics: {
        id: 'G-1N60V340SV',
      },
    }),
  ],

  build: {
    rollupOptions: {
      onwarn(warning, next) {
        if (warning.code !== 'UNUSED_EXTERNAL_IMPORT')
          next(warning)
      },
    },
  },

  ssgOptions: {
    formatting: 'minify',
  },
})

// const ogSVg = fs.readFileSync('./scripts/og-template.svg', 'utf-8')

// async function generateOg(title: string, output: string) {
//   if (fs.existsSync(output))
//     return

//   await fs.mkdir(dirname(output), { recursive: true })
//   // breakline every 30 chars
//   const lines = title.trim().split(/(.{0,30})(?:\s|$)/g).filter(Boolean)

//   const data: Record<string, string> = {
//     line1: lines[0],
//     line2: lines[1],
//     line3: lines[2],
//   }
//   const svg = ogSVg.replace(/\{\{([^}]+)\}\}/g, (_, name) => data[name] || '')

//   // eslint-disable-next-line no-console
//   console.log(`Generating ${output}`)
//   try {
//     await sharp(Buffer.from(svg))
//       .resize(1200 * 1.1, 630 * 1.1)
//       .png()
//       .toFile(output)
//   }
//   catch (e) {
//     console.error('Failed to generate og image', e)
//   }
// }
