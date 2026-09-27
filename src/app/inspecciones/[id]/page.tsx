import { notFound } from 'next/navigation';

// Base de datos sintética simulada
const mockDatabase: Record<string, any> = {
  'INS-001': {
    id: 'INS-001',
    laboratorio: 'Laboratorio de Química Central',
    estado: 'Completado',
    fecha: '2023-10-25',
    inspector: 'Dra. María González',
    observaciones: 'Todo en orden. Extintores actualizados.'
  },
  'INS-002': {
    id: 'INS-002',
    laboratorio: 'Laboratorio de Biología Molecular',
    estado: 'Pendiente',
    fecha: '2023-10-26',
    inspector: 'Dr. Carlos Ruiz',
    observaciones: 'Revisar microscopios y campana de extracción.'
  },
  'INS-003': {
    id: 'INS-003',
    laboratorio: 'Taller de Mecatrónica',
    estado: 'En Progreso',
    fecha: '2023-10-27',
    inspector: 'Ing. Roberto Méndez',
    observaciones: 'Verificando cableado estructurado.'
  }
};

// Función para obtener detalles de la inspección con simulación de red (SSR)
const getInspectionDetails = async (id: string) => {
  // Simular latencia de red para demostrar el estado de carga
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const data = mockDatabase[id];
  
  if (!data) {
    throw new Error('NOT_FOUND');
  }

  return data;
}

export default async function InspeccionDetalle({ params }: { params: { id: string } }) {
  let data;
  
  try {
    data = await getInspectionDetails(params.id);
  } catch (error) {
    // Si la inspección no existe, delegar al manejador de no encontrado o error
    notFound();
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Detalle de Inspección: {data.id}</h1>
        <p className="text-gray-600">Renderizado en el servidor (SSR) mediante ruta dinámica.</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Laboratorio</dt>
            <dd className="mt-1 text-lg text-gray-900">{data.laboratorio}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Estado</dt>
            <dd className="mt-1 text-lg text-gray-900">
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                data.estado === 'Completado' ? 'bg-green-100 text-green-800' : 
                data.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-blue-100 text-blue-800'
              }`}>
                {data.estado}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Fecha de Inspección</dt>
            <dd className="mt-1 text-lg text-gray-900">{data.fecha}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Inspector</dt>
            <dd className="mt-1 text-lg text-gray-900">{data.inspector}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Observaciones</dt>
            <dd className="mt-1 text-lg text-gray-900 bg-gray-50 p-4 rounded-md border border-gray-100">{data.observaciones}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
