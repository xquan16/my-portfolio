"use client";


import portfolioData from "./porfolio_data.json";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";

const MONTH_LOOKUP: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function parseMonthYear(value: string, fallbackMonth: number) {
  const lower = value.toLowerCase();
  const monthMatch = lower.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/
  );
  const yearMatch = lower.match(/\b(19|20)\d{2}\b/);

  if (!yearMatch) {
    return null;
  }

  const year = Number(yearMatch[0]);
  const month = monthMatch ? MONTH_LOOKUP[monthMatch[1]] : fallbackMonth;

  if (month === undefined) {
    return null;
  }

  return { year, month };
}

function isCurrentExperience(period: string) {
  const lower = period.toLowerCase();
  if (lower.includes("present")) {
    return true;
  }

  const parts = period.split(/[–-]/).map((part) => part.trim());
  const start = parseMonthYear(parts[0] ?? "", 0);
  if (!start) {
    return false;
  }

  const end = parseMonthYear(parts[1] ?? parts[0] ?? "", 11);
  if (!end) {
    return false;
  }

  const endScore = end.year * 12 + end.month;
  const now = new Date();
  const currentScore = now.getFullYear() * 12 + now.getMonth();

  return endScore >= currentScore;
}

const getTagStyle = (tag: string) => {
  const styles: Record<string, string> = {
    // Core Languages & Frameworks
    "Java": "bg-rose-500/30 text-rose-100 border-rose-400/50",
    "C++": "bg-sky-500/30 text-sky-100 border-sky-400/50", // Shifted to bright sky blue
    "C#": "bg-purple-500/30 text-purple-100 border-purple-400/50",
    "ASP.NET": "bg-pink-500/30 text-pink-100 border-pink-400/50",
    "SQL": "bg-blue-400/30 text-blue-100 border-blue-400/50",
    "Swing": "bg-fuchsia-500/30 text-fuchsia-100 border-fuchsia-400/50",
    
    // Core Concepts 
    "OOP": "bg-emerald-500/30 text-emerald-100 border-emerald-400/50",
    "AI": "bg-amber-500/30 text-amber-100 border-amber-400/50",
    "Algorithms": "bg-orange-500/30 text-orange-100 border-orange-400/50",
    "Concurrency": "bg-fuchsia-500/30 text-fuchsia-100 border-fuchsia-400/50", // Shifted away from dark blue
    "Multi-threading": "bg-violet-400/30 text-violet-100 border-violet-400/50", // Brightened violet

    // Specific Data Structures
    "Data Structures": "bg-teal-500/30 text-teal-100 border-teal-400/50",
    "Arrays": "bg-cyan-500/30 text-cyan-100 border-cyan-400/50",
    "Linked Lists": "bg-yellow-500/30 text-yellow-100 border-yellow-400/50", // Shifted to yellow to pop against blue
    "Queues": "bg-red-500/30 text-red-100 border-red-400/50",
    "Stacks": "bg-lime-500/30 text-lime-100 border-lime-400/50",
  };
  return styles[tag] || "bg-zinc-400/30 text-zinc-100 border-zinc-400/50 shadow-sm";
};

export default function Home() {
  const [isGeekMode, setIsGeekMode] = useState(false);
  const { personal_info, work_experience, projects, certifications } = portfolioData;
  const [activeCert, setActiveCert] = useState(0); // Existing
  const [zoomedImg, setZoomedImg] = useState<string | null>(null); // For the Lightbox Zoom
  const [isAutoPlaying, setIsAutoPlaying] = useState(true); // For Auto-play
  const allSkills = [
    ...portfolioData.skills.languages,
    ...portfolioData.skills.ai_and_data_science,
    ...portfolioData.skills.cloud_and_infrastructure,
    ...portfolioData.skills.systems_and_architecture,
    ...portfolioData.skills.frameworks_and_tools,
  ];
  const vibrantColors = [
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
    "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
    "#14b8a6", "#d946ef", "#eab308", "#22c55e", "#0ea5e9"
  ];
  const variedSizes = [2.5, 1.5, 2.0, 1.2, 2.8, 1.8, 2.2, 1.4, 2.6, 1.6, 2.4, 1.3, 2.1, 1.9, 2.7];

  // Auto-play Effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveCert((prev) => (prev + 1) % portfolioData.certifications.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const [randomizedSkills, setRandomizedSkills] = useState<{name: string, color: string, size: string}[]>([]);

  useEffect(() => {
    const mappedSkills = allSkills.map((skill) => ({
      name: skill,
      color: vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
      size: variedSizes[Math.floor(Math.random() * variedSizes.length)] + "rem"
    }));
    setRandomizedSkills(mappedSkills);
  }, []);

  return (
    <div>
      <Script 
        src="https://www.goat1000.com/tagcanvas.min.js" 
        strategy="lazyOnload"
        onLoad={() => {
          try {
            // @ts-ignore
            window.TagCanvas.Start('skillCloud', 'skillTags', {
              textColour: null, 
              outlineColour: 'transparent',
              reverse: true,
              depth: 0.8,
              maxSpeed: 0.05,
              initial: [0.1, -0.1],
              wheelZoom: false,
              textFont: 'Inter, sans-serif',
              weight: true,
              weightMode: 'size', // <-- THIS LINE ACTIVATES THE RANDOM SIZES IN 3D
            });
          } catch (e) {
            console.error('Canvas error:', e);
          }
        }}
      />

      <div className={`${isGeekMode ? "dark" : ""} min-h-screen bg-[oklch(98%_0.045_203.388)] text-slate-900 transition-colors duration-500 dark:bg-zinc-950 dark:text-zinc-50`}>
      <div>
        <header className="fixed top-0 z-50 w-full border-b border-sky-950/30 bg-sky-700/95 text-sky-50 backdrop-blur dark:border-zinc-500/40 dark:bg-zinc-800/90">
          <div className="flex w-full items-center justify-between px-6 md:px-12 py-4">
            <p className="text-2xl font-black md:text-3xl">
              {personal_info.name}
            </p>

            <button
              type="button"
              onClick={() => setIsGeekMode((prev) => !prev)}
              className="relative h-10 w-28 rounded-full border border-white/40 bg-sky-950/30 p-1 transition-colors duration-300 dark:border-zinc-500 dark:bg-zinc-900/90"
              aria-label="Toggle theme mode"
            >
              <span
                className={`absolute left-1 top-1 h-8 w-[52px] rounded-full bg-white transition-transform duration-300 ease-in-out dark:bg-emerald-300 ${
                  isGeekMode ? "translate-x-[52px]" : "translate-x-0"
                }`}
              >
                <span className="flex h-full items-center justify-center text-[11px] font-extrabold text-slate-900 dark:text-zinc-950">
                  {isGeekMode ? "Geek" : "Normal"}
                </span>
              </span>
              <span className="absolute inset-0 grid grid-cols-2 place-items-center text-[11px] font-bold">
                <span className={isGeekMode ? "text-white/55" : "text-transparent"}>
                  Normal
                </span>
                <span
                  className={
                    isGeekMode ? "text-transparent" : "text-white/70 dark:text-emerald-200/70"
                  }
                >
                  Geek
                </span>
              </span>
            </button>
          </div>
        </header>
      </div>

        <main className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-16 items-start max-w-7xl mx-auto pt-32 px-6">
          <section>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-3 whitespace-nowrap">
              {personal_info.name}
            </h1>
            <p className="text-xl md:text-2xl font-bold text-sky-800 dark:text-emerald-400 whitespace-nowrap">
              {personal_info.degree}
            </p>
            <p className="text-sm font-semibold  text-gray-400 dark:text-zinc-300 whitespace-nowrap">
              Current Status: {personal_info.current_status}
            </p>

            <div className="mt-7">
              <div className="relative pl-2">
                {work_experience.map((experience, index) => {
                  const isLast = index === work_experience.length - 1;
                  const isActive = isCurrentExperience(experience.period);

                  return (
                    <div key={`${experience.role}-${experience.period}`} className="relative flex gap-5 pb-8">
                      <div className="relative flex w-5 justify-center">
                        <span
                          className={`absolute top-4 w-px bg-slate-300 dark:bg-zinc-700 ${
                            isLast ? "h-14" : "h-[calc(100%+1rem)]"
                          }`}
                        />
                        <span
                          className={`relative mt-1 h-3.5 w-3.5 rounded-full ${
                            isActive
                              ? "bg-blue-600 dark:bg-green-500"
                              : "bg-slate-400 dark:bg-zinc-700"
                          }`}
                        />
                        {isActive && (
                          <span className="absolute mt-0.5 h-5 w-5 rounded-full bg-blue-500/35 ring-2 ring-blue-400/40 animate-pulse dark:bg-green-500/30 dark:ring-green-400/35" />
                        )}
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <p className="text-lg font-bold leading-tight text-gray-900 dark:text-zinc-200">
                          {experience.role}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-cyan-600 dark:text-emerald-400">
                            {experience.organization}
                          </p>
                          <div className="flex items-center gap-2">
                          {experience.link && (
                            <a 
                              href={experience.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              aria-label="Visit Shop"
                              className="text-cyan-400 hover:text-blue-600 dark:text-emerald-500 dark:hover:text-emerald-300 transition-colors transform hover:scale-110"
                            >
                              {experience.iconType === "gallery" ? (
                                <>
                                  <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                </>
                              ) : (
                                <>
                                  <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                  </svg>
                                </>
                              )}
                            </a>
                          )}
                        </div>
                        </div>
                        <p className="mt-0.5 text-sm font-semibold text-gray-500 dark:text-zinc-400">
                          {experience.period}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 pl-2 md:gap-8">
                <a
                  href={personal_info.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-slate-700 transition-transform transform hover:scale-110 hover:text-blue-500 dark:text-zinc-300 dark:hover:text-emerald-400"
                >
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href={personal_info.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-slate-700 transition-transform transform hover:scale-110 hover:text-blue-500 dark:text-zinc-300 dark:hover:text-emerald-400"
                >
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href={personal_info.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="text-slate-700 transition-transform transform hover:scale-110 hover:text-blue-500 dark:text-zinc-300 dark:hover:text-emerald-400"
                >
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                <a
                  href={`mailto:${personal_info.contact.email}`}
                  aria-label="Email"
                  className="mt-[-2px] text-slate-700 transition-transform transform hover:scale-110 hover:text-blue-500 dark:text-zinc-300 dark:hover:text-emerald-400"
                >
                  <svg
                    className="h-10 w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          <section className="flex justify-center md:justify-end">
            <div className="aspect-square w-full max-w-md bg-white/40 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-black/10 dark:border-white/10 flex items-center justify-center">
              <p className="px-8 text-center text-sm md:text-base text-slate-600 dark:text-zinc-400">
                3D Avatar Integration Pending
              </p>
            </div>
          </section>
        </main>

        <section className="py-20">
          <h2 className="mb-8 text-center text-3xl font-black tracking-tight text-blue-950 dark:text-zinc-100">
            Featured Projects
          </h2>

          <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1.5fr] auto-rows-[280px] md:auto-rows-[100px] gap-4 max-w-7xl mx-auto px-6">
            {projects.map((project, index) => {
              const isAvatar = project.type === "avatar";
              const projectKey = `${project.id ?? project.title}-${index}`;

              return (
                <motion.div
                  key={projectKey}
                  className={`group relative h-full w-full overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 ${project.gridClass}`}
                >
                  {isAvatar ? (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-fuchsia-600 via-sky-500 to-blue-700 p-6 text-center"
                    >
                      <p className="text-2xl font-black text-white drop-shadow-md">
                        View All 30+ Repositories
                      </p>
                    </a>
                  ) : (
                    <>
                      {project.mediaType === "video" ? (
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          disablePictureInPicture
                          controlsList="nodownload"
                          className="object-cover w-full h-full"
                          src={project.mediaUrl}
                        />
                      ) : (
                        <Image
                          src={project.mediaUrl}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      )}

                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-x-0 bottom-0 pt-24 bg-gradient-to-t from-blue-950/[0.95] via-blue-900/[0.8] to-transparent p-6 flex-col justify-end transition-all duration-500 hidden md:flex translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 dark:from-zinc-900/[0.95] dark:via-zinc-800/[0.8] dark:to-transparent"
                      >
                        <p className="text-white font-bold text-xl drop-shadow-md">
                          {project.title}
                        </p>
                        <p className="mt-1.5 text-xs md:text-sm font-medium text-blue-100 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.techStack.map((tag) => (
                            <span
                              key={`${project.id}-${tag}`}
                              className={`backdrop-blur-md border text-[10px] uppercase tracking-wider font-bold rounded-full px-2.5 py-1 transition-colors ${getTagStyle(tag)}`}                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </a>

                      <motion.a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ y: 16, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ margin: "-35% 0px -35% 0px", once: false }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-x-0 bottom-0 pt-24 bg-gradient-to-t from-blue-950/[0.95] via-blue-900/[0.8] to-transparent p-6 flex flex-col justify-end transition-all duration-500 md:hidden dark:from-zinc-900/[0.95] dark:via-zinc-800/[0.8] dark:to-transparent"
                      >
                        <p className="text-white font-bold text-xl drop-shadow-md">
                          {project.title}
                        </p>
                        <p className="mt-1.5 text-xs md:text-sm font-medium text-blue-100 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.techStack.map((tag) => (
                            <span
                              key={`${project.id}-${tag}-mobile`}
                              className={`backdrop-blur-md border text-[10px] uppercase tracking-wider font-bold rounded-full px-2.5 py-1 transition-colors ${getTagStyle(tag)}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.a>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Certifications 3D Carousel Section */}
        <section className="py-20 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 className="mb-6 md:mb-10 text-center text-3xl md:text-4xl font-bold tracking-tight text-blue-950 dark:text-zinc-100">
              Certifications & Achievements
            </h2>

            {/* 3D Carousel Wrapper */}
            <div 
              className="relative h-[420px] md:h-[580px] w-full flex items-center justify-center perspective-[1100px]"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {certifications.map((cert, index) => {
                const isActive = index === activeCert;
                const offset = index - activeCert;
                const isLeft = offset === -1;
                const isRight = offset === 1;
                const isHidden = Math.abs(offset) > 1;

                return (
                  <motion.div
                    key={cert.id}
                    className="absolute top-0 w-[85vw] md:w-[60vw] max-w-[380px] md:max-w-[900px] cursor-pointer origin-center"
                    onClick={() => !isActive && setActiveCert(index)}
                    initial={false}
                    animate={{
                      x: isActive ? "0%" : isLeft ? "-55%" : isRight ? "55%" : offset > 0 ? "100%" : "-100%",
                      scale: isActive ? 1 : 0.85,
                      opacity: isActive ? 1 : isHidden ? 0 : 0.4,
                      zIndex: isActive ? 30 : isHidden ? 0 : 10,
                      rotateY: isActive ? 0 : isLeft ? 15 : isRight ? -15 : 0,
                    }}
                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                    style={{ pointerEvents: isHidden ? "none" : "auto" }}
                  >
                    {/* The Card UI */}
                    <div className={`bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-500 flex flex-col ${isActive ? "shadow-2xl ring-1 ring-black/5 dark:ring-white/10" : "shadow-md blur-[2px]"}`}>
                      
                      {/* Top Image (Wider Aspect Ratio) */}
                      <div 
                        className={`relative w-full aspect-[4/3] md:aspect-[2/1] bg-gray-100 dark:bg-zinc-800 ${isActive ? "cursor-zoom-in" : ""}`}
                        onClick={(e) => {
                          if (isActive) {
                            e.stopPropagation();
                            setZoomedImg(cert.image);
                          }
                        }}
                      >
                        <Image
                          src={cert.image}
                          alt={cert.title}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>

                      <div className="p-6 flex flex-col justify-between bg-white dark:bg-zinc-900">
                        <div className="mb-4">
                          <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400 font-medium mb-1">{cert.date}</p>
                          <h3 className={`text-xl md:text-3xl font-bold mb-1 ${cert.textColor}`}>
                            {cert.title}
                          </h3>
                          <p className="text-sm md:text-base text-gray-700 dark:text-zinc-300 font-medium">
                            {cert.subtitle}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {cert.tags.map((tag, tIdx) => (
                            <span 
                              key={tIdx} 
                              className={`text-xs font-bold tracking-wide px-3 py-1 rounded-full ${cert.tagBg} ${cert.tagText}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Apple iOS-Style Dynamic Progress Pill */}
            <div className="mt-8 md:mt-14 flex justify-center">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-200/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-black/5 dark:border-white/5">
                {certifications.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    onClick={() => setActiveCert(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className="relative h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: activeCert === index ? "24px" : "8px" }}
                  >
                    <span 
                      className={`absolute inset-0 rounded-full transition-colors duration-500 ${
                        activeCert === index 
                          ? "bg-blue-600 dark:bg-zinc-200" 
                          : "bg-slate-400/50 dark:bg-zinc-600 hover:bg-slate-500 dark:hover:bg-zinc-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Image Zoom Lightbox Modal */}
            <AnimatePresence>
              {zoomedImg && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setZoomedImg(null)}
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10 cursor-zoom-out"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl"
                  >
                    <Image src={zoomedImg} alt="Zoomed Certificate" fill className="object-contain" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Skills 3D Cloud Section */}
        <section className="py-12 overflow-hidden bg-[oklch(98%_0.045_203.388)] dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-blue-950 dark:text-zinc-100">
              Skills
            </h2>

            <div className="w-full max-w-full overflow-hidden flex justify-center">
              <canvas 
                id="skillCloud" 
                width="1200" 
                height="800" 
                className="w-full max-w-[1100px] h-auto cursor-grab active:cursor-grabbing"
              >
                <p>Error: Your browser does not support the HTML canvas element.</p>
              </canvas>
            </div>

            {/* Safe Hydration Mapping */}
            <div id="skillTags" className="hidden">
              <ul>
                {randomizedSkills.length > 0
                  ? /* CLIENT RENDER: Use the truly random values */
                    randomizedSkills.map((skill, i) => (
                      <li key={`client-skill-${i}`}>
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          style={{ fontSize: skill.size, color: skill.color }}
                        >
                          {skill.name}
                        </a>
                      </li>
                    ))
                  : /* SERVER RENDER: Safe fallback using modulo to prevent hydration errors */
                    allSkills.map((skill, i) => {
                      const safeColor = vibrantColors[i % vibrantColors.length];
                      const safeSize = variedSizes[i % variedSizes.length] + "rem";
                      return (
                        <li key={`server-skill-${i}`}>
                          <a href="#" style={{ fontSize: safeSize, color: safeColor }}>
                            {skill}
                          </a>
                        </li>
                      );
                    })}
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
