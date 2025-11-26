// scripts/generateMeta.js
const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'public', '.well-known', 'farcaster.json');
const indexPath = path.join(__dirname, '..', 'pages', 'index.tsx');

function escapeJsonForMeta(json) {
    return JSON.stringify(json).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}

try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const metaContent = `  <meta property="fc:miniapp" content='${escapeJsonForMeta(manifest)}' />`;

    let indexFile = fs.readFileSync(indexPath, 'utf8');
    // Replace any existing fc:miniapp meta tag block
    const regex = /<meta property="fc:miniapp"[^>]*>/g;
    if (regex.test(indexFile)) {
        indexFile = indexFile.replace(regex, metaContent);
    } else {
        // Insert before closing </Head>
        indexFile = indexFile.replace('</Head>', `${metaContent}\n</Head>`);
    }
    fs.writeFileSync(indexPath, indexFile, 'utf8');
    console.log('✅ fc:miniapp meta tag synced');
} catch (err) {
    console.error('Error syncing meta tag:', err);
    process.exit(1);
}
