import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-muted-foreground">Página no encontrada</p>
        <Link
          href="/"
          className={buttonVariants()}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
