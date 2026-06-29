export type TipoInmueble = "apartamento" | "casa" | "local_comercial" | "parqueadero";
export type EstadoInmueble = "ocupado" | "desocupado" | "en_venta" | "en_arriendo";
export type RolUsuario = "administrador" | "residente" | "propietario_no_residente" | "guardia" | "comite_convivencia";
export type EstadoResidente = "activo" | "inactivo" | "suspendido";
export type EstadoVisita = "pendiente" | "autorizado" | "en_conjunto" | "finalizado" | "rechazado";
export type TipoVisita = "familiar" | "amigo" | "proveedor" | "delivery" | "otro";
export type EstadoPago = "pendiente" | "pagado" | "vencido" | "en_mora";
export type ConceptoPago = "administracion" | "parqueadero" | "multa" | "cuota_extraordinaria" | "agua" | "otro";

export interface Vehiculo {
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  tipo: "carro" | "moto" | "bicicleta";
}

export interface Mascota {
  nombre: string;
  especie: "perro" | "gato" | "otro";
  raza: string;
  color: string;
}

export interface Inmueble {
  id: string;
  torre: string;
  numero: string;
  piso: number;
  tipo: TipoInmueble;
  estado: EstadoInmueble;
  areaM2: number;
  propietarioId: string;
  residenteIds: string[];
  vehiculos: Vehiculo[];
  mascotas: Mascota[];
  coeficiente: number;
  createdAt: string;
}

export interface Residente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cedula: string;
  rol: RolUsuario;
  estado: EstadoResidente;
  inmuebleId: string | null;
  createdAt: string;
}

export interface Visitante {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  tipoVisita: TipoVisita;
  inmuebleDestinoId: string;
  residenteAutorizadorId: string;
  estado: EstadoVisita;
  fechaAutorizacion: string;
  fechaIngreso?: string;
  fechaSalida?: string;
  vehiculoPlaca?: string;
  observaciones?: string;
  createdAt: string;
}

export interface Pago {
  id: string;
  inmuebleId: string;
  residenteId: string;
  concepto: ConceptoPago;
  descripcion: string;
  monto: number;
  estado: EstadoPago;
  fechaVencimiento: string;
  fechaPago?: string;
  periodo: string;
  comprobante?: string;
  createdAt: string;
}

export const inmuebles: Inmueble[] = [
  {
    id: "INM-001",
    torre: "A",
    numero: "101",
    piso: 1,
    tipo: "apartamento",
    estado: "ocupado",
    areaM2: 72,
    propietarioId: "RES-001",
    residenteIds: ["RES-001", "RES-002"],
    vehiculos: [
      { placa: "ABC123", marca: "Chevrolet", modelo: "Spark GT", color: "Blanco", tipo: "carro" },
      { placa: "XYZ789", marca: "Honda", modelo: "CB190R", color: "Rojo", tipo: "moto" },
    ],
    mascotas: [{ nombre: "Max", especie: "perro", raza: "Labrador", color: "Dorado" }],
    coeficiente: 4.2,
    createdAt: "2021-03-15T08:00:00Z",
  },
  {
    id: "INM-002",
    torre: "A",
    numero: "202",
    piso: 2,
    tipo: "apartamento",
    estado: "ocupado",
    areaM2: 85,
    propietarioId: "RES-003",
    residenteIds: ["RES-003"],
    vehiculos: [{ placa: "DEF456", marca: "Renault", modelo: "Logan", color: "Gris", tipo: "carro" }],
    mascotas: [
      { nombre: "Luna", especie: "gato", raza: "Siamés", color: "Beige" },
      { nombre: "Milo", especie: "gato", raza: "Persa", color: "Blanco" },
    ],
    coeficiente: 5.1,
    createdAt: "2021-03-15T08:00:00Z",
  },
  {
    id: "INM-003",
    torre: "A",
    numero: "305",
    piso: 3,
    tipo: "apartamento",
    estado: "en_venta",
    areaM2: 68,
    propietarioId: "RES-004",
    residenteIds: [],
    vehiculos: [],
    mascotas: [],
    coeficiente: 3.9,
    createdAt: "2021-03-15T08:00:00Z",
  },
  {
    id: "INM-004",
    torre: "B",
    numero: "401",
    piso: 4,
    tipo: "apartamento",
    estado: "ocupado",
    areaM2: 95,
    propietarioId: "RES-005",
    residenteIds: ["RES-005", "RES-006", "RES-007"],
    vehiculos: [
      { placa: "GHI321", marca: "Toyota", modelo: "Corolla", color: "Negro", tipo: "carro" },
      { placa: "JKL654", marca: "Mazda", modelo: "CX-5", color: "Azul", tipo: "carro" },
    ],
    mascotas: [{ nombre: "Rocky", especie: "perro", raza: "Bulldog", color: "Atigrado" }],
    coeficiente: 5.8,
    createdAt: "2021-04-01T08:00:00Z",
  },
  {
    id: "INM-005",
    torre: "B",
    numero: "102",
    piso: 1,
    tipo: "apartamento",
    estado: "en_arriendo",
    areaM2: 60,
    propietarioId: "RES-008",
    residenteIds: ["RES-009"],
    vehiculos: [{ placa: "MNO987", marca: "Kia", modelo: "Picanto", color: "Rojo", tipo: "carro" }],
    mascotas: [],
    coeficiente: 3.5,
    createdAt: "2021-04-01T08:00:00Z",
  },
  {
    id: "INM-006",
    torre: "C",
    numero: "201",
    piso: 2,
    tipo: "casa",
    estado: "ocupado",
    areaM2: 130,
    propietarioId: "RES-010",
    residenteIds: ["RES-010"],
    vehiculos: [{ placa: "PQR147", marca: "Ford", modelo: "Explorer", color: "Plata", tipo: "carro" }],
    mascotas: [
      { nombre: "Bella", especie: "perro", raza: "Golden Retriever", color: "Dorado" },
      { nombre: "Toby", especie: "perro", raza: "Beagle", color: "Tricolor" },
    ],
    coeficiente: 7.2,
    createdAt: "2022-01-10T08:00:00Z",
  },
  {
    id: "INM-007",
    torre: "C",
    numero: "L01",
    piso: 0,
    tipo: "local_comercial",
    estado: "ocupado",
    areaM2: 28,
    propietarioId: "RES-004",
    residenteIds: [],
    vehiculos: [],
    mascotas: [],
    coeficiente: 1.8,
    createdAt: "2022-01-10T08:00:00Z",
  },
  {
    id: "INM-008",
    torre: "A",
    numero: "501",
    piso: 5,
    tipo: "apartamento",
    estado: "desocupado",
    areaM2: 78,
    propietarioId: "RES-003",
    residenteIds: [],
    vehiculos: [],
    mascotas: [],
    coeficiente: 4.6,
    createdAt: "2021-03-15T08:00:00Z",
  },
];

export const residentes: Residente[] = [
  {
    id: "RES-001",
    nombre: "Carlos Andrés",
    apellido: "Martínez López",
    email: "carlos.martinez@email.com",
    telefono: "+57 310 234 5678",
    cedula: "79854321",
    rol: "residente",
    estado: "activo",
    inmuebleId: "INM-001",
    createdAt: "2021-03-20T10:00:00Z",
  },
  {
    id: "RES-002",
    nombre: "Diana Marcela",
    apellido: "Rodríguez Gómez",
    email: "diana.rodriguez@email.com",
    telefono: "+57 315 876 4321",
    cedula: "52741852",
    rol: "residente",
    estado: "activo",
    inmuebleId: "INM-001",
    createdAt: "2021-03-20T10:00:00Z",
  },
  {
    id: "RES-003",
    nombre: "Jorge Enrique",
    apellido: "Peña Vargas",
    email: "jorge.pena@email.com",
    telefono: "+57 320 543 2198",
    cedula: "80123456",
    rol: "propietario_no_residente",
    estado: "activo",
    inmuebleId: null,
    createdAt: "2021-04-05T10:00:00Z",
  },
  {
    id: "RES-004",
    nombre: "Luisa Fernanda",
    apellido: "Torres Herrera",
    email: "luisa.torres@email.com",
    telefono: "+57 300 987 6541",
    cedula: "43218765",
    rol: "comite_convivencia",
    estado: "activo",
    inmuebleId: "INM-006",
    createdAt: "2021-05-12T10:00:00Z",
  },
  {
    id: "RES-005",
    nombre: "Andrés Felipe",
    apellido: "Castro Ruiz",
    email: "andres.castro@email.com",
    telefono: "+57 316 321 0987",
    cedula: "1020345678",
    rol: "residente",
    estado: "activo",
    inmuebleId: "INM-004",
    createdAt: "2021-04-15T10:00:00Z",
  },
  {
    id: "RES-006",
    nombre: "María Camila",
    apellido: "Castro Ruiz",
    email: "maria.castro@email.com",
    telefono: "+57 313 456 7890",
    cedula: "1024567890",
    rol: "residente",
    estado: "activo",
    inmuebleId: "INM-004",
    createdAt: "2021-04-15T10:00:00Z",
  },
  {
    id: "RES-007",
    nombre: "Sebastián",
    apellido: "Castro Mora",
    email: "sebastian.castro@email.com",
    telefono: "+57 312 789 0123",
    cedula: "1032456789",
    rol: "residente",
    estado: "activo",
    inmuebleId: "INM-004",
    createdAt: "2022-06-01T10:00:00Z",
  },
  {
    id: "RES-008",
    nombre: "Roberto",
    apellido: "Jiménez Salcedo",
    email: "roberto.jimenez@email.com",
    telefono: "+57 301 654 3210",
    cedula: "17654321",
    rol: "propietario_no_residente",
    estado: "activo",
    inmuebleId: null,
    createdAt: "2021-04-01T10:00:00Z",
  },
  {
    id: "RES-009",
    nombre: "Valentina",
    apellido: "Morales Quintero",
    email: "valentina.morales@email.com",
    telefono: "+57 318 234 5670",
    cedula: "1050123456",
    rol: "residente",
    estado: "activo",
    inmuebleId: "INM-005",
    createdAt: "2023-02-14T10:00:00Z",
  },
  {
    id: "RES-010",
    nombre: "Pedro Pablo",
    apellido: "Guzmán Arias",
    email: "pedro.guzman@email.com",
    telefono: "+57 304 111 2233",
    cedula: "19876543",
    rol: "administrador",
    estado: "activo",
    inmuebleId: "INM-006",
    createdAt: "2021-01-01T10:00:00Z",
  },
  {
    id: "RES-011",
    nombre: "Hernando",
    apellido: "Suárez Bernal",
    email: "hernando.suarez@email.com",
    telefono: "+57 311 444 5566",
    cedula: "14567890",
    rol: "guardia",
    estado: "activo",
    inmuebleId: null,
    createdAt: "2021-02-01T10:00:00Z",
  },
];

export const visitantes: Visitante[] = [
  {
    id: "VIS-001",
    nombre: "Sandra Patricia",
    apellido: "Núñez Ospina",
    cedula: "45678901",
    telefono: "+57 312 900 1234",
    tipoVisita: "familiar",
    inmuebleDestinoId: "INM-001",
    residenteAutorizadorId: "RES-001",
    estado: "finalizado",
    fechaAutorizacion: "2026-06-25T09:00:00Z",
    fechaIngreso: "2026-06-25T14:30:00Z",
    fechaSalida: "2026-06-25T18:45:00Z",
    observaciones: "Hermana del propietario",
    createdAt: "2026-06-25T09:00:00Z",
  },
  {
    id: "VIS-002",
    nombre: "Juan Sebastián",
    apellido: "Ríos Medina",
    cedula: "1088776655",
    telefono: "+57 300 112 2334",
    tipoVisita: "proveedor",
    inmuebleDestinoId: "INM-004",
    residenteAutorizadorId: "RES-005",
    estado: "en_conjunto",
    fechaAutorizacion: "2026-06-29T08:00:00Z",
    fechaIngreso: "2026-06-29T10:15:00Z",
    vehiculoPlaca: "TUV258",
    observaciones: "Técnico de Claro - instalación fibra óptica",
    createdAt: "2026-06-29T08:00:00Z",
  },
  {
    id: "VIS-003",
    nombre: "Catalina",
    apellido: "Agudelo Restrepo",
    cedula: "32109876",
    telefono: "+57 316 445 6677",
    tipoVisita: "amigo",
    inmuebleDestinoId: "INM-002",
    residenteAutorizadorId: "RES-003",
    estado: "autorizado",
    fechaAutorizacion: "2026-06-29T11:00:00Z",
    observaciones: "Visita programada para almuerzo",
    createdAt: "2026-06-29T11:00:00Z",
  },
  {
    id: "VIS-004",
    nombre: "Repartidor",
    apellido: "Rappi Colombia",
    cedula: "N/A",
    telefono: "+57 320 000 1111",
    tipoVisita: "delivery",
    inmuebleDestinoId: "INM-001",
    residenteAutorizadorId: "RES-002",
    estado: "finalizado",
    fechaAutorizacion: "2026-06-28T19:30:00Z",
    fechaIngreso: "2026-06-28T19:55:00Z",
    fechaSalida: "2026-06-28T20:05:00Z",
    vehiculoPlaca: "BIC-007",
    observaciones: "Pedido de comida - solo hasta portería",
    createdAt: "2026-06-28T19:30:00Z",
  },
  {
    id: "VIS-005",
    nombre: "Mauricio",
    apellido: "Palomino Vidal",
    cedula: "71234567",
    telefono: "+57 305 678 9012",
    tipoVisita: "proveedor",
    inmuebleDestinoId: "INM-005",
    residenteAutorizadorId: "RES-009",
    estado: "pendiente",
    fechaAutorizacion: "2026-06-30T09:00:00Z",
    observaciones: "Plomero - revisión tubería",
    createdAt: "2026-06-29T15:20:00Z",
  },
  {
    id: "VIS-006",
    nombre: "Gloria Inés",
    apellido: "Zapata Cárdenas",
    cedula: "41098765",
    telefono: "+57 317 234 5601",
    tipoVisita: "familiar",
    inmuebleDestinoId: "INM-004",
    residenteAutorizadorId: "RES-005",
    estado: "rechazado",
    fechaAutorizacion: "2026-06-27T16:00:00Z",
    observaciones: "Acceso denegado: no coincide con identidad registrada",
    createdAt: "2026-06-27T16:00:00Z",
  },
  {
    id: "VIS-007",
    nombre: "Felipe Augusto",
    apellido: "Bermúdez Leal",
    cedula: "1062345678",
    telefono: "+57 314 890 1234",
    tipoVisita: "amigo",
    inmuebleDestinoId: "INM-006",
    residenteAutorizadorId: "RES-004",
    estado: "finalizado",
    fechaAutorizacion: "2026-06-26T17:00:00Z",
    fechaIngreso: "2026-06-26T17:20:00Z",
    fechaSalida: "2026-06-26T22:10:00Z",
    vehiculoPlaca: "STU852",
    createdAt: "2026-06-26T17:00:00Z",
  },
];

export const pagos: Pago[] = [
  {
    id: "PAG-001",
    inmuebleId: "INM-001",
    residenteId: "RES-001",
    concepto: "administracion",
    descripcion: "Cuota de administración – Junio 2026",
    monto: 285000,
    estado: "pagado",
    fechaVencimiento: "2026-06-10T00:00:00Z",
    fechaPago: "2026-06-07T11:32:00Z",
    periodo: "2026-06",
    comprobante: "COMP-20260607-001",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "PAG-002",
    inmuebleId: "INM-002",
    residenteId: "RES-003",
    concepto: "administracion",
    descripcion: "Cuota de administración – Junio 2026",
    monto: 335000,
    estado: "vencido",
    fechaVencimiento: "2026-06-10T00:00:00Z",
    periodo: "2026-06",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "PAG-003",
    inmuebleId: "INM-004",
    residenteId: "RES-005",
    concepto: "administracion",
    descripcion: "Cuota de administración – Junio 2026",
    monto: 382000,
    estado: "pagado",
    fechaVencimiento: "2026-06-10T00:00:00Z",
    fechaPago: "2026-06-05T09:15:00Z",
    periodo: "2026-06",
    comprobante: "COMP-20260605-003",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "PAG-004",
    inmuebleId: "INM-005",
    residenteId: "RES-009",
    concepto: "administracion",
    descripcion: "Cuota de administración – Junio 2026",
    monto: 230000,
    estado: "pendiente",
    fechaVencimiento: "2026-07-10T00:00:00Z",
    periodo: "2026-06",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "PAG-005",
    inmuebleId: "INM-004",
    residenteId: "RES-005",
    concepto: "parqueadero",
    descripcion: "Parqueadero adicional visitantes – Mayo 2026",
    monto: 85000,
    estado: "pagado",
    fechaVencimiento: "2026-05-10T00:00:00Z",
    fechaPago: "2026-05-08T16:45:00Z",
    periodo: "2026-05",
    comprobante: "COMP-20260508-005",
    createdAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "PAG-006",
    inmuebleId: "INM-002",
    residenteId: "RES-003",
    concepto: "multa",
    descripcion: "Multa por ruido excesivo – infracción 15/05/2026",
    monto: 120000,
    estado: "en_mora",
    fechaVencimiento: "2026-05-25T00:00:00Z",
    periodo: "2026-05",
    createdAt: "2026-05-16T00:00:00Z",
  },
  {
    id: "PAG-007",
    inmuebleId: "INM-006",
    residenteId: "RES-004",
    concepto: "cuota_extraordinaria",
    descripcion: "Cuota extraordinaria – Reparación ascensor Torre C",
    monto: 450000,
    estado: "pagado",
    fechaVencimiento: "2026-06-20T00:00:00Z",
    fechaPago: "2026-06-18T14:00:00Z",
    periodo: "2026-06",
    comprobante: "COMP-20260618-007",
    createdAt: "2026-06-10T00:00:00Z",
  },
  {
    id: "PAG-008",
    inmuebleId: "INM-001",
    residenteId: "RES-001",
    concepto: "administracion",
    descripcion: "Cuota de administración – Julio 2026",
    monto: 285000,
    estado: "pendiente",
    fechaVencimiento: "2026-07-10T00:00:00Z",
    periodo: "2026-07",
    createdAt: "2026-07-01T00:00:00Z",
  },
];

// exports de respaldo (entidad con página pero sin datos en el mock)
export const EstadoResidente: any[] = [];
export const Mascota: any[] = [];
export const Residente: any[] = [];
export const RolUsuario: any[] = [];
export const Vehiculo: any[] = [];