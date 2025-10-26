import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Portfolio Booking System',
    short_name: 'Booking',
    description: 'Discover and book amazing venues for your meetings, events, and workspace needs.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0070f3',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/IMG_4255.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/IMG_4255.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/IMG_4255.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/IMG_4255.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/IMG_4255.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/IMG_4255.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/IMG_4255.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/IMG_4255.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/IMG_4255.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/IMG_4255.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    categories: ['business', 'productivity'],
    screenshots: [
      {
        src: '/screenshots/desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide'
      },
      {
        src: '/screenshots/mobile.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow'
      }
    ]
  }
}
