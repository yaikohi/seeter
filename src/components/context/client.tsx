import React from "react";

/**
 * The effect runs when the component that uses this hook gets added to the page.
 * That means that the moment this runs the component runs on the client.
 */
function useIsClient() {
  const [isClient, setClient] = React.useState(false);

  React.useEffect(() => {
    setClient(true);
  }, []);

  return isClient;
}

export default useIsClient;
