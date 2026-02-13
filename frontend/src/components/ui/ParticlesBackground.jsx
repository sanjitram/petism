import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ParticlesBackground = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate random particles
        const particleCount = 20;
        const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            duration: Math.random() * 20 + 10,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-primary/20"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}rem`,
                        height: `${particle.size}rem`,
                    }}
                    animate={{
                        x: [0, Math.random() * 100 - 50, 0],
                        y: [0, Math.random() * 100 - 50, 0],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-base-200/90 backdrop-blur-[1px]" />
        </div>
    );
};

export default ParticlesBackground;
