/**
 * Footer with attribution link to Rick and Morty API.
 */
export function ListFooter() {
  return (
    <footer className="mt-10 pt-6 pb-4 border-t border-gray-100 text-center">
      <p className="text-[13px] text-gray-400 leading-relaxed">
        Data from{' '}
        <a
          href="https://rickandmortyapi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:underline transition-colors"
        >
          Rick and Morty API
        </a>
      </p>
    </footer>
  );
}
