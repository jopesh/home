---
title: "Using Plausible Analytics in Your Next.js App"
description: "Working with a simple and privacy-friendly alternative to Google Analytics in your Next.js app and dodging a few caveats."
pubDate: "2022-01-24"
---

I was looking for a pure, lightweight and privacy-friendly way to get simple stats about my personal homepage. I ruled out Google Analytics as they sustain little issues with privacy, and it does not fit into the mentioned attributes. So, what's out there in the market? Until this point, I've come across the following:

- umami (self-hosted, open source),
- Simple Analytics (paid),
- Fathom Analytics (paid),
- Splitbee (paid),
- and Plausible (paid or self-hosted, open source)

If possible, I'd rather avoid a paid service (at least for now). Having used umami for a client project recently being quite fond of it, I've moved to [Plausible](https://plausible.io), an open-source project based in the European Union, for this project. Plausible offers a pretty clean [self-hosting setup via Docker](https://github.com/plausible/hosting). Alternatively, they offer a paid managed service on their platform for those who prefer.

Either via plausible.io or self-hosted - after creating your site in the Plausible dashboard you're provided with a simple `<script>` tag looking somewhat like this:

```html
<script
  async
  defer
  data-domain="johnschmidt.de"
  src="https://stats.johnschmidt.cloud/js/plausible.js"
/>
```

Of course the `src` and `data-domain` attributes might differ depending on your setup. That's all you need from Plausible itself.

## Setting up Your Application

In your Next.js project we need to modify the [custom document](https://nextjs.org/docs/advanced-features/custom-document) `/pages/_document.js` file. There's a few possible approaches to implement the tracker. In this case, I implemented it manually. However, there is a [small package](https://github.com/4lejandrito/next-plausible) providing you with a `<PlausibleProvider>` wrapper. The simplest approach is by adding the `<script>` tag in the `<Head>` component.

```jsx
import Document, { Html, Head, Main, NextScript } from 'next/document'

class HomepageDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
  render() {
    return (
      <Html lang='en'>
        <Head>
          <script
            async
            defer
            data-domain='johnschmidt.de'
            src='https://stats.johnschmidt.cloud/js/plausible.js'
          />
        </Head>
        <body className='antialiased dark:bg-black dark:text-white'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default HomepageDocument
```

In the easiest scenario this would be it - you're good to go. The script will be included into the app bundle on every page. Once deployed, the script will automatically run the tracker function and count visitors and page views. The results will be displayed in the Plausible dashboard almost instantly.

## Avoiding Counts in Preview Deployments

_There's just this one little caveat:_ Plausible does not differ between the domain or referring URL (yet) you call the script from. Using Vercel or Netlify for your deployments, you might use preview URLs quite frequently. A visit to one of these would trigger an event like in the production environment. As far as I could evaluate, there's essentially two options to avoid:

1. exclude yourself from tracking on the client-side or
1. include the script only on the desired production URL (e.g. johnschmidt.de)

The First option could be achieved with a custom rule in a script-blocking extension of sorts (e.g. uBlock, Adblock Plus).  The second approach is a bit trickier at the moment. To avoid the `<script>` to render in the preview URLs we need to include the snippet conditionally, based on the current hostname. The `Window` object can provide this information quite simply in `window.location.hostname`. It'll be offered as a string. This moves the code from `/pages/_document.js` to `/pages/_app.js` since we need to check our conditions on the client-side.

```jsx
import Head from 'next/head'

function HomepageApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {typeof window !== 'undefined' &&
          window.location.hostname === 'johnschmidt.de' && (
            <script
              async
              defer
              data-domain='johnschmidt.de'
              src='https://stats.johnschmidt.cloud/js/plausible.js'
            />
          )}
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default HomepageApp
```

Before reading the `window.location.hostname` parameter we need to make sure that it is only called in a client-side setting. We can check if the `Window` object is defined and render the script tag conditionally. Since Next.js statically generates our page on the server-side, it would try to call the `Window` object in a Node.js environment - albeit `Window` does not exist there. Once a visitor opens our app on the production URL, the script should be rendered on hydration and Plausible can start collecting your events as usual.

## Wrapping up

Plausible provides a good alternative to Google Analytics, especially on the privacy side of things. The only downside is the fairly narrow adjustability within a continuous deployment environment like Vercel or Netlify. With a little tweak, however, it can work like a charm. For a small project like this homepage, it seemed like one of the best solutions to get lightweight stats and baseline analytics.

Since this is my first post of this kind, let me know if this post was helpful to you and reach out [to me on Twitter](https://twitter.com/jope_sh) (@jope_sh) with feedback and ideas!
