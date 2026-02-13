import { motion } from "framer-motion";

const AnimatedButton = ({
    children,
    onClick,
    type = "button",
    disabled = false,
    loading = false,
    className = "",
    variant = "btn-primary"
}) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`btn ${variant} ${className} relative overflow-hidden`}
        >
            {loading ? (
                <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span className="ml-2">Processing...</span>
                </>
            ) : (
                children
            )}
        </motion.button>
    );
};

export default AnimatedButton;
