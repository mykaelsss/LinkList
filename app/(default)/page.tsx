import HeroForm from "@/components/forms/HeroForm";
import { fetchData } from "@/functions/fetchData";

export default async function Home() {
  const session = await fetchData()

  return (
      <main>
          <section className='pt-44 max-w-6xl mx-auto p-6'>
            <div className='max-w-md mb-7'>
              <h1 className='text-3xl font-bold text-slate-100 md:text-5xl'>
                Your one link <br /> for everything!
              </h1>
              <h2 className='text-slate-300 text-xl mt-7'>
                Share your links, socials, contact info and more on one page.
              </h2>
            </div>
            {/* <HeroForm userSession={session}/> */}
          </section>
          <div className="col-6 auth-widget">
          </div>
      </main>
  )
}
