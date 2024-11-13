import { useState, useEffect, useRef, Suspense } from "react";

import Spinner from "./spinner";

const LazyLoadComponent = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={
          <div className="w-full flex items-center justify-center">
            <Spinner center />
          </div>
        }>
          {children}
        </Suspense>
      ) : (
        <div style={{ minHeight: "200px" }} />
      )}
    </div>
  );
};

export default LazyLoadComponent;