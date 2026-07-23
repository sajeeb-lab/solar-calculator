import { useEffect, useState } from "react";

/* Loads the Google Maps JS API (Places library) once a key exists. */
export const useGoogleMaps = (apiKey) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!apiKey) return;
    if (window.google?.maps?.places) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    s.async = true;
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, [apiKey]);

  return ready;
};
