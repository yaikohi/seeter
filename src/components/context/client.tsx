import React from "react";

function useIsClient() {
  const [isClient, setClient] = React.useState(false);

  React.useEffect(() => {
    setClient(true);
  }, []);

  return isClient;
}

export default useIsClient;
