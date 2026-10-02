import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/my_documents/**', '**/scripts/**', '**/.git/**'],
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Apiligu Learning Pass',
        short_name: 'LearningPass',
        description: 'Private certification mastery platform — CISA, CISM, CRISC, CISSP',
        theme_color: '#002366',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15MB for offline AI/ML knowledge graph
        // v3 §5.5: App shell — Cache-first, 7 days
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          // Google Fonts — CacheFirst, 1 year
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // v3 §5.5: Questions, options, explanations — NetworkFirst, 24h fallback
          {
            urlPattern: /\/rest\/v1\/(questions|options|explanations|case_studies|case_study_questions)/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-questions-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 10,
            },
          },
          // v3 §5.5: Study materials, glossary — CacheFirst, 30 days
          {
            urlPattern: /\/rest\/v1\/(study_materials|glossary_terms|topics|subtopics|domains|certifications|task_statements)/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-content-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // v3 §5.5: User progress — NetworkFirst, never long-cached
          {
            urlPattern: /\/rest\/v1\/(user_progress|quiz_sessions|session_answers|profiles)/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-progress-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes max
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 5,
            },
          },
          // v3 §5.5: Images and static assets — CacheFirst, 30 days
          {
            urlPattern: /\/storage\/v1\/object\/public\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-storage-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
