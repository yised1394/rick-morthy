import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/config/routes.config';

/**
 * Home page — clean landing with hero and feature highlights.
 * No global header/footer; self-contained presentation page.
 */
function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Logo mark */}
        <div className="mb-6 w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl tracking-tight">
          Rick and Morty
          <span className="block text-primary-600 mt-1">Character Explorer</span>
        </h1>

        <p className="mt-6 max-w-lg text-base text-gray-500 leading-relaxed">
          Explore all characters from the Rick and Morty universe.
          Search, filter, and save your favorites.
        </p>

        {/* CTA */}
        <Link
          to={ROUTES.CHARACTERS}
          className="group mt-10 inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white hover:text-white font-medium rounded-lg hover:shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] no-underline"
        >
          Explore Characters
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Feature cards */}
        <div className="mt-20 grid gap-6 sm:grid-cols-3 max-w-2xl w-full">
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            }
            title="Search & Filter"
            description="Find characters by name, status, or species"
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            }
            title="Save Favorites"
            description="Mark your favorite characters for quick access"
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            }
            title="Add Comments"
            description="Share your thoughts about any character"
          />
        </div>
      </div>

      {/* Inline footer */}
      <footer className="py-6 text-center border-t border-gray-100">
        <p className="text-[13px] text-gray-400">
          Data from{' '}
          <a
            href="https://rickandmortyapi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            Rick and Morty API
          </a>
        </p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 p-5 text-center transition-all hover:border-gray-200 hover:shadow-sm">
      <div className="mb-3 inline-flex w-10 h-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

export default HomePage;
