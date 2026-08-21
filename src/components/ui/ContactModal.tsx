"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useUiStore } from "@/lib/uiStore";
import { site } from "@/lib/site";
import { Button } from "./Button";

type Status = "idle" | "sending" | "done";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactModal() {
  const open = useUiStore((s) => s.contactOpen);
  const close = useUiStore((s) => s.closeContact);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lenis-stopped");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [open, close]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const errs: Record<string, string> = {};
    if (!data.name?.trim()) errs.name = "Please add your name.";
    if (!EMAIL_RE.test(data.email || "")) errs.email = "Please use a valid work email.";
    if (!data.company?.trim()) errs.company = "Please add your company.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("sending");
    try {
      await fetch(site.contactApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _page: window.location.pathname }),
      });
    } catch {
      /* API not configured on preview hosts – still show thanks, like the live site */
    }
    setStatus("done");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-canvas/70 p-3 backdrop-blur-md sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            key="panel"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            className="panel w-full max-w-lg overflow-y-auto p-6 sm:p-8"
            style={{ maxHeight: "92vh", background: "rgba(20,22,29,0.92)" }}
            initial={{ y: 40, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow mb-2">Contact us</p>
                <h2 id="contact-title" className="display text-2xl">
                  {status === "done" ? "Thank you." : "Tell us about your planning."}
                </h2>
              </div>
              <button
                onClick={close}
                aria-label="Close"
                className="rounded-full border border-line p-2 text-muted hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2 2l10 10M12 2L2 12" />
                </svg>
              </button>
            </div>

            {status === "done" ? (
              <div>
                <p className="text-muted">
                  We will get back to you within one business day. If it is urgent, write to{" "}
                  <a className="text-teal-bright underline" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                  .
                </p>
                <Button className="mt-6" onClick={close}>
                  Back to the story
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="name" label="Name" placeholder="Your full name" error={errors.name} />
                  <Field name="email" label="Work email" type="email" placeholder="you@company.com" error={errors.email} />
                </div>
                <Field name="company" label="Company" placeholder="Company name" error={errors.company} />
                <label className="block">
                  <span className="mb-1.5 block text-xs text-muted">
                    How can we help? <span className="text-faint">optional</span>
                  </span>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="A line or two about your planning process and what is getting in the way today."
                    className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-faint focus:border-teal"
                  />
                </label>
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Leave this field empty
                    <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-faint">No contracts, no lock-in.</p>
                  <Button type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  error,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-faint focus:border-teal ${
          error ? "border-coral" : "border-line"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-coral">{error}</span>}
    </label>
  );
}
