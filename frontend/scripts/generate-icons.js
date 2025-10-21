const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const svgPath = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    // Read the SVG file
    const svg = fs.readFileSync(svgPath);

    // Generate icons for each size
    for (const size of sizes) {
      console.log(`Generating ${size}x${size} icon...`);

      // Render SVG to PNG using resvg
      const resvg = new Resvg(svg, {
        fitTo: {
          mode: 'width',
          value: size,
        },
      });

      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      // Write the PNG file
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      fs.writeFileSync(outputPath, pngBuffer);

      console.log(`✓ Generated icon-${size}x${size}.png`);
    }

    // Also create apple-touch-icon
    const resvgApple = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 180,
      },
    });

    const applePngData = resvgApple.render();
    const applePngBuffer = applePngData.asPng();
    fs.writeFileSync(path.join(outputDir, 'apple-touch-icon.png'), applePngBuffer);
    console.log('✓ Generated apple-touch-icon.png');

    // Create favicon
    const resvgFavicon = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 32,
      },
    });

    const faviconPngData = resvgFavicon.render();
    const faviconPngBuffer = faviconPngData.asPng();

    // Convert to ICO format (just use PNG for now, browsers support it)
    fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), faviconPngBuffer);
    fs.writeFileSync(path.join(outputDir, 'favicon-32x32.png'), faviconPngBuffer);
    console.log('✓ Generated favicon files');

    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
