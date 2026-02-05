/**
 * Application footer.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-muted py-8">
      <div className="container text-center">
        <p className="text-sm text-neutral-600">
          Data from{' '}
          <a
            href="https://rickandmortyapi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand hover:underline"
          >
            Rick and Morty API
          </a>
        </p>
        <p className="mt-2 text-xs text-neutral-500">
          &copy; {currentYear} Rick and Morty Character Explorer. Built with React.
        </p>
      </div>
    </footer>
  );
}
