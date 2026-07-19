export const skillLanguages = [
  "Linux", "x86_64 ASM", "SIMD", "C", "C++", "C#", "Python", "HTML", "CSS", "SQL", "GLSL", "HLSL", "Git", "Perforce"
];

export const skillEngines = [
  "Unity", "Unreal Engine", "Godot", "Shader Graph", "Material System", "OpenGL",
];

export const skillSoftware = [
  "Trello", "Miro", "Adobe After Effect", "Office Suite",
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
