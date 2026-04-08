export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso no autorizado</h1>
        <p className="text-gray-600">No tenés permiso para acceder a esta página.</p>
        <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
