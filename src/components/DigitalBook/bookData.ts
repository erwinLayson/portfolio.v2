export type BookChapter = {
  id: number;
  chapterNumber: number;
  chapterRoman: string;
  chapterTitle: string;
  subtitle: string;
  role: string;
  company: string;
  period: string;
  summary: string;
  points: string[];
  technologies: string[];
  keyAccomplishments: string[];
  quote?: string;
};

export const bookChapters: BookChapter[] = [
  {
    id: 1,
    chapterNumber: 1,
    chapterRoman: "I",
    chapterTitle: "The Genesis of Code",
    subtitle: "1st Year College — Programming Foundation",
    role: "1st Year College — Programming Foundation",
    company: "Sultan Kudarat State University (SKSU)",
    period: "2023 — 2024",
    summary:
      "Embarked on the formal software journey through rigorous college computer science and information technology coursework, cultivating strong algorithmic problem-solving instincts.",
    points: [
      "Built foundational programming knowledge through college programming and information technology coursework.",
      "Learned fundamental programming concepts such as variables, functions, conditions, loops, data structures, and problem solving using C and C++.",
      "Developed simple programs using conditional statements and loops to solve basic programming problems.",
    ],
    technologies: ["C", "C++", "Data Structures", "Algorithms", "Problem Solving", "CLI"],
    keyAccomplishments: [
      "Mastered low-level memory concepts, data types, and logical execution flows.",
      "Engineered command-line applications testing algorithmic efficiency and edge cases.",
      "Established core analytical skills forming the bedrock of modern software engineering.",
    ],
    quote: "Every complex software system begins with mastering the fundamental building blocks of code.",
  },
  {
    id: 2,
    chapterNumber: 2,
    chapterRoman: "II",
    chapterTitle: "Building for the Web",
    subtitle: "2nd Year College — Web Development Foundation",
    role: "2nd Year College — Web Development Foundation",
    company: "Sultan Kudarat State University (SKSU)",
    period: "2024 — 2025",
    summary:
      "Transitioned into full-stack web architectures, bridging client-side user interfaces with server-side logic and relational database systems.",
    points: [
      "Developed a stronger foundation in web development and began building complete web applications.",
      "Learned frontend development, backend development, databases, and how different parts of a web application communicate.",
      "Started working with JavaScript, HTML, PHP, CSS, Bootstrap, and SQL databases.",
      "Started learning Object-Oriented Programming (OOP) principles such as classes, objects, encapsulation, inheritance, and polymorphism.",
      "Improved problem-solving and debugging skills through hands-on programming projects.",
    ],
    technologies: ["JavaScript", "PHP", "HTML5", "CSS3", "Bootstrap", "MySQL", "OOP", "Relational DBs"],
    keyAccomplishments: [
      "Developed multi-tier database-driven web applications from scratch.",
      "Applied Object-Oriented Programming (OOP) to architect modular, maintainable codebases.",
      "Implemented relational schemas with SQL normalization, foreign keys, and secure queries.",
    ],
    quote: "Bridging frontend elegance with backend reliability creates real-world value.",
  },
  {
    id: 3,
    chapterNumber: 3,
    chapterRoman: "III",
    chapterTitle: "Leadership & Real-World Craft",
    subtitle: "3rd Year College — Real-World Project Development",
    role: "3rd Year College — Real-World Project Development",
    company: "Sultan Kudarat State University (SKSU)",
    period: "2025 — 2026",
    summary:
      "Stepped into project leadership and client delivery, spearheading capstone development and delivering commercial academic software based on live stakeholder specifications.",
    points: [
      "Served as the Capstone Project Leader and Programmer, coordinating the development process and contributing directly to the system implementation.",
      "Started developing and delivering paid academic software projects based on actual user and school requirements.",
      "Built full-stack applications using React, TypeScript, Node.js, Express.js, and MySQL.",
      "Learned and applied the Model-View-Controller (MVC) architectural pattern to organize application logic and improve code maintainability.",
      "Implemented features such as authentication, CRUD operations, REST APIs, database relationships, and role-based workflows.",
      "Prepared and completed Capstone Chapters 1–3, covering the introduction, related literature and studies, and research methodology.",
      "Successfully defended Chapters 1–3 of the capstone project before the panel.",
      "Gained practical experience debugging applications, gathering requirements, modifying systems based on feedback, and delivering completed projects.",
    ],
    technologies: ["React", "TypeScript", "Node.js", "Express.js", "MySQL", "MVC Architecture", "REST APIs", "Git"],
    keyAccomplishments: [
      "Capstone Project Leader & Programmer: Successfully defended Chapters 1–3 before faculty panel.",
      "Delivered paid commercial software matching real academic and institutional stakeholder needs.",
      "Architected clean MVC RESTful backends with robust authentication and role-based workflows.",
    ],
    quote: "True engineering leadership means delivering reliable software that solves real stakeholder needs.",
  },
  {
    id: 4,
    chapterNumber: 4,
    chapterRoman: "IV",
    chapterTitle: "Full-Stack Mastery & SaaS Innovation",
    subtitle: "4th Year College — Full-Stack Developer",
    role: "4th Year College — Full-Stack Developer",
    company: "Sultan Kudarat State University (SKSU)",
    period: "2026 — 2027 - Present",
    summary:
      "Architecting enterprise-grade applications, presenting SaaS proposals to institutional offices, containerizing microservices, and deploying cloud-native distributed platforms.",
    points: [
      "Built and maintained full-stack web applications using React, TypeScript, Node.js, Express.js, and MySQL/TiDB.",
      "Developed the GradeSync capstone system, implementing full-stack features, authentication, role-based access control, REST APIs, database-driven workflows, and reporting functionality.",
      "Developed ModuLearn as a proposed Software-as-a-Service (SaaS) platform and presented the system proposal to the UP Cebu Technology Transfer and Business Development Office (TTBDO).",
      "Contributed as a developer to the TTBDO system, gaining experience working on software intended for an organizational and institutional environment.",
      "Learned and applied software testing practices, including unit testing and testing database-driven application logic.",
      "Applied clean code principles, separation of concerns, reusable components, and software architecture practices to improve code quality and maintainability.",
      "Learned and applied Docker and Docker Compose for containerizing and managing development environments.",
      "Worked with cloud databases such as TiDB and deployed applications using platforms such as Vercel and Render.",
      "Developed larger systems such as GradeSync, ModuLearn, and Salonease with authentication, role-based access control, REST APIs, scheduling, database relationships, and complex business workflows.",
      "Gained practical experience debugging production issues, managing environment configurations, working with Git/GitHub, and maintaining full-stack applications.",
    ],
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Express.js",
      "MySQL",
      "TiDB Cloud",
      "Docker",
      "Docker Compose",
      "Vercel",
      "Render",
      "Unit Testing",
    ],
    keyAccomplishments: [
      "GradeSync: Comprehensive school management system with role-based access control and analytics.",
      "ModuLearn: Proposed SaaS platform pitched directly to UP Cebu TTBDO.",
      "TTBDO System: Developed software for institutional university environment.",
      "DevOps: Containerized environments via Docker; cloud-scale databases with TiDB.",
    ],
    quote: "Architecting software that scales, empowers communities, and stands the test of production.",
  },
];
