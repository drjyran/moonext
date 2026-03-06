"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Toast = {
  id: number;
  title: string;
  type: "success" | "error";
};

type ToastContextType = {
  pushToast: (title: string, type?: Toast["type"]) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((title: string, type: Toast["type"] = "success") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "min-w-52 rounded-lg px-4 py-3 text-sm text-white shadow-lg",
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            )}
          >
            {toast.title}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
