import { motion } from "framer-motion";

const AnimatedInput = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    required = false,
    isTextarea = false,
    className = ""
}) => {
    return (
        <div className={`form-control w-full ${className}`}>
            <label className="label">
                <span className="label-text font-medium text-base-content/80">{label}</span>
            </label>
            <motion.div
                whileTap={{ scale: 0.995 }}
                className="relative"
            >
                {isTextarea ? (
                    <textarea
                        className="textarea textarea-bordered w-full h-32 text-base focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200 bg-base-200/50 hover:bg-base-200 focus:bg-base-100"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        required={required}
                    />
                ) : (
                    <input
                        type={type}
                        className="input input-bordered w-full text-base focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200 bg-base-200/50 hover:bg-base-200 focus:bg-base-100"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        required={required}
                        min={type === "number" ? "1" : undefined}
                    />
                )}
            </motion.div>
        </div>
    );
};

export default AnimatedInput;
