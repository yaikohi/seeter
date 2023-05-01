import { LoadingSpinner } from "./ui/loading-spinner";

export const LoadingPage = () => {
  return (
    <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-white to-slate-600">
      <div className="absolute left-1/2 top-1/3">
        <LoadingSpinner />
      </div>
    </div>
  );
};
