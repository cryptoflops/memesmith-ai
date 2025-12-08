const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '../public/.well-known/farcaster.json');
const indexPath = path.join(__dirname, '../pages/index.tsx');

try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);

    // Construct the meta tag content based on the manifest
    // We primarily need the 'miniapp' section for the fc:frame meta tag
    const miniapp = manifest.miniapp;

    if (!miniapp) {
        console.error('Error: No miniapp section found in farcaster.json');
        process.exit(1);
    }

    const metaContent = {
        version: "next",
        imageUrl: miniapp.splashImageUrl || "https://memesmith-ai.vercel.app/api/og",
        button: {
            title: "Forge Your Coin",
            action: {
                type: "launch_frame",
                name: miniapp.name || "MemeSmith AI",
                url: miniapp.homeUrl || "https://memesmith-ai.vercel.app",
                splashImageUrl: miniapp.splashImageUrl || "https://memesmith-ai.vercel.app/splash.png",
                splashBackgroundColor: miniapp.splashBackgroundColor || "#000000"
            }
        }
    };

    const metaString = JSON.stringify(metaContent).replace(/"/g, '&quot;');

    let indexContent = fs.readFileSync(indexPath, 'utf8');

    // Regex to replace the content of the fc:frame meta tag
    const regex = /<meta property="fc:frame" content='.*?' \/>/;
    const replacement = `<meta property="fc:frame" content='${JSON.stringify(metaContent)}' />`;

    if (regex.test(indexContent)) {
        indexContent = indexContent.replace(regex, replacement);
        fs.writeFileSync(indexPath, indexContent, 'utf8');
        console.log('Successfully updated fc:frame meta tag in pages/index.tsx');
    } else {
        console.warn('Warning: Could not find existing fc:frame meta tag to update in pages/index.tsx');
    }

} catch (error) {
    console.error('Error syncing manifest to meta tags:', error);
    process.exit(1);
}
