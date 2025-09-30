/**
 * Generate array of image URLs for a location based on its ID
 * Uses hash-based selection to generate multiple Greece images
 * Falls back to placeholder if location ID is null/undefined
 */
export function getLocationImages(locationId?: string | null, count: number = 4): string[] {
  // Return placeholder if no location ID
  if (!locationId) {
    return ['/greece1.jpg'];
  }

  // Generate hash from location ID
  const hash = locationId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0) || 0;

  // Generate array of image URLs based on hash
  const images: string[] = [];
  for (let i = 0; i < count; i++) {
    const imageNumber = (Math.abs(hash + i) % 3) + 1;
    images.push(`/greece${imageNumber}.jpg`);
  }

  return images;
}
