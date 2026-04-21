// ported from jalxp.github.io/_data/resume.yml
export const resume = {
  summary:
    "I'm an iOS developer with 5+ years of experience specialising in native " +
    'app development using Swift, UIKit, and SwiftUI. I focus on building ' +
    'performant, user-friendly experiences backed by solid architecture. ' +
    "I want to build things that feel great to use, make people's lives a " +
    'little better, and grow alongside a product and team that cares about ' +
    'the same things.',

  work: [
    {
      company: 'GoodBarber',
      position: 'iOS Developer',
      website: 'https://goodbarber.com',
      startDate: '2020-03-01',
      endDate: null, // present
      summary:
        'GoodBarber is a no-code app builder platform shipping native iOS and ' +
        'Android apps with a strong focus on UI/UX and design systems.',
      highlights: [
        'Developed core user-facing features including token-based authentication, push notifications, and caching strategies, improving security, engagement, and app performance.',
        'Expanded the component library and refactored multiple screens to align with an evolving design system, improving UI consistency across the app.',
        'Integrated third-party SDKs including Stripe, Google Ads, Meta Events, and Lottie, improving revenue streams, analytics coverage, and user experience.',
        'Configured CI/CD workflows, reducing TestFlight deployment time and improving the testing process.',
        'Introduced AI tooling into development workflows — local LLM deployment, MCP servers, and custom agents for code generation and documentation.',
        'Created and maintained technical documentation and onboarding guides, mentoring interns and junior developers and reducing new developer ramp-up time.',
        'Represented the company at Portuguese university career fairs, supporting technical recruitment and employer branding.',
      ],
    },
  ],

  volunteer: [
    {
      organization: 'Caspae',
      position: 'Programming Instructor',
      website: 'https://caspae.pt',
      summary:
        'Introduced 5th-grade students to programming fundamentals with Scratch, ' +
        'sparking their interest in coding and technology.',
    },
  ],

  education: [
    {
      institution: 'Instituto Superior de Engenharia de Coimbra',
      area: 'Software Development',
      studyType: 'Bachelor',
      startDate: '2016-09',
      endDate: '2020-09',
    },
    {
      institution: 'Universidade de Coimbra',
      area: 'Physics',
      studyType: 'Bachelor',
      startDate: '2012-09',
      endDate: '2016-09',
    },
  ],

  skills: [
    {
      name: 'Languages',
      keywords: ['Swift', 'Objective-C', 'Python', 'Go', 'Rust', 'C'],
    },
    {
      name: 'Frameworks',
      keywords: [
        'SwiftUI', 'UIKit', 'Combine', 'CoreAnimation', 'CoreData', 'SwiftData',
        'WidgetKit', 'MapKit', 'Swift Testing', 'AlamoFire', 'SDWebImage',
      ],
    },
    {
      name: 'Tools',
      keywords: [
        'Git', 'Xcode', 'Instruments', 'Bitrise', 'TestFlight',
        'App Store Connect', 'JIRA', 'Confluence',
      ],
    },
    {
      name: 'Practices',
      keywords: [
        'MVC', 'MVVM', 'MVVM-C', 'Design Patterns', 'RESTful APIs',
        'Swift Concurrency', 'Compositional Layouts', 'Diffable Data Sources',
      ],
    },
    {
      name: 'Other',
      keywords: ['AI Tooling (MCP, Agents, Local LLMs)', 'UI/UX', 'Figma'],
    },
  ],

  languages: [
    { language: 'Portuguese', fluency: 'Native speaker' },
    { language: 'English',    fluency: 'Highly proficient' },
    { language: 'German',     fluency: 'Limited working proficiency — A2' },
  ],

  interests: [
    { name: 'Development', keywords: ['Game development'] },
    { name: 'Gaming',      keywords: ['Strategy'] },
    { name: 'Reading',     keywords: ['Manga', 'Sci-fi'] },
    { name: 'Hobbies',     keywords: ['FPV racing', 'Learning to draw'] },
  ],

  pdf: '/joao-aleixo-resume.pdf',
} as const;

export type Resume = typeof resume;
