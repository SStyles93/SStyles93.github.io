// Single source of truth for the CV page and the homepage.
// Keep in sync with the Typst PDF CV (typst - documents/Typst_CV/Samuel_Styles_CV.typ).
// Bullet strings may contain <strong> and <a> tags; they are rendered with set:html.

export interface SkillItem {
  name: string;
  icon?: string;     // devicon class
  svgPath?: string;  // Simple Icons path (viewBox "0 0 24 24"), rendered inline with fill-current
}

export const profile =
  "Software engineer specialized in C++ and C#, with a BSc (First Class Honours) and a background in industrial mechatronics. " +
  "Experienced from low-level systems and native libraries to developer tooling and commercial products shipped as co-founder and lead programmer. " +
  "C++ Institute and Unity certified. Looking for a software engineering role building reliable, high-performance systems.";

export const skillLanguages: SkillItem[] = [
  { name: "C++",        icon: "devicon-cplusplus-plain colored" },
  { name: "C#",         icon: "devicon-csharp-plain colored" },
  { name: "C",          icon: "devicon-c-plain colored" },
  { name: "Python",     icon: "devicon-python-plain colored" },
  { name: "JavaScript", icon: "devicon-javascript-plain colored" },
  { name: "TypeScript", icon: "devicon-typescript-plain colored" },
  { name: "SQL",        icon: "devicon-postgresql-plain colored" },
  { name: "HLSL" },
  { name: "GLSL" },
  { name: "x86-64 ASM" },
];

export const skillEngines: SkillItem[] = [
  { name: ".NET",          icon: "devicon-dotnetcore-plain colored" },
  { name: "Unity",         icon: "devicon-unity-plain" },
  { name: "Unreal Engine", icon: "devicon-unrealengine-original" },
  { name: "OpenGL",        icon: "devicon-opengl-plain colored" },
  { name: "Qt (PyQt)",     icon: "devicon-qt-original colored" },
  { name: "SFML" },
];

export const skillTools: SkillItem[] = [
  { name: "Git",           icon: "devicon-git-plain colored" },
  { name: "Perforce",      svgPath: "m7.386 14.957 2.279-1.316-.576-.333A1.48 1.48 0 0 1 8.334 12c0-.262.073-.915.755-1.308l10.31-5.953a1.49 1.49 0 0 1 1.51 0c.228.13.755.52.755 1.308v11.906c0 .788-.527 1.178-.754 1.308s-.828.393-1.51 0l-2.732-1.577-2.334 1.348 3.899 2.251a3.81 3.81 0 0 0 3.845 0A3.81 3.81 0 0 0 24 17.953V6.047a3.81 3.81 0 0 0-1.922-3.33 3.83 3.83 0 0 0-1.923-.52c-.66 0-1.32.173-1.922.52L7.923 8.67A3.81 3.81 0 0 0 6 12c0 1.17.51 2.234 1.386 2.956zm9.228-5.913-2.279 1.316.576.333c.682.393.755 1.046.755 1.308 0 .263-.073.915-.755 1.308l-10.31 5.954a1.49 1.49 0 0 1-1.51 0 1.48 1.48 0 0 1-.755-1.308V6.047c0-.788.527-1.178.754-1.308s.828-.393 1.51 0l2.732 1.577 2.334-1.348-3.899-2.251a3.81 3.81 0 0 0-3.845 0A3.81 3.81 0 0 0 0 6.047v11.906c0 1.39.72 2.635 1.922 3.33a3.83 3.83 0 0 0 1.923.52c.66 0 1.32-.173 1.922-.52l10.31-5.953A3.81 3.81 0 0 0 18 12c0-1.17-.51-2.234-1.386-2.956" },
  { name: "CMake",         icon: "devicon-cmake-plain colored" },
  { name: "vcpkg" },
  { name: "Visual Studio", icon: "devicon-visualstudio-plain colored" },
  { name: "GDB" },
  { name: "Valgrind" },
  { name: "CI/CD",         icon: "devicon-githubactions-plain colored" },
  { name: "Linux",         icon: "devicon-linux-plain" },
  { name: "Jira",          icon: "devicon-jira-plain colored" },
];

export const skillMethods = ["Agile", "Scrum", "Profiling & optimization", "Technical documentation"];

export interface Experience {
  title: string;
  company: string;
  location?: string;
  start: string;
  end: string;
  bullets: string[];
}

export const experiences: Experience[] = [
  {
    title: "Co-Founder – Programmer & Digital Asset Creator",
    company: "PixelPulse (PxP)",
    start: "Jan 2025",
    end: "Present",
    bullets: [
      "Co-founded a 2-person studio building tools, shaders and 3D asset packs for the Unity Asset Store",
      "Programmed, validated and published assets optimized for real-time engines; released <strong>12 commercial packs in 8 months</strong>",
      "Ran the product pipeline (pricing, store pages, analytics, website): <strong>1'000+ sales</strong>, ~22% conversion rate and <strong>4'400+ page views</strong> with zero paid advertising",
    ],
  },
  {
    title: "Software Engineer (Internship)",
    company: "Lab4Tech",
    location: "Lausanne",
    start: "Jun 2025",
    end: "Sep 2025",
    bullets: [
      "Designed a <strong>native C++ library (DLL)</strong> for procedural map generation (BSP, cellular automata, random walk), integrated into Unity through <strong>C++/C# interop</strong> and custom editor tooling (CMake, vcpkg); <strong>adopted by senior developers</strong> for map creation",
      "Built <a href=\"/projects/quiztrainer\">Quiz Trainer</a>, a web-based exam training tool (JavaScript) that converts documents into JSON question sets",
      "Improved the C++ training material for the CPE, CPA and CPP certifications, helping <strong>3 interns obtain 2 certifications each</strong>",
    ],
  },
  {
    title: "Co-Founder & Lead Programmer",
    company: "Styles Studio Sàrl",
    location: "Lausanne",
    start: "Jan 2022",
    end: "Jul 2024",
    bullets: [
      "Led development of <a href=\"/projects/run4yourlight\">Run4YourLight</a> (Unity/C#, team of 5) from prototype to <strong>commercial Steam release</strong>, including Steamworks integration; <strong>Indie Game Nation Jury &amp; Public Award</strong>",
      "Set up and managed the company's IT infrastructure and development tools; led technical operations and strategy",
      "Mentored junior developers and taught programming courses for the <a href=\"https://swiss-digital-academy.com/\">Swiss Digital Academy</a>",
      "Presented the product to <strong>5'000+ visitors</strong> at Fantasy Basel, Zurich Pop Con, Numerik Games and Japan Tours Festival",
    ],
  },
];

// Web-only: older roles, shown below the main experience
export const earlierExperiences: Experience[] = [
  {
    title: "Teacher & Speaker",
    company: "Swiss Game Academy, HEIA-FR",
    location: "Fribourg",
    start: "2023",
    end: "2025",
    bullets: [
      "Taught an <a href=\"/projects/alchemisteddy_course\">advanced programming lab</a> (Unity/C#) and coached students through their projects",
    ],
  },
  {
    title: "Producer",
    company: "SAE Institute",
    location: "Geneva",
    start: "Sep 2023",
    end: "Sep 2024",
    bullets: [
      "Produced two Unreal Engine specialization projects, coordinating programmers, artists and audio engineers",
      "Defined milestones and schedules and kept delivery on track",
    ],
  },
  {
    title: "Co-Founder – Game Programmer",
    company: "Dama Dama Games",
    location: "Lausanne",
    start: "Jan 2021",
    end: "May 2021",
    bullets: [
      "Gameplay and shader programming, visual effects and QA in Unity, before starting a bachelor's degree",
    ],
  },
  {
    title: "Mechatronics Technician",
    company: "LARAG SA | MAN Truck & Bus Schweiz AG",
    start: "Aug 2014",
    end: "Jan 2021",
    bullets: [
      "Diagnosed and fixed faults in electrical, electronic and mechanical vehicle systems using <strong>CAN bus</strong> diagnostic software",
      "Applied systematic root-cause analysis to complex control systems, working with engineers on interdisciplinary issues",
    ],
  },
];

export interface Credential {
  title: string;
  issuer: string;
  date: string;
  pdfPath: string;
  linkLabel: string;
}

export const certifications: Credential[] = [
  {
    title: "Unity Certified Professional Programmer",
    issuer: "ISEIG, Lausanne",
    date: "Aug 2025",
    pdfPath: "/pdf/Samuel_Styles_UCPP520.pdf",
    linkLabel: "UCPP-520",
  },
  {
    title: "Professional Scrum Product Owner™ I",
    issuer: "Lab4Tech, Lausanne",
    date: "Aug 2025",
    pdfPath: "/pdf/Samuel_Styles_PSPO_I.pdf",
    linkLabel: "PSPO I",
  },
  {
    title: "C++ Certified Associate Programmer",
    issuer: "ISEIG, Lausanne",
    date: "Jul 2025",
    pdfPath: "/pdf/Samuel_Styles_C++_CPA_Certificate.pdf",
    linkLabel: "CPA",
  },
];

export const education: Credential[] = [
  {
    title: "BSc (Hons) Games Programming – First Class Honours",
    issuer: "University of Hertfordshire (UK), via SAE Institute Geneva",
    date: "2024",
    pdfPath: "/pdf/Samuel_Styles_BachelorDegree.pdf",
    linkLabel: "Diploma",
  },
  {
    title: "CFC Diploma in Mechatronics",
    issuer: "EPSIC, Lausanne",
    date: "2019",
    pdfPath: "/pdf/Samuel_Styles_CFC_2019.pdf",
    linkLabel: "Diploma",
  },
];

export const spokenLanguages = [
  { name: "English", level: "Native" },
  { name: "French", level: "Native" },
  { name: "Italian", level: "B1" },
  { name: "German", level: "Basic" },
];
