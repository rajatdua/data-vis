import "../styles/tailwind.css"
import "../styles/scatterplot.css"

import { AppProps } from "next/app"

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
