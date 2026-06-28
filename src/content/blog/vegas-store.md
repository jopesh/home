---
title: "Vegas Store"
description: "Custom web application for a unique slot machine merchant. Built with Next and Sanity."
pubDate: "2022-02-14"
heroImage: "../../assets/blog/vegas-store/26f6a9752933d0ab6260ecb1ac39bb66957ce510.jpg"
---

This small project was to transform an outdated [Joomla](https://www.joomla.de/)-based website into a modern, easy-to-use web application. It's built with Next.js and Sanity as content management system.

![Frontpage](../../assets/blog/vegas-store/da142cb610038c3c4ee0617f63f398c2ce9b5b85.png)

## Initial problem

The main challenge was to transform three outdated and unconnected instances of a no-code page builder ([Joomla](https://www.joomla.de/)) with different domains to a singular web instance which addresses all the needs of the client.

![Overview of products in the sales category](../../assets/blog/vegas-store/450d606d7f2cc1f0a8560fc494211cb3280c12c3.png)

The main offers consist of selling, renting, and placing/servicing (in public houses and alike) different kinds of slot and arcade machines. The products in renting and placing consist of the same pool, but are selectively excluded from the other. The client wanted granular control over what products show in each category. The products offered to sale are a different pool of products managed on their own with own attributes. Additionally, the client required the possibility to update his content from time to time (weekly).

Thus, the choice fell to [Sanity](https://www.sanity.io/) as a content-management system, since it offered the maximal freedom to structure the different kinds of content and interweave them. The choice for Next as the front-end framework was obligatory since it was my default choice and offered all the qualities needed.

![Product overview in renting and placing categories](../../assets/blog/vegas-store/be6613e461ac299018f196d92ed0f099fb25870b.png)

## Final thoughts

In retrospective, some choices were not optimal. For example, the sales category currently consists with approximately 140 products and causes a large static page to be rendered. I could have implemented a pagination system and routed the filter/search query through an API route rather than fuzzy-searching the static data (impacts performance too). Additionally, some design choices are still not optimal, and I think the data in all categories could be visualized far better if there was more time prototyping.

![Different mobile views](../../assets/blog/vegas-store/1ec22be31b08a1ed2ba052f24b3423577eaf83b4.png)

Visit the [live project here](https://vegas-store.de).
