import { useEffect } from "react";
import splitbee from "@splitbee/web";

export const useInitTracking = (): void => {
  useEffect(() => {
    splitbee.init({
      apiUrl: "/sb-api",
      scriptUrl: "/sb.js",
    });
  }, []);
};
