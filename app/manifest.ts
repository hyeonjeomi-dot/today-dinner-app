import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '봉봉저녁',
    short_name: '저녁앱',
    description: '봉봉하우스 저녁 메뉴 추천 앱',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffaf3',
    theme_color: '#ff9900',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}