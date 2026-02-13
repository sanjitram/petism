import { motion } from "framer-motion";

const AnimatedCard = ({ children, className = "", delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={`card bg-base-100 shadow-xl border border-base-content/5 backdrop-blur-sm ${className}`}
        >
            <div className="card-body p-6 sm:p-8">
                {children}
            </div>
        </motion.div>
    );
};

export default AnimatedCard;
