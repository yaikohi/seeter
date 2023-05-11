import { Spinner } from "./spinner";

export const LoadingSpinner = () => {
  return (
    <div role="status">
      <Spinner />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
