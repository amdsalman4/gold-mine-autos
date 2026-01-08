import { forwardRef, useEffect, useRef, useState } from "react";

const LOGO_CAROUSEL_INTERVAL = 3000;
const LOGO_CAROUSEL_SCROLL_TIMEOUT = 200;

interface Platform {
  name: string;
  logoSrc: string;
}

const platforms: Platform[] = [
  { name: "Facebook Marketplace", logoSrc: "/logos/facebook.png" },
  { name: "IAAI", logoSrc: "/logos/iaai.png" },
  { name: "North Toronto Auction", logoSrc: "/logos/nta.png" },
  { name: "ADESA", logoSrc: "/logos/adesa.png" },
  { name: "Kijiji Autos", logoSrc: "/logos/kijiji.png" },
  { name: "AutoTrader", logoSrc: "/logos/autotrader.png" },
];

const LogoCarousel = () => {
  const [currentPlatform, setCurrentPlatform] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      {
        threshold: 0.5,
        rootMargin: "-200px 0px -100px 0px",
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isInView && platforms.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentPlatform((prev) => (prev + 1) % platforms.length);
      }, LOGO_CAROUSEL_INTERVAL);
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollContainerRef.current) {
        const scrollContainer = scrollContainerRef.current;
        const targetLogo = scrollContainer.children[currentPlatform] as
          | HTMLElement
          | undefined;

        if (targetLogo) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const logoRect = targetLogo.getBoundingClientRect();
          const scrollLeft =
            targetLogo.offsetLeft -
            scrollContainer.offsetLeft -
            containerRect.width / 2 +
            logoRect.width / 2;

          scrollContainer.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        }
      }
    }, LOGO_CAROUSEL_SCROLL_TIMEOUT);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isInView, currentPlatform]);

  const handleMouseEnter = (index: number) => {
    setCurrentPlatform(index);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isInView && platforms.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentPlatform((prev) => (prev + 1) % platforms.length);
      }, LOGO_CAROUSEL_INTERVAL);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative my-12 flex w-full flex-col items-center"
    >
      <h3 className="text-muted-foreground mb-6 text-center text-sm font-medium">
        We scan these platforms daily so you don't have to
      </h3>
      <div className="w-full max-w-5xl overflow-hidden">
        <div
          className="no-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-4 pb-6"
          ref={scrollContainerRef}
        >
          {platforms.map((platform, index) => (
            <LogoCard
              key={index}
              platform={platform}
              index={index}
              isCurrent={index === currentPlatform}
              onMouseEnter={handleMouseEnter}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface LogoCardProps {
  platform: Platform;
  index: number;
  isCurrent: boolean;
  onMouseEnter: (index: number) => void;
}

const LogoCard = forwardRef<HTMLDivElement, LogoCardProps>(
  ({ platform, index, isCurrent, onMouseEnter }, ref) => {
    return (
      <div
        ref={ref}
        className="flex-shrink-0 snap-center transition-all duration-200"
        onMouseEnter={() => onMouseEnter(index)}
      >
        <div
          className={`flex h-24 w-32 items-center justify-center rounded-lg border bg-background p-4 transition-all duration-200 ${
            isCurrent
              ? "scale-110 border-primary shadow-lg"
              : "border-border opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
          }`}
        >
          <img
            src={platform.logoSrc}
            alt={platform.name}
            className="h-auto max-h-16 w-auto max-w-full object-contain"
          />
        </div>
      </div>
    );
  }
);

LogoCard.displayName = "LogoCard";

export default LogoCarousel;
