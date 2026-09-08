import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import { AdBanner } from '../../types';
import { adService } from '../../services/adService';

export const AdCarousel: React.FC = () => {
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadAds = async () => {
      const activeAds = await adService.getActive();
      setAds(activeAds);
    };
    loadAds();
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;

    if (!isHovered) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000); // Slideshow auto, 5s
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [ads.length, isHovered]);

  if (ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? ads.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  return (
    <section className="py-8 bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative rounded-3xl overflow-hidden shadow-xl bg-gray-900 border border-black/10 group min-h-[300px] sm:min-h-[360px] flex items-center"
        >
          {/* BACKGROUND IMAGE WITH OVERLAY */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentAd.image}
              alt={currentAd.title}
              className="w-full h-full object-cover opacity-45 transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          </div>

          {/* CONTENT */}
          <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-2xl text-white space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/40 text-[#D4A017] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>À la une & Actualités</span>
            </div>

            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl leading-tight">
              {currentAd.title}
            </h3>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
              {currentAd.subtitle}
            </p>

            <div className="pt-2">
              <Link
                to={currentAd.linkUrl || '/produits'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold shadow-md transition-all"
              >
                <span>{currentAd.ctaText || 'En savoir plus'}</span>
                <ExternalLink className="w-4 h-4 text-[#D4A017]" />
              </Link>
            </div>
          </div>

          {/* CONTROLS (ARROWS) */}
          {ads.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Publicité précédente"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Publicité suivante"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* DOT INDICATORS */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {ads.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Aller à la diapositive ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      currentIndex === index ? 'w-8 bg-[#D4A017]' : 'w-2.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* PAUSE INDICATOR HINT */}
          {isHovered && ads.length > 1 && (
            <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-md bg-black/50 text-[11px] text-gray-300 backdrop-blur-xs">
              Diaporama en pause
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
