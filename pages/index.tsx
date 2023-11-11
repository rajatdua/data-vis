import Head from "next/head"
import {useState} from "react";

const members = [
    {name: "Calderón, Andrés", email: "auXXXXXX@uni.au.dk", links: { github: '', twitter: '' }},
    {name: "Dua, Rajat", email: "au747653@uni.au.dk", links: { github: 'https://github.com/rajatdua', twitter: 'https://twitter.com/rajatdua1' }},
    {name: "Kratschmer, Anastasia", email: "auXXXXXX@uni.au.dk", links: { github: '', twitter: '' }},
    {name: "Rammohan, Shivaram", email: "auXXXXXX@uni.au.dk", links: { github: '', twitter: '' }},
];

export default function Web() {
    const [showMenu, setShowMenu] = useState(false);
    return (
        <>
            <Head>
                <meta property="og:url" content="https://data-vis-wqyg.vercel.app/"/>
                <meta
                    property="og:image"
                    content="/banner.png"
                />
                <meta property="og:image:width" content="1200"/>
                <meta property="og:image:height" content="630"/>
                <meta name="twitter:card" content="summary_large_image"/>
                <title>AU 2023 | Data Visualisation Project</title>
            </Head>
            <section className="w-full px-6 pb-12 antialiased bg-white ">
                <div className="mx-auto max-w-7xl">

                    <nav className="relative z-50 h-24 select-none" x-data="{ showMenu: false }">
                        <div
                            className="container relative flex flex-wrap items-center justify-between h-24 mx-auto overflow-hidden font-medium border-b border-gray-200 md:overflow-visible lg:justify-center sm:px-4 md:px-2 lg:px-0">
                            <div className="flex items-center justify-start w-1/4 h-full pr-4">
                                <a href="#_" className="inline-block py-4 md:py-0">
                                    <span className="p-1 text-xl font-black leading-none text-gray-900">AU 2023 | Data Visualisation</span>
                                </a>
                            </div>
                            <div
                                className={`top-0 left-0 items-start hidden w-full h-full p-4 text-sm bg-gray-900 bg-opacity-50 md:items-center md:w-3/4 lg:text-base md:bg-transparent md:p-0 md:relative md:flex ${showMenu ? 'flex fixed' : 'hidden'}`}>
                                <div
                                    className="flex-col w-full h-auto overflow-hidden bg-white rounded-lg md:bg-transparent md:overflow-visible md:rounded-none md:relative md:flex md:flex-row">
                                    <a href="#_"
                                       className="inline-flex items-center w-auto h-16 px-6 text-xl font-black leading-none text-gray-900 md:hidden">tails<span
                                        className="text-indigo-600">.</span></a>
                                    <div
                                        className="flex flex-col items-start justify-center w-full space-x-6 text-center lg:space-x-8 md:w-2/3 md:mt-0 md:flex-row md:items-center">
                                        {/*<a href="#_"*/}
                                        {/*   className="inline-block w-full py-2 mx-0 ml-6 font-medium text-left text-indigo-600 md:ml-0 md:w-auto md:px-0 md:mx-2 lg:mx-3 md:text-center">Home</a>*/}
                                        {/*<a href="#_"*/}
                                        {/*   className="inline-block w-full py-2 mx-0 font-medium text-left text-gray-700 md:w-auto md:px-0 md:mx-2 hover:text-indigo-600 lg:mx-3 md:text-center">Features</a>*/}
                                        {/*<a href="#_"*/}
                                        {/*   className="inline-block w-full py-2 mx-0 font-medium text-left text-gray-700 md:w-auto md:px-0 md:mx-2 hover:text-indigo-600 lg:mx-3 md:text-center">Blog</a>*/}
                                        {/*<a href="#_"*/}
                                        {/*   className="inline-block w-full py-2 mx-0 font-medium text-left text-gray-700 md:w-auto md:px-0 md:mx-2 hover:text-indigo-600 lg:mx-3 md:text-center">Contact</a>*/}
                                        {/*<a href="#_"*/}
                                        {/*   className="absolute top-0 left-0 hidden py-2 mt-6 ml-10 mr-2 text-gray-600 lg:inline-block md:mt-0 md:ml-2 lg:mx-3 md:relative">*/}
                                        {/*    <svg className="inline w-5 h-5" fill="none" strokeLinecap="round"*/}
                                        {/*         strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"*/}
                                        {/*         stroke="currentColor">*/}
                                        {/*        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>*/}
                                        {/*    </svg>*/}
                                        {/*</a>*/}
                                    </div>
                                    <div
                                        className="flex flex-col items-start justify-end w-full pt-4 md:items-center md:w-1/3 md:flex-row md:py-0">
                                        <a href="/multi-variate-data"
                                           className="inline-flex items-center w-full px-6 py-3 text-sm font-medium leading-4 text-white bg-indigo-600 md:px-3 md:w-auto md:rounded-full lg:px-5 hover:bg-indigo-500 focus:outline-none md:focus:ring-2 focus:ring-0 focus:ring-offset-2 focus:ring-indigo-600">Get Started</a>
                                    </div>
                                </div>
                            </div>
                            {/*<div onClick={() => setShowMenu(!showMenu)}*/}
                            {/*     className="absolute right-0 flex flex-col items-center justify-center w-10 h-10 bg-white rounded-full cursor-pointer md:hidden hover:bg-gray-100">*/}
                            {/*    <svg className="w-6 h-6 text-gray-700" style={{display: showMenu ? 'none' : 'block'}}*/}
                            {/*         fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"*/}
                            {/*         viewBox="0 0 24 24" stroke="currentColor">*/}
                            {/*        <path d="M4 6h16M4 12h16M4 18h16"></path>*/}
                            {/*    </svg>*/}
                            {/*    <svg className="w-6 h-6 text-gray-700" style={{display: showMenu ? 'block' : 'none'}}*/}
                            {/*         fill="none" stroke="currentColor" viewBox="0 0 24 24"*/}
                            {/*         xmlns="http://www.w3.org/2000/svg">*/}
                            {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"*/}
                            {/*              d="M6 18L18 6M6 6l12 12"></path>*/}
                            {/*    </svg>*/}
                            {/*</div>*/}
                        </div>
                    </nav>

                    {/* Main Hero Content */}
                    <div className="container max-w-lg px-4 py-14 mx-auto mt-px text-left md:max-w-none md:text-center">
                        <h1 className="text-5xl font-extrabold leading-10 tracking-tight text-left text-gray-900 md:text-center sm:leading-none md:text-6xl lg:text-7xl">
                            <span className="inline md:block">Explore the</span> <span
                            className="relative mt-2 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-500 md:inline-block">US 2016 Elections</span>
                            <span className="inline md:block">Overview</span>
                        </h1>
                        <div
                            className="mx-auto mt-5 text-gray-500 md:mt-12 md:max-w-lg md:text-center lg:text-lg">Take a glance over how trump&apos;s social media presence mainly on twitter affected US 2016 elections.
                        </div>
                        <div className="flex flex-col items-center mt-12 text-center">
                            <span className="relative inline-flex w-full md:w-auto">
                              <a href="/multi-variate-data" type="button"
                                 className="inline-flex items-center justify-center w-full px-8 py-4 text-base font-bold leading-6 text-white bg-indigo-600 border border-transparent rounded-full md:w-auto hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                                Get Started
                              </a>
                            </span>
                        </div>
                    </div>
                    {/* End Main Hero Content */}

                </div>
            </section>


            <section className="relative pb-14 overflow-hidden bg-white">
    <span className="absolute top-0 right-0 flex flex-col items-end mt-0 -mr-16 opacity-60">
        <span
            className="container hidden w-screen h-32 max-w-xs mt-20 rounded-full rounded-r-none md:block md:max-w-xs lg:max-w-lg 2xl:max-w-3xl bg-blue-50"></span>
    </span>

                <span className="absolute bottom-0 left-0"> </span>

                <div className="relative px-16 mx-auto max-w-7xl">
                    <p className="font-medium tracking-wide text-blue-500 uppercase">OUR TEAM</p>
                    <h2 className="relative max-w-lg mt-5 mb-10 text-4xl font-semibold leading-tight lg:text-5xl">An
                        incredible team of <br/>amazing individuals</h2>
                    <div className="grid w-full grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
                        {members.map(member => {
                           return (
                               <div key={member.name} className="flex flex-col items-center justify-center col-span-1">
                                   <div className="relative p-5">
                                   </div>
                                   <div className="mt-3 space-y-2 text-center">
                                       <div className="space-y-1 text-lg font-medium leading-6">
                                           <h3 className="">{member.name}</h3>
                                           <p className="text-blue-600">{member.email}</p>
                                       </div>
                                       <div className="relative flex items-center justify-center space-x-3">
                                           {!!member?.links?.twitter && <a href={member.links.twitter} className="text-gray-300 hover:text-gray-400">
                                               <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                                           </a>}
                                           {!!member?.links?.github && <a href={member.links.github} className="text-gray-300 hover:text-gray-400">
                                               <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                                           </a>}
                                       </div>
                                   </div>
                               </div>
                           );
                        })}
                    </div>
                </div>
            </section>

            <div className="container flex flex-col items-center p-8 mx-auto max-w-7xl sm:flex-row ">
                <a href="#_" className="text-xl font-black leading-none text-gray-900 select-none">AU 2023 | Data Visualisation<span className="text-indigo-600"></span></a>
                <p className="mt-4 text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-200 sm:mt-0">© {new Date().getFullYear()} - Group 10 Project</p>
                <span className="inline-flex justify-center mt-4 space-x-5 sm:ml-auto sm:mt-0 sm:justify-start">
        {/*<a href="#" className="text-gray-400 hover:text-gray-500">*/}
        {/*    <span className="sr-only">Facebook</span>*/}
        {/*    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">*/}
        {/*        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>*/}
        {/*    </svg>*/}
        {/*</a>*/}

        {/*<a href="#" className="text-gray-400 hover:text-gray-500">*/}
        {/*    <span className="sr-only">Instagram</span>*/}
        {/*    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">*/}
        {/*        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.045 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>*/}
        {/*    </svg>*/}
        {/*</a>*/}

        {/*<a href="#" className="text-gray-400 hover:text-gray-500">*/}
        {/*    <span className="sr-only">Twitter</span>*/}
        {/*    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">*/}
        {/*        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>*/}
        {/*    </svg>*/}
        {/*</a>*/}

        <a href="https://github.com/rajatdua/data-vis" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">GitHub</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
            </svg>
        </a>

        <a href="https://vercel.com/rajatdua/data-vis-wqyg" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Vercel</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 2L22 22H2L12 2z"/>
            </svg>
        </a>
    </span>
            </div>
        </>
    )
}
