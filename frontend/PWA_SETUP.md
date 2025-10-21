# Progressive Web App (PWA) Setup

This application is now configured as a Progressive Web App, allowing users to install it on their mobile devices and use it like a native app.

## Features

- **Installable**: Users can install the app on their mobile devices from the browser
- **Offline Support**: Basic offline functionality with service worker caching
- **Custom Icon**: Booking-themed icon with calendar and checkmark design
- **Standalone Mode**: Runs in standalone mode without browser UI
- **Apple iOS Support**: Optimized for iOS devices with Apple touch icons

## Files Created/Modified

### Created Files:
1. `src/app/manifest.ts` - PWA manifest configuration
2. `public/sw.js` - Service worker for offline functionality
3. `public/icons/icon.svg` - Source SVG for booking icon
4. `public/icons/icon-*.png` - Generated icons in multiple sizes (72, 96, 128, 144, 152, 192, 384, 512)
5. `public/icons/apple-touch-icon.png` - Apple iOS icon
6. `public/icons/favicon-32x32.png` - Favicon
7. `src/components/PWAInstaller.tsx` - Service worker registration component
8. `src/app/offline/page.tsx` - Offline fallback page
9. `scripts/generate-icons.js` - Icon generation script

### Modified Files:
1. `src/app/layout.tsx` - Added PWA metadata and viewport settings
2. `package.json` - Added generate-icons script

## Icon Design

The booking icon features:
- Calendar design with rings at the top
- Grid dots representing calendar days
- Green checkmark in a circle indicating booking confirmation
- Blue color scheme matching the app theme (#0070f3)

## How to Install on Mobile

### Android (Chrome/Edge):
1. Visit the website on your mobile browser
2. Tap the menu (three dots) in the browser
3. Select "Install app" or "Add to Home Screen"
4. Confirm the installation

### iOS (Safari):
1. Visit the website in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name the app and tap "Add"

## Testing PWA Installation

### Desktop (Chrome/Edge):
1. Run the app in production mode: `npm run build && npm start`
2. Open Chrome DevTools (F12)
3. Go to the "Application" tab
4. Check "Manifest" to verify the manifest is loaded correctly
5. Check "Service Workers" to verify the service worker is registered
6. Look for the install icon in the address bar

### Mobile:
1. Deploy the app to a server with HTTPS
2. Visit the URL on your mobile device
3. Follow the installation steps above

## Regenerating Icons

If you want to modify the icon design:

1. Edit `public/icons/icon.svg`
2. Run `npm run generate-icons` to regenerate all icon sizes
3. The script will create PNG versions in all required sizes

## Adding Screenshots

For better app store presentation:

1. Take screenshots of the app at:
   - Desktop: 1280x720 pixels
   - Mobile: 750x1334 pixels
2. Save them in `public/screenshots/` as:
   - `desktop.png`
   - `mobile.png`
3. These will appear in the installation prompt

## Service Worker Caching Strategy

The service worker uses a cache-first strategy with network fallback:

1. **Static Cache**: Core app files (/, /offline, icons)
2. **Dynamic Cache**: Automatically caches visited pages
3. **Network Fallback**: Shows offline page when network is unavailable

## Customization

### Change Theme Color:
Edit `src/app/manifest.ts`:
```typescript
theme_color: "#0070f3",  // Change this color
background_color: "#ffffff",  // And this one
```

### Change App Name:
Edit `src/app/manifest.ts`:
```typescript
name: 'Portfolio Booking System',  // Full name
short_name: 'Booking',  // Short name for home screen
```

### Update Viewport:
Edit `src/app/layout.tsx`:
```typescript
export const viewport: Viewport = {
  themeColor: "#0070f3",  // Match manifest theme_color
  // ... other settings
};
```

## Production Deployment Notes

1. **HTTPS Required**: PWAs require HTTPS (except on localhost)
2. **Service Worker**: Only registers in production mode (`NODE_ENV=production`)
3. **Caching**: Clear service worker cache when deploying major updates
4. **Testing**: Always test on real mobile devices before releasing

## Browser Support

- ✅ Chrome/Edge (Android & Desktop): Full support
- ✅ Safari (iOS 16.4+): Full support
- ✅ Firefox (Android): Full support
- ⚠️ Safari (iOS < 16.4): Limited support
- ❌ Internet Explorer: Not supported

## Troubleshooting

### App won't install:
- Check that you're using HTTPS
- Verify manifest.json is accessible at `/manifest.json`
- Check browser console for errors
- Ensure all required icon sizes are present

### Service worker not working:
- Only works in production mode
- Check if service worker is registered in DevTools
- Clear browser cache and reload
- Verify `public/sw.js` is accessible

### Icons not showing:
- Run `npm run generate-icons` to regenerate
- Check that all icon files exist in `public/icons/`
- Verify paths in `manifest.ts` are correct
- Clear browser cache

## Next Steps

1. Add custom screenshots for app installation prompts
2. Implement push notifications (if needed)
3. Add background sync for offline form submissions
4. Optimize caching strategy for your specific use case
5. Test on various devices and browsers

## Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)
- [Next.js PWA Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/manifest)
