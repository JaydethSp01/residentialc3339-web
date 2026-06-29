"use client";
export const dynamic = "force-dynamic";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  residentes as residentesMock,
  Residente,
  RolUsuario,
  EstadoResidente,
  Vehiculo,
  Mascota,
} from '@/lib/mock';
import {
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Car,
  PawPrint,
  Home,
  Phone,
  Mail,
  IdCard,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCircle2,
} from 'lucide-react';

const ROLES: RolUsuario[] = [
  'Administrador',
  'Residente',
  'Propietario no residente',
  'Guardia de Seguridad',
  'Comité de Convivencia',
];

const ESTADOS: EstadoResidente[] = ['Activo', 'Inactivo', 'Pendiente'];

const INMUEBLES_OPCIONES = [
  { id: 'INM001', label: 'Torre A – Apto 401' },
  { id: 'INM002', label: 'Torre B – Apto 202' },
  { id: 'INM003', label: 'Bloque C – Casa 12' },
  { id: 'INM004', label: 'Torre A – Apto 315' },
  { id: 'INM005', label: 'Acceso Principal – Portería' },
  { id: 'INM006', label: 'Torre B – Apto 510' },
  { id: 'INM007', label: 'Torre C – Apto 108' },
  { id: 'INM008', label: 'Torre A – Apto 603' },
];

const rolColor: Record<RolUsuario, string> = {
  Administrador: 'bg-purple-100 text-purple-700 ring-1 ring-purple-200',
  Residente: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
  'Propietario no residente': 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  'Guardia de Seguridad': 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
  'Comité de Convivencia': 'bg-teal-100 text-teal-700 ring-1 ring-teal-200',
};

const estadoConfig: Record<EstadoResidente, { color: string; icon: React.ReactNode }> = {
  Activo: {
    color: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Inactivo: {
    color: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    icon: <X className="w-3 h-3" />,
  },
  Pendiente: {
    color: 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
    icon: <Clock className="w-3 h-3" />,
  },
};

function getInitials(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

function getAvatarBg(id: string) {
  const colors = [
    'bg-violet-500',
    'bg-blue-500',
    'bg-emerald-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-teal-500',
    'bg-indigo-500',
  ];
  const idx = parseInt(id.replace(/\D/g, ''), 10) % colors?.length;
  return colors[idx];
}

interface FormState {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento: string;
  inmuebleId: string;
  inmueble: string;
  torre: string;
  rol: RolUsuario;
  estado: EstadoResidente;
  fechaIngreso: string;
  vehiculos: Vehiculo[];
  mascotas: Mascota[];
}

const EMPTY_FORM: FormState = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  documento: '',
  inmuebleId: '',
  inmueble: '',
  torre: '',
  rol: 'Residente',
  estado: 'Activo',
  fechaIngreso: new Date().toISOString().split('T')[0],
  vehiculos: [],
  mascotas: [],
};

export default function ResidentePage() {
  const [residentes, setResidentes] = useState<Residente[]>(residentesMock);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState<RolUsuario | 'Todos'>('Todos');
  const [filtroEstado, setFiltroEstado] = useState<EstadoResidente | 'Todos'>('Todos');
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 5;

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const [detalleResidente, setDetalleResidente] = useState<Residente | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  const [vehiculoTemp, setVehiculoTemp] = useState<Vehiculo>({ placa: '', marca: '', color: '' });
  const [mascotaTemp, setMascotaTemp] = useState<Mascota>({ nombre: '', especie: '', raza: '' });

  const residentesFiltrados = useMemo(() => {
    return (residentes ?? []).filter((r) => {
      const texto = busqueda.toLowerCase();
      const coincideTexto =
        !texto ||
        r.nombre.toLowerCase().includes(texto) ||
        r.apellido.toLowerCase().includes(texto) ||
        r.email.toLowerCase().includes(texto) ||
        r.documento.includes(texto) ||
        r.inmueble.toLowerCase().includes(texto);
      const coincideRol = filtroRol === 'Todos' || r.rol === filtroRol;
      const coincideEstado = filtroEstado === 'Todos' || r.estado === filtroEstado;
      return coincideTexto && coincideRol && coincideEstado;
    });
  }, [residentes, busqueda, filtroRol, filtroEstado]);

  const totalPaginas = Math.max(1, Math.ceil(residentesFiltrados?.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const residentesPagina = residentesFiltrados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA,
  );

  const contadorPorEstado = useMemo(() => {
    return {
      Activo: (residentes ?? []).filter((r) => r.estado === 'Activo').length,
      Inactivo: (residentes ?? []).filter((r) => r.estado === 'Inactivo').length,
      Pendiente: (residentes ?? []).filter((r) => r.estado === 'Pendiente').length,
    };
  }, [residentes]);

  function abrirCrear() {
    setEditandoId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setVehiculoTemp({ placa: '', marca: '', color: '' });
    setMascotaTemp({ nombre: '', especie: '', raza: '' });
    setModalAbierto(true);
  }

  function abrirEditar(r: Residente) {
    setEditandoId(r.id);
    setForm({
      nombre: r.nombre,
      apellido: r.apellido,
      email: r.email,
      telefono: r.telefono,
      documento: r.documento,
      inmuebleId: r.inmuebleId,
      inmueble: r.inmueble,
      torre: r.torre,
      rol: r.rol,
      estado: r.estado,
      fechaIngreso: r.fechaIngreso,
      vehiculos: [...r.vehiculos],
      mascotas: [...r.mascotas],
    });
    setFormErrors({});
    setVehiculoTemp({ placa: '', marca: '', color: '' });
    setMascotaTemp({ nombre: '', especie: '', raza: '' });
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setEditandoId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  }

  function validarForm(): boolean {
    const errores: Partial<Record<keyof FormState, string>> = {};
    if (!form.nombre.trim()) errores.nombre = 'El nombre es requerido';
    if (!form.apellido.trim()) errores.apellido = 'El apellido es requerido';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errores.email = 'Email inválido';
    if (!form.telefono.trim()) errores.telefono = 'El teléfono es requerido';
    if (!form.documento.trim()) errores.documento = 'El documento es requerido';
    if (!form.inmuebleId) errores.inmuebleId = 'Seleccione un inmueble';
    if (!form.fechaIngreso) errores.fechaIngreso = 'La fecha de ingreso es requerida';
    setFormErrors(errores);
    return Object.keys(errores).length === 0;
  }

  function handleInmuebleChange(id: string) {
    const opcion = (INMUEBLES_OPCIONES ?? []).find((o) => o.id === id);
    if (!opcion) return;
    const partes = opcion.label.split(' – ');
    setForm((f) => ({ ...f, inmuebleId: id, torre: partes[0] ?? '', inmueble: partes[1] ?? '' }));
  }

  function guardar() {
    if (!validarForm()) return;
    if (editandoId) {
      setResidentes((prev) =>
        (prev ?? []).map((r) => (r.id === editandoId ? { ...r, ...form } : r)),
      );
    } else {
      const nuevo: Residente = {
        id: `R${String(Date.now()).slice(-4)}`,
        ...form,
      };
      setResidentes((prev) => [nuevo, ...prev]);
    }
    cerrarModal();
  }

  function eliminar(id: string) {
    setResidentes((prev) => (prev ?? []).filter((r) => r.id !== id));
    setEliminandoId(null);
  }

  function agregarVehiculo() {
    if (!vehiculoTemp.placa.trim()) return;
    setForm((f) => ({ ...f, vehiculos: [...f.vehiculos, { ...vehiculoTemp }] }));
    setVehiculoTemp({ placa: '', marca: '', color: '' });
  }

  function eliminarVehiculo(idx: number) {
    setForm((f) => ({ ...f, vehiculos: (f.vehiculos ?? []).filter((_, i) => i !== idx) }));
  }

  function agregarMascota() {
    if (!mascotaTemp.nombre.trim()) return;
    setForm((f) => ({ ...f, mascotas: [...f.mascotas, { ...mascotaTemp }] }));
    setMascotaTemp({ nombre: '', especie: '', raza: '' });
  }

  function eliminarMascota(idx: number) {
    setForm((f) => ({ ...f, mascotas: (f.mascotas ?? []).filter((_, i) => i !== idx) }));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-lg tracking-tight">ConjuntoAdmin</span>
            <span className="text-slate-300 mx-1">|</span>
            <nav className="flex items-center gap-1 text-sm">
              <Link href="/" className="text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors">
                Inicio
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-indigo-600 font-medium px-2 py-1">Residentes</span>
            </nav>
          </div>
          <button
            onClick={abrirCrear}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo Residente
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Directorio de Residentes</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Gestión de usuarios, roles y datos del conjunto residencial
            </p>
          </div>
          <div className="flex items-center gap-3">
            {(Object.entries(contadorPorEstado) as [EstadoResidente, number][]).map(([estado, count]) => (
              <div
                key={estado}
                className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-slate-200 shadow-sm"
              >
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${estadoConfig[estado].color}`}>
                  {count}
                </span>
                <span className="text-slate-600 text-sm font-medium">{estado}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email, documento o inmueble…"
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={filtroRol}
                onChange={(e) => { setFiltroRol(e.target.value as RolUsuario | 'Todos'); setPagina(1); }}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                <option value="Todos">Todos los roles</option>
                {(ROLES ?? []).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <select
                value={filtroEstado}
                onChange={(e) => { setFiltroEstado(e.target.value as EstadoResidente | 'Todos'); setPagina(1); }}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                <option value="Todos">Todos los estados</option>
                {(ESTADOS ?? []).map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Residente</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Contacto</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Inmueble</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Rol</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Estado</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Activos</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {residentesPagina?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400">
                      <UserCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">No se encontraron residentes</p>
                      <p className="text-xs mt-1">Intenta con otros filtros o registra un nuevo residente</p>
                    </td>
                  </tr>
                ) : (
                  (residentesPagina ?? []).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${getAvatarBg(r.id)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {getInitials(r.nombre, r.apellido)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{r.nombre} {r.apellido}</p>
                            <p className="text-slate-400 text-xs">Doc: {r.documento}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs">{r.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs">{r.telefono}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <Home className="w-3.5 h-3.5 text-slate-400" />
                          <div>
                            <p className="text-slate-700 font-medium text-xs">{r.inmueble}</p>
                            <p className="text-slate-400 text-xs">{r.torre}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${rolColor[r.rol]}`}>
                          {r.rol}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${estadoConfig[r.estado].color}`}>
                          {estadoConfig[r.estado].icon}
                          {r.estado}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {r.vehiculos?.length > 0 && (
                            <button
                              onClick={() => setDetalleResidente(r)}
                              className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors"
                              title={`${r.vehiculos?.length} vehículo(s)`}
                            >
                              <Car className="w-4 h-4" />
                              <span className="text-xs font-medium">{r.vehiculos?.length}</span>
                            </button>
                          )}
                          {r.mascotas?.length > 0 && (
                            <button
                              onClick={() => setDetalleResidente(r)}
                              className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors"
                              title={`${r.mascotas?.length} mascota(s)`}
                            >
                              <PawPrint className="w-4 h-4" />
                              <span className="text-xs font-medium">{r.mascotas?.length}</span>
                            </button>
                          )}
                          {r.vehiculos?.length === 0 && r.mascotas?.length === 0 && (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setDetalleResidente(r)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                            title="Ver detalle"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => abrirEditar(r)}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEliminandoId(r.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {residentesFiltrados?.length > 0 && (
            <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <p className="text-xs text-slate-500">
                Mostrando{' '}
                <span className="font-semibold text-slate-700">
                  {(paginaActual - 1) * POR_PAGINA + 1}–{Math.min(paginaActual * POR_PAGINA, residentesFiltrados?.length)}
                </span>{' '}
                de <span className="font-semibold text-slate-700">{residentesFiltrados?.length}</span> residentes
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPagina(n)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      n === paginaActual
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'hover:bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={cerrarModal} />
          <div className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editandoId ? 'Editar Residente' : 'Nuevo Residente'}
                  </h2>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {editandoId
                      ? 'Actualiza los datos del residente'
                      : 'Completa el formulario para registrar un residente'}
                  </p>
                </div>
                <button onClick={cerrarModal} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <section>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Datos Personales
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                      placeholder="Ej: Carlos"
                      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.nombre ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'
                      }`}
                    />
                    {formErrors.nombre && <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Apellido *</label>
                    <input
                      type="text"
                      value={form.apellido}
                      onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))}
                      placeholder="Ej: Mendoza Rivera"
                      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.apellido ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'
                      }`}
                    />
                    {formErrors.apellido && <p className="text-red-500 text-xs mt-1">{formErrors.apellido}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Documento *</label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={form.documento}
                        onChange={(e) => setForm((f) => ({ ...f, documento: e.target.value }))}
                        placeholder="CC / CE / NIT"
                        className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          formErrors.documento ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'
                        }`}
                      />
                    </div>
                    {formErrors.documento && <p className="text-red-500 text-xs mt-1">{formErrors.documento}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Fecha de Ingreso *</label>
                    <input
                      type="date"
                      value={form.fechaIngreso}
                      onChange={(e) => setForm((f) => ({ ...f, fechaIngreso: e.target.value }))}
                      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.fechaIngreso ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'
                      }`}
                    />
                    {formErrors.fechaIngreso && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.fechaIngreso}</p>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contacto</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="correo@ejemplo.com"
                        className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          formErrors.email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'
                        }`}
                      />
                    </div>
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={form.telefono}
                        onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                        placeholder="+57 300 000 0000"
                        className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          formErrors.telefono ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'
                        }`}
                      />
                    </div>
                    {formErrors.telefono && <p className="text-red-500 text-xs mt-1">{formErrors.telefono}</p>}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Inmueble y Acceso
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Inmueble *</label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={form.inmuebleId}
                        onChange={(e) => handleInmuebleChange(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          formErrors.inmuebleId ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <option value="">Selecciona un inmueble</option>
                        {(INMUEBLES_OPCIONES ?? []).map((o) => (
                          <option key={o.id} value={o.id}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    {formErrors.inmuebleId && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.inmuebleId}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Rol de Acceso</label>
                    <select
                      value={form.rol}
                      onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value as RolUsuario }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    >
                      {(ROLES ?? []).map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Estado</label>
                    <select
                      value={form.estado}
                      onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value as EstadoResidente }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    >
                      {(ESTADOS ?? []).map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" /> Vehículos
                </h3>
                <div className="space-y-2">
                  {(form.vehiculos ?? []).map((v, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      <Car className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="text-sm font-semibold text-slate-800">{v.placa}</span>
                      <span className="text-xs text-slate-500">{v.marca} · {v.color}</span>
                      <button
                        onClick={() => eliminarVehiculo(i)}
                        className="ml-auto p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Placa"
                      value={vehiculoTemp.placa}
                      onChange={(e) => setVehiculoTemp((v) => ({ ...v, placa: e.target.value.toUpperCase() }))}
                      className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Marca"
                      value={vehiculoTemp.marca}
                      onChange={(e) => setVehiculoTemp((v) => ({ ...v, marca: e.target.value }))}
                      className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Color"
                        value={vehiculoTemp.color}
                        onChange={(e) => setVehiculoTemp((v) => ({ ...v, color: e.target.value }))}
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={agregarVehiculo}
                        className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <PawPrint className="w-3.5 h-3.5" /> Mascotas
                </h3>
                <div className="space-y-2">
                  {(form.mascotas ?? []).map((m, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      <PawPrint className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-sm font-semibold text-slate-800">{m.nombre}</span>
                      <span className="text-xs text-slate-500">{m.especie} · {m.raza}</span>
                      <button
                        onClick={() => eliminarMascota(i)}
                        className="ml-auto p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={mascotaTemp.nombre}
                      onChange={(e) => setMascotaTemp((m) => ({ ...m, nombre: e.target.value }))}
                      className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Especie"
                      value={mascotaTemp.especie}
                      onChange={(e) => setMascotaTemp((m) => ({ ...m, especie: e.target.value }))}
                      className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Raza"
                        value={mascotaTemp.raza}
                        onChange={(e) => setMascotaTemp((m) => ({ ...m, raza: e.target.value }))}
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={agregarMascota}
                        className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-end gap-3">
              <button
                onClick={cerrarModal}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors"
              >
                {editandoId ? 'Guardar Cambios' : 'Registrar Residente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {detalleResidente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setDetalleResidente(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-6">
              <button
                onClick={() => setDetalleResidente(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${getAvatarBg(detalleResidente.id)} flex items-center justify-center text-white text-xl font-bold shadow-lg`}
                >
                  {getInitials(detalleResidente.nombre, detalleResidente.apellido)}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {detalleResidente.nombre} {detalleResidente.apellido}
                  </h3>
                  <p className="text-indigo-200 text-sm">{detalleResidente.rol}</p>
                  <span
                    className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${estadoConfig[detalleResidente.estado].color}`}
                  >
                    {estadoConfig[detalleResidente.estado].icon}
                    {detalleResidente.estado}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-0.5">Documento</p>
                  <p className="font-semibold text-slate-800">{detalleResidente.documento}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-0.5">Inmueble</p>
                  <p className="font-semibold text-slate-800">{detalleResidente.inmueble}</p>
                  <p className="text-xs text-slate-500">{detalleResidente.torre}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-0.5">Email</p>
                  <p className="font-semibold text-slate-800 truncate">{detalleResidente.email}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-0.5">Teléfono</p>
                  <p className="font-semibold text-slate-800">{detalleResidente.telefono}</p>
                </div>
              </div>

              {detalleResidente.vehiculos?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Car className="w-3.5 h-3.5" /> Vehículos ({detalleResidente.vehiculos?.length})
                  </p>
                  <div className="space-y-1.5">
                    {(detalleResidente.vehiculos ?? []).map((v, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 text-sm">
                        <span className="font-bold text-indigo-600">{v.placa}</span>
                        <span className="text-slate-500">{v.marca}</span>
                        <span className="ml-auto text-xs text-slate-400 capitalize">{v.color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detalleResidente.mascotas?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <PawPrint className="w-3.5 h-3.5" /> Mascotas ({detalleResidente.mascotas?.length})
                  </p>
                  <div className="space-y-1.5">
                    {(detalleResidente.mascotas ?? []).map((m, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 text-sm">
                        <span className="font-bold text-emerald-600">{m.nombre}</span>
                        <span className="text-slate-500">{m.especie}</span>
                        <span className="ml-auto text-xs text-slate-400">{m.raza}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setDetalleResidente(null);
                    abrirEditar(detalleResidente);
                  }}
                  className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
                >
                  Editar Residente
                </button>
                <button
                  onClick={() => {
                    setEliminandoId(detalleResidente.id);
                    setDetalleResidente(null);
                  }}
                  className="px-4 py-2.5 text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {eliminandoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setEliminandoId(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">Eliminar Residente</h3>
            <p className="text-slate-500 text-sm text-center mb-6">
              Esta acción eliminará permanentemente el registro y no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setEliminandoId(null)}
                className="flex-1 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminar(eliminandoId)}
                className="flex-1 py-2.5 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
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