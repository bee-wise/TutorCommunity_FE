"use client";

import { useEffect, useRef } from "react";
import { Info, Copy, Download, Hash } from "lucide-react";
import type { ChatMessage } from "../types/messages.types";

interface MessageContextMenuProps {
  message: ChatMessage | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onViewDetails: (message: ChatMessage) => void;
}

export function MessageContextMenu({
  message,
  position,
  onClose,
  onViewDetails,
}: MessageContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!position) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [position, onClose]);

  if (!position || !message) return null;

  // Keep menu within viewport bounds
  const menuWidth = 190;
  const menuHeight = 160;
  const adjustedX = Math.max(10, Math.min(position.x, window.innerWidth - menuWidth - 12));
  const adjustedY = Math.max(10, Math.min(position.y, window.innerHeight - menuHeight - 12));

  const handleCopyText = async () => {
    if (message.text) {
      try {
        await navigator.clipboard.writeText(message.text);
      } catch {
        // fallback
      }
    }
    onClose();
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(message.id);
    } catch {
      // fallback
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{ top: `${adjustedY}px`, left: `${adjustedX}px` }}
      className="fixed z-50 min-w-[185px] overflow-hidden rounded-xl border border-border bg-popover/95 p-1 text-popover-foreground shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95"
      role="menu"
      aria-orientation="vertical"
    >
      <button
        type="button"
        onClick={() => {
          onViewDetails(message);
          onClose();
        }}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
        role="menuitem"
      >
        <Info size={14} className="text-primary" />
        <span>Xem chi tiết</span>
      </button>

      {message.text && (
        <button
          type="button"
          onClick={handleCopyText}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
          role="menuitem"
        >
          <Copy size={14} className="text-muted-foreground" />
          <span>Sao chép tin nhắn</span>
        </button>
      )}

      {message.attachment && (
        <a
          href={message.attachment.url}
          download={message.attachment.name}
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
          role="menuitem"
        >
          <Download size={14} className="text-muted-foreground" />
          <span>Tải tệp đính kèm</span>
        </a>
      )}

      <div className="my-1 h-px bg-border/60" />

      <button
        type="button"
        onClick={handleCopyId}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
        role="menuitem"
      >
        <Hash size={13} />
        <span>Sao chép Message ID</span>
      </button>
    </div>
  );
}
