import React from "react"
import Constants from "./src/Constants";

export default {

  Document: ({
    Html,
    Head,
    Body,
    children,
    state: { siteData, renderMeta },
  }) => {
    return (
      <Html lang="en-US">
        <Head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
          <meta property="title" content="/airhorn" />
          <meta property="url" content={Constants.AIRHORN_URL} />
          <meta property="description" content="A Discord bot with live statistics that makes airhorn sounds BEEP BOOP." />
          <meta property="site_name" content="Airhorn Solutions" />
          <meta property="locale" content="en-US" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content={Constants.AIRHORN_URL} />
          <meta property="og:image" content={Constants.AIRHORN_URL + "/airhorn-banner.png"} />
          <meta property="og:title" content="/airhorn" />
          <meta property="og:description" content="A Discord bot with live statistics that makes airhorn sounds BEEP BOOP." />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:site" content="@discord" />
          <meta property="twitter:image" content={Constants.AIRHORN_URL + "/airhorn-banner.png"} />
          <meta property="twitter:title" content="/airhorn" />
          <meta property="twitter:description" content="BEEP BOOP. Airhorn bot makes airhorn noises in Discord. BEEP BOOP." />

          <link rel="icon" href={Constants.AIRHORN_URL + "/favicon.png"} />

          <link href="https://fonts.googleapis.com/css?family=Roboto:500" rel="stylesheet" type="text/css" />

          <title>/airhorn</title>
        </Head>
        <Body>{children}</Body>
      </Html>
    )
  },

  plugins: [
    [
      "react-static-plugin-stylus",
      {
        cssLoaderOptions: {}
      }
    ]
  ],

  silent: true,
}
