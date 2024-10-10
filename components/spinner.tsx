const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-12 min-h-screen">
      <div className="border-t-4 border-primary border-solid rounded-full w-14 h-14 animate-spin" />
      <p className="text-lg">Đang tải...</p>
    </div>
  );
};

export default Spinner;