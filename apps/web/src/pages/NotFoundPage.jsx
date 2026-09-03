import { Link } from "react-router";

function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-6">
      <section className="text-center" aria-labelledby="not-found-title">
        <p className="text-sm font-semibold text-brand-600">404</p>

        <h1 id="not-found-title" className="mt-2 text-4xl font-bold tracking-tight text-ink">
          Page not found
        </h1>

        <p className="mt-4 text-muted">The page you requested does not exist.</p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Return to overview
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
