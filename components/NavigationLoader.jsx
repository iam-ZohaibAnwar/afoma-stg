import React from "react";
import { useRouter } from "next/router";

const LOADER_THRESHOLD = 100; // Reduced threshold for faster feedback

export default function NavigationLoader(props) {
  const { text = "Loading..." } = props;
  const [isLoading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    let timer;
    let startTime = 0;

    const handleStart = () => {
      startTime = Date.now();
      // Show loader immediately for slow routes, but delay for fast ones
      timer = setTimeout(() => {
        // Only show if navigation is still in progress
        if (Date.now() - startTime >= LOADER_THRESHOLD) {
          setLoading(true);
        }
      }, LOADER_THRESHOLD);
    };

    const handleComplete = () => {
      if (timer) clearTimeout(timer);
      // Hide loader with a small delay to prevent flicker
      const elapsed = Date.now() - startTime;
      if (elapsed < 150) {
        // If navigation was very fast, hide immediately
        setLoading(false);
      } else {
        // Otherwise, hide after a brief delay
        setTimeout(() => setLoading(false), 50);
      }
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);

      if (timer) clearTimeout(timer);
    };
  }, [router.events]);

  if (!isLoading) return null;

  return <div className="navigation-loader">{text}</div>;
}
