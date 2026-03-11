import { useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export function LaserCard({
  children,
  className = "",
  colorType = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  colorType?: "primary" | "accent" | "purple";
}) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use raw framer-motion values to track mouse position for the gradient
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Define glow colors based on category
  const glowThemeMap = {
    primary: "rgba(0, 212, 255, 0.15)", // Cyan
    accent: "rgba(0, 255, 136, 0.15)",  // Green
    purple: "rgba(124, 58, 237, 0.15)", // Purple
  };

  const glowColor = glowThemeMap[colorType];

  const backgroundTemplate = useMotionTemplate`
    radial-gradient(
      450px circle at ${mouseX}px ${mouseY}px,
      ${glowColor},
      transparent 80%
    )
  `;

  const borderTemplate = useMotionTemplate`
    radial-gradient(
      300px circle at ${mouseX}px ${mouseY}px,
      ${glowColor.replace("0.15", "0.6")},
      transparent 40%
    )
  `;

  return (
    <div
      className={`group relative rounded-2xl bg-dark-800/80 border border-white/5 backdrop-blur-md overflow-hidden transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* 
        This is the inner gradient mask that follows the cursor.
        It creates a subtle "flashlight" effect on the card background.
      */}
      {isMounted && (
        <motion.div
           className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
           style={{ background: backgroundTemplate }}
        />
      )}

      {/* 
        This is a second border gradient that acts as the "laser stroke"
        along the very edge of the card.
      */}
      {isMounted && (
        <motion.div
           className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
           style={{
             background: borderTemplate,
             maskImage: "linear-gradient(black, black)",
             maskComposite: "exclude",
             WebkitMaskImage: "linear-gradient(black, black)",
             WebkitMaskComposite: "source-out",
             padding: "1px",
           }}
        />
      )}

      {/* Actual Content Wrapper */}
      <div className="relative h-full w-full z-10 bg-dark-800/30 rounded-2xl">
        {children}
      </div>
    </div>
  );
}
