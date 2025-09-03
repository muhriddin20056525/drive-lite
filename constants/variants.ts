import { Variants } from "framer-motion";

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
};
