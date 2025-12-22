import React, { useEffect, useRef, useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  User,
  BookOpen,
  Calendar,
  Clock,
  Menu,
  X,
  Globe2,
} from "lucide-react";

import portfolioDataJson from "./portfolio.json";

// Types TypeScript
interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  links: {
    github: string;
    linkedin: string;
    portfolio: string;
  };
}

interface SkillGroup {
  category: string;
  items: string[];
}

interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link: string;
  highlights: string[];
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface Article {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  link: string;
  featured?: boolean;
}

interface PortfolioData {
  personal: PersonalInfo;
  skills: SkillGroup[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  education: Education[];
  articles: Article[];
}

type SectionId =
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "articles";

type Locale = "en" | "fr" | "de";

type Translation = {
  nav: Record<SectionId, string>;
  about: { title: string; email: string; phone: string; location: string };
  experienceTitle: string;
  projectsTitle: string;
  skillsTitle: string;
  educationTitle: string;
  certificationsTitle: string;
  articlesTitle: string;
  featuredLabel: string;
  allArticlesLabel: string;
  footer: string;
  presentLabel: string;
  months: string[];
  localeDate: string;
};

type PortfolioDataByLocale = Record<Locale, PortfolioData>;

const translations: Record<Locale, Translation> = {
  en: {
    nav: {
      about: "About",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      education: "Education",
      certifications: "Certifications",
      articles: "Articles",
    },
    about: {
      title: "About",
      email: "Email",
      phone: "Phone",
      location: "Location",
    },
    experienceTitle: "Professional Experience",
    projectsTitle: "Projects",
    skillsTitle: "Skills",
    educationTitle: "Education",
    certificationsTitle: "Certifications",
    articlesTitle: "Articles & Blog",
    featuredLabel: "Featured Articles",
    allArticlesLabel: "All articles",
    footer: "All rights reserved.",
    presentLabel: "Present",
    months: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    localeDate: "en-US",
  },
  fr: {
    nav: {
      about: "À propos",
      experience: "Expérience",
      projects: "Projets",
      skills: "Compétences",
      education: "Formation",
      certifications: "Certifications",
      articles: "Articles",
    },
    about: {
      title: "À propos",
      email: "Email",
      phone: "Téléphone",
      location: "Localisation",
    },
    experienceTitle: "Expérience Professionnelle",
    projectsTitle: "Projets",
    skillsTitle: "Compétences",
    educationTitle: "Formation",
    certificationsTitle: "Certifications",
    articlesTitle: "Articles & Blog",
    featuredLabel: "Articles en vedette",
    allArticlesLabel: "Tous les articles",
    footer: "Tous droits réservés.",
    presentLabel: "Présent",
    months: [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ],
    localeDate: "fr-FR",
  },
  de: {
    nav: {
      about: "Über mich",
      experience: "Berufserfahrung",
      projects: "Projekte",
      skills: "Kompetenzen",
      education: "Ausbildung",
      certifications: "Zertifizierungen",
      articles: "Artikel",
    },
    about: {
      title: "Über mich",
      email: "E-Mail",
      phone: "Telefon",
      location: "Standort",
    },
    experienceTitle: "Berufserfahrung",
    projectsTitle: "Projekte",
    skillsTitle: "Kompetenzen",
    educationTitle: "Ausbildung",
    certificationsTitle: "Zertifizierungen",
    articlesTitle: "Artikel & Blog",
    featuredLabel: "Ausgewählte Artikel",
    allArticlesLabel: "Alle Artikel",
    footer: "Alle Rechte vorbehalten.",
    presentLabel: "Aktuell",
    months: [
      "Jan",
      "Feb",
      "Mär",
      "Apr",
      "Mai",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dez",
    ],
    localeDate: "de-DE",
  },
};

const LOCALES: Locale[] = ["en", "fr", "de"];

const portfolioDataByLocale = portfolioDataJson as PortfolioDataByLocale;

interface Section {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Portfolio: React.FC = () => {
  const [locale, setLocale] = useState<Locale>("en");
  const [activeSection, setActiveSection] = useState<SectionId>("about");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocaleOpen, setIsLocaleOpen] = useState(false);
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    about: null,
    experience: null,
    projects: null,
    skills: null,
    education: null,
    certifications: null,
    articles: null,
  });
  const localeDesktopRef = useRef<HTMLDivElement | null>(null);
  const localeMobileRef = useRef<HTMLDivElement | null>(null);
  const data = portfolioDataByLocale[locale] ?? portfolioDataByLocale.en;
  const t = translations[locale];

  const scrollToSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false); // Close mobile menu when section changes
    setIsLocaleOpen(false);
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLocaleChange = (value: Locale) => {
    setLocale(value);
    setIsMobileMenuOpen(false);
    setIsLocaleOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.getAttribute("data-section-id") as SectionId | null;
          if (id) {
            setActiveSection(id);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -50% 0px", // consider midpoint of viewport
        threshold: [0.25, 0.5, 0.75],
      }
    );

    Object.values(sectionRefs.current).forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isLocaleOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        (localeDesktopRef.current && localeDesktopRef.current.contains(target)) ||
        (localeMobileRef.current && localeMobileRef.current.contains(target))
      ) {
        return;
      }
      setIsLocaleOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLocaleOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLocaleOpen]);

  const sections: Section[] = [
    { id: "about", label: t.nav.about, icon: User },
    { id: "experience", label: t.nav.experience, icon: Briefcase },
    { id: "projects", label: t.nav.projects, icon: Code2 },
    { id: "articles", label: t.nav.articles, icon: BookOpen },
    { id: "skills", label: t.nav.skills, icon: Code2 },
    { id: "education", label: t.nav.education, icon: GraduationCap },
    { id: "certifications", label: t.nav.certifications, icon: Award },
  ];

  const formatDate = (date: string): string => {
    if (date === "Present") return t.presentLabel;
    const [year, month] = date.split("-");
    return `${t.months[parseInt(month) - 1]} ${year}`;
  };

  const formatArticleDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(t.localeDate, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-white/10 z-50">
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {data.personal.name}
            </h1>

            {/* Desktop Navigation + Locale */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <div className="flex gap-3 lg:gap-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`px-3 lg:px-4 py-2 rounded-lg transition-all text-sm lg:text-base ${
                      activeSection === section.id
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
              <div className="relative" ref={localeDesktopRef}>
                <button
                  onClick={() => setIsLocaleOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition text-gray-200 hover:text-white hover:bg-white/5"
                  aria-haspopup="listbox"
                  aria-expanded={isLocaleOpen}
                >
                  <Globe2 className="w-5 h-5" />
                  <span className="font-semibold">{locale.toUpperCase()}</span>
                </button>
                {isLocaleOpen && (
                  <div className="absolute right-0 mt-2 w-36 rounded-lg border border-white/10 bg-slate-900/90 backdrop-blur-lg shadow-lg z-50">
                    <ul className="py-2">
                      {LOCALES.map((loc) => (
                        <li key={loc}>
                          <button
                            onClick={() => handleLocaleChange(loc)}
                            className={`w-full text-left px-4 py-2 text-sm transition ${
                              locale === loc
                                ? "bg-purple-600 text-white"
                                : "text-gray-200 hover:text-white hover:bg-white/5"
                            }`}
                            role="option"
                            aria-selected={locale === loc}
                          >
                            {loc.toUpperCase()}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-2">
              <div className="relative" ref={localeMobileRef}>
                <button
                  onClick={() => {
                    setIsLocaleOpen((prev) => !prev);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-gray-200 hover:text-white hover:bg-white/5 rounded-lg transition"
                  aria-haspopup="listbox"
                  aria-expanded={isLocaleOpen}
                >
                  <Globe2 className="w-5 h-5" />
                  <span className="font-semibold text-sm">{locale.toUpperCase()}</span>
                </button>
                {isLocaleOpen && (
                  <div className="absolute right-0 mt-2 w-32 rounded-lg border border-white/10 bg-slate-900/90 backdrop-blur-lg shadow-lg z-50">
                    <ul className="py-2">
                      {LOCALES.map((loc) => (
                        <li key={loc}>
                          <button
                            onClick={() => handleLocaleChange(loc)}
                            className={`w-full text-left px-4 py-2 text-sm transition ${
                              locale === loc
                                ? "bg-purple-600 text-white"
                                : "text-gray-200 hover:text-white hover:bg-white/5"
                            }`}
                            role="option"
                            aria-selected={locale === loc}
                          >
                            {loc.toUpperCase()}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setIsLocaleOpen(false);
                }}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? "max-h-[28rem] opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-2 pb-4">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                      activeSection === section.id
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 pb-4 px-1">
              {LOCALES.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition ${
                    locale === loc
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center text-3xl sm:text-5xl font-bold">
              {data.personal.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent px-4">
              {data.personal.name}
            </h2>
            <p className="text-xl sm:text-2xl text-purple-300 mb-4 sm:mb-6 px-4">
              {data.personal.title}
            </p>
            <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              {data.personal.summary}
            </p>
            <div className="flex justify-center gap-3 sm:gap-4">
              <a
                href={data.personal.links.github}
                className="p-2 sm:p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href={data.personal.links.linkedin}
                className="p-2 sm:p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href={`mailto:${data.personal.email}`}
                className="p-2 sm:p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 pb-24 sm:pb-32 space-y-10 sm:space-y-14">
        {/* About Section */}
        <section
          id="about"
          data-section-id="about"
          ref={(node) => (sectionRefs.current.about = node)}
          className="scroll-mt-28"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              {t.about.title}
            </h3>
            <div className="space-y-4 text-gray-300">
              <p className="text-base sm:text-lg">{data.personal.summary}</p>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                <div className="bg-white/5 p-3 sm:p-4 rounded-lg">
                  <span className="text-purple-400 font-semibold text-sm sm:text-base">
                    {t.about.email}:
                  </span>
                  <p className="text-sm sm:text-base break-all">{data.personal.email}</p>
                </div>
                <div className="bg-white/5 p-3 sm:p-4 rounded-lg">
                  <span className="text-purple-400 font-semibold text-sm sm:text-base">
                    {t.about.phone}:
                  </span>
                  <p className="text-sm sm:text-base">{data.personal.phone}</p>
                </div>
                <div className="bg-white/5 p-3 sm:p-4 rounded-lg sm:col-span-2">
                  <span className="text-purple-400 font-semibold text-sm sm:text-base">
                    {t.about.location}:
                  </span>
                  <p className="text-sm sm:text-base">{data.personal.location}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section
          id="experience"
          data-section-id="experience"
          ref={(node) => (sectionRefs.current.experience = node)}
          className="scroll-mt-28"
        >
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              {t.experienceTitle}
            </h3>
            {data.experience.map((exp, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 hover:border-purple-500/50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                  <div className="flex-1">
                    <h4 className="text-xl sm:text-2xl font-bold text-purple-300">
                      {exp.position}
                    </h4>
                    <p className="text-lg sm:text-xl text-gray-300">{exp.company}</p>
                    <p className="text-sm sm:text-base text-gray-400">{exp.location}</p>
                  </div>
                  <span className="text-gray-400 bg-white/5 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base self-start sm:self-auto">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">{exp.description}</p>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-300 text-sm sm:text-base"
                    >
                      <span className="text-purple-400 mt-1">▹</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section
          id="projects"
          data-section-id="projects"
          ref={(node) => (sectionRefs.current.projects = node)}
          className="scroll-mt-28"
        >
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              {t.projectsTitle}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {data.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-purple-500/50 transition group"
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <h4 className="text-lg sm:text-xl font-bold text-purple-300 flex-1 pr-2">
                      {project.name}
                    </h4>
                    <a
                      href={project.link}
                      className="text-gray-400 hover:text-purple-400 transition flex-shrink-0"
                      aria-label={`View ${project.name}`}
                    >
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  </div>
                  <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 sm:px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs sm:text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {project.highlights.map((highlight, i) => (
                      <p key={i} className="text-xs sm:text-sm text-gray-400">
                        • {highlight}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section
          id="skills"
          data-section-id="skills"
          ref={(node) => (sectionRefs.current.skills = node)}
          className="scroll-mt-28"
        >
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              {t.skillsTitle}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {data.skills.map((skillGroup, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10"
                >
                  <h4 className="text-lg sm:text-xl font-bold text-purple-300 mb-3 sm:mb-4">
                    {skillGroup.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600/30 text-purple-200 rounded-lg hover:bg-purple-600/50 transition text-sm sm:text-base"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section
          id="education"
          data-section-id="education"
          ref={(node) => (sectionRefs.current.education = node)}
          className="scroll-mt-28"
        >
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              {t.educationTitle}
            </h3>
            {data.education.map((edu, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                  <div className="flex-1">
                    <h4 className="text-xl sm:text-2xl font-bold text-purple-300">
                      {edu.degree}
                    </h4>
                    <p className="text-lg sm:text-xl text-gray-300">{edu.institution}</p>
                    <p className="text-sm sm:text-base text-gray-400">{edu.location}</p>
                  </div>
                  <span className="text-gray-400 bg-white/5 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base self-start sm:self-auto">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-gray-300 text-sm sm:text-base">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section
          id="certifications"
          data-section-id="certifications"
          ref={(node) => (sectionRefs.current.certifications = node)}
          className="scroll-mt-28"
        >
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              {t.certificationsTitle}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {data.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10"
                >
                  <h4 className="text-lg sm:text-xl font-bold text-purple-300 mb-2">
                    {cert.name}
                  </h4>
                  <p className="text-gray-300 mb-2 text-sm sm:text-base">{cert.issuer}</p>
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">
                    {formatDate(cert.date)}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    ID: {cert.credentialId}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section
          id="articles"
          data-section-id="articles"
          ref={(node) => (sectionRefs.current.articles = node)}
          className="scroll-mt-28"
        >
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              {t.articlesTitle}
            </h3>

            {/* Featured Articles */}
            <div className="space-y-4 mb-6 sm:mb-8">
              <h4 className="text-lg sm:text-xl font-semibold text-purple-300">
                {t.featuredLabel}
              </h4>
              {data.articles
                .filter((article) => article.featured)
                .map((article, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-500/30 hover:border-purple-500/60 transition group"
                  >
                    <div className="flex items-start justify-between mb-3 sm:mb-4 gap-3">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition">
                          {article.title}
                        </h5>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            {formatArticleDate(article.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            {article.readTime}
                          </span>
                        </div>
                      </div>
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 sm:p-3 bg-white/10 rounded-lg hover:bg-white/20 transition flex-shrink-0"
                        aria-label={`Read ${article.title}`}
                      >
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    </div>
                    <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg">
                      {article.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 sm:px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-xs sm:text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* All Articles */}
            <div className="space-y-4">
              <h4 className="text-lg sm:text-xl font-semibold text-purple-300">
                {t.allArticlesLabel}
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.articles.map((article, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/10 hover:border-purple-500/50 transition group"
                  >
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <h5 className="text-base sm:text-lg font-bold text-purple-300 group-hover:text-purple-200 transition flex-1 min-w-0">
                        {article.title}
                      </h5>
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-400 transition flex-shrink-0"
                        aria-label={`Read ${article.title}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatArticleDate(article.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-purple-600/20 text-purple-300 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-slate-900/80 backdrop-blur-lg border-t border-white/10 py-4 sm:py-8 z-40">
        <div className="container mx-auto px-4 sm:px-6 text-center text-gray-400">
          <p className="text-xs sm:text-sm">
            © 2024 {data.personal.name}. {t.footer}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
