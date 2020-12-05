import Head from 'next/head'
import { MetaTagsProps } from './types'

const MetaTags = ({ title, description, canonical, image }: MetaTagsProps) => {
  const pageTitle = title ? `${title} | GoBarber 2020` : 'GoBarber 2020'
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content={pageTitle} />
      <meta
        name="og:description"
        property="og:description"
        content={description}
      />
      <meta property="og:site_name" content="e-commerce" />
      <meta property="og:url" content={`${canonical}`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="e-commerce" />
      <meta name="twitter:creator" content="e-commerce" />
      <meta
        property="og:image"
        content={
          image ||
          'https://www.propernoun.co/static/images/proper-noun-social.png'
        }
      />
      {image && <meta name="twitter:image" content={image} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
      <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
    </Head>
  )
}

export default MetaTags
