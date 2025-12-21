import Head from 'next/head';
import dynamic from 'next/dynamic';

const App = dynamic(() => import('../components/App'), { ssr: false });

export default function Home() {
    return (
        <>
            <Head>
                <title>MemeSmith AI</title>
                <meta property="og:title" content="MemeSmith AI" />
                <meta property="og:image" content="https://memesmith-ai.vercel.app/api/og" />
                <meta property="fc:frame" content='{"version":"next","imageUrl":"https://memesmith-ai.vercel.app/splash.png","button":{"title":"Forge Your Coin","action":{"type":"launch_frame","name":"MemeSmith AI","url":"https://memesmith-ai.vercel.app","splashImageUrl":"https://memesmith-ai.vercel.app/splash.png","splashBackgroundColor":"#000000"}}}' />
                <meta property="fc:miniapp" content='{"accountAssociation":{"header":"eyJmaWQiOjEyMzQ1LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4MTIzNDU2Nzg5MGFiY2RlZiJ9","payload":"eyJkb21haW4iOiJleGFtcGxlLmNvbSJ9","signature":"MHhiYWRjb2Rl..."},"miniapp":{"version":"1","name":"MemeSmith AI","homeUrl":"https://memesmith-6sjr1zskh-cryptoflops00-3036s-projects.vercel.app","iconUrl":"https://memesmith-6sjr1zskh-cryptoflops00-3036s-projects.vercel.app/icon.png","splashImageUrl":"https://memesmith-6sjr1zskh-cryptoflops00-3036s-projects.vercel.app/splash.png","splashBackgroundColor":"#000000","webhookUrl":"https://memesmith-6sjr1zskh-cryptoflops00-3036s-projects.vercel.app/api/webhook","subtitle":"Forge your social identity into a token","description":"MemeSmith AI analyzes your Farcaster profile to generate and deploy a unique, personalized meme coin on Celo, Base, Optimism, or Arbitrum.","primaryCategory":"social","tags":["ai","token","memecoin","generator"]}}' />
            </Head>
            <App />
        </>
    );
}
