"use client";
export const dynamic = "force-dynamic";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { pagos as pagosMock } from '@/lib/mock';

type EstadoPago = 'pendiente' | 'pagado' | 'vencido';
type MetodoPago = 'transferencia' | 'efectivo' | 'tarjeta' | 'pse';
type ConceptoPago = 'Administración' | 'Parqueadero' | 'Zona común' | 'Multa' | 'Mantenimiento';

export interface Pago {
  id: string;
  apartamento: string;
  residente: string;
  concepto: ConceptoPago;
  monto: number;
  fechaVencimiento: string;
  fechaPago: string | null;
  estado: EstadoPago;
  metodo: MetodoPago | null;
  referencia: string | null;
}

const EMPTY_FORM: Omit<Pago, 'id'> = {
  apartamento: '',
  residente: '',
  concepto: 'Administración',
  monto: 0,
  fechaVencimiento: '',
  fechaPago: null,
  estado: 'pendiente',
  metodo: null,
  referencia: null,
};

const ESTADO_CONFIG: Record<EstadoPago, { label: string; classes: string }> = {
  pendiente: { label: 'Pendiente', classes: 'bg-yellow-100 text-yellow-800' },
  pagado:    { label: 'Pagado',    classes: 'bg-green-100 text-green-800'  },
  vencido:   { label: 'Vencido',   classes: 'bg-red-100 text-red-800'     },
};

const CONCEPTOS: ConceptoPago[] = ['Administración', 'Parqueadero', 'Zona común', 'Multa', 'Mantenimiento'];
const METODOS: MetodoPago[]      = ['transferencia', 'efectivo', 'tarjeta', 'pse'];

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-bold text-indigo-700">{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

export default function PagoPage() {
  const [pagos, setPagos]             = useState<Pago[]>(pagosMock);
  const [search, setSearch]           = useState('');
  const [filterEstado, setFilterEstado] = useState<EstadoPago | 'todos'>('todos');
  const [showForm, setShowForm]       = useState(false);
  const [editing, setEditing]         = useState<Pago | null>(null);
  const [form, setForm]               = useState<Omit<Pago, 'id'>>(EMPTY_FORM);
  const [toDelete, setToDelete]       = useState<string | null>(null);

  /* ── stats ── */
  const stats = useMemo(() => {
    const total     = (pagos ?? []).reduce((s, p) => s + p.monto, 0);
    const recaudado = (pagos ?? []).filter(p => p.estado === 'pagado').reduce((s, p) => s + p.monto, 0);
    return {
      total,
      recaudado,
      pendientes: (pagos ?? []).filter(p => p.estado === 'pendiente').length,
      vencidos:   (pagos ?? []).filter(p => p.estado === 'vencido').length,
    };
  }, [pagos]);

  /* ── filtered list ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (pagos ?? []).filter(p => {
      const matchSearch =
        p.residente.toLowerCase().includes(q) ||
        p.apartamento.toLowerCase().includes(q) ||
        p.concepto.toLowerCase().includes(q);
      const matchEstado = filterEstado === 'todos' || p.estado === filterEstado;
      return matchSearch && matchEstado;
    });
  }, [pagos, search, filterEstado]);

  /* ── handlers ── */
  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(p: Pago) {
    setEditing(p);
    setForm({ ...p });
    setShowForm(true);
  }

  function handleSave() {
    if (!form.apartamento || !form.residente || !form.monto || !form.fechaVencimiento) return;
    if (editing) {
      setPagos(prev => (prev ?? []).map(p => p.id === editing.id ? { ...form, id: editing.id } : p));
    } else {
      setPagos(prev => [...prev, { ...form, id: `PAG-${Date.now()}` }]);
    }
    setShowForm(false);
  }

  function handleDelete(id: string) {
    setPagos(prev => (prev ?? []).filter(p => p.id !== id));
    setToDelete(null);
  }

  function setField<K extends keyof Omit<Pago, 'id'>>(key: K, val: Omit<Pago, 'id'>[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  const formValid = Boolean(form.apartamento && form.residente && form.monto && form.fechaVencimiento);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top nav ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm">CondoAdmin</span>
          </div>
          <nav className="flex items-center gap-1">
            {[
              { href: '/dashboard',  label: 'Dashboard'  },
              { href: '/inmueble',   label: 'Inmuebles'  },
              { href: '/residente',  label: 'Residentes' },
              { href: '/visitante',  label: 'Visitantes' },
              { href: '/pago',       label: 'Pagos'      },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors font-medium ${
                  href === '/pago'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-600">AD</span>
            </div>
            <span className="text-sm text-gray-700 hidden sm:block">Administrador</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── Heading ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
            <p className="text-sm text-gray-500 mt-0.5">Cuotas de administración, parqueadero, multas y más</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Registrar Pago
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Facturado',
              value: formatCOP(stats.total),
              sub:   `${pagos?.length} registros`,
              icon: (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              ),
              iconBg: 'bg-indigo-50',
              valueClass: 'text-gray-900',
            },
            {
              label: 'Recaudado',
              value: formatCOP(stats.recaudado),
              sub:   'Confirmados',
              icon: (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              iconBg: 'bg-green-50',
              valueClass: 'text-green-700',
            },
            {
              label: 'Pendientes',
              value: String(stats.pendientes),
              sub:   'Por cobrar',
              icon: (
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              iconBg: 'bg-yellow-50',
              valueClass: 'text-yellow-700',
            },
            {
              label: 'Vencidos',
              value: String(stats.vencidos),
              sub:   'Requieren gestión',
              icon: (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ),
              iconBg: 'bg-red-50',
              valueClass: 'text-red-700',
            },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{card.label}</p>
                <div className={`w-9 h-9 ${card.iconBg} rounded-lg flex items-center justify-center`}>{card.icon}</div>
              </div>
              <p className={`text-xl font-bold ${card.valueClass}`}>{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por residente, apartamento o concepto…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['todos', 'pendiente', 'pagado', 'vencido'] as const).map(e => (
                <button
                  key={e}
                  onClick={() => setFilterEstado(e)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                    filterEstado === e
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {e === 'todos' ? 'Todos' : e.charAt(0).toUpperCase() + e.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Referencia', 'Residente', 'Concepto', 'Monto', 'Vencimiento', 'Fecha Pago', 'Estado', 'Método', ''].map(h => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                        h === 'Monto' ? 'text-right' : h === '' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered?.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-sm text-gray-400">
                      No se encontraron pagos con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  (filtered ?? []).map(pago => (
                    <tr key={pago.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-gray-400">{pago.id}</span>
                        <div className="text-sm font-semibold text-gray-900">{pago.apartamento}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={pago.residente} />
                          <span className="text-sm text-gray-800">{pago.residente}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{pago.concepto}</td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right tabular-nums">{formatCOP(pago.monto)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{pago.fechaVencimiento}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {pago.fechaPago ?? <span className="text-gray-300 text-base leading-none">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ESTADO_CONFIG[pago.estado].classes}`}>
                          {ESTADO_CONFIG[pago.estado].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                        {pago.metodo ?? <span className="text-gray-300 text-base leading-none">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEdit(pago)}
                            title="Editar"
                            className="p-1.5 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setToDelete(pago.id)}
                            title="Eliminar"
                            className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Mostrando <span className="font-semibold text-gray-700">{filtered?.length}</span> de{' '}
              <span className="font-semibold text-gray-700">{pagos?.length}</span> registros
            </p>
          </div>
        </div>
      </main>

      {/* ══ MODAL: CREATE / EDIT ══ */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editing ? 'Editar Pago' : 'Registrar Nuevo Pago'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editing ? `Editando ${editing.id}` : 'Completa los datos del pago'}
                </p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-5 space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Apartamento *</label>
                  <input
                    type="text"
                    value={form.apartamento}
                    onChange={e => setField('apartamento', e.target.value)}
                    placeholder="Ej: 301-A"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Residente *</label>
                  <input
                    type="text"
                    value={form.residente}
                    onChange={e => setField('residente', e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Concepto *</label>
                <select
                  value={form.concepto}
                  onChange={e => setField('concepto', e.target.value as ConceptoPago)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  {(CONCEPTOS ?? []).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Monto (COP) *</label>
                  <input
                    type="number"
                    value={form.monto || ''}
                    onChange={e => setField('monto', Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Estado *</label>
                  <select
                    value={form.estado}
                    onChange={e => setField('estado', e.target.value as EstadoPago)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="vencido">Vencido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fecha Vencimiento *</label>
                  <input
                    type="date"
                    value={form.fechaVencimiento}
                    onChange={e => setField('fechaVencimiento', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fecha de Pago</label>
                  <input
                    type="date"
                    value={form.fechaPago ?? ''}
                    onChange={e => setField('fechaPago', e.target.value || null)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Método de Pago</label>
                  <select
                    value={form.metodo ?? ''}
                    onChange={e => setField('metodo', (e.target.value as MetodoPago) || null)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="">Sin especificar</option>
                    {(METODOS ?? []).map(m => (
                      <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Referencia</label>
                  <input
                    type="text"
                    value={form.referencia ?? ''}
                    onChange={e => setField('referencia', e.target.value || null)}
                    placeholder="Nº comprobante"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formValid}
                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
              >
                {editing ? 'Guardar Cambios' : 'Registrar Pago'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: DELETE CONFIRM ══ */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Eliminar registro</h3>
                <p className="text-sm text-gray-500 mt-0.5">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el pago{' '}
              <span className="font-mono font-semibold text-gray-800">{toDelete}</span>?
              Se perderá toda la información asociada.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(toDelete)}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}