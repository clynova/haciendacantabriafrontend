const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full" />
        </div>
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
};

export { LoadingSpinner };