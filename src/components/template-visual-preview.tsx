"use client";

import React from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, User, ExternalLink } from "lucide-react";

interface TemplateVisualPreviewProps {
  templateId: string;
  templateName?: string;
  compact?: boolean; // thumbnail mode for cards
  userPhotoUrl?: string; // if user already has a photo uploaded, show it!
}

export function TemplateVisualPreview({
  templateId,
  templateName,
  compact = false,
  userPhotoUrl,
}: TemplateVisualPreviewProps) {
  // Dummy credentials representing the realistic final output
  const dummyCandidate = {
    name: "ALEXANDER MORGAN",
    title: "Senior Full-Stack Engineer",
    location: "San Francisco, CA",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 234-5678",
    website: "alexmorgan.dev",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    photoUrl:
      userPhotoUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    summary:
      "Full-stack engineer with 6+ years of experience designing fault-tolerant cloud architectures and high-throughput microservices. Proven track record optimizing web performance and leading distributed engineering teams.",
    experience: [
      {
        company: "TechCorp Global",
        location: "San Francisco, CA",
        role: "Senior Software Engineer",
        period: "2022 – Present",
        bullets: [
          "Architected event-driven microservices processing 45M+ daily API requests with 99.99% uptime.",
          "Spearheaded migration to Next.js 15 & GraphQL, reducing page load latency by 42%.",
          "Mentored 6 engineers and drove CI/CD automation improving deployment frequency by 3x.",
        ],
      },
      {
        company: "Apex Systems",
        location: "Austin, TX",
        role: "Full-Stack Software Engineer",
        period: "2020 – 2022",
        bullets: [
          "Engineered real-time telemetry dashboard in React and WebSockets serving 150k+ active users.",
          "Optimized PostgreSQL queries and Redis caching, cutting average DB response times from 320ms to 45ms.",
        ],
      },
    ],
    education: {
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      gpa: "GPA: 3.9 / 4.0",
      period: "2016 – 2020",
    },
    skills: {
      languages: "TypeScript, JavaScript, Python, Go, SQL, HTML5/CSS3",
      frameworks: "React, Next.js, Node.js, Express, Tailwind CSS, GraphQL",
      cloud: "AWS (ECS, S3, RDS), Docker, Kubernetes, PostgreSQL, Redis, Git",
    },
    academic: {
      thesis: "Thesis: High-Throughput Consensus in Asynchronous Distributed Networks",
      publications: [
        "Morgan, A., et al. (2021). Optimizing Latency in Distributed Vector Databases. IEEE Transactions on Cloud Computing.",
        "Morgan, A. (2020). Scalable State Synchronization for Edge Devices. ACM SIGCOMM Poster.",
      ],
    },
  };

  const isPhotoTemplate = templateId === "modern-photo";
  const isNavyGiannetti = templateId === "my-template-3";
  const isBlueAccent = templateId === "my-template-2";
  const isRezume = templateId === "my-template-1";
  const isExecutive = templateId === "classic-executive";
  const isCompact = templateId === "compact-minimal";
  const isAcademic = templateId === "academic-research";

  // Dynamic styling variables based on template
  const primaryColor = isNavyGiannetti
    ? "#00367b"
    : isBlueAccent
    ? "#1d4ed8"
    : isPhotoTemplate
    ? "#0f766e"
    : "#111827";

  const fontFamilyClass = isExecutive || isAcademic ? "font-serif" : "font-sans";

  return (
    <div
      className={`w-full bg-white text-gray-900 rounded-xl overflow-hidden shadow-md border border-gray-300 select-none ${fontFamilyClass} ${
        compact ? "text-[8.5px] leading-tight p-3 max-h-[360px]" : "text-[12px] leading-relaxed p-6 sm:p-8"
      }`}
      style={{ minHeight: compact ? "320px" : "auto" }}
    >
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. HEADER SECTION                                            */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isPhotoTemplate ? (
        // Modern Photo Template: 2-Column Header with Passport Photo Frame
        <div className="flex items-start justify-between gap-3 border-b-2 pb-3 mb-3" style={{ borderColor: primaryColor }}>
          <div className="space-y-1">
            <h1 className={`${compact ? "text-sm" : "text-xl"} font-black tracking-tight text-gray-950`}>
              {dummyCandidate.name}
            </h1>
            <p className="font-bold text-teal-700 text-[9px] uppercase tracking-wider">
              {dummyCandidate.title}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-gray-600 text-[8px]">
              <span>{dummyCandidate.location}</span>
              <span>•</span>
              <span>{dummyCandidate.email}</span>
              <span>•</span>
              <span>{dummyCandidate.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-teal-800 text-[8px] font-medium pt-0.5">
              <span>{dummyCandidate.linkedin}</span>
              <span>•</span>
              <span>{dummyCandidate.github}</span>
            </div>
          </div>

          {/* Formal Passport-size Photo Frame */}
          <div className="shrink-0 flex flex-col items-center">
            <div
              className={`${
                compact ? "w-12 h-15" : "w-20 h-26"
              } rounded-md border-2 border-teal-600 overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center`}
              style={{ aspectRatio: "3.5 / 4.5" }}
            >
              {dummyCandidate.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dummyCandidate.photoUrl}
                  alt="Passport Photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <User className="w-5 h-5" />
                  <span className="text-[6px] uppercase font-bold text-gray-500 mt-0.5">Photo</span>
                </div>
              )}
            </div>
            <span className="text-[6.5px] font-bold text-teal-700 uppercase mt-0.5 tracking-wider">Passport</span>
          </div>
        </div>
      ) : isRezume ? (
        // Rezume / sb2nov: Left Name, Right Contact & Underlined Links
        <div className="border-b border-gray-900 pb-2 mb-2.5">
          <div className="flex justify-between items-baseline">
            <h1 className={`${compact ? "text-base" : "text-2xl"} font-extrabold text-gray-950`}>
              Jane Doe
            </h1>
            <div className="text-right text-gray-700 text-[8px]">
              <span>{dummyCandidate.location}</span> | <span>{dummyCandidate.phone}</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[8px] text-gray-700 mt-0.5">
            <div className="flex items-center gap-2">
              <span className="underline">{dummyCandidate.website}</span>
              <span>|</span>
              <span className="underline">linkedin.com/in/janedoe</span>
              <span>|</span>
              <span className="underline">github.com/janedoe</span>
            </div>
            <span>{dummyCandidate.email}</span>
          </div>
        </div>
      ) : isNavyGiannetti ? (
        // Executive Navy: Centered Navy Title & Centered Contacts with Bar Separators
        <div className="text-center pb-2.5 mb-2.5 border-b-2" style={{ borderColor: primaryColor }}>
          <h1 className={`${compact ? "text-sm" : "text-xl"} font-black tracking-wide`} style={{ color: primaryColor }}>
            {dummyCandidate.name}
          </h1>
          <p className="text-[8px] font-semibold text-gray-600 mt-0.5 uppercase tracking-wider">
            {dummyCandidate.title}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2 text-[8px] text-gray-600 mt-1">
            <span>{dummyCandidate.location}</span>
            <span style={{ color: primaryColor }}>|</span>
            <span>{dummyCandidate.email}</span>
            <span style={{ color: primaryColor }}>|</span>
            <span>{dummyCandidate.phone}</span>
            <span style={{ color: primaryColor }}>|</span>
            <span>{dummyCandidate.linkedin}</span>
          </div>
        </div>
      ) : isBlueAccent ? (
        // Classic Minimalist Blue: Centered Royal Blue Header with Dot Separators
        <div className="text-center pb-2.5 mb-2.5">
          <h1 className={`${compact ? "text-sm" : "text-xl"} font-bold tracking-tight text-blue-700`}>
            {dummyCandidate.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 text-[8px] text-gray-600 mt-0.5">
            <span>{dummyCandidate.location}</span>
            <span>•</span>
            <span className="text-blue-700">{dummyCandidate.email}</span>
            <span>•</span>
            <span>{dummyCandidate.phone}</span>
            <span>•</span>
            <span className="text-blue-700">{dummyCandidate.website}</span>
          </div>
        </div>
      ) : isExecutive ? (
        // Classic Executive Serif: Centered Georgia/Palatino with Diamond Glyphs
        <div className="text-center pb-2 mb-2 border-b border-stone-300">
          <h1 className={`${compact ? "text-base" : "text-2xl"} font-bold tracking-normal text-stone-900`}>
            {dummyCandidate.name}
          </h1>
          <p className="text-[8.5px] italic text-stone-700 mt-0.5">
            {dummyCandidate.title} — Technology Leadership & Cloud Architecture
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2 text-[8px] text-stone-600 mt-1">
            <span>{dummyCandidate.location}</span>
            <span>◆</span>
            <span>{dummyCandidate.email}</span>
            <span>◆</span>
            <span>{dummyCandidate.phone}</span>
            <span>◆</span>
            <span>{dummyCandidate.linkedin}</span>
          </div>
        </div>
      ) : (
        // Jake's Modern Tech (FAANG Standard): Centered Clean with Pipe Dividers
        <div className="text-center pb-2 mb-2">
          <h1 className={`${compact ? "text-base" : "text-2xl"} font-extrabold tracking-tight text-gray-950`}>
            {dummyCandidate.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 text-[8px] text-gray-700 mt-0.5">
            <span>{dummyCandidate.location}</span>
            <span>|</span>
            <span className="text-blue-800">{dummyCandidate.email}</span>
            <span>|</span>
            <span>{dummyCandidate.phone}</span>
            <span>|</span>
            <span className="text-blue-800">linkedin.com/in/alexmorgan</span>
            <span>|</span>
            <span className="text-blue-800">github.com/alexmorgan</span>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. SUMMARY (For Executive / Navy / Blue)                      */}
      {/* ──────────────────────────────────────────────────────────── */}
      {(isExecutive || isBlueAccent || isNavyGiannetti || isPhotoTemplate) && (
        <div className="mb-2.5">
          <div
            className={`font-bold uppercase tracking-wider text-[8px] mb-1 pb-0.5 ${
              isBlueAccent
                ? "text-blue-700 border-b border-blue-600"
                : isNavyGiannetti
                ? "text-[#00367b] border-b border-[#00367b]"
                : isPhotoTemplate
                ? "text-teal-800 border-b border-teal-700"
                : "text-stone-900 border-b border-stone-800"
            }`}
          >
            {isExecutive ? "Executive Summary" : "Professional Summary"}
          </div>
          <p className="text-[8px] text-gray-700 leading-snug">
            {dummyCandidate.summary}
          </p>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. ACADEMIC SPECIFIC: EDUCATION FIRST                         */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isAcademic && (
        <div className="mb-2.5">
          <div className="font-bold uppercase tracking-wider text-[8px] text-amber-900 border-b border-amber-900 mb-1 pb-0.5">
            Education & Academic Honors
          </div>
          <div className="flex justify-between items-baseline font-bold text-gray-950">
            <span>{dummyCandidate.education.institution}</span>
            <span className="text-[8px] font-normal">{dummyCandidate.education.period}</span>
          </div>
          <div className="flex justify-between text-gray-700 text-[8px]">
            <span>{dummyCandidate.education.degree} ({dummyCandidate.education.gpa})</span>
            <span className="italic">Summa Cum Laude</span>
          </div>
          <div className="text-[7.5px] text-gray-600 italic mt-0.5">
            {dummyCandidate.academic.thesis}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. WORK EXPERIENCE                                           */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="mb-2.5">
        <div
          className={`font-bold uppercase tracking-wider text-[8px] mb-1 pb-0.5 ${
            isBlueAccent
              ? "text-blue-700 border-b border-blue-600"
              : isNavyGiannetti
              ? "text-[#00367b] border-b border-[#00367b]"
              : isPhotoTemplate
              ? "text-teal-800 border-b border-teal-700"
              : isAcademic
              ? "text-amber-900 border-b border-amber-900"
              : "text-gray-950 border-b border-gray-900"
          }`}
        >
          Work Experience
        </div>

        {/* Item 1 */}
        <div className="mb-1.5">
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-gray-950">{dummyCandidate.experience[0].company}</span>
            <span className="text-[7.5px] font-medium text-gray-600">{dummyCandidate.experience[0].location}</span>
          </div>
          <div className="flex justify-between items-baseline text-[7.5px] text-gray-700 italic mb-0.5">
            <span>{dummyCandidate.experience[0].role}</span>
            <span>{dummyCandidate.experience[0].period}</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-gray-700 text-[7.5px] pl-0.5">
            <li>{dummyCandidate.experience[0].bullets[0]}</li>
            <li>{dummyCandidate.experience[0].bullets[1]}</li>
            {!compact && <li>{dummyCandidate.experience[0].bullets[2]}</li>}
          </ul>
        </div>

        {/* Item 2 */}
        <div>
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-gray-950">{dummyCandidate.experience[1].company}</span>
            <span className="text-[7.5px] font-medium text-gray-600">{dummyCandidate.experience[1].location}</span>
          </div>
          <div className="flex justify-between items-baseline text-[7.5px] text-gray-700 italic mb-0.5">
            <span>{dummyCandidate.experience[1].role}</span>
            <span>{dummyCandidate.experience[1].period}</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-gray-700 text-[7.5px] pl-0.5">
            <li>{dummyCandidate.experience[1].bullets[0]}</li>
            {!compact && <li>{dummyCandidate.experience[1].bullets[1]}</li>}
          </ul>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. ACADEMIC SPECIFIC: PUBLICATIONS BLOCK                      */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isAcademic && (
        <div className="mb-2">
          <div className="font-bold uppercase tracking-wider text-[8px] text-amber-900 border-b border-amber-900 mb-1 pb-0.5">
            Selected Publications & Preprints
          </div>
          <ol className="list-decimal list-inside space-y-0.5 text-[7px] text-gray-700 pl-0.5">
            <li>{dummyCandidate.academic.publications[0]}</li>
            {!compact && <li>{dummyCandidate.academic.publications[1]}</li>}
          </ol>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. TECHNICAL SKILLS                                          */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="mb-2">
        <div
          className={`font-bold uppercase tracking-wider text-[8px] mb-1 pb-0.5 ${
            isBlueAccent
              ? "text-blue-700 border-b border-blue-600"
              : isNavyGiannetti
              ? "text-[#00367b] border-b border-[#00367b]"
              : isPhotoTemplate
              ? "text-teal-800 border-b border-teal-700"
              : isAcademic
              ? "text-amber-900 border-b border-amber-900"
              : "text-gray-950 border-b border-gray-900"
          }`}
        >
          Technical Skills
        </div>

        {isRezume ? (
          // 2-column tabular key-value
          <div className="space-y-0.5 text-[7.5px]">
            <div className="grid grid-cols-4 gap-1">
              <span className="font-bold text-gray-950">Languages:</span>
              <span className="col-span-3 text-gray-700">{dummyCandidate.skills.languages}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <span className="font-bold text-gray-950">Frameworks:</span>
              <span className="col-span-3 text-gray-700">{dummyCandidate.skills.frameworks}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <span className="font-bold text-gray-950">Dev Tools:</span>
              <span className="col-span-3 text-gray-700">{dummyCandidate.skills.cloud}</span>
            </div>
          </div>
        ) : isCompact ? (
          // Compact pill tags
          <div className="flex flex-wrap gap-1 text-[7px]">
            {["TypeScript", "React", "Next.js", "Python", "Go", "AWS", "Docker", "Kubernetes", "PostgreSQL", "Redis"].map(
              (tag) => (
                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded font-medium text-gray-800">
                  {tag}
                </span>
              )
            )}
          </div>
        ) : (
          <div className="space-y-0.5 text-[7.5px] text-gray-800">
            <div>
              <span className="font-bold">Languages:</span> {dummyCandidate.skills.languages}
            </div>
            <div>
              <span className="font-bold">Frameworks:</span> {dummyCandidate.skills.frameworks}
            </div>
            <div>
              <span className="font-bold">Developer Tools & Cloud:</span> {dummyCandidate.skills.cloud}
            </div>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. EDUCATION (Standard position for non-academic)            */}
      {/* ──────────────────────────────────────────────────────────── */}
      {!isAcademic && (
        <div>
          <div
            className={`font-bold uppercase tracking-wider text-[8px] mb-1 pb-0.5 ${
              isBlueAccent
                ? "text-blue-700 border-b border-blue-600"
                : isNavyGiannetti
                ? "text-[#00367b] border-b border-[#00367b]"
                : isPhotoTemplate
                ? "text-teal-800 border-b border-teal-700"
                : "text-gray-950 border-b border-gray-900"
            }`}
          >
            Education
          </div>
          <div className="flex justify-between items-baseline font-bold text-gray-950 text-[7.5px]">
            <span>{dummyCandidate.education.institution}</span>
            <span className="font-normal text-gray-600">{dummyCandidate.education.period}</span>
          </div>
          <div className="flex justify-between text-gray-700 text-[7.5px]">
            <span>{dummyCandidate.education.degree}</span>
            <span>{dummyCandidate.education.gpa}</span>
          </div>
        </div>
      )}
    </div>
  );
}
