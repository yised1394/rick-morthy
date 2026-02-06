import { Link } from 'react-router-dom';
import { MainLayout } from '@/shared/components/layout/main-layout';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/core/config/routes.config';

/**
 * 404 Not Found page.
 */
function NotFoundPage() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-8 text-8xl">🛸</div>

        <h1 className="text-4xl font-bold text-foreground">
          Lost in the Multiverse
        </h1>

        <p className="mt-4 text-lg text-neutral-600">
          The page you're looking for doesn't exist in any dimension.
        </p>

        <div className="mt-8 flex gap-4">
          <Link to={ROUTES.HOME}>
            <Button>Go Home</Button>
          </Link>

          <Link to={ROUTES.CHARACTERS}>
            <Button variant="secondary">Browse Characters</Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

export default NotFoundPage;
