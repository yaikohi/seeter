import { LoadingSpinner } from "./ui/loading-spinner";

export const LoadingPage = () => {
  return (
    <div className="inset-0 bg-opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted to-background h-screen w-screen flex justify-center items-center">
        <LoadingSpinner />
    </div>
  );
};
