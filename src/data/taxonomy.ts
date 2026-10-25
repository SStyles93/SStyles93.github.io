// Single source of truth for how projects and posts are organized.
// The enums here are enforced by the content schema (src/content.config.ts).

export const categories = [
  {
    id: "systems",
    label: "Systems & Low-Level",
    description: "C and C++ fundamentals, engines, physics, native libraries, architecture and performance.",
  },
  {
    id: "graphics",
    label: "Graphics & Rendering",
    description: "Rendering engines, shaders and visual effects in OpenGL, Unity and Unreal Engine.",
  },
  {
    id: "games",
    label: "Games & Gameplay",
    description: "Shipped games, game jams and gameplay systems.",
  },
  {
    id: "tools",
    label: "Tools & Automation",
    description: "Desktop utilities, editor tools and web tools that speed up everyday work.",
  },
  {
    id: "workflow",
    label: "Workflow & Teaching",
    description: "Version control, production, team practices and courses.",
  },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
export const categoryIds = categories.map((c) => c.id) as [CategoryId, ...CategoryId[]];
export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;

// Tag keys stay stable because they appear in URLs (/blogs/tags/<key>/); labels are what visitors see.
export const techLabels = {
  C: "C",
  CPP: "C++",
  CSharp: "C#",
  Python: "Python",
  JavaScript: "JavaScript",
  Shell: "Shell",
  Unity: "Unity",
  UnrealEngine: "Unreal Engine",
  OpenGL: "OpenGL",
  Shaders: "Shaders",
  Linux: "Linux",
  Git: "Git",
  Mobile: "Mobile",
  Network: "Networking",
} as const;

export type TechId = keyof typeof techLabels;
export const techIds = Object.keys(techLabels) as [TechId, ...TechId[]];
export const techLabel = (id: string) => techLabels[id as TechId] ?? id;

export const kinds = {
  "case-study": "Case study",
  "deep-dive": "Deep dive",
  tutorial: "Tutorial",
  notes: "Notes",
} as const;

export type KindId = keyof typeof kinds;
export const kindIds = Object.keys(kinds) as [KindId, ...KindId[]];

export const series = [
  {
    id: "marblemaze",
    title: "MarbleMaze Deep Dives",
    description: "The systems behind MarbleMaze: Galactic Stars, a mobile puzzle game built in Unity/C#.",
    project: "mmgs_project",
  },
  {
    id: "c-fundamentals",
    title: "C & Shell Fundamentals",
    description: "From first shell commands to pointers, linked lists, GDB and Valgrind.",
    project: "42_overview",
  },
  {
    id: "alchemisteddy",
    title: "AlchemisTeddy Devlog",
    description: "Building game-ready props, shaders and systems for AlchemisTeddy in Unity 6.",
  },
  {
    id: "unity-tips",
    title: "Unity Tips",
    description: "Short, practical techniques for everyday Unity development.",
  },
  {
    id: "git",
    title: "Git for Teams",
    description: "Version control workflows, from SourceTree basics to team practices.",
  },
] as const;

export type SeriesId = (typeof series)[number]["id"];
export const seriesIds = series.map((s) => s.id) as [SeriesId, ...SeriesId[]];
export const getSeries = (id: SeriesId) => series.find((s) => s.id === id)!;
