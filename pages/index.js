// pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Gentlemens Club — Premium Barbershop</title>
        <meta name="description" content="Gentlemens Club — Book premium haircuts and beard trims online." />
      </Head>

      <Header />

      <main className="max-w-4xl mx-auto p-6">
        <section className="py-12 text-center">
          <h1 className="text-4xl font-bold">Gentlemens club</h1>
          <p className="mt-4 text-lg">Premium barbershop. Book online. Look sharp.</p>
          <Link href="/booking"><a className="inline-block mt-6 px-6 py-3 rounded bg-black text-white">Book Now</a></Link>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Services & Prices</h2>
          <ul className="mt-4 space-y-2">
            <li>Haircut — 120 P</li>
            <li>Beard Trim — 80 P</li>
            <li>Kids Cut — 60 P</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Testimonials</h2>
          <blockquote className="mt-4 italic">“Best haircut in town — 5 stars” — Happy Customer</blockquote>
        </section>
      </main>

      <Footer />
    </>
  );
}
