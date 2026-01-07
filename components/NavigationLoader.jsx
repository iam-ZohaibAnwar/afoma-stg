import React from "react";
import { useRouter } from "next/router";

// Subtle progress bar that only shows for slow navigations (>300ms)
// Doesn't block route changes - provides feedback without being intrusive
const LOADER_THRESHOLD = 300; // Only show if navigation takes longer than 300ms

export default function NavigationLoader() {
  const [isLoading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const router = useRouter();

  React.useEffect(() => {
    let timer;
    let progressTimer;
    let startTime = 0;

    const handleStart = () => {
      startTime = Date.now();
      setProgress(0);
      
      // Only show progress bar if navigation takes longer than threshold
      timer = setTimeout(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= LOADER_THRESHOLD) {
          setLoading(true);
          setProgress(20);
          
          // Simulate progress (not actual progress, just visual feedback)
          progressTimer = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 90) return prev; // Stop at 90%, complete on route change
              return prev + Math.random() * 10;
            });
          }, 100);
        }
      }, LOADER_THRESHOLD);
    };

    const handleComplete = () => {
      if (timer) clearTimeout(timer);
      if (progressTimer) clearInterval(progressTimer);
      
      // Complete the progress bar quickly
      setProgress(100);
      
      // Hide after a brief moment
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
      
      if (timer) clearTimeout(timer);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [router.events]);

  if (!isLoading) return null;

  return (
    <div className="navigation-loader">
      <div 
        className="navigation-loader-progress"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
