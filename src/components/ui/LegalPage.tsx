import Image from "next/image";
import Link from "next/link";
import { content } from "@/lib/content";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" aria-label="Haidi home">
          <Image src="/assets/haidi.png" alt="Haidi" width={96} height={28} className="h-6 w-auto" />
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← Back to the story
        </Link>
      </header>
      <article className="legal mx-auto max-w-3xl px-5 pb-24 pt-10 sm:px-8">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="display mb-8 text-4xl sm:text-5xl">{title}</h1>
        <div className="space-y-4 text-muted [&_a]:text-teal-bright [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc">
          {children}
        </div>
      </article>
      <footer className="mx-auto max-w-3xl border-t border-line px-5 py-6 text-xs text-faint sm:px-8">{content.outro.footer}</footer>
    </div>
  );
}
