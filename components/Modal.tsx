"use client";

import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-abyss rounded-lg shadow-lg w-full max-w-md p-5">
        {/* Title */}
        {title && (
          <h2 className="text-lg font-semibold text-skyfog mb-4">{title}</h2>
        )}

        {/* Body */}
        {children}

        {/* Footer */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-storm text-skyfog rounded-md hover:bg-graphite"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
