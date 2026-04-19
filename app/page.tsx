"use client";

import { useState } from "react";
import portfolioData from "./porfolio_data.json";

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

  // const startScore = start.year * 12 + start.month;
  const endScore = end.year * 12 + end.month;
  const now = new Date();
  const currentScore = now.getFullYear() * 12 + now.getMonth();

  return endScore >= currentScore;
}

export default function Home() {
  const [isGeekMode, setIsGeekMode] = useState(false);
  const { personal_info, work_experience } = portfolioData;

  return (
    <div className={isGeekMode ? "dark" : ""}>
      <div className="min-h-screen bg-[oklch(98%_0.045_203.388)] text-slate-900 transition-colors duration-500 dark:bg-zinc-950 dark:text-zinc-50">
        <header className="fixed top-0 z-50 w-full border-b border-sky-950/30 bg-sky-700/95 text-sky-50 backdrop-blur dark:border-zinc-500/40 dark:bg-zinc-800/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
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

        <main className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-16 items-start max-w-7xl mx-auto pt-32 px-6">
          <section>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 whitespace-nowrap">
              {personal_info.name}
            </h1>
            <p className="text-xl md:text-2xl font-bold text-sky-800 dark:text-emerald-400 whitespace-nowrap">
              {personal_info.degree}
            </p>
            <p className="text-s md:text-s font-semibold  text-gray-400 dark:text-zinc-300 whitespace-nowrap">
              Current Status: {personal_info.current_status}
            </p>

            <div className="mt-8">
              <div className="relative pl-2">
                {work_experience.map((experience, index) => {
                  const isLast = index === work_experience.length - 1;
                  const isActive = isCurrentExperience(experience.period);

                  return (
                    <div key={`${experience.role}-${experience.period}`} className="relative flex gap-5 pb-8">
                      <div className="relative flex w-5 justify-center">
                        <span
                          className={`absolute top-4 w-px bg-slate-300 dark:bg-zinc-700 ${
                            isLast ? "h-15" : "h-[calc(100%+1rem)]"
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
                          <span className="absolute mt-0.5 h-4.5 w-4.5 rounded-full bg-blue-500/35 ring-2 ring-blue-400/40 animate-pulse dark:bg-green-500/30 dark:ring-green-400/35" />
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
                              className="text-cyan-500 hover:text-blue-600 dark:text-emerald-500 dark:hover:text-emerald-300 transition-colors transform hover:scale-110"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                              </svg>
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
      </div>
    </div>
  );
}
