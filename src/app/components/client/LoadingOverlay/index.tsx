const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black opacity-25 flex items-center justify-center z-50 pointer-events-auto">
      <div className="animate-spin rounded-full border-t-4 border-white w-16 h-16"></div>
    </div>
  );
};

export default LoadingOverlay;
