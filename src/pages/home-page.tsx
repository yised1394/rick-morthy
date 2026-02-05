import { Link } from 'react-router-dom';
import { MainLayout } from '@/shared/components/layout/main-layout';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/core/config/routes.config';

/**
 * Home page with hero section and quick navigation.
 */
function HomePage() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-8 text-8xl">🧪</div>

        <h1 className="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
          Rick and Morty
          <span className="block text-brand">Character Explorer</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-neutral-600">
          Explore all characters from the Rick and Morty universe.
          Search, filter, and save your favorites. Works offline too!
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link to={ROUTES.CHARACTERS}>
            <Button size="lg" className="min-w-[200px]">
              Explore Characters
            </Button>
          </Link>

          <Link to={ROUTES.FAVORITES}>
            <Button variant="secondary" size="lg" className="min-w-[200px]">
              View Favorites
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <FeatureCard
            icon="🔍"
            title="Search & Filter"
            description="Find characters by name, status, species, or gender"
          />
          <FeatureCard
            icon="⭐"
            title="Save Favorites"
            description="Mark your favorite characters and access them anytime"
          />
          <FeatureCard
            icon="💬"
            title="Add Comments"
            description="Share your thoughts about any character"
          />
        </div>
      </div>
    </MainLayout>
  );
}

interface FeatureCardProps {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-md">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-neutral-600">{description}</p>
    </div>
  );
}

export default HomePage;
