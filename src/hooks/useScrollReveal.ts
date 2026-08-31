import { useEffect } from "react";

const REVEAL_SELECTOR = ".reveal, .reveal-left, .reveal-scale";

export function useScrollReveal() {
  useEffect(() => {
    let intersectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const observedElements = new WeakSet<Element>();

    const observeElements = (root: ParentNode = document) => {
      if (!intersectionObserver) return;

      const elements = root.querySelectorAll(REVEAL_SELECTOR);

      elements.forEach((element) => {
        if (observedElements.has(element)) return;

        observedElements.add(element);
        intersectionObserver?.observe(element);
      });
    };

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target;

          element.classList.add("visible");

          // Once visible, we don't need to observe it anymore.
          intersectionObserver?.unobserve(element);
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    // Observe everything that already exists.
    observeElements();

    // IMPORTANT:
    // React creates new DOM elements when navigating between
    // Home -> Shop -> Compare -> Reviews -> etc.
    // MutationObserver detects those newly-created elements.
    mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          const element = node as Element;

          if (element.matches(REVEAL_SELECTOR)) {
            observeElements(element.parentElement ?? document);
          } else {
            observeElements(element);
          }
        });
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      intersectionObserver?.disconnect();
      mutationObserver?.disconnect();

      intersectionObserver = null;
      mutationObserver = null;
    };
  }, []);
}