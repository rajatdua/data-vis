import Head from "next/head"
import { Button } from "components/Button/Button"

const members = [
  { name: "Barrena Calderón, Andrés", email: "" },
  { name: "Dua, Rajat", email: "au747653@uni.au.dk" },
  { name: "Kratschmer, Anastasia Katharina", email: "" },
  { name: "Rammohan, Shivaram", email: "" },
];

export default function Web() {
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
        <title>AU 2023 | Data Visualisation Project</title>
      </Head>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16 lg:pb-0">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
              Data Visualisation Project
            </h1>
            <p className="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
              In this project, we have worked with multiple data sources
              to provide us a holistic view on how Trump&apos;s tweets had effect on US Election 2016.
            </p>
            <Button href="/multi-variate-data" className="mr-3">
              View Visualisation
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 pb-0">
          <div className="justify-center space-y-8">
          <h3 className="mb-2 text-xl font-bold dark:text-white">Group 10 Members:</h3>
          {members.map((memberDetails, index) => {
            return (
              <p key={memberDetails.name} className="text-gray-500 dark:text-gray-400">{index + 1}. {memberDetails.name} ({memberDetails.email})</p>
            );
          })}
          </div>
        </div>
      </section>
    </>
  )
}
