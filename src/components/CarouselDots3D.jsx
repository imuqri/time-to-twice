import { useMemo } from "react";
import styles from "./Carousel.module.css";

const MAX_TRANSLATE_Z = 140;
const MAX_SCALE_REDUCTION = 0.14;
const CULL_DISTANCE = 3;
const MAX_TRANSLATE_X = 28;

export default function CarouselDots3D({ count, activeIndex, onChange }) {
  const dots = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const distance = Math.abs(i - activeIndex);
      if (distance > CULL_DISTANCE) continue;
      const clamped = Math.min(CULL_DISTANCE, distance);
      const direction = i - activeIndex;
      const scale = 1 - clamped * MAX_SCALE_REDUCTION;
      const translateZ = clamped * 20;
      const translateX = direction * MAX_TRANSLATE_X;
      const opacity = 1 - clamped * 0.22;
      const zIndex = 10 - clamped;
      arr.push({ i, distance, clamped, scale, translateZ, translateX, opacity, zIndex, isActive: distance === 0 });
    }
    return arr;
  }, [count, activeIndex]);

  return (
    <div className={styles.dots3d} role="tablist" aria-label="Carousel navigation">
      {dots.map(({ i, scale, translateZ, translateX, opacity, zIndex, isActive }) => (
        <button
          key={i}
          className={`${styles.dot3d} ${isActive ? styles.dot3dActive : ""}`}
          onClick={() => onChange(i)}
          role="tab"
          aria-selected={isActive}
          aria-label={`Go to slide ${i + 1}`}
          style={{
            transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
            opacity,
            zIndex,
          }}
        />
      ))}
    </div>
  );
}