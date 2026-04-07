"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function getInitialStandalone() {
  if (typeof window === "undefined") return false;
  return !!(
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as unknown as { standalone: boolean }).standalone)
  );
}

function getInitialIOS() {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|Chrome/.test(ua);
  return isIOSDevice && isSafari;
}

export function usePwaInstall() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS] = useState(getInitialIOS);
  const [isStandalone] = useState(getInitialStandalone);

  useEffect(() => {
    // Android/Chrome: beforeinstallprompt 이벤트 캡처
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt.current) return false;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    deferredPrompt.current = null;
    setIsInstallable(false);
    return outcome === "accepted";
  }, []);

  return { isInstallable, isIOS, isStandalone, promptInstall };
}
