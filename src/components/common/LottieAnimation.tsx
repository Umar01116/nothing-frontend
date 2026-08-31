import { useEffect, useRef } from "react";
import lottie from "lottie-web/build/player/lottie_light";
import type { AnimationItem } from "lottie-web";

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  className = "",
  style,
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animInstance = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current || !animationData) return;

    if (animInstance.current) {
      animInstance.current.destroy();
    }

    animInstance.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay,
      animationData,
    });

    return () => {
      animInstance.current?.destroy();
      animInstance.current = null;
    };
  }, [animationData, loop, autoplay]);

  return <div ref={containerRef} className={className} style={style} />;
}

export default LottieAnimation;
