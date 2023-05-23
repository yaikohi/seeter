import { Spinner } from "./spinner";

export const LoadingSpinner = () => {
  return (
    <div role="status" className="flex w-full justify-center p-8">
      <Spinner />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
