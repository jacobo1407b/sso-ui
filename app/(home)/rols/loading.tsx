// app/dashboard/loading.tsx
export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-default-500">Cargando detalles del usuario...</p>
            </div>
        </div>
    );
}
