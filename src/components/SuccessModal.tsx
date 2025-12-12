import React, { ReactNode } from "react";
import svgPaths from "../imports/svg-tm4zbha7id";
import "./SuccessModal.css";

type AlertType = "success" | "payment";
type ButtonVariant = "pink" | "teal" | "danger";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;

  type?: AlertType;

  title?: string;
  message?: string;

  primaryText?: string;
  onPrimary?: () => void;
  primaryVariant?: ButtonVariant;

  secondaryText?: string;
  onSecondary?: () => void;
  secondaryVariant?: ButtonVariant;

  icon?: ReactNode;
}

export default function AlertModal({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
  primaryText,
  onPrimary,
  primaryVariant = "pink",
  secondaryText,
  onSecondary,
  secondaryVariant = "danger",
  icon,
}: AlertModalProps) {
  if (!isOpen) return null;

  const CONFIG = {
    success: {
      color: "#ffb4c4",
      defaultTitle: "Berhasil",
      defaultMessage: "Aksi berhasil dilakukan",
      defaultPrimary: "Selanjutnya",
    },
    payment: {
      color: "#34c165",
      defaultTitle: "Lanjutkan Pembayaran",
      defaultMessage: "Lanjutkan pembayaran melalui WhatsApp",
      defaultPrimary: "Bayar",
    },
  }[type];

  const handlePrimary = () => {
    onPrimary ? onPrimary() : onClose();
  };

  const handleSecondary = () => {
    onSecondary ? onSecondary() : onClose();
  };

  const primaryClass = `success-modal-btn success-modal-btn--${primaryVariant}`;
  const secondaryClass = `success-modal-btn success-modal-btn--${secondaryVariant}`;

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="success-modal-icon" style={{ backgroundColor: CONFIG.color }}>
          {icon ?? (
            <svg viewBox="0 0 181 181" className="success-modal-icon-svg">
              <path d={svgPaths.p2fc54f00} />
            </svg>
          )}
        </div>

        <p className="success-modal-title">{title ?? CONFIG.defaultTitle}</p>

        {message ? (
          <p className="success-modal-description">{message}</p>
        ) : null}

        <div className="success-modal-actions">
          {secondaryText && (
            <button
              type="button"
              className={secondaryClass}
              onClick={handleSecondary}
            >
              {secondaryText}
            </button>
          )}

          <button
            type="button"
            className={primaryClass}
            onClick={handlePrimary}
          >
            {primaryText ?? CONFIG.defaultPrimary}
          </button>
        </div>
      </div>
    </div>
  );
}
