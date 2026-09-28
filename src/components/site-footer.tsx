import { Link } from "@tanstack/react-router";

import latentArtwork from "@/assets/logo/indias-got-latent-logo.webp";
import latentIcon from "@/assets/logo/latent-a-icon.webp";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-card/40 backdrop-blur-xl">
      <div className="mx-auto max-w-[1728px] px-5 py-12 sm:px-8 lg:px-12 xl:px-[72px]">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col items-start space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src={latentIcon}
                alt="JustLatent Icon"
                className="h-9 w-9 shrink-0 object-contain transition-transform group-hover:scale-105"
              />
              <img
                src={latentArtwork}
                alt="India's Got Latent — JustLatent.com"
                className="h-7 w-auto shrink-0 object-contain"
              />
            </Link>
            <p className="text-xs sm:text-sm leading-6 text-muted-foreground">
              An unofficial, free community archive for <strong className="text-foreground font-semibold">India's Got Latent</strong> by Samay Raina. Watch full episodes, uncut bonus clips, and behind-the-scenes content free.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-medium text-muted-foreground">
              <span className="rounded-full bg-accent/70 px-2.5 py-1 text-foreground">100% Free Archive</span>
              <span className="rounded-full bg-accent/70 px-2.5 py-1 text-foreground">Fast Streaming</span>
              <span className="rounded-full border border-primary/40 bg-primary/20 px-2.5 py-1 font-semibold text-primary">
                Download Available Free
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link
                  to="/season-{$season}/$tab/$episode"
                  params={{ season: "2", tab: "episodes", episode: "07" }}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-primary font-semibold text-foreground"
                >
                  <span className="text-primary text-xs">▶</span> Play Latest Episode (S2 Ep 7)
                </Link>
              </li>
              <li>
                <Link
                  to="/season-{$season}/$tab/$episode"
                  params={{ season: "2", tab: "episodes", episode: "07" }}
                  className="transition-colors hover:text-foreground"
                >
                  See All Season 2 Episodes
                </Link>
              </li>
              <li>
                <Link
                  to="/season-{$season}/$tab/$episode"
                  params={{ season: "1", tab: "episodes", episode: "12" }}
                  className="transition-colors hover:text-foreground"
                >
                  See All Season 1 Episodes
                </Link>
              </li>
              <li>
                <Link to="/" className="transition-colors hover:text-foreground">
                  Browse Home Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Browse Categories */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Browse Categories
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link
                  to="/season-{$season}/$tab/$episode"
                  params={{ season: "2", tab: "episodes", episode: "01" }}
                  className="transition-colors hover:text-foreground"
                >
                  Season 2 Main Episodes
                </Link>
              </li>
              <li>
                <Link
                  to="/season-{$season}/$tab/$episode"
                  params={{ season: "2", tab: "bonus", episode: "06" }}
                  className="transition-colors hover:text-foreground"
                >
                  Season 2 Bonus Episodes
                </Link>
              </li>
              <li>
                <Link
                  to="/season-{$season}/$tab/$episode"
                  params={{ season: "2", tab: "bts", episode: "04" }}
                  className="transition-colors hover:text-foreground"
                >
                  Behind The Scenes (BTS)
                </Link>
              </li>
              <li>
                <Link
                  to="/season-{$season}/$tab/$episode"
                  params={{ season: "1", tab: "episodes", episode: "01" }}
                  className="transition-colors hover:text-foreground"
                >
                  Season 1 Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Feedback & Broken Links */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Report & Feedback
            </h3>
            <p className="text-xs leading-5 text-muted-foreground">
              If you see any broken links, video playback errors, or want to report an issue, feel free to reach out to us via email:
            </p>
            <div className="pt-1">
              <a
                href="mailto:hello@justlatent.com"
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-all hover:border-primary hover:bg-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg
                  className="h-4 w-4 fill-none stroke-current text-primary"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                hello@justlatent.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 <strong className="text-foreground font-semibold">JustLatent.com</strong> · Unofficial community fan platform.</p>
          <p className="text-[11px] text-muted-foreground/70">
            All videos and trademarks belong to Samay Raina & respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
