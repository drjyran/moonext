"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button className="text-sm text-slate-500" onClick={onClose}>Close</button>
        </div>
        <div>{children}</div>
        {footer ? <div className="mt-4 flex justify-end gap-2">{footer}</div> : null}
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
          <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>{loading ? "Please wait..." : confirmText}</Button>
        </>
      )}
    >
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  );
}
