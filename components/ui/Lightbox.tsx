"use client";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [currentIndex, images.length, onClose, onNavigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-navy/90 backdrop-blur-lg" />

      {/* Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 glass-coral text-white text-sm px-4 py-1.5 rounded-full font-inter z-10">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Close */}
      <button
        className="absolute top-6 right-6 glass-dark text-white rounded-full p-2 z-10 hover:brightness-125 transition-all"
        onClick={onClose}
      >
        <X size={22} />
      </button>

      {/* Prev */}
      {currentIndex > 0 && (
        <button
          className="absolute left-4 glass-dark text-white rounded-full p-3 z-10 hover:brightness-125 transition-all"
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Next */}
      {currentIndex < images.length - 1 && (
        <button
          className="absolute right-4 glass-dark text-white rounded-full p-3 z-10 hover:brightness-125 transition-all"
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 max-w-5xl max-h-[80vh] w-full mx-16"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
