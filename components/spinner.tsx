const Spinner = ({ center }: { center?: boolean }) => {
  return (
    center ? (
      <div className="flex flex-col items-center justify-center gap-12 min-h-screen">
        <div className="border-t-4 border-primary border-solid rounded-full w-14 h-14 animate-spin" />
        <p className="text-lg">Đang tải...</p>
      </div>
    ) : (
      <div className="border-t-4 border-primary border-solid rounded-full w-6 h-6 animate-spin" />
    )
  );
};

export default Spinner;