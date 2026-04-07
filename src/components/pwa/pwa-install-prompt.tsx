"use client";

import { InstallBanner } from "./install-banner";
import { ShareGuide } from "./share-guide";

export function PwaInstallPrompt() {
  return (
    <>
      <InstallBanner />
      <ShareGuide />
    </>
  );
}
