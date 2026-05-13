"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { RiAlertLine } from "react-icons/ri";

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", variant = "danger" }) {
  const variantStyles = {
    danger: "bg-danger hover:bg-danger/90 shadow-danger/25",
    warning: "bg-warning hover:bg-warning/90 shadow-warning/25",
    primary: "bg-primary hover:bg-primary-dark shadow-primary/25",
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface rounded-2xl shadow-xl border border-border z-50 p-6 outline-none"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${variant === "danger" ? "bg-danger/10" : "bg-warning/10"}`}>
                    <RiAlertLine size={22} className={variant === "danger" ? "text-danger" : "text-warning"} />
                  </div>
                  <div>
                    <Dialog.Title className="text-base font-bold text-text">{title}</Dialog.Title>
                  </div>
                </div>
                <p className="text-sm text-text-muted leading-relaxed mb-6">{message}</p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-text hover:bg-base-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all ${variantStyles[variant]}`}
                  >
                    {confirmLabel}
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
