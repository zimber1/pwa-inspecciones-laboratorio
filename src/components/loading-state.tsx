export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">Cargando detalles de inspección...</h2>
      <p className="text-gray-500 mt-2 text-sm">Obteniendo información del servidor</p>
    </div>
  );
}
