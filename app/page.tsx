"use client";
export const dynamic = "force-dynamic";
import { Hero } from "@/components/ui/Hero";
import { FacturacionModule } from "@/components/ui/FacturacionModule";
import Link from "next/link";
import { inmuebles as mockInmuebles, residentes as mockResidentes, visitantes as mockVisitantes, pagos as mockPagos } from "@/lib/mock";

type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  colorClass: string;
  icon: string;
  href: string;
};

function MetricCard({ title, value, subtitle, colorClass, icon, href }: MetricCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center text-2xl shadow-sm`}>
            {icon}
          </div>
          <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors font-medium">
            Ver más →
          </span>
        </div>
        <div className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">{value}</div>
        <div className="text-sm font-semibold text-gray-700 mb-0.5">{title}</div>
        <div className="text-xs text-gray-400">{subtitle}</div>
      </div>
    </Link>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    autorizado: "bg-emerald-100 text-emerald-700",
    aprobado: "bg-emerald-100 text-emerald-700",
    pendiente: "bg-amber-100 text-amber-700",
    denegado: "bg-red-100 text-red-700",
    rechazado: "bg-red-100 text-red-700",
    pagado: "bg-emerald-100 text-emerald-700",
    vencido: "bg-red-100 text-red-700",
    ocupado: "bg-blue-100 text-blue-700",
    disponible: "bg-gray-100 text-gray-600",
  };
  const cls = map[estado?.toLowerCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${cls}`}>
      {estado}
    </span>
  );
}

export default function DashboardPage() {
  const inmuebles = mockInmuebles;
  const residentes = mockResidentes;
  const visitantes = mockVisitantes;
  const pagos = mockPagos;

  const inmueblesOcupados = (inmuebles ?? []).filter(
    (i) => i.estado?.toLowerCase() === "ocupado"
  ).length;

  const pagosPendientes = (pagos ?? []).filter(
    (p) => p.estado?.toLowerCase() === "pendiente"
  ).length;

  const montoPendiente = pagos
    .filter((p) => p.estado?.toLowerCase() === "pendiente")
    .reduce((sum, p) => sum + (p.monto ?? 0), 0);

  const visitantesRecientes = [...visitantes].slice(0, 6);
  const pagosRecientes = [...pagos].slice(0, 5);

  const fechaHoy = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <Hero title="Panel de Control" subtitle="Resumen de tu operación de un vistazo." />
      <div className="mt-2"><h2 className="mb-3 text-lg font-semibold text-slate-900">Vista rápida</h2><FacturacionModule /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Panel de Control
            </h1>
            <p className="text-gray-500 mt-1 capitalize text-sm">{fechaHoy}</p>
          </div>
          <Link
            href="/visitantes/nuevo"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <span className="text-base">＋</span> Registrar Visitante
          </Link>
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <MetricCard
            title="Inmuebles Totales"
            value={inmuebles?.length}
            subtitle={`${inmueblesOcupados} ocupados · ${inmuebles?.length - inmueblesOcupados} disponibles`}
            colorClass="bg-blue-600"
            icon="🏢"
            href="/inmuebles"
          />
          <MetricCard
            title="Residentes Activos"
            value={residentes?.length}
            subtitle={`${(residentes ?? []).filter((r) => r.rol === "propietario").length} propietarios registrados`}
            colorClass="bg-emerald-500"
            icon="👥"
            href="/residentes"
          />
          <MetricCard
            title="Control de Visitantes"
            value={visitantes?.length}
            subtitle="Registros en el sistema"
            colorClass="bg-violet-600"
            icon="🪪"
            href="/visitantes"
          />
          <MetricCard
            title="Pagos Pendientes"
            value={pagosPendientes}
            subtitle={`$${montoPendiente.toLocaleString("es-CO")} por recaudar`}
            colorClass="bg-amber-500"
            icon="💳"
            href="/pagos"
          />
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Tabla de Visitantes Recientes */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Visitantes Recientes</h2>
                <p className="text-xs text-gray-400 mt-0.5">Últimos accesos registrados</p>
              </div>
              <Link
                href="/visitantes"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Ver todos
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Visitante
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Inmueble
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Motivo
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(visitantesRecientes ?? []).map((v) => {
                    const iniciales = `${v.nombre?.charAt(0) ?? ""}${v.apellido?.charAt(0) ?? ""}`.toUpperCase();
                    return (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs flex-shrink-0">
                              {iniciales}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {v.nombre} {v.apellido}
                              </div>
                              <div className="text-gray-400 text-xs">{v.documento}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">
                          {v.apartamento ?? v.inmueble ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-500 capitalize">
                          {v.motivo ?? "Visita general"}
                        </td>
                        <td className="px-6 py-4">
                          <EstadoBadge estado={v.estado ?? "pendiente"} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel lateral: Pagos Recientes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Pagos Recientes</h2>
                <p className="text-xs text-gray-400 mt-0.5">Cuotas y administración</p>
              </div>
              <Link
                href="/pagos"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Ver todos
              </Link>
            </div>
            <div className="divide-y divide-gray-50 flex-1">
              {(pagosRecientes ?? []).map((p) => (
                <div
                  key={p.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {p.concepto}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {p.apartamento ?? p.inmueble ?? p.apto ?? "—"} · {p.fecha}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-gray-900">
                      ${(p.monto ?? 0).toLocaleString("es-CO")}
                    </div>
                    <div className="mt-1">
                      <EstadoBadge estado={p.estado ?? "pendiente"} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Acciones Rápidas ── */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Registrar Visitante",
              href: "/visitantes/nuevo",
              cls: "bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-100",
              icon: "🪪",
            },
            {
              label: "Nuevo Residente",
              href: "/residentes/nuevo",
              cls: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100",
              icon: "👤",
            },
            {
              label: "Agregar Inmueble",
              href: "/inmuebles/nuevo",
              cls: "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100",
              icon: "🏠",
            },
            {
              label: "Registrar Pago",
              href: "/pagos/nuevo",
              cls: "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100",
              icon: "💰",
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`${action.cls} rounded-xl p-4 flex items-center gap-3 transition-all text-sm font-semibold`}
            >
              <span className="text-xl">{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}