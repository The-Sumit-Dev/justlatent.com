import { Download, Smartphone, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import latentIcon from "@/assets/logo/latent-a-icon.webp";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;
    if (isStandalone) {
      setInstalled(true);
      return;
    }

    // Check iOS user agent
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const dismissed = localStorage.getItem("justlatent_pwa_dismissed");

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If iOS and not dismissed, show banner after 3 seconds
    if (isIosDevice && !dismissed) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      // General fallback
      alert("To install JustLatent, tap your browser's menu (⋮) and select 'Install app' or 'Add to Home screen'.");
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIosGuide(false);
    localStorage.setItem("justlatent_pwa_dismissed", "true");
  };

  if (installed || (!showBanner && !showIosGuide)) return null;

  return (
    <>
      {showBanner && !showIosGuide ? (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-fade-in">
          <div className="relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-white/15 bg-black/90 p-3.5 shadow-2xl backdrop-blur-xl sm:p-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-purple-900/40 p-1 ring-1 ring-white/20">
                <img src={latentIcon} alt="JustLatent App" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="truncate text-xs font-bold text-white sm:text-sm">Install JustLatent App</h4>
                  <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary">FREE</span>
                </div>
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                  Instant full-screen streaming on mobile
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-md transition-transform hover:scale-105 active:scale-95 sm:px-4"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Install</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* iOS Instructions Modal */}
      {showIosGuide ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleDismiss();
          }}
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-card p-6 shadow-2xl text-foreground animate-scale-in">
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-accent hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary/20 text-primary ring-1 ring-primary/40">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
                <p className="text-xs text-muted-foreground">Add JustLatent to your Home Screen</p>
              </div>
            </div>

            <ol className="mt-5 space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-foreground">
                  1
                </span>
                <span>
                  Tap the <strong className="text-white">Share</strong> button at the bottom of Safari screen.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-foreground">
                  2
                </span>
                <span>
                  Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-foreground">
                  3
                </span>
                <span>
                  Tap <strong className="text-white">Add</strong> on the top right to complete installation.
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={handleDismiss}
              className="mt-6 flex h-10 w-full items-center justify-center rounded-xl bg-primary font-bold text-xs text-primary-foreground transition-all hover:brightness-110"
            >
              Got it!
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
