import "../styles/tailwind.css"
import "../styles/scatterplot.css"
import "../styles/overlay.css"
import "../styles/app.css"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { AppProps } from "next/app"

function MyApp({ Component, pageProps }: AppProps) {
  return <><Component {...pageProps} /><SpeedInsights /></>;
}

export default MyApp
