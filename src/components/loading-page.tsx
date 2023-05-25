import { LoadingSpinner } from "./ui/loading-spinner";

export const LoadingPage = () => {
  return (
    <div className="inset-0 flex h-screen w-screen items-center justify-center bg-opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted to-background">
      <LoadingSpinner />
    </div>
  );
};
