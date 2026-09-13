"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  panelClassName?: string;
};

export function Modal({ open, title, onClose, children, footer, panelClassName }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className={`max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-xl bg-white p-4 shadow-xl sm:p-5 ${panelClassName || "max-w-lg"}`}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button className="text-sm text-slate-500" onClick={onClose}>Close</button>
        </div>
        <div>{children}</div>
        {footer ? <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div> : null}
      </div>
    </div>
  );
}

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  loading,
  onCancel,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={(
        <>
          <Button variant="secondary" className="w-full sm:w-auto" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="danger" className="w-full sm:w-auto" onClick={onConfirm} disabled={loading}>{loading ? "Please wait..." : confirmText}</Button>
        </>
      )}
    >
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  );
}
