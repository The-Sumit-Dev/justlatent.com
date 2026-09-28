import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  episodeSlug,
  formatEpisodeTitle,
  LATENT_SEASONS,
  SEASON_SLUGS,
  SEASON_TABS,
  type ContentTab,
} from "@/data/latent";
import { getMergedSectionEpisodes } from "@/data/episode-store";
import {
  fetchAndSyncFeed,
  getActiveClientProxyDomain,
  getStoredScrapedEpisodes,
  type ScrapedEpisodeItem,
} from "@/data/auto-updater";

import latentArtwork from "../assets/logo/indias-got-latent-logo.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Watch India's Got Latent Season 1 & 2 Full Episodes Free — JustLatent.com" },
      {
        name: "description",
        content:
          "Stream all India's Got Latent full episodes, bonus clips, BTS, and deleted scenes free online on JustLatent.com. Featuring Samay Raina, Alia Bhatt, Rakhi Sawant, Ashneer Grover, Bhuvan Bam & more.",
      },
      {
        name: "keywords",
        content:
          "India's Got Latent, Samay Raina, justlatent, justlatent.com, India's Got Latent Season 2, India's Got Latent Episode 7, watch free online, bonus episodes, BTS, uncensored comedy",
      },
      { property: "og:title", content: "Watch India's Got Latent Season 1 & 2 Full Episodes Free — JustLatent.com" },
      {
        property: "og:description",
        content: "Raw talent, wild judges and zero filters. Stream all full episodes, bonus clips & BTS free on JustLatent.com.",
      },
      { property: "og:url", content: "https://justlatent.com/" },
      { property: "og:site_name", content: "JustLatent.com" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "India's Got Latent — Watch All Episodes Free on JustLatent.com" },
      { name: "twitter:description", content: "Watch all full episodes, bonus clips, and BTS unfiltered online on JustLatent.com." },
    ],
    links: [{ rel: "canonical", href: "https://justlatent.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "JustLatent",
          "alternateName": ["Just Latent", "India's Got Latent Archive"],
          "url": "https://justlatent.com/",
          "description": "Watch India's Got Latent full episodes, bonus clips, deleted scenes, and behind-the-scenes unfiltered on JustLatent.com.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://justlatent.com/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TVSeries",
          "name": "India's Got Latent",
          "url": "https://justlatent.com/",
          "sameAs": ["https://www.youtube.com/@SamayRainaOfficial"],
          "description": "India's Got Latent is an unfiltered comedy talent show created by Samay Raina.",
          "genre": ["Comedy", "Talent Show", "Entertainment"],
          "actor": [
            { "@type": "Person", "name": "Samay Raina" },
            { "@type": "Person", "name": "Tanmay Bhat" },
            { "@type": "Person", "name": "Balraj Singh Ghai" }
          ]
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const ytVideoRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(true);
  const [heroStreamUrl, setHeroStreamUrl] = useState<string | null>(null);
  const [heroPlaying, setHeroPlaying] = useState(false);
  const [season, setSeason] = useState<keyof typeof LATENT_SEASONS>("Season 2");
  const [contentTab, setContentTab] = useState<ContentTab>("episodes");
  const [isFeedSyncing, setIsFeedSyncing] = useState(true);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [, setCustomUpdateTick] = useState(0);

  const [scrapedS2Items, setScrapedS2Items] = useState<ScrapedEpisodeItem[]>(() =>
    getStoredScrapedEpisodes().filter((e) => e.season === "Season 2"),
  );

  // Trigger brief skeleton loading effect on initial web page load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingList(false), 350);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scraper engine: fetch immediately at top priority and scan every 5 minutes
  useEffect(() => {
    let active = true;

    const syncPromise = fetchAndSyncFeed().then(() => {
      if (active) {
        setScrapedS2Items(getStoredScrapedEpisodes().filter((e) => e.season === "Season 2"));
      }
    });

    // Fallback timer so skeleton never stutters or hangs
    const fallbackTimer = setTimeout(() => {
      if (active) {
        setScrapedS2Items(getStoredScrapedEpisodes().filter((e) => e.season === "Season 2"));
        setIsFeedSyncing(false);
      }
    }, 450);

    syncPromise.finally(() => {
      if (active) {
        clearTimeout(fallbackTimer);
        setScrapedS2Items(getStoredScrapedEpisodes().filter((e) => e.season === "Season 2"));
        setIsFeedSyncing(false);
      }
    });

    const interval = window.setInterval(() => {
      fetchAndSyncFeed().then(() => {
        if (active) {
          setScrapedS2Items(getStoredScrapedEpisodes().filter((e) => e.season === "Season 2"));
        }
      });
    }, 5 * 60 * 1000);

    const handleUpdate = () => {
      if (active) {
        setScrapedS2Items(getStoredScrapedEpisodes().filter((e) => e.season === "Season 2"));
        setCustomUpdateTick((tick) => tick + 1);
      }
    };
    window.addEventListener("latent_episodes_updated", handleUpdate);

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
      window.clearInterval(interval);
      window.removeEventListener("latent_episodes_updated", handleUpdate);
    };
  }, []);

  // Dynamically resolve newest Season 2 item from feed/catalogue for the Hero banner
  const s2EpisodesList = getMergedSectionEpisodes("Season 2", "episodes");
  const s2BonusList = getMergedSectionEpisodes("Season 2", "bonus");

  // Always prioritize top item from /api/feed (scrapedS2Items[0]), then static catalogue top item fallback
  const newestHeroItem = scrapedS2Items[0] || s2BonusList[0] || s2EpisodesList[0];
  const heroTab: ContentTab =
    newestHeroItem && "tab" in (newestHeroItem as object)
      ? (newestHeroItem as any).tab
      : s2BonusList.length > 0
        ? "bonus"
        : "episodes";

  const heroList = getMergedSectionEpisodes("Season 2", heroTab);
  const heroItemIdx = heroList.findIndex(
    (item) =>
      (newestHeroItem?.okcdnId && item.okcdnId === newestHeroItem.okcdnId) ||
      (newestHeroItem?.youtubeId && item.youtubeId === newestHeroItem.youtubeId) ||
      item.title === newestHeroItem?.title,
  );
  const heroEpisodeRank = heroItemIdx !== -1 ? heroList.length - heroItemIdx : heroList.length;
  const heroEpisodeSlug = episodeSlug(heroEpisodeRank);

  const heroDisplayTitle = newestHeroItem ? formatEpisodeTitle(newestHeroItem) : "India's Got Latent — Season 2";
  const heroDisplayDesc = newestHeroItem?.description || "Raw talent, wild judges and zero filters. Stream the latest episode now.";
  const heroDisplayThumb = newestHeroItem?.thumbnail;
  const heroOkcdnId = newestHeroItem?.okcdnId;
  const heroYoutubeId = newestHeroItem?.youtubeId;

  // Fetch Hero stream for latest S2 episode with automatic recall / retry mechanism
  useEffect(() => {
    let cancelled = false;
    let retryTimer: number | null = null;
    let attempt = 0;
    setHeroStreamUrl(null);
    setHeroPlaying(false);
    if (!heroOkcdnId) return;

    const fetchHeroStream = async () => {
      try {
        const res = await fetch(`/api/stream?id=${encodeURIComponent(heroOkcdnId)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        if (data && data.status === "success" && Array.isArray(data.streams) && data.streams.length > 0) {
          const pref =
            data.streams.find((s: { type: string; url: string }) => s.type === "720p") ||
            data.streams.find((s: { type: string; url: string }) => s.type === "480p") ||
            data.streams[0];
          if (pref?.url) {
            setHeroStreamUrl(pref.url);
            return;
          }
        }
        throw new Error("No stream URL returned");
      } catch (err) {
        if (cancelled) return;
        console.warn(`[HeroStream] Fetch attempt ${attempt + 1} failed, auto-recalling...`, err);
        if (attempt < 3) {
          attempt++;
          retryTimer = window.setTimeout(fetchHeroStream, 1200 * attempt);
        }
      }
    };

    fetchHeroStream();

    return () => {
      cancelled = true;
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [heroOkcdnId]);

  const visibleEpisodes = getMergedSectionEpisodes(season, contentTab);

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = nextMuted;
    }
    if (ytVideoRef.current?.contentWindow) {
      ytVideoRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: nextMuted ? "mute" : "unMute", args: [] }),
        "https://www.youtube-nocookie.com",
      );
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative flex aspect-video min-h-0 items-end justify-start overflow-hidden md:aspect-auto md:min-h-[84vh]">
        {isFeedSyncing ? (
          <div className="relative flex h-full w-full min-h-[50vh] items-end justify-start overflow-hidden bg-card/60 md:min-h-[84vh]">
            <Skeleton className="absolute inset-0 h-full w-full bg-muted/30 animate-pulse" />
            <div className="relative z-10 w-[88%] max-w-[480px] pl-4 pr-5 pb-6 pt-5 sm:w-[44%] sm:max-w-[520px] sm:pl-5 sm:pb-12 sm:pt-8 lg:max-w-[560px] lg:pl-6 lg:pb-20 lg:pt-16 xl:max-w-[600px] xl:pl-8">
              <Skeleton className="mb-3 h-10 w-44 rounded bg-muted/50" />
              <Skeleton className="h-5 w-72 rounded bg-muted/40 sm:h-6 md:w-96" />
              <div className="mt-4 flex items-center gap-3">
                <Skeleton className="h-8 min-w-28 rounded-full bg-muted/60 sm:h-12 sm:min-w-36" />
                <Skeleton className="size-8 rounded-full bg-muted/50 sm:size-12" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 overflow-hidden bg-card" aria-hidden="true">
              {heroStreamUrl ? (
                <video
                  ref={heroVideoRef}
                  src={heroStreamUrl}
                  className="absolute inset-0 h-full w-full object-cover object-center md:inset-auto md:left-1/2 md:top-1/2 md:h-[56.25vw] md:min-h-full md:w-[177.78vh] md:min-w-full md:-translate-x-1/2 md:-translate-y-1/2"
                  autoPlay
                  muted={muted}
                  loop
                  playsInline
                  onLoadedMetadata={(e) => {
                    if (e.currentTarget.currentTime < 40) {
                      e.currentTarget.currentTime = 40;
                    }
                  }}
                  onCanPlay={(e) => {
                    if (e.currentTarget.currentTime < 40) {
                      e.currentTarget.currentTime = 40;
                    }
                    e.currentTarget
                      .play()
                      .then(() => setHeroPlaying(true))
                      .catch(() => {});
                  }}
                  onPlay={() => setHeroPlaying(true)}
                  onPlaying={() => setHeroPlaying(true)}
                  onError={() => {
                    console.warn("[HeroVideo] Playback error encountered, clearing stream to trigger auto-recall");
                    setHeroStreamUrl(null);
                  }}
                />
              ) : !heroOkcdnId && heroYoutubeId ? (
                <iframe
                  ref={ytVideoRef}
                  className="absolute inset-0 h-full w-full md:inset-auto md:left-1/2 md:top-1/2 md:h-[56.25vw] md:min-h-full md:w-[177.78vh] md:min-w-full md:-translate-x-1/2 md:-translate-y-1/2"
                  src={`https://www.youtube-nocookie.com/embed/${heroYoutubeId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${heroYoutubeId}&enablejsapi=1&start=40`}
                  title={heroDisplayTitle}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  tabIndex={-1}
                />
              ) : null}

              {/* High quality thumbnail overlay - STAYS ON TOP UNTIL VIDEO ACTUALLY STARTS PLAYING */}
              {heroDisplayThumb && (
                <img
                  src={heroDisplayThumb}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                    heroPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                />
              )}
            </div>
            <div className="pointer-events-none absolute inset-0 bg-hero-scrim" />

            <div className="relative z-10 flex h-full w-full items-end justify-start">
              <div className="w-[88%] max-w-[480px] pl-4 pr-5 pb-6 pt-5 sm:w-[44%] sm:max-w-[520px] sm:pl-5 sm:pb-12 sm:pt-8 lg:max-w-[560px] lg:pl-6 lg:pb-20 lg:pt-16 xl:max-w-[600px] xl:pl-8">
                <div className="animate-fade-in opacity-100">
                  <img
                    src={latentArtwork}
                    alt="India's Got Latent"
                    className="mb-2.5 h-auto w-[115px] max-w-[48vw] object-contain sm:w-[170px] md:w-[230px] lg:w-[290px]"
                  />

                  <p className="font-copy max-w-[320px] text-[11px] leading-[15px] font-semibold text-foreground sm:text-[12px] sm:leading-4 md:max-w-[420px] md:text-[16px] md:leading-6">
                    {heroDisplayTitle}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1.5 sm:gap-2 md:mt-5 md:gap-3">
                  <Link
                    to="/season-{$season}/$tab/$episode"
                    params={{ season: "2", tab: heroTab, episode: heroEpisodeSlug }}
                    search={{ autoplay: true }}
                    className="inline-flex h-8 min-w-24 items-center justify-center gap-1 rounded-full bg-primary px-3.5 text-[11px] font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background active:scale-[0.98] sm:min-w-28 sm:px-4 md:h-12 md:min-w-36 md:gap-2 md:px-6 md:text-sm"
                    aria-label={`Play ${heroDisplayTitle}`}
                  >
                    <Play className="h-2.5 w-2.5 fill-current md:h-4 md:w-4" aria-hidden="true" />
                    Play now
                  </Link>

                  <button
                    type="button"
                    onClick={toggleSound}
                    className="inline-flex size-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-9 md:size-12"
                    aria-label={muted ? "Turn sound on" : "Mute sound"}
                    title={muted ? "Turn sound on" : "Mute sound"}
                  >
                    {muted ? <VolumeX className="h-3.5 w-3.5 md:h-5 md:w-5" /> : <Volume2 className="h-3.5 w-3.5 md:h-5 md:w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-hero-fade md:h-40" />
          </>
        )}
      </section>

      <section className="mx-auto max-w-[1728px] pb-24 pt-5 sm:pt-7 lg:pt-9" aria-labelledby="latent-heading">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-8 lg:px-12 xl:px-[72px]">
          <h2
            id="latent-heading"
            className="font-heading text-[28px] font-normal uppercase tracking-[0.04em] text-foreground sm:text-[34px] lg:text-[40px]"
          >
            India's Got Latent
          </h2>

          <Select
            value={season}
            onValueChange={(value) => {
              setIsLoadingList(true);
              setSeason(value as keyof typeof LATENT_SEASONS);
              setContentTab("episodes");
              setTimeout(() => setIsLoadingList(false), 300);
            }}
          >
            <SelectTrigger
              className="h-10 w-[140px] rounded-full border-border bg-card px-4 text-sm font-semibold text-foreground sm:h-11 sm:w-[160px]"
              aria-label="Choose season"
            >
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent align="end" className="border-border bg-popover text-popover-foreground">
              {Object.keys(LATENT_SEASONS).map((name) => (
                <SelectItem key={name} value={name} className="cursor-pointer">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs
          value={contentTab}
          onValueChange={(value) => {
            setIsLoadingList(true);
            setContentTab(value as ContentTab);
            setTimeout(() => setIsLoadingList(false), 300);
          }}
          className="mt-5 sm:mt-7"
        >
          <div className="px-5 sm:px-8 lg:px-12 xl:px-[72px]">
            <TabsList className="grid h-auto min-h-11 w-full grid-cols-3 rounded-md border border-border/70 bg-card/55 p-1">
              {SEASON_TABS[season].map((tab) => (
                <TabsTrigger
                  key={`${season}-${tab.value}`}
                  value={tab.value}
                  className="relative min-h-9 rounded-sm px-2 py-2 text-[11px] font-semibold text-muted-foreground shadow-none transition-colors duration-300 after:absolute after:inset-x-3 after:-bottom-1 after:h-0.5 after:origin-center after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:scale-x-100 sm:px-5 sm:text-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {SEASON_TABS[season].map((t) => {
            const listForTab = getMergedSectionEpisodes(season, t.value);
            return (
              <TabsContent key={`${season}-${t.value}`} value={t.value} className="mt-4 animate-fade-in sm:mt-6">
                {isLoadingList ? (
                  <div className="flex flex-col">
                    {Array.from({ length: Math.min(Math.max(listForTab.length, 3), 5) }).map((_, idx) => (
                      <EpisodeListItemSkeleton key={`skeleton-${t.value}-${idx}`} />
                    ))}
                  </div>
                ) : (
                  <ol className="flex flex-col">
                    {listForTab.map((episode, index) => {
                      const rank = listForTab.length - index;
                      return (
                        <li key={`${season}-${t.value}-${episode.title}-${episode.guests}`} className="border-b border-border/60">
                          <Link
                            to="/season-{$season}/$tab/$episode"
                            params={{ season: SEASON_SLUGS[season], tab: t.value, episode: episodeSlug(rank) }}
                            className="group flex h-auto w-full items-center justify-start gap-3 whitespace-normal rounded-none px-5 py-4 text-left transition-colors duration-300 hover:bg-card/60 sm:gap-6 sm:px-8 sm:py-6 lg:gap-8 lg:px-12 xl:px-[72px]"
                          >
                            <span
                              className="episode-rank w-9 shrink-0 select-none text-center text-[34px] leading-none sm:w-14 sm:text-[52px] lg:w-[72px] lg:text-[62px]"
                              aria-hidden="true"
                            >
                              {episodeSlug(rank)}
                            </span>

                            <span className="relative flex aspect-video w-[112px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-card shadow-md sm:w-[200px] lg:w-[240px]">
                              {episode.thumbnail ? (
                                <img
                                  src={episode.thumbnail}
                                  alt=""
                                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                  loading="lazy"
                                />
                              ) : null}
                              {episode.duration ? (
                                <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs backdrop-blur-xs sm:bottom-1.5 sm:right-1.5 sm:px-2 sm:py-0.5 sm:text-[11px]">
                                  {episode.duration}
                                </span>
                              ) : null}
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="flex items-baseline justify-between gap-2 sm:gap-3">
                                <span className="line-clamp-2 text-[12px] font-bold leading-snug text-foreground sm:text-base lg:text-lg">
                                  {formatEpisodeTitle(episode)}
                                </span>
                                <span className="shrink-0 text-[10px] font-medium text-muted-foreground sm:text-sm">
                                  {episode.duration}
                                </span>
                              </span>
                              <span className="mt-1 line-clamp-2 block text-[10px] leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
                                {episode.description}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </section>

      <SiteFooter />
    </main>
  );
}

/** Standalone multi-item Skeleton component for episode list items */
function EpisodeListItemSkeleton() {
  return (
    <div className="flex h-auto w-full items-center justify-start gap-3 border-b border-border/60 px-5 py-4 sm:gap-6 sm:px-8 sm:py-6 lg:gap-8 lg:px-12 xl:px-[72px]">
      {/* 1. Numbering / Rank Skeleton */}
      <div className="flex w-9 shrink-0 justify-center sm:w-14 lg:w-[72px]">
        <Skeleton className="h-7 w-7 rounded bg-muted/60 sm:h-12 sm:w-12 lg:h-14 lg:w-14" />
      </div>

      {/* 2. Thumbnail & Timeline Badge Skeletons */}
      <div className="relative aspect-video w-[112px] shrink-0 overflow-hidden rounded-md bg-muted/40 shadow-md sm:w-[200px] lg:w-[240px]">
        <Skeleton className="h-full w-full bg-muted/50" />
        {/* Timeline badge skeleton */}
        <Skeleton className="absolute bottom-1 right-1 h-3.5 w-8 rounded bg-muted/80 sm:bottom-1.5 sm:right-1.5 sm:h-4 sm:w-10" />
      </div>

      {/* 3. Title, Timeline & Description Skeletons */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Title Skeleton */}
          <Skeleton className="h-4 w-3/5 rounded bg-muted/60 sm:h-5 lg:h-6" />
          {/* Timeline / Duration text Skeleton */}
          <Skeleton className="h-3.5 w-10 shrink-0 rounded bg-muted/60 sm:h-4 sm:w-12" />
        </div>
        {/* Description Skeleton */}
        <div className="mt-2 space-y-1.5 sm:mt-2.5">
          <Skeleton className="h-3 w-5/6 rounded bg-muted/40 sm:h-4" />
          <Skeleton className="h-3 w-1/2 rounded bg-muted/40 sm:h-4" />
        </div>
      </div>
    </div>
  );
}
