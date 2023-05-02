import { LoadingSpinner } from "./ui/loading-spinner";

export const LoadingPage = () => {
  return (
    <div className="absolute inset-0 h-full w-full  bg-opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted to-background">
      <div className="absolute left-1/2 top-1/3">
        <LoadingSpinner />
      </div>
    </div>
  );
};
