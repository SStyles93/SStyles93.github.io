export interface SkillItem {
  name: string;
  icon?: string;     // devicon class
  svgPath?: string;  // Simple Icons path (viewBox "0 0 24 24"), rendered inline with fill-current
}

export const skillLanguages: SkillItem[] = [
  { name: "Linux",       icon: "devicon-linux-plain" },
  { name: "C",          icon: "devicon-c-plain colored" },
  { name: "C++",        icon: "devicon-cplusplus-plain colored" },
  { name: "C#",         icon: "devicon-csharp-plain colored" },
  { name: "Python",     icon: "devicon-python-plain colored" },
  { name: "HTML",       icon: "devicon-html5-plain colored" },
  { name: "CSS",        icon: "devicon-css3-plain colored" },
  { name: "JavaScript", icon: "devicon-javascript-plain colored" },
  { name: "TypeScript", icon: "devicon-typescript-plain colored" },
  { name: "SQL",        icon: "devicon-postgresql-plain colored" },
  { name: "Git",        icon: "devicon-git-plain colored" },
  { name: "Perforce",   svgPath: "m7.386 14.957 2.279-1.316-.576-.333A1.48 1.48 0 0 1 8.334 12c0-.262.073-.915.755-1.308l10.31-5.953a1.49 1.49 0 0 1 1.51 0c.228.13.755.52.755 1.308v11.906c0 .788-.527 1.178-.754 1.308s-.828.393-1.51 0l-2.732-1.577-2.334 1.348 3.899 2.251a3.81 3.81 0 0 0 3.845 0A3.81 3.81 0 0 0 24 17.953V6.047a3.81 3.81 0 0 0-1.922-3.33 3.83 3.83 0 0 0-1.923-.52c-.66 0-1.32.173-1.922.52L7.923 8.67A3.81 3.81 0 0 0 6 12c0 1.17.51 2.234 1.386 2.956zm9.228-5.913-2.279 1.316.576.333c.682.393.755 1.046.755 1.308 0 .263-.073.915-.755 1.308l-10.31 5.954a1.49 1.49 0 0 1-1.51 0 1.48 1.48 0 0 1-.755-1.308V6.047c0-.788.527-1.178.754-1.308s.828-.393 1.51 0l2.732 1.577 2.334-1.348-3.899-2.251a3.81 3.81 0 0 0-3.845 0A3.81 3.81 0 0 0 0 6.047v11.906c0 1.39.72 2.635 1.922 3.33a3.83 3.83 0 0 0 1.923.52c.66 0 1.32-.173 1.922-.52l10.31-5.953A3.81 3.81 0 0 0 18 12c0-1.17-.51-2.234-1.386-2.956" },
  { name: "x86_64 ASM" },
  { name: "SIMD" },
  { name: "GLSL" },
  { name: "HLSL" },
  { name: "JSON" },
  { name: "YAML" },
];

export const skillEngines: SkillItem[] = [
  { name: "Unity",           icon: "devicon-unity-plain" },
  { name: "Unreal Engine",   icon: "devicon-unrealengine-original" },
  { name: "Godot",           icon: "devicon-godot-plain colored" },
  { name: "OpenGL",          icon: "devicon-opengl-plain colored" },
  { name: "Shader Graph" },
  { name: "Material System" },
];

export const skillSoftware: SkillItem[] = [
  { name: "Jira",               icon: "devicon-jira-plain colored" },
  { name: "Trello",             icon: "devicon-trello-plain colored" },
  { name: "Miro",       svgPath: "M17.392 0H13.9L17 4.808 10.444 0H6.949l3.102 6.3L3.494 0H0l3.05 8.131L0 24h3.494L10.05 6.985 6.949 24h3.494L17 5.494 13.899 24h3.493L24 3.672 17.392 0z" },
  { name: "Adobe After Effect", icon: "devicon-aftereffects-plain colored" },
  { name: "Office Suite" },
];

export interface Experience {
  title: string;
  subtitle: string;
  bulletGroups: string[][];
}

export const experiences: Experience[] = [
  {
    title: "Co-Founder – Programmer & Digital Asset Creator",
    subtitle: "PixelPulse (PxP), January 2025 – Present",
    bulletGroups: [
      [
        "Co-founded a 2-person studio producing tools, shaders, and asset packs for Unity marketplace",
        "Programmed, organized, validated, and published 3D assets optimized for real-time engines",
        "Managed product pipeline: pricing, product pages, analytics, website, and description",
      ],
      [
        "Released 12 commercial asset packs in 8 months",
        "Generated 1,000+ total sales with a 21.98% conversion rate",
        "Achieved 4,400+ page views with no paid advertising",
      ],
    ],
  },
  {
    title: "Software Engineer Intern",
    subtitle: "Lab4Tech, Lausanne, Switzerland, June 2025 – September 2025",
    bulletGroups: [
      [
        "Developed a web-based quiz tool, converting documents with JSON data serialization (Quiz Trainer)",
        "Created a C++/Unity native DLL for procedural 2D map generation, accelerating workflow for senior developers",
        "Enhanced the C++ training materials for CPE, CPA, and CPP certifications",
      ],
      [
        "Contributed to 3 interns achieving 2 certifications each",
        "Procedural generation tool adopted by senior staff, improving map creation speed",
      ],
    ],
  },
  {
    title: "Co-Founder – Programmer",
    subtitle: "Styles Studio SàRL, Lausanne, Switzerland, Jan 2022 – Jul 2024",
    bulletGroups: [
      [
        "Architected and managed the IT infrastructure and development tools",
        "Led the development of Run4YourLight from prototype to full Steam release",
        "Led technical operations and strategy for Styles Studio",
        "Mentored junior developers, delivered training courses for the Swiss Digital Academy",
      ],
      [
        "Built a scalable development pipeline and IT infrastructure",
        "Indie Game Nation Jury & Public Award for Run4YourLight",
        "Showcased Run4YourLight to 5,000+ attendees at Fantasy-Basel, Zurich Pop Con, Numerik Games, Japan Tours Festival",
      ],
    ],
  },
  {
    title: "Teacher & Speaker",
    subtitle: "From 2023 to 2025 at the Swiss Game Academy, HEIA-FR Fribourg, Switzerland",
    bulletGroups: [
      [
        "Teaching advanced coding principles",
        "Guiding student to accomplish their projects.",
      ],
    ],
  },
  {
    title: "Producer",
    subtitle: "From September 2023 to September 2024 at SAE-Institute, Geneva, Switzerland",
    bulletGroups: [
      [
        "Assumed the role of a producer for two specialized projects during my third year at SAE Institute Geneva.",
        "Managed the entire production cycle, gaining in-depth knowledge of Unreal Engine.",
        "Organized project schedules, defined key milestones, and ensured adherence to timelines to meet deadlines.",
        "Facilitated communication and collaboration among game programmers, artists, and audio engineers to maintain a cohesive project vision and ensure successful execution.",
      ],
    ],
  },
  {
    title: "Game Programmer",
    subtitle: "From 2021 to Mai 2021 at Dama Dama Games, Lausanne, Switzerland",
    bulletGroups: [
      [
        "Began career in game development by co-founding Dama Dama Games, a Swiss indie game studio.",
        "Applied commercial knowledge and learned game development using Unity.",
        "Stopped working at Dama Dama Games to start a bachelor's degree at SAE Institute.",
      ],
    ],
  },
  {
    title: "Mecatronics Engineering & Other experiences",
    subtitle: "From 2008 to 2021",
    bulletGroups: [
      [
        "Mecatronics Engineering",
        "Receptionist",
        "Mecatronics Apprentice",
        "Divers Commerical work experiences",
        "Divers IT work experiences",
      ],
    ],
  },
];

export interface Certification {
  title: string;
  subtitle: string;
  pdfPath: string;
  buttonLabel: string;
}

export const certifications: Certification[] = [
  {
    title: "Unity Certified Professional Programmer - UCPP-520",
    subtitle: "Completed: 08/2025, ISEIG, Lausanne, Switzerland",
    pdfPath: "/pdf/Samuel_Styles_UCPP520.pdf",
    buttonLabel: "UCPP-520 Certificate",
  },
  {
    title: "Professional Scrum Product Owner™ I - PSPO-I",
    subtitle: "Completed: 08/2025, Lab4Tech, Lausanne, Switzerland",
    pdfPath: "/pdf/Samuel_Styles_PSPO_I.pdf",
    buttonLabel: "PSPO-I Certificate",
  },
  {
    title: "C++ Certified Associate Programmer - C++ CPA",
    subtitle: "Completed: 07/2025, ISEIG, Lausanne, Switzerland",
    pdfPath: "/pdf/Samuel_Styles_C++_CPA_Certificate.pdf",
    buttonLabel: "C++ CPA Certificate",
  },
  {
    title: "Bachelor's Degree (First Hon.)",
    subtitle: "Completed: 2024, University of Hertfordshire, UK",
    pdfPath: "/pdf/Samuel_Styles_BachelorDegree.pdf",
    buttonLabel: "Bachelor's Degree",
  },
  {
    title: "CFC of Mecatronics",
    subtitle: "Completed: 2019, EPSIC, Lausanne, Switzerland",
    pdfPath: "/pdf/Samuel_Styles_CFC_2019.pdf",
    buttonLabel: "Mecatronics Certificate",
  },
];
