/** All marketing copy, sourced from the existing haidi.io site. */
export const content = {
  hero: {
    h1a: "Experience the new world of",
    h1b: "supply chain planning",
    cta: "Prepare to launch",
    note: "Built by supply chain practitioners",
  },
  noise: {
    eyebrow: "The problem",
    statements: [
      { big: "Spreadsheets", small: "stitched together every Monday, broken again by Friday." },
      { big: "Black-box forecasts", small: "nobody can explain to the CFO, so nobody trusts." },
      { big: "Month-long setups", small: "that are out of date before the first planning cycle ends." },
    ],
    stats: [
      { value: 100000, suffix: "+", label: "SKUs in a single workspace" },
      { value: 4, suffix: " hours", label: "from kickoff to live planning, not weeks" },
    ],
  },
  forecast: {
    eyebrow: "Forecasts that explain themselves",
    title: "A planning platform shaped by how planners actually work.",
    steps: [
      {
        k: "01",
        name: "Demand Drivers",
        title: "See the signals behind demand",
        body: "Promotions, seasonality, price, weather, events: every driver is visible, weighted and reviewable, so the forecast is never a surprise.",
      },
      {
        k: "02",
        name: "Forecast Lab",
        title: "Test and compare planning approaches",
        body: "Run statistical, ML and hybrid models side by side. Keep the one that earns its place on accuracy and bias, not on reputation.",
      },
      {
        k: "03",
        name: "Demand Review",
        title: "Bring forecasts and business input together",
        body: "Sales, marketing and finance overlay their knowledge on the baseline. Every override is logged with a reason.",
      },
    ],
    callout: {
      label: "Why this value",
      rows: [
        ["Baseline", "1,240"],
        ["Promo uplift", "+18%"],
        ["Bias correction", "−3%"],
        ["Final", "1,420"],
      ],
    },
  },
  decision: {
    eyebrow: "Scenario testing",
    title: "Test the impact before making the call.",
    sub: "From agreed demand to inventory position.",
    scenarios: [
      {
        name: "Baseline",
        tone: "teal",
        kpi: "Service 96.2%",
        body: "Agreed demand, current safety stock policy, current lead times.",
        series: [40, 44, 43, 48, 52, 55, 58, 60],
      },
      {
        name: "Promo push",
        tone: "bright",
        kpi: "Service 94.8%",
        body: "+18% demand on promoted SKUs for six weeks. Stock-out risk on 3 of 40 families.",
        series: [40, 46, 55, 62, 66, 64, 60, 58],
      },
      {
        name: "Supplier delay",
        tone: "coral",
        kpi: "Service 91.1%",
        body: "Lead time +2 weeks from the primary supplier. Safety stock rebalanced automatically.",
        series: [40, 42, 38, 35, 37, 44, 50, 54],
      },
      {
        name: "Inventory position",
        tone: "teal",
        kpi: "Working capital −12%",
        body: "Projected inventory by location, with reorder points that move with the agreed demand.",
        series: [60, 58, 55, 52, 50, 49, 49, 48],
      },
    ],
  },
  workspace: {
    eyebrow: "Inside the product",
    title: "One workspace. Two planning pillars.",
    hotspots: [
      { x: 9, y: 12, label: "Saved views" },
      { x: 28, y: 12, label: "Scenarios" },
      { x: 52, y: 46, label: "Planning grid" },
      { x: 78, y: 30, label: "Anomaly detection" },
      { x: 68, y: 70, label: "Forecast bias" },
      { x: 36, y: 74, label: "Why this value" },
      { x: 88, y: 86, label: "AI summary" },
    ],
    pillars: [
      { title: "Live before the end of day", body: "Connect your data in the morning, review a real forecast in the afternoon." },
      { title: "The whole planning cycle, one workspace", body: "Demand, review, scenarios and inventory share one model and one set of numbers." },
      { title: "Forecasts that explain themselves", body: "Every value has a lineage: drivers, model, overrides and the person behind them." },
      { title: "No contracts, no lock-in", body: "Month to month. Export everything, any time." },
    ],
  },
  configure: {
    eyebrow: "Configure",
    title: "Your hierarchies, your measures, your logic.",
    badge: "Obsessively designed around the user, it is easy to use.",
    features: [
      { title: "Flexible data model", body: "Products, locations, customers, channels: any hierarchy, any depth." },
      { title: "Smart data import", body: "Map files and feeds once; Haidi validates and reconciles on every load." },
      { title: "Formula builder", body: "Define measures in plain expressions. No scripts, no consultants." },
      { title: "Time intelligence", body: "Fiscal calendars, rolling horizons, week-to-month splits handled for you." },
      { title: "Flexible export", body: "Push plans back to ERP, BI or a spreadsheet in the shape they expect." },
    ],
    connect: {
      eyebrow: "Integrations",
      title: "Connected to the systems you already run.",
      systems: ["SAP IBP", "SAP S/4HANA", "SAP Business ByDesign"],
    },
  },
  launch: {
    eyebrow: "How it works",
    title: "Onboarding that fits around your planning decisions.",
    duration: "2–3 weeks",
    steps: [
      { title: "Scope it together", body: "We agree on the decisions that matter and the data that drives them." },
      { title: "Bring your data in", body: "Connect ERP, files and forecasts. Haidi maps and validates them." },
      { title: "Read the signal together", body: "We review the first forecasts with your planners, line by line." },
      { title: "Apply the right intelligence", body: "Models, drivers and overrides tuned to your categories." },
      { title: "Decide and move", body: "Your first cycle runs in Haidi. The decision is yours." },
    ],
    about: {
      eyebrow: "About",
      title: "Born in Switzerland. Built by a worldwide team for supply chains globally.",
      stats: [
        { value: 80, suffix: "+", label: "years combined experience" },
        { value: 2018, suffix: "", label: "founded" },
        { value: 40, suffix: "+", label: "multinationals and SMEs" },
      ],
    },
  },
  outro: {
    eyebrow: "Planning without the guesswork",
    title: "Prepare to launch",
    body: "Bring one dataset. Leave with a forecast you can explain and a plan you can defend.",
    cta: "Prepare to launch",
    secondary: "Book a 15-minute call",
    footer: "© 2026 Haidi · Built by IBP Ready, Switzerland",
  },
} as const;
