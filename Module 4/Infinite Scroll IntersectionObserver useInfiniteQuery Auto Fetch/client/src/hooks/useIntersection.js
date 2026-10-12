import { useEffect } from "react";

export function useIntersection(ref, onIntersect) {
  useEffect(() => {
    const el = ref.current;
    if (el === null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting === true) {
          onIntersect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "300px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, onIntersect]);
}
