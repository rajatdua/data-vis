import Head from "next/head"

export default function Dashboard() {
    return (
    <>
    <Head>
        <meta property="og:url" content="https://data-vis-wqyg.vercel.app/" />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/*/*.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <title>AU 2023 | Urbanisation Dashboard</title>
      </Head>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16 lg:pb-0">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
              Dashboard
            </h1>
          </div>
        </div>
      </section>
    </>
    );
}