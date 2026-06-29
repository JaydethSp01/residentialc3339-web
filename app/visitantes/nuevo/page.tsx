"use client";
export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function FormPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Nuevo Visitantes" subtitle="Completa los datos y guarda." />
      <Card>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); router.push("/visitantes"); }}>
          {["Nombre", "Descripción", "Detalle"].map((f) => (
            <div key={f} className="space-y-1">
              <label className="text-sm font-medium text-slate-700">{f}</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30" placeholder={f} />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Button type="submit">Guardar</Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/visitantes")}>Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
