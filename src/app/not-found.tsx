import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="display text-4xl sm:text-6xl">That page drifted out of the forecast.</h1>
      <p className="mt-5 max-w-md text-muted">The link may be old or mistyped. The story starts again from the top.</p>
      <Link href="/" className="mt-8 rounded-full bg-teal px-6 py-3 text-sm font-medium text-canvas hover:bg-teal-bright">
        Back to the start
      </Link>
    </div>
  );
}
