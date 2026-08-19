export const sidebars = {
  radar: [
    { label: "Sources", items: [
      { href: "#radar", label: "All signals", current: true, badge: 42 },
      { href: "#radar", label: "X", badge: 12 },
      { href: "#radar", label: "Reddit", badge: 9 },
      { href: "#radar", label: "Hacker News", badge: 5 },
      { href: "#radar", label: "Substack", badge: 6 },
      { href: "#radar", label: "GitHub", badge: 10 }
    ] },
    { label: "Views", items: [
      { href: "#radar", label: "Hot now", badge: 7 },
      { href: "#radar", label: "New" },
      { href: "#story", label: "Discussed" },
      { href: "#moderation", label: "Needs review", badge: 3 }
    ] }
  ],
  story: [
    { label: "Story", items: [
      { href: "#story", label: "Overview", current: true },
      { href: "#story", label: "Coverage", badge: 8 },
      { href: "#signal", label: "Signals", badge: 7 },
      { href: "#story", label: "World discussion", badge: 14 }
    ] },
    { label: "Resolved entities", items: [
      { href: "#story", label: "LiveSession" },
      { href: "#story", label: "hara-wasm-core" },
      { href: "#story", label: "PR #767" }
    ] }
  ],
  signal: [
    { label: "Signal", items: [
      { href: "#signal", label: "Original", current: true },
      { href: "#signal", label: "Match evidence", badge: 3 },
      { href: "#story", label: "Related records", badge: 3 },
      { href: "#signal", label: "World discussion", badge: 6 }
    ] }
  ],
  clip: [
    { label: "Clipping", items: [
      { href: "#clip", label: "Original", current: true },
      { href: "#clip", label: "Your note" },
      { href: "#clip", label: "Hara entities" },
      { href: "#clip", label: "Visibility" }
    ] }
  ],
  submit: [
    { label: "Register source", items: [
      { href: "#submit", label: "Source", current: true },
      { href: "#submit", label: "Match rule" },
      { href: "#submit", label: "Preview" },
      { href: "#source", label: "Review" }
    ] }
  ],
  source: [
    { label: "Source", items: [
      { href: "#source", label: "Overview", current: true },
      { href: "#source", label: "Discoveries", badge: 18 },
      { href: "#source", label: "Match contract" },
      { href: "#source", label: "Audit trail" }
    ] }
  ],
  moderation: [
    { label: "Review queue", items: [
      { href: "#moderation", label: "Potential matches", current: true, badge: 3 },
      { href: "#moderation", label: "Duplicate signals", badge: 2 },
      { href: "#moderation", label: "Identity claims", badge: 1 }
    ] }
  ],
  relay: [
    { label: "Relay", items: [
      { href: "#relay", label: "Candidate queue", current: true, badge: 3 },
      { href: "#relay", label: "Drafts", badge: 2 },
      { href: "#relay", label: "Schedule" },
      { href: "#relay", label: "Receipts" }
    ] }
  ]
};

export const radarSignals = [
  {
    source: "x" as const,
    author: "@compiler_notes",
    time: "18 min",
    title: "A browser session boundary that behaves like a protocol",
    excerpt: "Revision fencing, monotonic events, explicit capabilities, and one lifecycle for interpreted or compiled execution.",
    percentile: "Top 4% on X today",
    related: "LiveSession · hara-wasm-core",
    reactions: "96 likes · 42 reposts",
    comments: "11 replies",
    match: "Exact hara-lang.org link",
    featured: true
  },
  {
    source: "hacker-news" as const,
    author: "news.ycombinator.com",
    time: "31 min",
    title: "Show HN: revision-fenced sessions for browser language tools",
    excerpt: "Discussion is moving from the demo toward cancellation, backend parity, and unsupported-operation semantics.",
    percentile: "Rising discussion",
    related: "PR #767 · browser runtime",
    reactions: "38 points",
    comments: "17 comments",
    match: "Canonical repository URL"
  },
  {
    source: "reddit" as const,
    author: "u/language_architect",
    time: "1 hr",
    title: "Could durable work be an algebra instead of a framework?",
    excerpt: "A thread compares replayable work, checkpointed boundaries, providers, and a deliberately narrow public ABI.",
    percentile: "Top 9% in source",
    related: "work.* · IWorkExecutor",
    reactions: "27 upvotes",
    comments: "9 comments",
    match: "Known namespace and repository"
  },
  {
    source: "substack" as const,
    author: "Systems in the Small",
    time: "Today",
    title: "Portable schemas as language values",
    excerpt: "An essay connects inspectable schemas, generated interfaces, and runtime validation without hidden metadata.",
    percentile: "Curator pick",
    related: "std.typed · Schema",
    reactions: "6 clips",
    comments: "4 World comments",
    match: "Exact namespace and Hara links"
  }
];

export const coverage = [
  ["world", "Canonical update", "LiveSession contract merged", "The merged Hara change anchors every external reaction.", "main · PR #767"],
  ["x", "X", "Protocol, not merely a browser REPL", "Fastest-moving external framing; exact canonical link present.", "Top 4% velocity"],
  ["hacker-news", "Hacker News", "Show HN discussion", "Readers focus on lifecycle parity and cancellation semantics.", "38 points · 17 comments"],
  ["substack", "Substack", "Browser runtimes need stale-intent fences", "Long-form interpretation links the contract to embedded tools.", "Curator pick"],
  ["reddit", "Reddit", "Could the same contract drive music sessions?", "A narrower reuse discussion appears in a browser-audio community.", "27 upvotes"]
] as const;

export const sourceSignals = [
  ["substack", "Programming languages as inspectable worlds", "Exact hara-lang.org link", "clustered"],
  ["substack", "The smallest useful durable-work interface", "Known work.* namespace", "clipped"],
  ["substack", "Revision fences in browser runtimes", "hara-wasm-core link", "hot"]
] as const;
