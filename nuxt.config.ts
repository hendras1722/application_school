import process from 'node:process';

const sw  = process.env.SW === 'true';
const dev = process.env.NODE_ENV === 'development';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    !dev && '@vite-pwa/nuxt',
    'nuxt-mongoose',
    'nuxt-charts'
  ], 
  runtimeConfig: {
    public: {
      DEV: process.env.NODE_ENV
    }
  },
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'id'
      },
      title: 'Nuxt Vite PWA',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Nuxt Vite PWA' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  css: ['~/assets/css/main.css'],
  ui: {
    colorMode: false,
    theme: {
      colors: [
        'primary',
        'secondary',
        'tertiary',
        'info',
        'success',
        'warning',
        'error'
      ]
    }
  },
  compatibilityDate: '2025-07-15',
  nitro: {
    esbuild: {
      options: {
        target: 'es2020'
      }
    },
    prerender: {
      routes: ['/', '/admin/user']
    }
  },
  vite: {
    plugins: [
      {
        apply: 'build',
        name: 'vite-plugin-ignore-sourcemap-warnings',
        configResolved(config) {
          const originalOnWarn              = config.build.rollupOptions.onwarn;
          config.build.rollupOptions.onwarn = (warning, warn) => {
            if (
              warning.code === 'SOURCEMAP_BROKEN' &&
              warning.plugin === '@tailwindcss/vite:generate:build'
            ) {
              return;
            }

            if (originalOnWarn) {
              originalOnWarn(warning, warn);
            } else {
              warn(warning);
            }
          };
        }
      }
    ]
  },
  eslint: {
    config: {
      formatters: true,
      stylistic: {
        semi: true,
        quotes: 'single',
        commaDangle: 'never',
        arrowParens: true
      }
    }
  },
  fonts: {
    defaults: {
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: [
        'cyrillic-ext',
        'cyrillic',
        'greek-ext',
        'greek',
        'vietnamese',
        'latin-ext',
        'latin'
      ]
    }
  },
  pwa: {
    strategies: dev ? undefined : (sw ? 'injectManifest' : 'generateSW'),
    srcDir: dev ? undefined : (sw ? 'service-worker' : undefined),
    filename: dev ? undefined : (sw ? 'sw.ts' : undefined),
    registerType: 'autoUpdate',
    manifest: {
      name: 'Nuxt Vite PWA',
      short_name: 'NuxtVitePWA',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: dev ? undefined : true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 20
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  }
});