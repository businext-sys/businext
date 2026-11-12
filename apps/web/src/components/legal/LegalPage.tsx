import Link from "next/link";
import type { ReactNode } from "react";

export const CONTACT_EMAIL = "danyflom27@gmail.com";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-[44rem] px-5 py-16 text-body text-foreground-muted md:px-10">
      <Link href="/" className="text-label font-bold text-primary hover:underline">
        Businext
      </Link>
      <h1 className="mt-8 font-heading text-[clamp(2rem,5vw,3rem)] font-extrabold uppercase leading-none text-foreground">
        {title}
      </h1>
      <p className="mt-3 text-caption text-foreground-subtle">Última actualización: {updated}</p>
      <div className="mt-10 flex flex-col gap-4 [&_a]:text-primary [&_a]:underline [&_h2]:mt-6 [&_h2]:font-heading [&_h2]:text-[1.5rem] [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
