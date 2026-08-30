'use client';

import { useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'sonner';
import { Button } from './Button';

interface QrCodeModalProps {
  url: string;
  codigo: string;
  onClose: () => void;
}

export function QrCodeModal({ url, codigo, onClose }: QrCodeModalProps) {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  function handleDownload() {
    const canvas = canvasWrapperRef.current?.querySelector('canvas');
    if (!canvas) {
      toast.error('Não foi possível gerar a imagem do QR Code.');
      return;
    }
    const link = document.createElement('a');
    link.download = `medidacerta-${codigo}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="QR Code do código de acesso"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-[var(--color-accent-gold)]/30 bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-title mb-4 text-center text-xl font-bold text-[var(--color-text-title)]">
          QR Code de acesso
        </h2>
        <div ref={canvasWrapperRef} className="flex justify-center rounded-lg bg-white p-4">
          <QRCodeCanvas value={url} size={200} fgColor="#3b2914" level="M" />
        </div>
        <p className="mt-3 break-all text-center text-xs text-slate-500">{url}</p>
        <div className="mt-5 flex justify-center gap-3">
          <Button type="button" variant="secondary" onClick={handleDownload}>
            Baixar imagem
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
