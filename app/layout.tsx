export const dynamic = "force-dynamic";
import "./globals.css";
import { AppShell } from "@/components/ui/AppShell";

const NAV = [{ href: "/", label: "Inicio" }, { href: "/pago", label: "Pagos" }, { href: "/residente", label: "Residente" }];

export const metadata = { title: "CondoManager — Gestión Residencial", description: "Generado con ScrumDev AI" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppShell items={NAV} title="CondoManager — Gestión Residencial">{children}</AppShell>
      </body>
    </html>
  );
}
