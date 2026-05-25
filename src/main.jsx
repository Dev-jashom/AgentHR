import React, { useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, BarChart3, BookOpen, Bot, BriefcaseBusiness, CalendarClock, ChevronDown,
  CircleDollarSign, ClipboardList, Code2, CreditCard, FileArchive, FileText,
  Filter, Gauge, GitBranch, Globe2, Home, KeyRound, LayoutDashboard, Link2,
  LogOut, Menu, Mic2, Moon, Sun, MoreHorizontal, Phone, PhoneCall, Plus, RefreshCcw,
  Search, Settings, ShieldCheck, Sparkles, UploadCloud, Users, Wand2, Workflow, Trash2, X
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import "./styles.css";

const stages = ["Uploaded", "AI Screened", "Shortlisted", "Interview Scheduled", "Interviewed", "Hired", "Rejected"];
const stageTone = {
  Uploaded: "gray",
  "AI Screened": "violet",
  Shortlisted: "blue",
  "Interview Scheduled": "amber",
  Interviewed: "violet",
  Hired: "green",
  Rejected: "red"
};

const initialDb = {
  jobs: [
    { id: "j1", title: "Sales Agent", category: "Sales", location: "New York, NY", source: "LinkedIn", status: "active", agent: "Technical Interview Bot", applicants: 3, reviews: 3, interviews: 1, rejected: 1, visible: true, threshold: 72, weights: [40, 35, 25] },
    { id: "j2", title: "Support Specialist", category: "Support", location: "Remote", source: "Direct", status: "active", agent: "Culture Fit Interviewer", applicants: 2, reviews: 2, interviews: 0, rejected: 0, visible: true, threshold: 70, weights: [35, 35, 30] },
    { id: "j3", title: "Senior DevOps Engineer", category: "Engineering", location: "London, UK", source: "LinkedIn", status: "draft", agent: "Technical Interview Bot", applicants: 0, reviews: 0, interviews: 0, rejected: 0, visible: false, threshold: 75, weights: [45, 30, 25] },
    { id: "j4", title: "Senior Software Engineer", category: "Engineering", location: "San Francisco, CA", source: "Direct", status: "active", agent: "Technical Interview Bot", applicants: 5, reviews: 5, interviews: 2, rejected: 2, visible: true, threshold: 82, weights: [45, 35, 20] },
    { id: "j5", title: "Data Analyst", category: "Analytics", location: "Remote", source: "Direct", status: "active", agent: "Culture Fit Interviewer", applicants: 4, reviews: 4, interviews: 2, rejected: 0, visible: true, threshold: 78, weights: [40, 35, 25] },
    { id: "j6", title: "UX Designer", category: "Design", location: "Austin, TX", source: "Direct", status: "active", agent: "Culture Fit Interviewer", applicants: 4, reviews: 4, interviews: 2, rejected: 1, visible: true, threshold: 76, weights: [35, 30, 35] },
    { id: "j7", title: "Product Manager", category: "Product", location: "New York, NY", source: "Direct", status: "active", agent: "Candidate Follow-up Agent", applicants: 1, reviews: 1, interviews: 0, rejected: 0, visible: true, threshold: 80, weights: [35, 40, 25] }
  ],
  candidates: [
    { id: "c1", name: "Neel Soni", job: "Senior Software Engineer", email: "neel.soni@uavcorp.com", phone: "+91 98765 43210", stage: "AI Screened", score: 88, tech: 91, communication: 82, culture: 86, source: "CV Upload", recommendation: "Advance" },
    { id: "c2", name: "Yvonne Mwema", job: "Data Analyst", email: "yvonne.mwema@datalab.org", phone: "+1 555 0142", stage: "Shortlisted", score: 84, tech: 80, communication: 88, culture: 82, source: "Widget", recommendation: "Advance" },
    { id: "c3", name: "Meenal Saxena", job: "UX Designer", email: "meenal.design@studio.in", phone: "+91 99887 66554", stage: "Interview Scheduled", score: 77, tech: 70, communication: 89, culture: 81, source: "Direct", recommendation: "Hold" },
    { id: "c4", name: "Prisha Patel", job: "Product Manager", email: "prisha.p@internship.net", phone: "+91 90123 45678", stage: "Uploaded", score: 62, tech: 58, communication: 76, culture: 64, source: "CV Upload", recommendation: "Hold" }
  ],
  agents: [
    { id: "a1", name: "Technical Interview Bot", voice: "Sarah - Mature, Reassuring, Confident", lang: "English", tone: "Professional & Direct", engine: "OpenAI GPT-4o Realtime", incoming: true, prompt: "Assess technical depth, system design choices, architecture trade-offs, and problem-solving clarity." },
    { id: "a2", name: "Candidate Follow-up Agent", voice: "Bella - Professional, Bright, Warm", lang: "English", tone: "Friendly & Conversational", engine: "ElevenLabs Reader", incoming: true, prompt: "Confirm availability, answer candidate questions about benefit schemes, and transfer to a human when requested." },
    { id: "a3", name: "Culture Fit Interviewer", voice: "Daniel - Steady Broadcaster", lang: "English", tone: "Inquisitive & Curious", engine: "OpenAI GPT-4o mini", incoming: false, prompt: "Explore collaboration practices, feedback reception, handling team conflicts, and professional growth values." }
  ],
  knowledge: [
    ["Company Overview & Culture Guide", "Text", "Ready", "8", "4.2 KB", "2026-05-14"],
    ["Benefits & Compensation Structure", "Text", "Ready", "12", "5.5 KB", "2026-05-14"],
    ["Standard Interview FAQ Matrix", "Text", "Ready", "6", "3.1 KB", "2026-05-15"],
    ["Engineering Architecture Stack", "Text", "Ready", "15", "8.9 KB", "2026-05-18"],
    ["https://www.diploy.in/docs", "URL", "Ready", "42", "94.5 KB", "2026-05-20"],
    ["Employee Handbook 2026", "PDF File", "Ready", "68", "145.2 KB", "2026-05-22"]
  ],
  uploads: [
    ["neel_soni_systems_resume.pdf", "182.4 KB", "1", "1/1", "1", "completed", "2026-05-25"],
    ["yvonne_mwema_analytics.pdf", "155.6 KB", "1", "1/1", "1", "completed", "2026-05-24"],
    ["meenal_saxena_designer.pdf", "210.8 KB", "1", "1/1", "1", "completed", "2026-05-23"],
    ["prisha_patel_pm_resume.pdf", "120.3 KB", "1", "1/1", "1", "completed", "2026-05-22"],
    ["candidate_batch_engineering.zip", "4.8 MB", "8", "8/8", "6", "completed", "2026-05-21"]
  ],
  flows: [
    { id: "f1", name: "Technical Deep Dive Screen", desc: "For engineering positions: asks architectural trade-offs, database choices, and system resilience questions.", active: true, nodesCount: 8, connectionsCount: 7, updated: "2026-05-22", nodes: [
      { id: "n1", type: "Message", title: "Welcome & Tone Setting", x: 50, y: 150, prompt: "Welcome to the AgentHR voice screening! Let's get started." },
      { id: "n2", type: "Question", title: "Architecture Design", x: 280, y: 150, prompt: "Explain a production system you designed and the critical trade-offs you decided on." },
      { id: "n3", type: "Condition", title: "Evaluate Technical Depth", x: 520, y: 220, prompt: "Score > 75%" },
      { id: "n4", type: "Action", title: "Tag Shortlist & Advance", x: 760, y: 100, prompt: "Promote stage and send notification email." },
      { id: "n5", type: "Transfer", title: "Live Human Hand-off", x: 760, y: 320, prompt: "Route call session directly to active Recruiter queue." }
    ]},
    { id: "f2", name: "Product & Strategy Screen", desc: "For product managers: focuses on metrics, roadmapping under constraints, and customer discovery processes.", active: true, nodesCount: 6, connectionsCount: 5, updated: "2026-05-18", nodes: [
      { id: "n1", type: "Message", title: "Intro Screen", x: 60, y: 100, prompt: "Welcome to your PM interview bot screening session." },
      { id: "n2", type: "Question", title: "Prioritization Frameworks", x: 300, y: 100, prompt: "What framework do you prefer when prioritizing features under high constraint?" }
    ]},
    { id: "f3", name: "Culture Fit & Values Review", desc: "Reviews work styles, communication, reception of feedback, and active conflict resolution.", active: false, nodesCount: 5, connectionsCount: 4, updated: "2026-05-15", nodes: [] }
  ],
  interviews: [
    ["Meenal Saxena", "UX Designer", "+91 99887 66554", "Scheduled", "2026-05-27 15:30", "Culture Fit Interviewer"],
    ["Neel Soni", "Senior Software Engineer", "+91 98765 43210", "Completed", "2026-05-25 10:15", "Technical Interview Bot"]
  ],
  calls: [
    ["Neel Soni", "Completed", "3m 12s", "0", "2026-05-25 10:18", "Overall score: 88/100. Strong engineering expertise."],
    ["Yvonne Mwema", "Completed", "2m 45s", "0", "2026-05-24 14:32", "Overall score: 84/100. Communicates product concepts well."]
  ],
  transactions: [
    ["Credit", "Pro License Included Allocation", "+500", "2026-05-25"],
    ["Debit", "Campaign: Outbound Recruiter Outreach - 12 calls", "-12", "2026-05-24"],
    ["Credit", "Business Pack Credit Purchase", "+1000", "2026-05-23"]
  ],
  apiKeys: [
    ["Production Hub API", "candidate:write, calls:trigger, analytics:read", "120/min", "Active", "ag_live_58c21a9db3f274a10e7b8f9e2"],
    ["Careers Site Widget Integration", "candidate:write", "60/min", "Active", "ag_live_14a938c20d7e63fa910d8a4f1"]
  ],
  plugins: [
    ["REST API Gateway Integration", "Full scopes, interactive endpoints, live sandbox telemetry.", "Installed"],
    ["SIP Engine Interface", "Configured for Twilio SIP, Plivo SIP, and OpenAI direct trunks.", "Installed"],
    ["Multi-Tenant Team Roles", "Scope access by Recruiter, Hiring Lead, and Billing roles.", "Available"],
    ["Payment Processing Hooks", "Connects Stripe, PayPal, Razorpay, and Paystack gateways.", "Installed"]
  ],
  adminUsers: [
    ["Demo User", "demo@diploy.in", "Platform Owner", "Active"],
    ["Lead Recruiter", "recruiter@diploy.in", "Team Member", "Active"],
    ["Billing Specialist", "finance@diploy.in", "Billing Admin", "Active"]
  ],
  credits: 1488,
  theme: "dark",
  widgetBrandColor: "#4f46e5",
  widgetBrandName: "Gradii"
};

function App() {
  const [signedIn, setSignedIn] = useState(() => {
    try {
      return localStorage.getItem("agenthrAuth") === "1";
    } catch (_) {
      return false;
    }
  });
  const [page, setPage] = useState("home");
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem("agenthr_db_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          // Check if flows is in legacy array-of-arrays format, if so, heal it
          let safeFlows = initialDb.flows;
          if (Array.isArray(parsed.flows) && parsed.flows.length > 0) {
            const firstFlow = parsed.flows[0];
            if (firstFlow && !Array.isArray(firstFlow) && typeof firstFlow === "object" && firstFlow.id) {
              safeFlows = parsed.flows;
            }
          }

          return {
            ...initialDb,
            ...parsed,
            jobs: Array.isArray(parsed.jobs) ? parsed.jobs : initialDb.jobs,
            candidates: Array.isArray(parsed.candidates) ? parsed.candidates : initialDb.candidates,
            agents: Array.isArray(parsed.agents) ? parsed.agents : initialDb.agents,
            knowledge: Array.isArray(parsed.knowledge) ? parsed.knowledge : initialDb.knowledge,
            uploads: Array.isArray(parsed.uploads) ? parsed.uploads : initialDb.uploads,
            flows: safeFlows,
            interviews: Array.isArray(parsed.interviews) ? parsed.interviews : initialDb.interviews,
            calls: Array.isArray(parsed.calls) ? parsed.calls : initialDb.calls,
            transactions: Array.isArray(parsed.transactions) ? parsed.transactions : initialDb.transactions,
            apiKeys: Array.isArray(parsed.apiKeys) ? parsed.apiKeys : initialDb.apiKeys,
            plugins: Array.isArray(parsed.plugins) ? parsed.plugins : initialDb.plugins,
            adminUsers: Array.isArray(parsed.adminUsers) ? parsed.adminUsers : initialDb.adminUsers,
            credits: typeof parsed.credits === "number" ? parsed.credits : initialDb.credits,
            theme: typeof parsed.theme === "string" ? parsed.theme : initialDb.theme,
            widgetBrandColor: typeof parsed.widgetBrandColor === "string" ? parsed.widgetBrandColor : initialDb.widgetBrandColor,
            widgetBrandName: typeof parsed.widgetBrandName === "string" ? parsed.widgetBrandName : initialDb.widgetBrandName
          };
        }
      }
    } catch (_) {}
    return initialDb;
  });
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  const flash = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2000);
  };

  const updateDb = (updater) => {
    setData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      try {
        localStorage.setItem("agenthr_db_v2", JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", data.theme || "dark");
  }, [data.theme]);

  const ctx = { data, setData: updateDb, page, setPage, query, setQuery, modal, setModal, flash };

  if (!signedIn) {
    return <Login onLogin={() => {
      try {
        localStorage.setItem("agenthrAuth", "1");
      } catch (_) {}
      setSignedIn(true);
    }} />;
  }

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={(p) => { setQuery(""); setPage(p); }} credits={data.credits} />
      <section className="workspace">
        <Topbar onLogout={() => { try { localStorage.removeItem("agenthrAuth"); } catch (_) {} setSignedIn(false); }} setModal={setModal} theme={data.theme} setTheme={(t) => updateDb({ theme: t })} />
        <main className="content"><CurrentPage ctx={ctx} /></main>
      </section>
      {modal && <Modal ctx={ctx} />}
      {toast && <div className="toast"><Sparkles size={16} />{toast}</div>}
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("demo@diploy.in");
  const [password, setPassword] = useState("Demo@123");
  const [err, setErr] = useState("");

  const handleSignIn = () => {
    if (email === "demo@diploy.in" && password === "Demo@123") {
      onLogin();
    } else {
      setErr("Invalid credentials. Try using the live demo credentials.");
    }
  };

  return (
    <div className="login-page" data-theme="dark">
      <section className="login-hero">
        <div className="brand big"><span className="logo-mark">A</span><span>AgentHR</span></div>
        <h1>Next-Gen AI Automated Voice Recruitment.</h1>
        <p>Conduct voice screening, weighted resume parsing, pipeline tracking, and telemetry in a production-ready proposal system.</p>
        <div className="hero-points">
          {["Weighted CV Screen", "Conversational AI Calling", "Interactive Pipeline", "REST API Docs"].map((x) => <span key={x}>{x}</span>)}
        </div>
        <div className="hero-stats">
          <b><span>10x</span><small>Hiring Speed</small></b>
          <b><span>85%</span><small>Time Saved</small></b>
          <b><span>24/7</span><small>Screening Slots</small></b>
        </div>
      </section>
      <section className="login-card">
        <div className="brand"><span className="logo-mark">A</span><span>AgentHR</span></div>
        <h2>Welcome back</h2>
        <p className="muted">Enter proposal credentials to access the simulator</p>
        {err && <div className="badge red span2" style={{marginBottom:10}}>{err}</div>}
        <label>Email Address
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="demo@diploy.in" />
        </label>
        <label>Password
          <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </label>
        <button className="primary full" onClick={handleSignIn}>Sign In to Sandbox</button>
        <div className="login-badges">
          <span>Sandbox Ready</span>
          <span>Proposal Demo V2</span>
        </div>
      </section>
    </div>
  );
}

const nav = [
  ["Overview", [["home", Home, "Home"]]],
  ["Agent Core", [["agents", Bot, "Hiring Agents"], ["knowledge", BookOpen, "Knowledge Base"]]],
  ["Pipeline", [["jobs", BriefcaseBusiness, "Jobs"], ["candidates", Users, "Candidates"], ["pipeline", Workflow, "Board View"], ["upload", UploadCloud, "CV Upload"]]],
  ["Outreach", [["interviews", CalendarClock, "Interviews"], ["calls", PhoneCall, "Call History"], ["campaign", Activity, "Campaign Monitor"]]],
  ["Telephony", [["phones", Phone, "Phone Numbers"], ["sip", Globe2, "SIP Engine"]]],
  ["Sandbox Tools", [["flows", GitBranch, "Interview Flows"], ["widget", Code2, "Hiring Widget"], ["api", KeyRound, "REST API Console"], ["analytics", BarChart3, "Analytics Panel"]]],
  ["Billing", [["upgrade", CircleDollarSign, "Compare Plans"], ["billing", CreditCard, "Ledger & Credits"]]],
  ["System Admin", [["admin", ShieldCheck, "Admin Console"], ["plugins", Settings, "Integrations"]] ]
];

function Sidebar({ page, setPage, credits }) {
  const safeCredits = credits !== undefined && credits !== null ? credits : 1500;
  return (
    <aside className="sidebar">
      <div className="brand side"><span className="logo-mark">A</span><span>AgentHR</span></div>
      <div style={{flex: 1, display:"grid", gap: "10px", alignContent: "start"}}>
        {nav.map(([group, items]) => (
          <div className="nav-group" key={group}>
            <p>{group}</p>
            {items.map(([id, Icon, label]) => (
              <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)} title={label}>
                <Icon size={18} /><span>{label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="plan-box">
        <small>Available Credits</small>
        <b>{safeCredits.toLocaleString()}</b>
        <span>Pro License</span>
      </div>
    </aside>
  );
}

function Topbar({ onLogout, setModal, theme, setTheme }) {
  return (
    <header className="topbar">
      <div style={{display:"flex", alignItems:"center", gap: 10}}>
        <span className="badge green" style={{fontWeight:800}}>PROPOSAL SANDBOX ACTIVE</span>
      </div>
      <div className="top-actions">
        <button className="secondary small" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <div className="profile">
          <span>D</span>
          <div>
            <b>Demo Administrator</b>
            <small>demo@diploy.in</small>
          </div>
        </div>
        <button className="icon-button" onClick={onLogout} title="Log Out"><LogOut size={16} /></button>
      </div>
    </header>
  );
}

function CurrentPage({ ctx }) {
  const pages = {
    home: Dashboard, agents: Agents, knowledge: Knowledge, jobs: Jobs, candidates: Candidates, pipeline: Pipeline,
    upload: Uploads, interviews: Interviews, calls: Calls, campaign: Campaign, phones: Phones, sip: Sip,
    flows: Flows, widget: Widget, api: Api, analytics: Analytics, upgrade: Upgrade, billing: Billing,
    admin: Admin, plugins: Plugins
  };
  const Page = pages[ctx.page] || Dashboard;
  return <Page {...ctx} />;
}

function Header({ title, subtitle, children }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="actions">{children}</div>
    </div>
  );
}

function Metric({ label, value, hint, icon: Icon = Gauge, trendGreen = true }) {
  return (
    <article className="metric-card">
      <div>
        <p>{label}</p>
        <h2>{value}</h2>
        <small className={trendGreen ? "badge green" : "badge gray"} style={{padding:"2px 8px"}}>{hint}</small>
      </div>
      <span><Icon size={20} /></span>
    </article>
  );
}

function Panel({ title, subtitle, children, actions }) {
  return (
    <section className="panel">
      {title && (
        <div className="panel-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="panel-actions">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// ---------------- PAGES ----------------

function Dashboard({ data, setPage, setModal }) {
  const safeCandidates = data.candidates || [];
  const safeJobs = data.jobs || [];
  const applied = safeCandidates.length;
  const inReview = safeCandidates.filter(c => c.stage === "AI Screened" || c.stage === "Uploaded").length;
  const hiring = safeJobs.filter(j => j.status === "active").length;

  const chart = stages.map(s => ({
    name: s.replace("Interview ", "Int. "),
    value: safeCandidates.filter(c => c.stage === s).length
  }));

  return (
    <>
      <Header title="Administrator Dashboard" subtitle="Overview of AI telephony campaigns, applicant pipelines, and usage tracking.">
        <button className="secondary" onClick={() => setModal("reportExport")}>Export Platform Summary</button>
      </Header>
      
      <div className="metrics three">
        <Metric label="Total Candidates" value={applied} hint="+12% this week" icon={Users} />
        <Metric label="Active Screenings" value={inReview} hint="Awaiting AI calling" icon={Activity} />
        <Metric label="Open Positions" value={hiring} hint="Active embed widget" icon={BriefcaseBusiness} />
      </div>

      <div className="dashboard-grid">
        <Panel title="Job Posting Status" subtitle="Breakdown of active hiring pipelines.">
          <StatusRing jobs={data.jobs} />
        </Panel>
        
        <Panel title="Hiring Funnel Analytics" subtitle="Candidates grouped by active stage.">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{fill: 'rgba(99,102,241,0.04)'}} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--blue)" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Recent Applicants" subtitle="Click details to initiate mock interviews." actions={<button className="secondary small" onClick={() => setPage("candidates")}>View All</button>}>
          <CandidateRows candidates={data.candidates.slice(0, 3)} setModal={setModal} />
        </Panel>

        <Panel title="Platform Diagnostic AI" subtitle="Quick CV screener configuration.">
          <div className="ai-card">
            <Sparkles size={32} />
            <h3>Trigger AI Analysis Simulation</h3>
            <p>Run weighted match-scoring across skills, job keywords, and shortlist thresholds on all newly uploaded files.</p>
            <button className="primary" onClick={() => setModal("screeningRun")}>Launch Screener Simulator</button>
          </div>
        </Panel>
      </div>
    </>
  );
}

function CandidateRows({ candidates, setModal }) {
  const safeCandidates = candidates || [];
  return (
    <DataTable
      headers={["Candidate Name", "Hiring Position", "Stage", "AI Match Score", "Actions"]}
      rows={safeCandidates.map((c) => [
        <div>
          <b>{c.name}</b>
          <small className="muted">{c.email}</small>
        </div>,
        c.job,
        <Badge tone={stageTone[c.stage]}>{c.stage}</Badge>,
        <Score value={c.score} />,
        <button className="primary small" onClick={() => setModal({ type: "candidateProfile", candidateId: c.id })}>Details & Call</button>
      ])}
    />
  );
}

function StatusRing({ jobs }) {
  const items = ["active", "pending", "draft"].map((s) => ({
    name: s === "active" ? "Active" : s === "pending" ? "Pending" : "Draft",
    value: jobs.filter((j) => j.status === s).length
  }));
  const colors = ["var(--green)", "var(--amber)", "var(--muted)"];
  
  return (
    <div className="ring-grid">
      <ResponsiveContainer width="45%" height={210}>
        <PieChart>
          <Pie data={items} innerRadius={58} outerRadius={80} dataKey="value" paddingAngle={2}>
            {items.map((_, i) => <Cell key={i} fill={colors[i]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="legend">
        {items.map((x, i) => (
          <p key={x.name}>
            <span>
              <i style={{ background: colors[i] }} />
              {x.name} Role postings
            </span> 
            <b>{x.value}</b>
          </p>
        ))}
      </div>
    </div>
  );
}

function Agents({ data, query, setQuery, setModal, setData, flash }) {
  const [activeTab, setActiveTab] = useState(0);

  const deleteAgent = (id) => {
    setData((prev) => ({
      ...prev,
      agents: prev.agents.filter(a => a.id !== id)
    }));
    flash("Agent deleted successfully");
  };

  const filtered = data.agents.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.voice.toLowerCase().includes(query.toLowerCase()) ||
    a.engine.toLowerCase().includes(query.toLowerCase())
  );

  const promptTemplates = [
    { name: "Technical Interview Blueprint", desc: "For software engineers, DevOps, and tech leads. Direct focus on system design, database scalability, dead-letter queue backpressure, and schema validation layers.", active: true, tokens: "2.1k tokens" },
    { name: "Support Agent Alignment", desc: "For customer success and help desk agents. Warm, empathetic tone. Explores escalations resolution pathing, customer service principles, and live ticket simulations.", active: true, tokens: "1.5k tokens" },
    { name: "Cultural Fit & Retention Screen", desc: "For all candidate cohorts. Professional, warm tone. Direct focus on receiving constructive feedback, dealing with cross-functional friction, and growth mindset.", active: false, tokens: "1.8k tokens" }
  ];

  const voices = [
    { name: "Sarah", engine: "ElevenLabs Core", desc: "Mature, Reassuring, Confident", lang: "English (US)", status: "Active", tone: "Professional" },
    { name: "Bella", engine: "OpenAI Realtime", desc: "Warm, Bright, Conversational", lang: "English (Global)", status: "Active", tone: "Friendly" },
    { name: "Daniel", engine: "ElevenLabs Reader", desc: "Steady, Deep, Authoritative", lang: "English (UK)", status: "Active", tone: "Inquisitive" }
  ];

  return (
    <>
      <Header title="Hiring Agents" subtitle="Configure custom conversational AI personas, prompt templates, and voice engines.">
        <button className="secondary" onClick={() => setModal("agentWizard")}><Wand2 size={15} />Guided Wizard</button>
        <button className="primary" onClick={() => setModal("agent")}><Plus size={15} />Create New Agent</button>
      </Header>
      
      <div className="tabs-enhanced">
        <button className={activeTab === 0 ? "selected" : ""} onClick={() => setActiveTab(0)}>
          <Bot size={16} /><span>Agents</span>
        </button>
        <button className={activeTab === 1 ? "selected" : ""} onClick={() => setActiveTab(1)}>
          <FileText size={16} /><span>Prompt Templates</span>
        </button>
        <button className={activeTab === 2 ? "selected" : ""} onClick={() => setActiveTab(2)}>
          <Mic2 size={16} /><span>Voices</span>
        </button>
      </div>
      
      <Toolbar query={query} setQuery={setQuery} placeholder="Search agent configurations..." />
      
      {activeTab === 0 && (
        <div className="cards three">
          {filtered.map((a) => (
            <article className="agent-card" key={a.id} style={{borderTop: "3px solid var(--blue)"}}>
              <div className="card-top">
                <div>
                  <h3 style={{fontSize: 16, fontWeight: 800}}>{a.name}</h3>
                  <small className="muted" style={{fontWeight: 600}}>{a.voice}</small>
                </div>
                <button className="icon-button small" onClick={() => setModal({ type: "agentMenu", agentId: a.id })}><MoreHorizontal size={14} /></button>
              </div>
              
              <div className="chips" style={{margin: "12px 0 16px"}}>
                <Badge tone="violet">{a.engine}</Badge>
                <Badge tone={a.incoming ? "green" : "gray"}>{a.incoming ? "Inbound Enabled" : "Outbound Only"}</Badge>
                <Badge tone="blue">{a.tone}</Badge>
              </div>
              <p className="muted" style={{fontSize: 12.5, fontStyle: "italic", lineHeight: 1.5, background: "var(--nav2)", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--line)"}}>
                "{a.prompt}"
              </p>
              
              <div className="row-actions" style={{marginTop: "auto", borderTop: "1px solid var(--line)", paddingTop: 14, width: "100%", justifyContent: "space-between"}}>
                <button className="secondary small" onClick={() => setModal({ type: "agentEditor", agentId: a.id })}>Edit Prompt</button>
                <button className="secondary small" style={{color: "var(--blue)", background: "var(--blue-glow)"}} onClick={() => setModal({ type: "voiceTest", agentId: a.id })}><Mic2 size={13} />Test Voice</button>
                <button className="danger small" onClick={() => deleteAgent(a.id)}><Trash2 size={13} /></button>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === 1 && (
        <div className="cards three">
          {promptTemplates.map((t, idx) => (
            <article className="flow-card" key={idx} style={{minHeight: 220, borderTop: "3px solid var(--violet)"}}>
              <div className="card-top">
                <h3 style={{fontSize: 16, fontWeight: 800}}>{t.name}</h3>
                <Badge tone={t.active ? "green" : "gray"}>{t.active ? "Active" : "Draft"}</Badge>
              </div>
              <p className="muted" style={{fontSize: 13, margin: "14px 0", lineHeight: 1.5}}>{t.desc}</p>
              <div style={{marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: 14}}>
                <small className="muted" style={{fontWeight: 700}}>{t.tokens}</small>
                <button className="primary small" style={{background: "var(--violet)", boxShadow: "0 4px 10px rgba(139, 92, 246, 0.2)"}} onClick={() => flash(`${t.name} template loaded`)}>Use Template</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === 2 && (
        <div className="cards three">
          {voices.map((v, idx) => (
            <article className="agent-card" key={idx} style={{minHeight: 220, borderTop: "3px solid var(--green)"}}>
              <div className="card-top">
                <div>
                  <h3 style={{fontSize: 16, fontWeight: 800}}>{v.name}</h3>
                  <small className="muted" style={{fontWeight: 600}}>{v.engine}</small>
                </div>
                <Badge tone="green">{v.status}</Badge>
              </div>
              <div className="chips" style={{margin: "12px 0 8px"}}>
                <Badge tone="violet">{v.lang}</Badge>
                <Badge tone="blue">{v.tone}</Badge>
              </div>
              <p className="muted" style={{fontSize: 13, lineHeight: 1.5}}>{v.desc}</p>
              <div style={{marginTop: "auto", display: "flex", gap: 8, borderTop: "1px solid var(--line)", paddingTop: 14, justifyContent: "space-between", alignItems: "center"}}>
                <small className="muted" style={{fontWeight: 700, fontSize: 11}}>Latency: ~85ms</small>
                <button className="secondary small" style={{color: "var(--green)", background: "var(--green-glow)"}} onClick={() => setModal({ type: "voiceTest", agentName: v.name })}><Mic2 size={13} />Play Audition</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function Knowledge({ data, query, setQuery, setModal, setData, flash }) {
  const [tab, setTab] = useState(0);

  const deleteKnowledge = (idx) => {
    setData((prev) => ({
      ...prev,
      knowledge: prev.knowledge.filter((_, i) => i !== idx)
    }));
    flash("Knowledge asset deleted");
  };

  const filtered = data.knowledge.filter(k =>
    k[0].toLowerCase().includes(query.toLowerCase()) ||
    k[1].toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Header title="Knowledge Base" subtitle="Train your bots with company handbooks, URLs, benefits guides, and compliance text.">
        <button className="secondary" onClick={() => setModal("url")}><Link2 size={15} />Index URL</button>
        <button className="secondary" onClick={() => setModal("files")}><FileArchive size={15} />Add Document</button>
        <button className="primary" onClick={() => setModal("text")}><Plus size={15} />Add Raw Text</button>
      </Header>
      
      <div className="metrics four">
        <Metric label="Total Source Assets" value={data.knowledge.length} hint="Persistent files" icon={BookOpen} />
        <Metric label="Knowledge Chunks" value={data.knowledge.reduce((a, b) => a + Number(b[3]), 0)} hint="Vector embeddings" icon={Activity} />
        <Metric label="Indexing Engine" value="OpenAI Text-3" hint="Embedding status: OK" icon={ShieldCheck} />
        <Metric label="Virtual Directory" value="Vector Index" hint="94.6 KB allocated" icon={KeyRound} />
      </div>

      <Tabs items={["All Assets", "Documents & Guides", "Synced Web Links"]} />
      
      <Panel title="System Vector Assets" subtitle="Select any asset to review vector search chunk limits.">
        <Toolbar query={query} setQuery={setQuery} placeholder="Search knowledge artifacts..." />
        <DataTable
          headers={["Asset Name", "Source Type", "Parsing Status", "Vectors Created", "Memory Size", "Indexed Date", "Actions"]}
          rows={filtered.map((r, idx) => [
            <b>{r[0]}</b>,
            <Badge tone="gray">{r[1]}</Badge>,
            <Badge tone={r[2] === "Ready" ? "green" : "amber"}>{r[2]}</Badge>,
            r[3],
            r[4],
            r[5],
            <div style={{display: "flex", gap: 6}}>
              <button className="secondary small" onClick={() => setModal({ type: "knowledgePreview", name: r[0], text: r[4] })}>Preview</button>
              <button className="icon-button small danger" onClick={() => deleteKnowledge(idx)}><Trash2 size={13} /></button>
            </div>
          ])}
        />
      </Panel>
    </>
  );
}

function Jobs({ data, query, setQuery, setModal, setData, flash, setPage }) {
  const handleToggleWidget = (id) => {
    setData((prev) => ({
      ...prev,
      jobs: prev.jobs.map(j => j.id === id ? { ...j, visible: !j.visible } : j)
    }));
    flash("Widget role visibility updated");
  };

  const deleteJob = (id) => {
    setData((prev) => ({
      ...prev,
      jobs: prev.jobs.filter(j => j.id !== id)
    }));
    flash("Role deleted successfully");
  };

  const filtered = data.jobs.filter(j =>
    j.title.toLowerCase().includes(query.toLowerCase()) ||
    j.location.toLowerCase().includes(query.toLowerCase()) ||
    j.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Header title="Hiring Postings" subtitle="Publish roles, configure automated thresholds, and bind specialized screening bots.">
        <button className="primary" onClick={() => setModal("job")}><Plus size={15} />Post New Role</button>
      </Header>

      <div className="widget-prompt">
        <div>
          <p>Careers Embedding Widget Configured</p>
          <small>Allow candidates to review positions, upload resumes, and undergo immediate AI voice screening.</small>
        </div>
        <button className="primary small" style={{background: "var(--blue)"}} onClick={() => setPage("widget")}>Launch Widget Settings</button>
      </div>

      <Tabs items={["All Job Openings", "Active Pipelines", "Draft Schemas"]} />
      
      <div className="toolbar">
        <div className="search"><Search size={17} /><input placeholder="Search positions..." value={query} onChange={(e)=>setQuery(e.target.value)} /></div>
      </div>

      <div className="job-grid">
        {filtered.map((j) => (
          <article className="job-card" key={j.id} style={{borderTop: j.status === "active" ? "3px solid var(--green)" : "3px solid var(--muted)"}}>
            <div>
              <div className="job-card-header">
                <div>
                  <h3 style={{fontSize: 17, fontWeight: 800, margin: 0, color: "var(--ink)"}}>{j.title}</h3>
                  <small className="muted" style={{fontWeight: 600}}>{j.category} • {j.location}</small>
                </div>
                <div style={{display: "flex", gap: 6, alignItems: "center"}}>
                  <Badge tone={j.status === "active" ? "green" : "gray"}>{j.status}</Badge>
                  <Badge tone="violet">Threshold {j.threshold}%</Badge>
                </div>
              </div>
              
              <div style={{margin: "12px 0 14px"}}>
                <small className="muted" style={{fontWeight: 700, display: "block", marginBottom: 6}}>Evaluation Shortlist Gauge</small>
                <div className="score" style={{minWidth: "100%"}}>
                  <span style={{fontSize: 12.5}}>{j.threshold}% Minimum</span>
                  <div><i style={{width: `${j.threshold}%`, background: "linear-gradient(90deg, var(--blue) 0%, var(--violet) 100%)"}} /></div>
                </div>
              </div>

              <p className="muted" style={{fontSize: 12.5, margin: "10px 0", lineHeight: 1.4}}>
                Assigned Screener: <b style={{color: "var(--ink-2)"}}>{j.agent}</b> <br/>
                Sourcing Link: <code style={{fontSize: 11, color: "var(--blue)", background: "var(--blue-glow)", padding: "2px 6px", borderRadius: 4}}>Careers Widget (Active)</code>
              </p>
              
              <div className="job-stats-pill" style={{marginTop: 16}}>
                <span style={{background: "var(--nav2)"}}><b>{j.applicants}</b><small>Applied</small></span>
                <span style={{background: "var(--nav2)"}}><b>{j.reviews}</b><small>Screened</small></span>
                <span style={{background: "var(--nav2)"}}><b>{j.interviews}</b><small>Interviews</small></span>
                <span style={{background: "var(--nav2)"}}><b>{j.rejected}</b><small>Rejected</small></span>
              </div>
            </div>
            
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 16}}>
              <label className="switch" title="Toggle Careers Widget Visibility">
                <input type="checkbox" checked={j.visible} onChange={() => handleToggleWidget(j.id)} />
                <span />
                <small className="muted" style={{marginLeft: 8, fontWeight: 700}}>Widget Sync</small>
              </label>
              
              <div style={{display: "flex", gap: 6}}>
                <button className="secondary small" onClick={() => setModal({ type: "jobDetails", jobId: j.id })}>Rules</button>
                <button className="icon-button small danger" onClick={() => deleteJob(j.id)}><Trash2 size={13} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Candidates({ data, query, setQuery, setModal, setData, flash }) {
  const deleteCandidate = (id) => {
    setData((prev) => ({
      ...prev,
      candidates: prev.candidates.filter(c => c.id !== id)
    }));
    flash("Candidate profile removed");
  };

  const filtered = data.candidates.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.job.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Header title="Candidate Profiles" subtitle="Access parsed resume insights, weighted match evaluations, and trigger voice screening.">
        <button className="secondary" onClick={() => setModal("candidateExport")}>Export Candidate Sheet</button>
        <button className="primary" onClick={() => setModal("candidate")}><Plus size={15} />Add New Profile</button>
      </Header>
      
      <Toolbar query={query} setQuery={setQuery} placeholder="Search applicants by name, role, email, or recommendations..." />
      <Tabs items={[`All Candidates (${data.candidates.length})`, "Shortlisted", "In Review", "Interviewed"]} />

      <Panel title="System Candidate Ledger" subtitle="Review scorecard vectors below. Click Details to trigger the AI Voice Simulator.">
        <DataTable
          headers={["Candidate Name & Contact", "Hiring Position", "Active Pipeline Stage", "Weighted AI Match", "Recommendation", "Voice Telephony", "Actions"]}
          rows={filtered.map((c) => [
            <div>
              <b>{c.name}</b>
              <small className="muted">{c.email}</small>
            </div>,
            c.job,
            <Badge tone={stageTone[c.stage]}>{c.stage}</Badge>,
            <Score value={c.score} />,
            <Badge tone={c.recommendation === "Advance" ? "green" : c.recommendation === "Reject" ? "red" : "amber"}>{c.recommendation}</Badge>,
            c.phone,
            <div style={{display:"flex", gap: 6}}>
              <button className="primary small" onClick={() => setModal({ type: "candidateProfile", candidateId: c.id })}>Details & Call</button>
              <button className="icon-button small danger" onClick={() => deleteCandidate(c.id)}><Trash2 size={13} /></button>
            </div>
          ])}
        />
      </Panel>
    </>
  );
}

function Pipeline({ data, setModal, setData, flash }) {
  const [boardView, setBoardView] = useState(true);
  const [draggedId, setDraggedId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, stageName) => {
    e.preventDefault();
    const id = draggedId || e.dataTransfer.getData("text/plain");
    if (!id) return;
    
    setData((prev) => {
      const cand = prev.candidates.find(c => c.id === id);
      if (!cand) return prev;
      
      flash(`${cand.name} moved to stage: ${stageName}`);
      
      return {
        ...prev,
        candidates: prev.candidates.map(c => c.id === id ? { ...c, stage: stageName } : c)
      };
    });
    setDraggedId(null);
  };

  return (
    <>
      <Header title="Candidate Board" subtitle="Physically drag candidate blocks across stages to update recruitment pipelines in real-time.">
        <button className={boardView ? "primary" : "secondary"} onClick={() => setBoardView(true)}>Kanban Grid</button>
        <button className={!boardView ? "primary" : "secondary"} onClick={() => setBoardView(false)}>List Directory</button>
      </Header>

      <div className="toolbar" style={{justifyContent: "flex-start", gap: 12}}>
        <select style={{maxWidth: 200}}><option>All Posted Roles</option>{data.jobs.map(j=><option key={j.id}>{j.title}</option>)}</select>
        <div className="search" style={{maxWidth: 300}}><Search size={17} /><input placeholder="Quick filter boards..." /></div>
      </div>

      {boardView ? (
        <div className="kanban">
          {stages.map((s) => {
            const list = data.candidates.filter((c) => c.stage === s);
            return (
              <section
                className={`lane ${draggedId ? "drag-over" : ""}`}
                key={s}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, s)}
              >
                <h3>
                  <span>{s}</span>
                  <span>{list.length}</span>
                </h3>
                
                <div style={{display:"grid", gap: 10, alignContent:"start", flex: 1}}>
                  {list.map((c) => (
                    <div
                      className="candidate-card"
                      key={c.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, c.id)}
                    >
                      <b>{c.name}</b>
                      <p>{c.job}</p>
                      <div>
                        <Badge tone={stageTone[s]}>{c.score} Score</Badge>
                        <small className="muted" style={{fontWeight: 700}}>{c.recommendation}</small>
                      </div>
                    </div>
                  ))}
                  
                  {list.length === 0 && <p className="empty-lane">Empty lane</p>}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <Panel title="Tabular Pipeline Mapping">
          <DataTable
            headers={["Candidate", "Applying Position", "Pipeline Status Stage", "AI Score Rating", "Last Synced Update"]}
            rows={data.candidates.map(c => [
              <b>{c.name}</b>,
              c.job,
              <Badge tone={stageTone[c.stage]}>{c.stage}</Badge>,
              <Score value={c.score} />,
              "Just now"
            ])}
          />
        </Panel>
      )}
    </>
  );
}

function Uploads({ data, setModal, setData, flash }) {
  const [selectedJob, setSelectedJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);

  const mockFileParseSteps = [
    "Uploading raw files to sandbox core...",
    "Extracting document text vector mappings...",
    "Executing entity extraction (Email, Phone, Name)...",
    "Running LLM weighted match evaluation...",
    "Auto-creating qualified candidate profiles..."
  ];

  const handleMockUpload = () => {
    if (!selectedJob) {
      flash("Please select a target job posting first");
      return;
    }
    
    setLoading(true);
    setLoadStep(0);
    
    const interval = setInterval(() => {
      setLoadStep((prev) => {
        if (prev >= mockFileParseSteps.length - 1) {
          clearInterval(interval);
          
          // Seed new candidate
          const firstNames = ["Aarav", "Elena", "Marcus", "Siddharth", "Juliana", "Kenji", "Tanya"];
          const lastNames = ["Sharma", "Volkova", "Moretti", "Patel", "Silva", "Sato", "Singh"];
          const emailDomains = ["gmail.com", "outlook.com", "yahoo.com", "uavcorp.com", "techops.net"];
          
          const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
          const score = Math.floor(Math.random() * 25) + 70; // 70-95
          
          const targetJob = data.jobs.find(j => j.title === selectedJob) || data.jobs[0];
          
          const newCandidate = {
            id: `c_${Date.now()}`,
            name: `${fName} ${lName}`,
            job: targetJob.title,
            email: `${fName.toLowerCase()}.${lName.toLowerCase()}@${domain}`,
            phone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
            stage: "Uploaded",
            score: score,
            tech: Math.min(score + Math.floor(Math.random() * 5), 100),
            communication: Math.min(score - Math.floor(Math.random() * 5), 100),
            culture: Math.min(score + Math.floor(Math.random() * 2), 100),
            source: "CV Upload",
            recommendation: score >= targetJob.threshold ? "Advance" : "Hold"
          };

          const newUpload = [
            `${fName.toLowerCase()}_${lName.toLowerCase()}_cv.pdf`,
            "142.6 KB",
            "1",
            "1/1",
            "1",
            "completed",
            new Date().toISOString().split("T")[0]
          ];

          setData((prev) => ({
            ...prev,
            candidates: [newCandidate, ...prev.candidates],
            uploads: [newUpload, ...prev.uploads],
            jobs: prev.jobs.map(j => j.title === selectedJob ? { ...j, applicants: j.applicants + 1, reviews: j.reviews + 1 } : j)
          }));
          
          setLoading(false);
          flash(`AI Parsed Candidate: ${newCandidate.name} created!`);
          return 0;
        }
        return prev + 1;
      });
    }, 1200);
  };

  return (
    <>
      <Header title="CV Upload Sandbox" subtitle="Simulate manual resume ingestion or ZIP bulk archives. The integrated agent extracts and parses skills instantly.">
      </Header>

      <div className="split">
        <Panel title="Trigger Parsing Simulation" subtitle="Drag a file or click dropzone below.">
          <label style={{marginBottom: 14}}>Target Recruitment Role
            <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
              <option value="">-- Choose target job posting --</option>
              {data.jobs.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}
            </select>
          </label>

          {loading ? (
            <div className="dropzone">
              <Sparkles className="pulse" size={40} style={{color: "var(--blue)"}} />
              <h3>Running AI Telemetry Screen...</h3>
              <p style={{fontWeight: 700, color: "var(--blue)"}}>{mockFileParseSteps[loadStep]}</p>
              <div className="progress-large full" style={{height: 6}}><i style={{width: `${(loadStep + 1) * 20}%`}} /></div>
            </div>
          ) : (
            <div className="dropzone" onClick={handleMockUpload}>
              <UploadCloud size={40} style={{color: "var(--muted)"}} />
              <h3>Click to Ingest Mock CV Document</h3>
              <p>Supports individual PDF/DOCX resumes, or a ZIP of up to 10 CVs.</p>
              <button className="primary small">Ingest Mock File</button>
            </div>
          )}
        </Panel>

        <Panel title="AI Resume Match Weightings" subtitle="Customize the global parser evaluation priorities.">
          <Weight label="Core Skills Proficiency Weight" value={40} />
          <Weight label="Hiring Experience Tenure Weight" value={35} />
          <Weight label="Academic Credentials Weight" value={25} />
          <div className="badge green" style={{marginTop: 14, width:"100%", padding:"12px 16px"}}>
            💡 Matching algorithms score profiles directly against target role thresholds automatically.
          </div>
        </Panel>
      </div>

      <Panel title="Ingested File Repository Logs" subtitle="Platform records of previously parsed files.">
        <DataTable
          headers={["Document Name", "Memory Size", "Total Entities Found", "Parsing Rate", "Profiles Synced", "Status", "Date Ingested", "Telemetry"]}
          rows={data.uploads.map((r, idx) => [
            <b>{r[0]}</b>,
            r[1],
            r[2],
            r[3],
            r[4],
            <Badge tone={r[5] === "completed" ? "green" : "amber"}>{r[5]}</Badge>,
            r[6],
            <button className="secondary small danger" onClick={() => {
              setData(prev => ({ ...prev, uploads: prev.uploads.filter((_, i) => i !== idx) }));
              flash("Upload record deleted");
            }}><Trash2 size={13} /></button>
          ])}
        />
      </Panel>
    </>
  );
}

function Interviews({ data, setModal, setData, flash }) {
  const [selectedDayNum, setSelectedDayNum] = useState("27");

  const cancelInterview = (idx) => {
    setData((prev) => ({
      ...prev,
      interviews: prev.interviews.filter((_, i) => i !== idx)
    }));
    flash("Interview scheduled event deleted");
  };

  const weekdays = [
    { name: "Mon", num: "25", label: "May 25" },
    { name: "Tue", num: "26", label: "May 26" },
    { name: "Wed", num: "27", label: "May 27" },
    { name: "Thu", num: "28", label: "May 28" },
    { name: "Fri", num: "29", label: "May 29" }
  ];

  // Map slots for days
  const getSlotData = (dayNum, hour) => {
    // Check Neel Soni (25th, 10:15)
    if (dayNum === "25" && hour === "10:00 AM") {
      return {
        name: "Neel Soni",
        role: "Senior Software Engineer",
        phone: "+91 98765 43210",
        status: "Completed",
        agent: "Technical Interview Bot",
        time: "10:15 AM",
        index: 1
      };
    }
    // Check Meenal Saxena (27th, 15:30)
    if (dayNum === "27" && hour === "03:30 PM") {
      return {
        name: "Meenal Saxena",
        role: "UX Designer",
        phone: "+91 99887 66554",
        status: "Scheduled",
        agent: "Culture Fit Interviewer",
        time: "03:30 PM",
        index: 0
      };
    }
    return null;
  };

  const hours = ["10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM"];

  return (
    <>
      <Header title="Hiring Interviews" subtitle="Schedule, configure calendar parameters, or launch live conversational voice previews.">
        <button className="primary" onClick={() => setModal("interview")}><CalendarClock size={15} />Schedule Screening Slot</button>
      </Header>

      <div className="metrics six" style={{marginBottom: 24}}>
        <Metric label="Total Planned" value={data.interviews.length} hint="Upcoming screenings" icon={CalendarClock} />
        <Metric label="Completed" value={data.calls.length} hint="Past screenings" icon={PhoneCall} />
        <Metric label="No Answers" value="0" hint="Simulated redials" icon={RefreshCcw} />
        <Metric label="Queue Capacity" value="25/min" hint="Platform throughput" icon={Activity} />
        <Metric label="Engine Status" value="Healthy" hint="AI dialer active" icon={ShieldCheck} />
        <Metric label="SIP Gateway" value="Active" hint="Connected" icon={Globe2} />
      </div>

      <div className="split">
        <div style={{display: "grid", gap: 16, alignContent: "start"}}>
          <h3 style={{fontSize: 16, fontWeight: 800, margin: "0 0 4px"}}>Daily Appointment Grid</h3>
          
          <div className="weekday-selector">
            {weekdays.map(d => (
              <div 
                key={d.num} 
                className={`weekday-card ${selectedDayNum === d.num ? "selected" : ""}`}
                onClick={() => setSelectedDayNum(d.num)}
              >
                <span className="day-name">{d.name}</span>
                <span className="day-num">{d.num}</span>
              </div>
            ))}
          </div>

          <div className="schedule-timeline">
            {hours.map(hour => {
              const slot = getSlotData(selectedDayNum, hour);
              const initials = slot ? slot.name.split(" ").map(n => n[0]).join("") : "";
              
              return (
                <div className="timeline-row" key={hour}>
                  <div className="timeline-hour">{hour}</div>
                  
                  {slot ? (
                    <article className={`timeline-slot-card ${slot.status.toLowerCase()}`}>
                      <div className="timeline-avatar">{initials}</div>
                      <div>
                        <h4 style={{margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "var(--ink)"}}>{slot.name}</h4>
                        <p className="muted" style={{fontSize: 12.5, margin: 0}}>{slot.role} • {slot.phone}</p>
                        <small className="muted" style={{display: "block", marginTop: 6, fontSize: 11}}>
                          Assigned Bot: <b style={{color: "var(--blue)"}}>{slot.agent}</b> • Actual time: <b>{slot.time}</b>
                        </small>
                      </div>
                      <div style={{display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end"}}>
                        <Badge tone={slot.status === "Completed" ? "green" : "amber"}>{slot.status}</Badge>
                        <div style={{display: "flex", gap: 6, marginTop: 4}}>
                          <button 
                            className="primary small" 
                            style={{padding: "4px 10px", fontSize: 11.5}} 
                            onClick={() => setModal({ type: "candidateProfile", candidateName: slot.name })}
                          >
                            Call Bot
                          </button>
                          <button 
                            className="icon-button small danger" 
                            style={{width: 30, height: 30}} 
                            onClick={() => cancelInterview(slot.index)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ) : (
                    <div 
                      className="timeline-slot-card" 
                      style={{borderStyle: "dashed", opacity: 0.6, cursor: "pointer", background: "transparent"}}
                      onClick={() => setModal("interview")}
                    >
                      <div style={{display: "flex", alignItems: "center", gap: 12, gridColumn: "span 3"}}>
                        <Plus size={18} className="muted" />
                        <div>
                          <b className="muted" style={{fontSize: 13.5}}>Available Screening Slot</b>
                          <p className="muted" style={{fontSize: 11.5, margin: "2px 0 0"}}>Click to schedule candidate phone screening for {hour}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Panel title="Scheduler Configuration Overview" subtitle="System timezone and calendar endpoints.">
          <div style={{display: "grid", gap: 14}}>
            <div className="insight" style={{padding: 14}}><small>Timezone Profile</small><b>GMT+05:30 (IST)</b></div>
            <div className="insight" style={{padding: 14}}><small>Outlook Calendar Link</small><b>Healthy Connected</b></div>
            <div className="insight" style={{padding: 14}}><small>Google Scheduler Sync</small><b>Enabled</b></div>
            <div className="badge green" style={{padding: 14, lineHeight: 1.5, borderRadius: 10}}>
              💡 Mapped voice bots will call candidates at their designated appointment times automatically.
            </div>
            
            <div style={{marginTop: 10, borderTop: "1px solid var(--line)", paddingTop: 16}}>
              <h4 style={{fontSize: 13.5, fontWeight: 700, margin: "0 0 10px"}}>Calendar Synced Pools</h4>
              <div style={{display: "grid", gap: 8}}>
                <div style={{display: "flex", justifyContent: "space-between", fontSize: 12.5}}>
                  <span className="muted">HR-Screening-Pool</span>
                  <Badge tone="green">Active</Badge>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", fontSize: 12.5}}>
                  <span className="muted">Developer-Technical-Slots</span>
                  <Badge tone="green">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

function Calls({ data, flash, setModal, setData }) {
  return (
    <>
      <Header title="Call Performance Logs" subtitle="Review complete recording logs, safety violations, and post-call conversational metrics.">
        <button className="secondary" onClick={() => flash("Refreshed recent audio call logs")}><RefreshCcw size={15} />Sync Logs</button>
      </Header>

      <Panel title="Filter Telemetry Parameters">
        <div className="form-grid">
          <label>Target Candidate
            <input placeholder="Enter candidate name..." />
          </label>
          <label>Call Status
            <select><option>Show all logs</option><option>Completed</option><option>No Answer</option><option>Dropped</option></select>
          </label>
          <label>Date Ingested
            <input type="date" />
          </label>
          <label>System Compliance Audit
            <select><option>Clear of Violations</option><option>Violations Flagged</option></select>
          </label>
        </div>
      </Panel>

      <Panel title="Audio Call Registry" subtitle="Review AI-analyzed logs. Click transcript details to load transcription dialogs.">
        <DataTable
          headers={["Candidate Profile", "Call Status", "Audio Duration", "Keywords Flagged", "Ingestion Timestamp", "AI Scoring Summary", "Transcript Link"]}
          rows={data.calls.map((r, idx) => [
            <b>{r[0]}</b>,
            <Badge tone="green">{r[1]}</Badge>,
            r[2],
            <Badge tone="gray">{r[3]}</Badge>,
            r[4],
            <span style={{fontSize: 12.5, color: "var(--ink-2)"}}>{r[5]}</span>,
            <button className="secondary small" onClick={() => setModal({ type: "callTranscript", candidateName: r[0], transcript: r[5] })}>Review Dialogue</button>
          ])}
        />
      </Panel>
    </>
  );
}

function Campaign({ data, setModal, flash, setData }) {
  const [running, setRunning] = useState(true);
  const [progress, setProgress] = useState(38);
  const [concurrency, setConcurrency] = useState(2);
  const [selectedJob, setSelectedJob] = useState("UX Designer");
  const [logs, setLogs] = useState([
    { time: "15:28:01", type: "system", text: "Outbound Campaign Blast Initialized (8 shortlist targets parsed)." },
    { time: "15:28:02", type: "system", text: "Verifying Plivo/Twilio SIP trunk routing connectivity... Connected." },
    { time: "15:28:03", type: "success", text: "[LINE 1] Dialing Neel Soni (+91 98765 43210) via Bangalore SIP Trunk." },
    { time: "15:28:05", type: "success", text: "[LINE 2] Dialing Yvonne Mwema (+1 555 0142) via US Toll-Free Gateway." },
    { time: "15:28:07", type: "system", text: "[LINE 1] Call Answered. Initializing Technical Interview Bot engine (Sarah)..." },
    { time: "15:28:10", type: "system", text: "[LINE 2] Call Answered. Initializing Culture Fit Interviewer engine (Bella)..." }
  ]);

  // Terminal auto scroll
  useEffect(() => {
    const consoleEl = document.getElementById("terminal_console");
    if (consoleEl) {
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 8;
        if (next >= 100) {
          setRunning(false);
          flash("Outbound calling campaign completed successfully!");
          
          setLogs(prevLogs => [
            ...prevLogs,
            { time: "15:29:10", type: "success", text: "[LINE 3] Meenal Saxena call completed. Score: 77/100. Stage promoted." },
            { time: "15:29:15", type: "success", text: "[LINE 4] Prisha Patel call completed. Score: 62/100. Stage: Hold." },
            { time: "15:29:16", type: "system", text: "[SYSTEM] Outbound Campaign Blast finished. 8/8 targets successfully screened." }
          ]);
          
          return 100;
        }

        // Add telemetry logs based on progress
        if (next > 40 && next < 55) {
          setLogs(prevLogs => [
            ...prevLogs,
            { time: "15:28:22", type: "success", text: "[LINE 1] Neel Soni call completed. Score: 88/100. Stage: Shortlisted." },
            { time: "15:28:25", type: "success", text: "[LINE 2] Yvonne Mwema call completed. Score: 84/100. Stage: Shortlisted." },
            { time: "15:28:30", type: "warning", text: "[LINE 3] Initiating SIP connect to Meenal Saxena (+91 99887 66554)..." }
          ]);
        } else if (next >= 55 && next < 75) {
          setLogs(prevLogs => [
            ...prevLogs,
            { time: "15:28:35", type: "system", text: "[LINE 3] Call Answered. Ingesting candidate conversational response..." },
            { time: "15:28:42", type: "system", text: "[LINE 3] Speech-to-text token matched: \"Design systems, Figma variables, usability\"." }
          ]);
        } else if (next >= 75 && next < 90) {
          setLogs(prevLogs => [
            ...prevLogs,
            { time: "15:28:50", type: "warning", text: "[LINE 4] Initiating SIP connect to Prisha Patel (+91 90123 45678)..." },
            { time: "15:28:55", type: "system", text: "[LINE 4] Call Answered. Initializing Candidate Follow-up Agent (Bella)..." }
          ]);
        }

        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [running]);

  const triggerCampaignBlast = () => {
    setProgress(0);
    setRunning(true);
    setLogs([
      { time: "15:30:00", type: "system", text: `[SYSTEM] Manual Outreach Campaign triggered targeting: ${selectedJob} candidates.` },
      { time: "15:30:01", type: "system", text: `[SYSTEM] Concurrency configured to: ${concurrency} lines.` },
      { time: "15:30:02", type: "warning", text: "[LINE 1] Dialing candidate cohort... verified SIP trunks." }
    ]);
    flash(`Outbound campaign started for role: ${selectedJob}`);
  };

  return (
    <>
      <Header title="Campaign Monitoring" subtitle="Launch bulk outbound calling sequences targeting shortlists. View live telephony waveforms.">
        <button className="secondary" onClick={() => { setRunning(!running); flash(running ? "Campaign paused" : "Campaign resumed"); }}>
          {running ? "Pause Campaign" : "Resume Campaign"}
        </button>
        <button className="primary" onClick={triggerCampaignBlast}><PhoneCall size={15} />Trigger Dialer Blast</button>
      </Header>

      <div className="metrics four">
        <Metric label="Total Targets" value="8 candidates" hint="Recruit shortlist" icon={Users} />
        <Metric label="Processed Runs" value={`${Math.floor((progress / 100) * 8)} / 8`} hint={`${progress}% complete`} icon={PhoneCall} />
        <Metric label="Outbound Concurrency" value={`${concurrency} Lines`} hint="Simultaneous trunks" icon={Activity} />
        <Metric label="Trunk Carrier" value="Twilio SIP Trunk" hint="Status: Connected" icon={ShieldCheck} />
      </div>

      <div className="dialer-control-box">
        <label>Target Recruiting Role
          <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
            {data.jobs.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}
          </select>
        </label>
        
        <label>Dialer Concurrency Limit
          <select value={concurrency} onChange={(e) => setConcurrency(Number(e.target.value))}>
            <option value="1">1 Active Line</option>
            <option value="2">2 Concurrent Lines</option>
            <option value="4">4 Concurrent Lines</option>
            <option value="8">8 Concurrent Lines</option>
          </select>
        </label>
        
        <button className="primary small" style={{background: "var(--blue)"}} onClick={triggerCampaignBlast}>
          <PhoneCall size={13} /> Initiate Blast
        </button>
      </div>

      <Panel title="Active Dialer Telemetry Grid" subtitle="Concurrent lines currently dialed by the ElevenLabs/OpenAI speech processor.">
        <div className="dialer-grid">
          {/* LINE 1 */}
          <article className="dialer-line-card completed">
            <div className="dialer-header">
              <span className="dialer-channel-title">Line 1</span>
              <Badge tone="green">Completed</Badge>
            </div>
            <div className="dialer-body">
              <h4 className="dialer-candidate-name">Neel Soni</h4>
              <p className="dialer-candidate-meta">Senior Software Engineer • +91 98765 43210</p>
            </div>
            <div className="dialer-footer">
              <small className="muted">Duration: <b>3m 12s</b></small>
              <Badge tone="violet">Score: 88%</Badge>
            </div>
          </article>

          {/* LINE 2 */}
          <article className="dialer-line-card completed">
            <div className="dialer-header">
              <span className="dialer-channel-title">Line 2</span>
              <Badge tone="green">Completed</Badge>
            </div>
            <div className="dialer-body">
              <h4 className="dialer-candidate-name">Yvonne Mwema</h4>
              <p className="dialer-candidate-meta">Data Analyst • +1 555 0142</p>
            </div>
            <div className="dialer-footer">
              <small className="muted">Duration: <b>2m 45s</b></small>
              <Badge tone="violet">Score: 84%</Badge>
            </div>
          </article>

          {/* LINE 3 */}
          {running && progress < 80 ? (
            <article className="dialer-line-card active">
              <div className="dialer-header">
                <span className="dialer-channel-title">Line 3</span>
                <span style={{display: "flex", alignItems: "center", gap: 6}}>
                  <span className="pulse-circle" />
                  <Badge tone="green">Calling</Badge>
                </span>
              </div>
              <div className="dialer-body">
                <h4 className="dialer-candidate-name">Meenal Saxena</h4>
                <p className="dialer-candidate-meta">UX Designer • +91 99887 66554</p>
                <div className="live-waveform-container">
                  <span className="live-waveform-bar" />
                  <span className="live-waveform-bar" />
                  <span className="live-waveform-bar" />
                  <span className="live-waveform-bar" />
                  <span className="live-waveform-bar" />
                  <span className="live-waveform-bar" />
                  <span className="live-waveform-bar" />
                </div>
              </div>
              <div className="dialer-footer">
                <small className="muted">Duration: <b>0m 42s</b></small>
                <Badge tone="amber">Active</Badge>
              </div>
            </article>
          ) : (
            <article className={`dialer-line-card ${progress >= 80 ? "completed" : "queued"}`}>
              <div className="dialer-header">
                <span className="dialer-channel-title">Line 3</span>
                <Badge tone={progress >= 80 ? "green" : "gray"}>{progress >= 80 ? "Completed" : "Queued"}</Badge>
              </div>
              <div className="dialer-body">
                <h4 className="dialer-candidate-name">Meenal Saxena</h4>
                <p className="dialer-candidate-meta">UX Designer • +91 99887 66554</p>
              </div>
              <div className="dialer-footer">
                <small className="muted">Duration: <b>{progress >= 80 ? "2m 10s" : "--"}</b></small>
                {progress >= 80 && <Badge tone="violet">Score: 77%</Badge>}
              </div>
            </article>
          )}

          {/* LINE 4 */}
          {running && progress >= 80 && progress < 100 ? (
            <article className="dialer-line-card active">
              <div className="dialer-header">
                <span className="dialer-channel-title">Line 4</span>
                <span style={{display: "flex", alignItems: "center", gap: 6}}>
                  <span className="pulse-circle" />
                  <Badge tone="green">Calling</Badge>
                </span>
              </div>
              <div className="dialer-body">
                <h4 className="dialer-candidate-name">Prisha Patel</h4>
                <p className="dialer-candidate-meta">Product Manager • +91 90123 45678</p>
                <div className="live-waveform-container">
                  <span className="live-waveform-bar" />
                  <span className="live-waveform-bar" />
                  <span className="live-waveform-bar" />
                  <span className="live-waveform-bar" />
                  <span className="live-waveform-bar" />
                  <span className="live-waveform-bar" />
                  <span className="live-waveform-bar" />
                </div>
              </div>
              <div className="dialer-footer">
                <small className="muted">Duration: <b>0m 15s</b></small>
                <Badge tone="amber">Active</Badge>
              </div>
            </article>
          ) : (
            <article className={`dialer-line-card ${progress >= 95 ? "completed" : "queued"}`}>
              <div className="dialer-header">
                <span className="dialer-channel-title">Line 4</span>
                <Badge tone={progress >= 95 ? "green" : "gray"}>{progress >= 95 ? "Completed" : "Queued"}</Badge>
              </div>
              <div className="dialer-body">
                <h4 className="dialer-candidate-name">Prisha Patel</h4>
                <p className="dialer-candidate-meta">Product Manager • +91 90123 45678</p>
              </div>
              <div className="dialer-footer">
                <small className="muted">Duration: <b>{progress >= 95 ? "1m 55s" : "--"}</b></small>
                {progress >= 95 && <Badge tone="violet">Score: 62%</Badge>}
              </div>
            </article>
          )}
        </div>

        <div className="progress-large full" style={{height: 10, margin: "20px 0 10px"}}>
          <i style={{width: `${progress}%`}} />
        </div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <small className="muted">Campaign speed throttle: <b>{concurrency} concurrent channels</b></small>
          <small className="muted" style={{fontWeight: 700}}>Ingestion progress: {progress}% complete</small>
        </div>
      </Panel>

      <Panel title="Real-Time Telephony Event Console" subtitle="Streaming developer logs direct from the Twilio SIP trunk integration.">
        <div className="telemetry-console" id="terminal_console">
          {logs.map((log, index) => (
            <div key={index} className={`telemetry-line ${log.type}`}>
              <span className="timestamp">[{log.time}]</span>
              <span>{log.text}</span>
            </div>
          ))}
          {running && (
            <div className="telemetry-line system">
              <span className="timestamp">[{new Date().toTimeString().split(" ")[0]}]</span>
              <span>[LINE 3] Streaming audio packets... <span className="pulse-circle" style={{width: 6, height: 6}} /></span>
            </div>
          )}
        </div>
      </Panel>
    </>
  );
}

function Phones({ setModal }) {
  return (
    <>
      <Header title="Dedicated Numbers" subtitle="Configure external Twilio or Plivo phone numbers to assign to specialized incoming agents.">
        <button className="primary" onClick={() => setModal("phone")}><Plus size={15} />Acquire Phone Number</button>
      </Header>
      <div className="metrics four">
        <Metric label="Numbers Acquired" value="2 active" hint="Mapped inbound routes" icon={Phone} />
        <Metric label="Active Trunks" value="Twilio Hook" hint="Twilio provider trunk" icon={ShieldCheck} />
        <Metric label="Rate Cap Limit" value="12 calls/sec" hint="Dialer ceiling config" icon={Activity} />
        <Metric label="Cost Allocation" value="$1.50/month" hint="Sandbox billed credit" icon={CircleDollarSign} />
      </div>

      <Panel title="Allocated Phone Numbers" subtitle="Twilio / Plivo incoming lines.">
        <DataTable
          headers={["Assigned Number", "Provider", "Virtual Location", "Target Hiring Agent", "Usage Status", "Cost Metric"]}
          rows={[
            [<b>+1 888 504 2291</b>, <Badge tone="blue">Twilio</Badge>, "US Toll-Free", "Technical Interview Bot", <Badge tone="green">Active Routing</Badge>, "$1.00/mo"],
            [<b>+91 80 4910 2209</b>, <Badge tone="violet">Plivo</Badge>, "Bangalore Hub", "Culture Fit Interviewer", <Badge tone="green">Active Routing</Badge>, "$0.50/mo"]
          ]}
        />
      </Panel>
    </>
  );
}

function Sip({ setModal }) {
  return (
    <>
      <Header title="SIP Trunk Engine" subtitle="Integrate your custom enterprise SIP trunk routing directly with ElevenLabs voice stacks or OpenAI pools.">
        <button className="primary" onClick={() => setModal("sipTrunk")}><Plus size={15} />Add Custom SIP Trunk</button>
      </Header>
      <div className="metrics four">
        <Metric label="Engine Version" value="v2.1" hint="SIP Stack Core" icon={ShieldCheck} />
        <Metric label="Trunk Providers" value="13+ supported" hint="Bring your own provider" icon={Globe2} />
        <Metric label="Fallback Route" value="Plivo SIP Link" hint="High redundancy failover" icon={Activity} />
        <Metric label="Session Limit" value="128 active" hint="Concurrent session limit" icon={ShieldCheck} />
      </div>

      <Panel title="Active SIP Configurations" subtitle="Trunks and provider linkages.">
        <DataTable
          headers={["Trunk Name Gateway", "Voice Interface Stack", "Domain Credentials", "Active Status", "Primary Routing Path"]}
          rows={[
            [<b>Twilio Primary Trunk</b>, <Badge tone="blue">OpenAI Direct</Badge>, "sip:twilio.agenthr.io", <Badge tone="green">Healthy Connection</Badge>, "Primary Gateway"],
            [<b>ElevenLabs Secondary</b>, <Badge tone="violet">ElevenLabs SIP</Badge>, "sip:elevenlabs.agenthr.io", <Badge tone="green">Healthy Connection</Badge>, "Secondary Pool"],
            [<b>Custom Enterprise Link</b>, <Badge tone="gray">Bring your own SIP</Badge>, "sip:byo.enterprise.net", <Badge tone="amber">Awaiting Validation</Badge>, "Redundant Gateway"]
          ]}
        />
      </Panel>
    </>
  );
}

function Flows({ data, setModal, setData, flash }) {
  const deleteFlow = (id) => {
    setData((prev) => ({
      ...prev,
      flows: prev.flows.filter(f => f.id !== id)
    }));
    flash("Flow sequence schema deleted");
  };

  return (
    <>
      <Header title="Interview Flows" subtitle="Construct interactive voice call sequence trees visually. Message nodes, questions, and triggers can be fully configured.">
        <button className="primary" onClick={() => setModal("flow")}><Plus size={15} />Create New Flow Schema</button>
      </Header>

      <Tabs items={[`All Created Flows (${data.flows.length})`, "Pre-built Recruiting Templates"]} />
      
      <div className="cards three">
        {data.flows.map((f) => (
          <article className="flow-card" key={f.id}>
            <div>
              <div className="card-top" style={{marginBottom: 8}}>
                <Badge tone={f.active ? "green" : "gray"}>{f.active ? "Active Flow" : "Inactive"}</Badge>
                <label className="switch" onClick={() => {
                  setData(prev => ({
                    ...prev,
                    flows: prev.flows.map(item => item.id === f.id ? { ...item, active: !item.active } : item)
                  }));
                  flash(`${f.name} updated successfully`);
                }}>
                  <input type="checkbox" checked={f.active} onChange={() => {}} />
                  <span />
                </label>
              </div>
              <h3>{f.name}</h3>
              <p className="muted" style={{fontSize: 12.5, minHeight: 48}}>{f.desc || "No description provided."}</p>
            </div>
            
            <div style={{borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 12, display:"grid", gap: 8}}>
              <small className="muted" style={{fontWeight: 700}}>{f.nodesCount} layout nodes • {f.connectionsCount} flow connectors</small>
              <small className="muted">Last modified: {f.updated}</small>
              
              <div className="row-actions" style={{marginTop: 8}}>
                <button className="primary small" onClick={() => setModal({ type: "canvas", flowId: f.id })}>Open Visual Canvas</button>
                <button className="secondary small" onClick={() => setModal({ type: "flowTest", flowId: f.id })}>Simulate Flow</button>
                <button className="icon-button small danger" onClick={() => deleteFlow(f.id)}><Trash2 size={13} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Widget({ data, setModal, setData, flash }) {
  const [activeStep, setActiveStep] = useState(1);
  const [simName, setSimName] = useState("Siddharth Patel");
  const [simEmail, setSimEmail] = useState("sid.patel@engineering.in");
  const [simPhone, setSimPhone] = useState("+91 94819 22019");
  const [simSelectedRole, setSimSelectedRole] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleCustomColor = (e) => {
    setData({ widgetBrandColor: e.target.value });
  };

  const handleCustomName = (e) => {
    setData({ widgetBrandName: e.target.value });
  };

  // Launch simulated applicant creation from widget
  const handleWizardSubmit = () => {
    if (!simSelectedRole || !simName || !simEmail) {
      flash("Complete the application fields");
      return;
    }
    
    // Create candidate
    const score = Math.floor(Math.random() * 20) + 75; // 75-95
    const targetJob = data.jobs.find(j => j.title === simSelectedRole) || data.jobs[0];

    const newCandidate = {
      id: `c_${Date.now()}`,
      name: simName,
      job: targetJob.title,
      email: simEmail,
      phone: simPhone,
      stage: "Uploaded",
      score: score,
      tech: Math.min(score + 4, 100),
      communication: Math.min(score - 2, 100),
      culture: Math.min(score + 1, 100),
      source: "Widget",
      recommendation: score >= targetJob.threshold ? "Advance" : "Hold"
    };

    setData(prev => ({
      ...prev,
      candidates: [newCandidate, ...prev.candidates],
      jobs: prev.jobs.map(j => j.title === targetJob.title ? { ...j, applicants: j.applicants + 1, reviews: j.reviews + 1 } : j)
    }));

    flash(`Application for ${simName} successfully submitted!`);
    setActiveStep(6);
  };

  const simulateProgress = () => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setActiveStep(4);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <>
      <Header title="Embed Careers Widget" subtitle="Embed a gorgeous, mobile-responsive careers wizard on your own site. Customize styles and simulate applicant flows instantly.">
      </Header>

      <div className="split">
        <Panel title="Branding Configurator" subtitle="Modify embed tokens, styling rules, and labels.">
          <label style={{marginBottom: 14}}>Company Brand Display Name
            <input value={data.widgetBrandName} onChange={handleCustomName} placeholder="Gradii" />
          </label>
          <label style={{marginBottom: 14}}>Brand Theme Hex Accent Color
            <div style={{display: "flex", gap: 10, alignItems: "center"}}>
              <input type="color" value={data.widgetBrandColor} onChange={handleCustomColor} style={{width: 50, height: 42, padding: 2, cursor:"pointer"}} />
              <code>{data.widgetBrandColor}</code>
            </div>
          </label>
          
          <CodeBlock title="Embed Script Integration Tag" code={`<!-- Inject widget overlay tag -->\n<div data-agenthr-careers data-brand="${data.widgetBrandName.toLowerCase()}" data-color="${data.widgetBrandColor}"></div>\n<script src="https://agenthr.diploy.in/widget/v2/embed.js" async></script>`} />
        </Panel>

        <Panel title={`Interactive Careers Widget - ${data.widgetBrandName}`} subtitle="Simulate applicant experience. Applications submitted here are parsed and populated instantly." style={{borderColor: data.widgetBrandColor}}>
          <div style={{border: `2px solid ${data.widgetBrandColor}`, borderRadius: 12, padding: 18, background: "var(--nav)"}}>
            <header style={{borderBottom: "1px solid var(--line)", paddingBottom: 10, marginBottom: 12, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <b style={{color: data.widgetBrandColor, fontSize:16}}>{data.widgetBrandName} Careers</b>
              <Badge tone="green">Powered by AgentHR</Badge>
            </header>

            {activeStep === 1 && (
              <div>
                <p className="muted" style={{fontSize: 13, marginBottom: 14}}>Choose an active posting to begin your application:</p>
                <div style={{display:"grid", gap: 8}}>
                  {data.jobs.filter(j => j.status === "active").map(j => (
                    <button key={j.id} className="secondary full" style={{textAlign:"left", display:"flex", justifyContent:"space-between", padding:"10px 14px"}} onClick={() => { setSimSelectedRole(j.title); setActiveStep(2); }}>
                      <b>{j.title}</b>
                      <small className="muted">{j.location}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div style={{display:"grid", gap: 10}}>
                <p className="muted" style={{fontSize: 13}}>Role Selected: <b style={{color: "var(--ink)"}}>{simSelectedRole}</b></p>
                <label>Full Legal Name <input value={simName} onChange={(e) => setSimName(e.target.value)} /></label>
                <label>Email Address <input value={simEmail} onChange={(e) => setSimEmail(e.target.value)} /></label>
                <label>Phone Number <input value={simPhone} onChange={(e) => setSimPhone(e.target.value)} /></label>
                
                <footer style={{marginTop: 10}}>
                  <button className="secondary small" onClick={() => setActiveStep(1)}>Back</button>
                  <button className="primary small" style={{background: data.widgetBrandColor}} onClick={() => setActiveStep(3)}>Next: Upload CV</button>
                </footer>
              </div>
            )}

            {activeStep === 3 && (
              <div>
                <p className="muted" style={{fontSize: 13}}>Role Selected: <b style={{color: "var(--ink)"}}>{simSelectedRole}</b></p>
                <div className="dropzone compact" style={{borderStyle: "dashed"}} onClick={simulateProgress}>
                  <UploadCloud size={30} style={{color: data.widgetBrandColor}} />
                  <b>Upload Resume File</b>
                  <small className="muted">Supports PDF, DOC, DOCX up to 10MB</small>
                </div>
                {uploadProgress > 0 && (
                  <div style={{marginTop: 14}}>
                    <small className="muted">Parsing telemetry progress: {uploadProgress}%</small>
                    <div className="progress-large full" style={{height: 5}}><i style={{width: `${uploadProgress}%`, background: data.widgetBrandColor}} /></div>
                  </div>
                )}
                <footer style={{marginTop: 10}}>
                  <button className="secondary small" onClick={() => setActiveStep(2)}>Back</button>
                </footer>
              </div>
            )}

            {activeStep === 4 && (
              <div>
                <div className="badge green" style={{marginBottom: 10, display: "flex", gap: 6, alignItems: "center"}}>
                  <Sparkles size={12} />
                  <span>Resume parsed successfully! Matching metrics loaded:</span>
                </div>
                <div className="score-cards">
                  <div className="insight" style={{padding: 8}}><small>Match score</small><b style={{fontSize: 15, color: "var(--green)"}}>84/100</b></div>
                  <div className="insight" style={{padding: 8}}><small>Role Rank</small><b style={{fontSize: 15}}>Strong</b></div>
                </div>
                <p className="muted" style={{fontSize: 12.5, lineHeight:1.4}}>Based on your core credentials, you are highly qualified for immediate voice screening. Choose an appointment time slot:</p>
                
                <footer style={{marginTop: 10}}>
                  <button className="primary full" style={{background: data.widgetBrandColor}} onClick={() => setActiveStep(5)}>Schedule Screening Slot</button>
                </footer>
              </div>
            )}

            {activeStep === 5 && (
              <div>
                <p className="muted" style={{fontSize: 13, marginBottom: 8}}>Pick a screening appointment date:</p>
                <div className="form-grid" style={{marginBottom: 14}}>
                  <input type="date" defaultValue="2026-05-27" />
                  <select><option>15:30 (Bangalore Time)</option><option>16:00</option><option>17:30</option></select>
                </div>
                <footer style={{marginTop: 10}}>
                  <button className="primary full" style={{background: data.widgetBrandColor}} onClick={handleWizardSubmit}>Submit Application</button>
                </footer>
              </div>
            )}

            {activeStep === 6 && (
              <div style={{textAlign:"center", padding: "10px 0"}}>
                <Sparkles size={34} style={{color: "var(--green)", marginBottom: 8}} />
                <h4>Application Completed!</h4>
                <p className="muted" style={{fontSize: 12.5, lineHeight: 1.4}}>Your interview slot is confirmed. An automated voice screening prompt will ring your line shortly!</p>
                <button className="secondary small" style={{marginTop: 14}} onClick={() => { setActiveStep(1); setUploadProgress(0); }}>Apply to another role</button>
              </div>
            )}

          </div>
        </Panel>
      </div>
    </>
  );
}

function Api({ data, setModal, setData, flash }) {
  const [activeTab, setActiveTab] = useState("curl");
  const [simRunning, setSimRunning] = useState(false);
  const [apiResponse, setApiResponse] = useState("");

  const copyKey = (key) => {
    try { navigator.clipboard.writeText(key); } catch(_) {}
    flash("API token copied to clipboard");
  };

  const handleSimulateRequest = () => {
    setSimRunning(true);
    setApiResponse("");
    setTimeout(() => {
      setApiResponse(JSON.stringify({
        status: "success",
        code: 200,
        message: "Candidate created successfully & AI voice interview queued.",
        data: {
          candidate_id: `c_${Date.now()}`,
          name: "Siddharth Patel",
          email: "sid.patel@engineering.in",
          phone: "+91 94819 22019",
          job_id: "j4",
          match_score: 84,
          telephony_status: "queued"
        }
      }, null, 2));
      setSimRunning(false);
      flash("API response generated");
    }, 1000);
  };

  return (
    <>
      <Header title="REST API Console" subtitle="Issue platform tokens, authorize webhook scopes, and test HTTP request payloads inside our sandbox simulator.">
        <button className="primary" onClick={() => setModal("apiKey")}><Plus size={15} />Create API Credentials</button>
      </Header>

      <div className="metrics four">
        <Metric label="API Key Tokens" value={data.apiKeys.length} hint="Active tokens" icon={KeyRound} />
        <Metric label="Daily Limit Cap" value="5,000/day" hint="Sandbox throttle" icon={Activity} />
        <Metric label="Swagger Hub" value="Ready" hint="/docs/swagger" icon={ShieldCheck} />
        <Metric label="Redoc Document" value="Ready" hint="/docs/redoc" icon={ShieldCheck} />
      </div>

      <div className="split">
        <Panel title="API Credentials" subtitle="Copy token variables to inspect REST telemetry.">
          <DataTable
            headers={["Token Identifier", "Authorized Scopes", "Throttles", "Status", "Action"]}
            rows={data.apiKeys.map((r, idx) => [
              <b>{r[0]}</b>,
              <span style={{fontSize:11.5}}>{r[1]}</span>,
              r[2],
              <Badge tone="green">{r[3]}</Badge>,
              <button className="secondary small" onClick={() => copyKey(r[4])}>Copy Token</button>
            ])}
          />
        </Panel>

        <Panel title="API Interactive Console" subtitle="Trigger mock HTTP endpoints.">
          <div className="tabs">
            <button className={activeTab === "curl" ? "selected" : ""} onClick={() => setActiveTab("curl")}>cURL</button>
            <button className={activeTab === "js" ? "selected" : ""} onClick={() => setActiveTab("js")}>JavaScript</button>
            <button className={activeTab === "py" ? "selected" : ""} onClick={() => setActiveTab("py")}>Python</button>
          </div>

          {activeTab === "curl" && <pre>{`curl -X POST "https://agenthr.diploy.in/api/v1/candidates" \\\n  -H "Authorization: Bearer ag_live_••••" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "name": "Siddharth Patel",\n    "email": "sid.patel@engineering.in",\n    "phone": "+91 94819 22019",\n    "job_id": "j4"\n  }'`}</pre>}
          {activeTab === "js" && <pre>{`fetch("https://agenthr.diploy.in/api/v1/candidates", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer ag_live_••••",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({\n    name: "Siddharth Patel",\n    email: "sid.patel@engineering.in",\n    phone: "+91 94819 22019",\n    job_id: "j4"\n  })\n}).then(res => res.json()).then(console.log);`}</pre>}
          {activeTab === "py" && <pre>{`import requests\n\nres = requests.post(\n  "https://agenthr.diploy.in/api/v1/candidates",\n  headers={"Authorization": "Bearer ag_live_••••"},\n  json={\n    "name": "Siddharth Patel",\n    "email": "sid.patel@engineering.in",\n    "phone": "+91 94819 22019",\n    "job_id": "j4"\n  }\n)\nprint(res.json())`}</pre>}

          <button className="primary full" style={{marginTop: 14}} onClick={handleSimulateRequest} disabled={simRunning}>
            {simRunning ? "Sending payload..." : "Send Simulated HTTP Request"}
          </button>

          {apiResponse && (
            <div style={{marginTop: 14}}>
              <small className="muted" style={{fontWeight: 700}}>Response Object (200 OK)</small>
              <pre style={{maxHeight: 180, overflowY: "auto"}}>{apiResponse}</pre>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}

function Analytics({ data }) {
  const chartData = data.candidates.map(c => ({
    name: c.name.split(" ")[0],
    score: c.score,
    tech: c.tech,
    comm: c.communication
  }));

  return (
    <>
      <Header title="Analytics telemetry" subtitle="Aggregated platform dashboards, match score vectors, and applicant telemetry.">
      </Header>
      
      <div className="metrics four">
        <Metric label="Hiring Conversion" value="13%" hint="Match rate threshold" icon={Activity} />
        <Metric label="Average AI Score" value="78/100" hint="General cohort avg" icon={Gauge} />
        <Metric label="Total Call Minutes" value="342 min" hint="Billing ledger sync" icon={PhoneCall} />
        <Metric label="Conversion Funnel" value="Healthy" hint="Standard ATS shape" icon={ShieldCheck} />
      </div>

      <div className="split">
        <Panel title="Weighted score distribution" subtitle="Match scores versus category dimensions.">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{stroke: 'var(--blue)', strokeWidth: 1}} />
              <Area dataKey="score" stroke="var(--blue)" fill="var(--blue-glow)" />
              <Area dataKey="tech" stroke="var(--violet)" fill="var(--violet-glow)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Job Posting Performance Metrics" subtitle="Telemetry aggregates mapped per posting category.">
          <DataTable
            headers={["Job Title Posting", "Applicants", "Match Average", "Screened", "Interviews", "Hired Rate", "Status"]}
            rows={data.jobs.map(j => [
              <b>{j.title}</b>,
              j.applicants,
              j.applicants > 0 ? "82%" : "-",
              j.reviews,
              j.interviews,
              "1",
              <Badge tone={j.status === "active" ? "green" : "gray"}>{j.status}</Badge>
            ])}
          />
        </Panel>
      </div>
    </>
  );
}

function Upgrade({ setModal }) {
  return (
    <>
      <Header title="Licensing Plans" subtitle="Review available self-hosted or SaaS tier allocations.">
      </Header>
      
      <div className="plans">
        <Plan name="Free Tier" price="Free" detail="Forever Sandbox" active={false} onClick={() => setModal({ type: "planPreview", tier: "Free" })} features={[
          "2 Active Screening Bots",
          "Max 10 Candidate Directory Entries",
          "Standard Resume parsing weights",
          "50 Included Audio minutes/mo"
        ]} />
        
        <Plan name="Professional Plan" price="$49.00" detail="/month billing" active={true} onClick={() => setModal({ type: "planPreview", tier: "Pro" })} features={[
          "Unlimited Active Interview Bots",
          "Unlimited Candidate Profiles Ingestion",
          "Editable Scoring Weights & Rules",
          "Twilio / Plivo Secondary SIP Hookup",
          "500 Included call minutes/mo"
        ]} />
      </div>
    </>
  );
}

function Billing({ data, setModal, setData, flash }) {
  const handlePurchaseCredits = (packName, creditsCount, price) => {
    setData(prev => ({
      ...prev,
      credits: prev.credits + creditsCount,
      transactions: [
        ["Credit", `Purchased credit bundle: ${packName}`, `+${creditsCount}`, new Date().toISOString().split("T")[0]],
        ...prev.transactions
      ]
    }));
    flash(`Credit bundle ${packName} completed! Mapped to billing account.`);
  };

  return (
    <>
      <Header title="Billing Ledger" subtitle="Purchase credit units for automated dialing or audit invoice transactions.">
      </Header>

      <div className="metrics four">
        <Metric label="Current Balance" value={`${data.credits.toLocaleString()} units`} hint="Audio minutes allocation" icon={CircleDollarSign} />
        <Metric label="Active License" value="Pro Tier" hint="Renewing next month" icon={ShieldCheck} />
        <Metric label="Transactions Run" value={data.transactions.length} hint="Past receipts loaded" icon={Activity} />
        <Metric label="Invoicing Stack" value="Automatic" hint="Auto-generates receipts" icon={ShieldCheck} />
      </div>

      <div className="split">
        <Panel title="Telemetry Credit Bundles" subtitle="Purchase bundles using Stripe, Razorpay, or PayPal simulator.">
          <div style={{display:"grid", gap: 12}}>
            {[
              ["Starter Package", 100, "$9.99"],
              ["Business Package", 1000, "$84.99"],
              ["Professional Pool", 2500, "$199.99"]
            ].map(([name, count, price]) => (
              <div key={name} className="pack">
                <div>
                  <h4>{name}</h4>
                  <p className="muted" style={{fontSize: 12.5}}>Get {count} automated minutes for voice screenings.</p>
                </div>
                <b>{price}</b>
                <button className="primary small" onClick={() => handlePurchaseCredits(name, count, price)}>Complete Bundle Purchase</button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Platform Transactions History" subtitle="Invoices synced automatically.">
          <DataTable
            headers={["Ledger Direction", "Description", "Value", "Billing Date"]}
            rows={data.transactions.map((r, idx) => [
              <Badge tone={r[0] === "Credit" ? "green" : "red"}>{r[0]}</Badge>,
              <b>{r[1]}</b>,
              <span style={{fontWeight:800}}>{r[2]}</span>,
              r[3]
            ])}
          />
        </Panel>
      </div>
    </>
  );
}

function Admin({ data, setModal }) {
  const [cpu, setCpu] = useState(42);
  const [ram, setRam] = useState(1.8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpu((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(20, Math.min(85, prev + delta));
      });
      setRam((prev) => {
        const delta = (Math.random() * 0.2) - 0.1;
        return parseFloat(Math.max(1.2, Math.min(3.4, prev + delta)).toFixed(2));
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Header title="Admin Console" subtitle="Monitor platform system utilization, multi-tenant instances, and credential routing rules.">
        <button className="primary" onClick={() => setModal("systemSettings")}><Settings size={15} />Platform Settings</button>
      </Header>

      <div className="metrics four">
        <Metric label="SaaS Tenant Instances" value="12 accounts" hint="Isolated data spaces" icon={Users} />
        <Metric label="System CPU Utilization" value={`${cpu}%`} hint="Fluctuating sandbox telemetry" icon={Gauge} />
        <Metric label="Memory Usage RAM" value={`${ram} GB`} hint="Platform allocations" icon={Activity} />
        <Metric label="Service Core Pools" value="Healthy" hint="OpenAI connection: OK" icon={ShieldCheck} />
      </div>

      <div className="split">
        <Panel title="Platform Workspace Users" subtitle="Authorized recruiter accounts.">
          <DataTable
            headers={["Administrator Name", "Email Identity", "Scoped License Role", "Activity Status", "Action"]}
            rows={data.adminUsers.map(r => [
              <b>{r[0]}</b>,
              r[1],
              r[2],
              <Badge tone="green">{r[3]}</Badge>,
              <button className="secondary small" onClick={() => setModal("userEditor")}>Configure Access</button>
            ])}
          />
        </Panel>

        <Panel title="System Controls Interface" subtitle="Interactive sandbox rules toggles.">
          <div className="control-grid">
            {["SMTP Configuration Status", "Stripe payment secret keys", "Default LLM deployment model", "Call concurrency bounds", "Twilio SIP trunk routing rules", "Webhooks HMAC signatures"].map(x => (
              <button className="control" key={x} onClick={() => setModal("systemSettings")}>
                <ShieldCheck size={16} style={{color: "var(--blue)"}} />
                <span>{x}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function Plugins({ data, setModal }) {
  return (
    <>
      <Header title="Platform Integrations" subtitle="Authorize Swagger REST endpoints, Twilio trunk dialers, and payment routing layers.">
        <button className="primary" onClick={() => setModal("pluginInstall")}><Plus size={15} />Install Integration Core</button>
      </Header>
      
      <Panel title="Active Extension Frameworks">
        <DataTable
          headers={["Framework Name", "Operational Capabilities", "Installation Status", "Actions"]}
          rows={data.plugins.map(r => [
            <b>{r[0]}</b>,
            r[1],
            <Badge tone={r[2] === "Installed" ? "green" : "blue"}>{r[2]}</Badge>,
            <button className="secondary small" onClick={() => setModal("pluginConfig")}>Configure Stack</button>
          ])}
        />
      </Panel>
    </>
  );
}

// ---------------- DIALOG MODALS ----------------

function Modal({ ctx }) {
  const { modal, setModal, flash } = ctx;
  
  const type = typeof modal === "string" ? modal : modal?.type;
  
  const close = () => setModal(null);
  const done = (msg) => { close(); flash(msg); };

  const titles = {
    job: "Post New Recruitment Role",
    candidate: "Add New Candidate Profile",
    agent: "Configure Screening Agent Persona",
    agentWizard: "Conversational Agent Design Wizard",
    url: "Embed URL Web Hook Link",
    files: "Add Asset Document File",
    text: "Add Raw Manual Text Asset",
    interview: "Schedule screening appointment",
    phone: "Acquire Sandbox Dialer Number",
    flow: "Create Flow Script Schema",
    canvas: "Visual Interview Flow Canvas Screen",
    candidateProfile: "Candidate Details & Audio Dialer Simulator",
    jobDetails: "Job Evaluation Matching Configurations",
    screeningRun: "AI Screener evaluation parsing runs",
    widget: "Integrate Careers widget Overlay",
    apiKey: "Issue REST API authentication tokens",
    userEditor: "Configure Administrator Role Scope",
    pluginInstall: "Authorize Framework integrations",
    pluginConfig: "Extension details config",
    systemSettings: "System SMTP & Core properties",
    callTranscript: "Audio call transcription history logs",
    voiceTest: "Synthesizer Auditory Test Panel",
    reportExport: "Export platform summary sheet",
    candidateExport: "Export applicant ledger",
    knowledgePreview: "Vector Knowledge Asset Preview",
    flowTest: "Sandbox Dialogue Flow simulator",
    sipTrunk: "Configure custom enterprise SIP trunks"
  };

  const isWide = ["canvas", "candidateProfile", "callTranscript", "screeningRun"].includes(type);

  return (
    <div className="modal-backdrop" onClick={(e) => e.target.className === "modal-backdrop" && close()}>
      <section className={`modal ${isWide ? "wide" : ""}`}>
        <header>
          <h2>{titles[type] || "Interactive Sandbox Dialog"}</h2>
          <button className="icon-button" style={{width: 32, height: 32}} onClick={close}><X size={16} /></button>
        </header>
        <div className="modal-body">
          <ModalContent type={type} payload={modal} ctx={ctx} done={done} close={close} />
        </div>
      </section>
    </div>
  );
}

function ModalContent({ type, payload, ctx, done, close }) {
  const { data, setData, setModal } = ctx;

  if (type === "job") {
    return (
      <div className="form-grid">
        <label className="span2">Posting Title <input placeholder="e.g. Senior QA Engineer" id="j_title" /></label>
        <label>Job Department <input placeholder="e.g. Quality Assurance" id="j_dept" /></label>
        <label>Hiring Office Location <input placeholder="e.g. remote / Austin, TX" id="j_loc" /></label>
        <label>Screening Evaluation Threshold (%) <input type="number" defaultValue="75" id="j_thresh" /></label>
        <label>Assigned Bot Agent
          <select id="j_agent">{data.agents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}</select>
        </label>
        <footer className="span2">
          <button className="secondary" onClick={close}>Cancel</button>
          <button className="primary" onClick={() => {
            const title = document.getElementById("j_title").value;
            const dept = document.getElementById("j_dept").value;
            const loc = document.getElementById("j_loc").value;
            const thresh = Number(document.getElementById("j_thresh").value) || 75;
            const agentName = document.getElementById("j_agent").value;
            if (!title) return;
            
            const newJ = {
              id: `j_${Date.now()}`,
              title,
              category: dept,
              location: loc,
              source: "Direct",
              status: "active",
              agent: agentName,
              applicants: 0,
              reviews: 0,
              interviews: 0,
              rejected: 0,
              visible: true,
              threshold: thresh,
              weights: [40, 35, 25]
            };
            setData(prev => ({ ...prev, jobs: [...prev.jobs, newJ] }));
            done("New position successfully published!");
          }}>Publish Position</button>
        </footer>
      </div>
    );
  }

  if (type === "candidate") {
    return (
      <div className="form-grid">
        <label className="span2">Candidate Name <input placeholder="Elena Rostova" id="c_name" /></label>
        <label>Email Identity <input placeholder="elena@rostov.net" id="c_email" /></label>
        <label>Screening Number <input placeholder="+91 94819 22001" id="c_phone" /></label>
        <label>Hiring Post Target
          <select id="c_job">{data.jobs.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}</select>
        </label>
        <label>Match Evaluation Rating <input type="number" defaultValue="80" id="c_score" /></label>
        <footer className="span2">
          <button className="secondary" onClick={close}>Cancel</button>
          <button className="primary" onClick={() => {
            const name = document.getElementById("c_name").value;
            const email = document.getElementById("c_email").value;
            const phone = document.getElementById("c_phone").value;
            const jobTitle = document.getElementById("c_job").value;
            const score = Number(document.getElementById("c_score").value) || 80;
            if (!name || !email) return;

            const targetJob = data.jobs.find(j => j.title === jobTitle) || data.jobs[0];

            const newC = {
              id: `c_${Date.now()}`,
              name,
              job: jobTitle,
              email,
              phone,
              stage: "Uploaded",
              score,
              tech: Math.min(score + 3, 100),
              communication: Math.min(score - 4, 100),
              culture: Math.min(score + 2, 100),
              source: "Direct",
              recommendation: score >= targetJob.threshold ? "Advance" : "Hold"
            };

            setData(prev => ({
              ...prev,
              candidates: [...prev.candidates, newC],
              jobs: prev.jobs.map(j => j.title === jobTitle ? { ...j, applicants: j.applicants + 1 } : j)
            }));
            done("Candidate profile successfully created!");
          }}>Create Profile</button>
        </footer>
      </div>
    );
  }

  if (type === "agent") {
    return (
      <div className="form-grid">
        <label className="span2">Agent Display Name <input placeholder="Technical Interview Bot" id="a_name" /></label>
        <label>Synthesis Voice Option
          <select id="a_voice">
            <option>Sarah - Mature, Reassuring, Confident</option>
            <option>Bella - Professional, Bright, Warm</option>
            <option>Daniel - Steady Broadcaster</option>
          </select>
        </label>
        <label>Primary Language <input placeholder="English" defaultValue="English" id="a_lang" /></label>
        <label>Deployment LLM Stacks
          <select id="a_engine">
            <option>OpenAI GPT-4o Realtime</option>
            <option>ElevenLabs Reader</option>
            <option>OpenAI GPT-4o mini</option>
          </select>
        </label>
        <label>Call Conduct Tone <input placeholder="Confident, inquiring..." defaultValue="Confident & Clear" id="a_tone" /></label>
        <label className="span2">Core Heuristics Prompt Input
          <textarea placeholder="e.g. Conduct screening on developer profiles, focusing on API design..." defaultValue="Assess applicant competencies." id="a_prompt" />
        </label>
        <footer className="span2">
          <button className="secondary" onClick={close}>Cancel</button>
          <button className="primary" onClick={() => {
            const name = document.getElementById("a_name").value;
            const voice = document.getElementById("a_voice").value;
            const lang = document.getElementById("a_lang").value;
            const engine = document.getElementById("a_engine").value;
            const tone = document.getElementById("a_tone").value;
            const prompt = document.getElementById("a_prompt").value;
            if (!name) return;

            const newA = {
              id: `a_${Date.now()}`,
              name,
              voice,
              lang,
              engine,
              tone,
              incoming: true,
              prompt
            };
            setData(prev => ({ ...prev, agents: [...prev.agents, newA] }));
            done("Hiring agent configured successfully!");
          }}>Publish Agent</button>
        </footer>
      </div>
    );
  }

  if (type === "candidateProfile") {
    const candidateId = payload?.candidateId;
    const candName = payload?.candidateName;
    const c = data.candidates.find(item => item.id === candidateId || item.name === candName) || data.candidates[0];

    return <CallSimulator candidate={c} ctx={ctx} done={done} close={close} />;
  }

  if (type === "screeningRun") {
    return (
      <div>
        <div className="processing-hero">
          <Sparkles size={34} style={{color: "var(--blue)"}} />
          <div>
            <h3>Weighted AI Evaluation Run</h3>
            <p>Conduct score calculations across all active applicant registries.</p>
          </div>
        </div>
        <DataTable
          headers={["Candidate Profile", "Hiring Target Role", "Core Tech rating", "Communication Score", "Match Rating", "Action Recommendation"]}
          rows={data.candidates.map(c => [
            <b>{c.name}</b>,
            c.job,
            `${c.tech}%`,
            `${c.communication}%`,
            <Score value={c.score} />,
            <Badge tone={c.recommendation === "Advance" ? "green" : "amber"}>{c.recommendation}</Badge>
          ])}
        />
        <footer>
          <button className="primary" onClick={() => done("Cohort evaluated successfully!")}>Finish Run</button>
        </footer>
      </div>
    );
  }

  if (type === "callTranscript") {
    const candName = payload?.candidateName;
    const c = data.candidates.find(item => item.name === candName) || data.candidates[0];

    return (
      <div>
        <div className="call-card">
          <PhoneCall size={28} style={{color: "var(--blue)"}} />
          <div>
            <h3>Audio Call Dialogue Logs</h3>
            <p>Candidate: {c.name} • Assigned Bot: Technical Interview Bot</p>
          </div>
        </div>
        <Panel title="Dialogue Transcript" subtitle="Speech-to-text conversion.">
          <div style={{display: "grid", gap: 10}}>
            <p><b>Agent:</b> Hi {c.name}, thanks for taking the call today. Let's start with a systems design overview.</p>
            <p><b>{c.name}:</b> Absolutely! I developed an event-driven telemetry stream using queue backpressure to optimize ingestion rates.</p>
            <p><b>Agent:</b> Outstanding. How did you handle schema compatibility across deployments?</p>
            <p><b>{c.name}:</b> We bound strict validation specs to our schema gateways with automated redial notifications on mismatch.</p>
          </div>
        </Panel>
        <footer>
          <button className="primary" onClick={close}>Done</button>
        </footer>
      </div>
    );
  }

  if (type === "knowledgePreview") {
    return (
      <div>
        <Panel title={payload.name} subtitle="Asset Summary & Metadata Index.">
          <p className="muted" style={{lineHeight: 1.5, fontSize:13.5}}>
            This vectorized knowledge asset is fully embedded within the vector db. Agents automatically query this schema to answer candidate queries regarding vacation allocations, basic payroll details, or technology configurations.
          </p>
          <div className="chips">
            <Badge tone="green">Vector Synced</Badge>
            <Badge tone="violet">{payload.text || "4.2 KB"} Allocated</Badge>
          </div>
        </Panel>
        <footer>
          <button className="primary" onClick={close}>Close</button>
        </footer>
      </div>
    );
  }

  if (type === "canvas") {
    const flowId = payload?.flowId;
    const flow = data.flows.find(f => f.id === flowId) || data.flows[0];
    return <InteractiveCanvas flow={flow} ctx={ctx} done={done} close={close} />;
  }

  if (type === "flowTest") {
    return (
      <div>
        <Panel title="Dialogue Flow Simulator Sandbox" subtitle="Simulate interview branching questions inside this sandbox.">
          <div className="chat-demo">
            <div className="chat-msg agent">Hi candidate, welcome to the interview flow screening. Are you ready?</div>
            <div className="chat-msg candidate">Yes, I am fully prepared to begin!</div>
            <div className="chat-msg agent">Great! Tell me about a time you handled schema failures under concurrent loads.</div>
          </div>
        </Panel>
        <footer>
          <button className="primary" onClick={() => done("Flow evaluation preview complete")}>Complete Sandbox Test</button>
        </footer>
      </div>
    );
  }

  if (type === "voiceTest") {
    return (
      <div style={{textAlign:"center", padding:"10px 0"}}>
        <Mic2 size={40} className="pulse" style={{margin:"0 auto 14px", color: "var(--blue)"}} />
        <h3>Synthesized Auditory Audition Preview</h3>
        <p className="muted" style={{fontSize: 13, padding: "0 24px"}}>
          "Welcome to the AgentHR sandbox environment. Synthesis engines are active and validating latency levels."
        </p>
        <footer>
          <button className="secondary" onClick={() => ctx.flash("Audition sample replayed")}>Replay Audio</button>
          <button className="primary" onClick={() => done("Voice sample confirmed!")}>Done</button>
        </footer>
      </div>
    );
  }

  if (type === "reportExport" || type === "candidateExport") {
    return (
      <div>
        <Panel title="CSV Summary Sheet Ready" subtitle="Simulated export package for client meeting.">
          <DataTable
            headers={["Document Name", "Rows", "Format", "Status"]}
            rows={[[type === "reportExport" ? "platform_report_may_2026.pdf" : "candidate_ledger_sheets.csv", "42 columns", type === "reportExport" ? "PDF Report" : "CSV Ingestion", <Badge tone="green">Ready</Badge>]]}
          />
        </Panel>
        <footer>
          <button className="primary" onClick={() => done("Report downloaded successfully!")}>Download File</button>
        </footer>
      </div>
    );
  }

  // Fallback generic form
  return <GenericForm type={type} done={done} close={close} />;
}

function GenericForm({ type, done, close }) {
  const fields = {
    url: ["URL Endpoint Link", "Namespace Display", "Sync Ingestion rate"],
    files: ["Document Attachment File", "Extraction Rules", "AI Chunking bounds"],
    text: ["Asset Title Namespace", "Raw Heuristic Text", "Agent Scopes Mapping"],
    interview: ["Target Candidate", "Target Job Posting", "Slot Appointment Date"],
    phone: ["Twilio/Plivo Provider Trunk", "Dialer Phone Number", "Binding Target Agent"],
    flow: ["Flow Namespace", "Operational Description", "Template Schema Mapping"],
    apiKey: ["Key Name token", "scopes authorization mapping", "Daily call rate caps"],
    userEditor: ["Administrator Username", "Email Identity", "Sandbox License Role"],
    pluginInstall: ["Framework Hub URL", "Authorized scopes", "Compliance triggers"],
    pluginConfig: ["Configuration API keys", "Provider Endpoint routing mappings"],
    systemSettings: ["SMTP Ingress Gateway Host", "Stripe API Webhook token key", "System maximum duration"],
    sipTrunk: ["SIP Registrar Domain", "Auth Credentials Username", "Redundant Fallback Trunk"]
  }[type] || ["Configuration Property"];

  return (
    <div className="form-grid">
      {fields.map(f => (
        <label className={f.includes("Text") || f.includes("Heuristic") ? "span2" : ""} key={f}>
          {f}
          {f.includes("Text") || f.includes("Heuristic") ? <textarea placeholder={f} /> : <input placeholder={f} />}
        </label>
      ))}
      <footer className="span2">
        <button className="secondary" onClick={close}>Cancel</button>
        <button className="primary" onClick={() => done("Settings updated successfully!")}>Save Config</button>
      </footer>
    </div>
  );
}

// ---------------- DYNAMIC SIMULATOR COMPONENTS ----------------

function CallSimulator({ candidate, ctx, done, close }) {
  const [callState, setCallState] = useState("idle"); // idle, ringing, answered, scorecard
  const [chatLog, setChatLog] = useState([]);
  const [creditsLeft, setCreditsLeft] = useState(ctx.data.credits);

  const simulateCall = () => {
    setCallState("ringing");
    
    // Ringing for 2s, then answer
    setTimeout(() => {
      setCallState("answered");
      
      const dialogue = [
        { type: "agent", text: `Hi ${candidate.name}, this is Sarah from AgentHR. Thanks for taking my call today! Let's start with a systems design overview.` },
        { type: "candidate", text: `Hi Sarah! Absolutely. I designed a real-time ingestion service using queue backpressure to optimize throughput under concurrent loads.` },
        { type: "agent", text: "Impressive. Kafka is great for backpressure. How did you handle schema drift when schemas changed?" },
        { type: "candidate", text: "We implemented validation layers at our source gateways with automated alerts on schema mismatch." },
        { type: "agent", text: "Outstanding. That's a highly resilient approach. Let's talk about team culture—how do you handle disagreements?" },
        { type: "candidate", text: "I focus on benchmarks and data. We run quick prototypes to let metrics decide rather than opinions." },
        { type: "agent", text: `Well, ${candidate.name}, you've done exceptionally well. I'm ending the call now and compiling your scorecard. Talk soon!` }
      ];

      let delay = 1000;
      dialogue.forEach((msg, idx) => {
        setTimeout(() => {
          setChatLog(prev => [...prev, msg]);
          
          // Scroll to bottom
          const container = document.getElementById("chat_sim");
          if (container) container.scrollTop = container.scrollHeight;

          // End call on last message
          if (idx === dialogue.length - 1) {
            setTimeout(() => {
              setCallState("scorecard");
              
              // Debit credits & save call history
              ctx.setData(prev => {
                const updatedCredits = prev.credits - 1;
                const newCall = [
                  candidate.name,
                  "Completed",
                  "1m 24s",
                  "0",
                  new Date().toISOString().replace("T", " ").slice(0, 19),
                  `Evaluated score: 86/100. Technical skills: 91%. Recommendation: Advance.`
                ];
                
                // Promote candidate stage automatically
                const updatedCandidates = prev.candidates.map(item =>
                  item.id === candidate.id ? { ...item, stage: "Interviewed", score: 86, recommendation: "Advance" } : item
                );

                return {
                  ...prev,
                  credits: updatedCredits,
                  calls: [newCall, ...prev.calls],
                  candidates: updatedCandidates
                };
              });
              ctx.flash("Credit balance debited: 1 credit unit.");
            }, 2500);
          }
        }, delay);
        delay += msg.type === "agent" ? 3500 : 4500;
      });

    }, 2000);
  };

  return (
    <div>
      {callState === "idle" && (
        <div style={{textAlign:"center", padding: "20px 0"}}>
          <PhoneCall size={48} className="pulse" style={{margin: "0 auto 16px", color: "var(--green)"}} />
          <h3>Initiate voice screening call to {candidate.name}?</h3>
          <p className="muted" style={{maxWidth: 420, margin: "0 auto 18px", fontSize: 13.5}}>
            This triggers the real-time AI Voice Dialer Simulator. Watch the conversation flow, check automated credit debiting, and review post-call evaluation scorecards.
          </p>
          <div className="badge gray" style={{marginBottom: 20}}>Phone routing line: {candidate.phone}</div>
          
          <footer>
            <button className="secondary" onClick={close}>Cancel</button>
            <button className="primary" onClick={simulateCall}>Connect Simulated Call</button>
          </footer>
        </div>
      )}

      {callState === "ringing" && (
        <div style={{textAlign:"center", padding: "20px 0"}}>
          <Phone size={44} className="pulse" style={{margin: "0 auto 16px", color: "var(--amber)"}} />
          <h3>Dialing {candidate.name}...</h3>
          <p className="muted">Connecting session vectors via Twilio SIP trunks...</p>
        </div>
      )}

      {callState === "answered" && (
        <div>
          <div className="call-card">
            <div className="waveform">
              <i /><i /><i /><i /><i /><i /><i />
            </div>
            <div>
              <h3>AI screening call in progress</h3>
              <p>Candidate: {candidate.name} • Target Role: {candidate.job}</p>
              <Badge tone="green">Speech-to-Text translation active</Badge>
            </div>
          </div>

          <Panel title="Dialogue Transcript Sandbox" subtitle="Real-time conversational logging.">
            <div className="chat-demo" id="chat_sim" style={{minHeight: 220, maxHeight: 220}}>
              {chatLog.map((msg, i) => (
                <div className={`chat-msg ${msg.type}`} key={i}>
                  <b>{msg.type === "agent" ? "Sarah (AI Bot):" : `${candidate.name}:`}</b>
                  <p style={{margin: "4px 0 0"}}>{msg.text}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {callState === "scorecard" && (
        <div>
          <div className="processing-hero">
            <Sparkles size={34} style={{color: "var(--green)"}} />
            <div>
              <h3>Post-Call AI Match Evaluation</h3>
              <p>Scores compiled based on dialogue vectors successfully.</p>
            </div>
          </div>

          <div className="score-cards">
            <Insight label="Overall Match" value="86/100" />
            <Insight label="Technical Skills" value="91%" />
            <Insight label="Communications" value="82%" />
            <Insight label="Recommendation" value="Advance" />
          </div>

          <Panel title="Strengths & Weaknesses Evaluation" subtitle="Parsed competencies summary.">
            <div className="split-list">
              <ul>
                <li>Demonstrated exceptional clarity regarding queue design and Kafka backpressure layers.</li>
                <li>Clear architectural reasoning with high validation thresholds.</li>
              </ul>
              <ul>
                <li>Evaluate high availability configurations under heavy replication rates.</li>
                <li>Validate cluster sizing experience.</li>
              </ul>
            </div>
          </Panel>

          <footer>
            <button className="primary" onClick={() => done("Evaluation compiled & candidate pipeline promoted!")}>Archive Call & Complete</button>
          </footer>
        </div>
      )}
    </div>
  );
}

function InteractiveCanvas({ flow, ctx, done, close }) {
  const [nodes, setNodes] = useState(flow.nodes || []);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodePrompt, setNodePrompt] = useState("");

  const addNode = (type) => {
    const colors = { Message: "var(--blue)", Question: "var(--violet)", Condition: "var(--amber)", Action: "var(--green)", Transfer: "var(--violet)" };
    const newN = {
      id: `n_${Date.now()}`,
      type,
      title: `Custom ${type} node`,
      x: 100 + Math.random() * 150,
      y: 100 + Math.random() * 150,
      prompt: "Configure this node variable."
    };
    setNodes(prev => [...prev, newN]);
    ctx.flash(`${type} node created on canvas`);
  };

  const handleNodeClick = (n) => {
    setSelectedNodeId(n.id);
    setNodePrompt(n.prompt);
  };

  const updateNodePrompt = (val) => {
    setNodePrompt(val);
    setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, prompt: val } : n));
  };

  const saveCanvas = () => {
    ctx.setData(prev => ({
      ...prev,
      flows: prev.flows.map(item => item.id === flow.id ? { ...item, nodes, nodesCount: nodes.length } : item)
    }));
    done("Flow sequence schema saved!");
  };

  return (
    <div>
      <div className="flow-toolbar">
        <button className="secondary small" onClick={() => addNode("Message")}><Plus size={13} />Message Node</button>
        <button className="secondary small" onClick={() => addNode("Question")}><Plus size={13} />Question Node</button>
        <button className="secondary small" onClick={() => addNode("Condition")}><Plus size={13} />Condition Node</button>
        <button className="secondary small" onClick={() => addNode("Action")}><Plus size={13} />Action Node</button>
        <button className="secondary small" onClick={() => addNode("Transfer")}><Plus size={13} />Transfer Node</button>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1fr 280px", gap: 14}}>
        <div className="canvas">
          {nodes.map(n => (
            <div
              className={`node ${n.type.toLowerCase()} ${selectedNodeId === n.id ? "selected" : ""}`}
              style={{left: n.x, top: n.y, borderStyle: selectedNodeId === n.id ? "dashed" : "solid", borderColor: selectedNodeId === n.id ? "var(--blue)" : ""}}
              key={n.id}
              onClick={() => handleNodeClick(n)}
            >
              <Badge tone={n.type === "Condition" ? "amber" : n.type === "Action" ? "green" : n.type === "Transfer" ? "violet" : "blue"}>{n.type}</Badge>
              <h3>{n.title}</h3>
              <p>{n.prompt}</p>
            </div>
          ))}
          
          {nodes.length === 0 && (
            <div className="empty">
              <h3>Flow Builder Canvas Empty</h3>
              <p>Add nodes using the toolbar above to map dialogue sequences.</p>
            </div>
          )}
        </div>

        <Panel title="Node Configurator" subtitle="Manage prompt heuristics.">
          {selectedNodeId ? (
            <div style={{display: "grid", gap: 10}}>
              <label>Node Content / Evaluation Spec
                <textarea value={nodePrompt} onChange={(e) => updateNodePrompt(e.target.value)} />
              </label>
              <button className="danger small" onClick={() => {
                setNodes(prev => prev.filter(n => n.id !== selectedNodeId));
                setSelectedNodeId(null);
                ctx.flash("Node deleted");
              }}>Delete Node</button>
            </div>
          ) : (
            <p className="muted" style={{fontSize: 12.5}}>Click any layout node inside the canvas to edit properties.</p>
          )}
        </Panel>
      </div>

      <footer>
        <button className="secondary" onClick={close}>Cancel</button>
        <button className="primary" onClick={saveCanvas}>Save Flow Script Schema</button>
      </footer>
    </div>
  );
}

function DataTable({ headers, rows }) {
  if (!rows || !rows.length) return <Empty title="Registry Empty" text="No items match your active filters." />;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              {r.map((cell, cidx) => <td key={cidx}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ children, tone = "blue" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Score({ value }) {
  return (
    <div className="score">
      <span>{value}</span>
      <div><i style={{width: `${value}%`}} /></div>
    </div>
  );
}

function Weight({ label, value }) {
  const [val, setVal] = useState(value);
  return (
    <div className="weight">
      <div>
        <b>{label}</b>
        <span style={{color: "var(--blue)"}}>{val}%</span>
      </div>
      <input type="range" min="0" max="100" value={val} onChange={(e) => setVal(e.target.value)} style={{accentColor: "var(--blue)", cursor:"pointer"}} />
    </div>
  );
}

function CodeBlock({ title, code }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(code);
    } catch(_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="code-block">
      <div>
        <b>{title}</b>
        <button className="secondary small" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy Tag"}
        </button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

function Empty({ title, text }) {
  return (
    <div className="empty">
      <FileText size={32} style={{color: "var(--muted)"}} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Insight({ label, value }) {
  return (
    <div className="insight">
      <small className="muted" style={{fontWeight: 700, textTransform: "uppercase", fontSize:10, letterSpacing: "0.03em"}}>{label}</small>
      <b>{value}</b>
    </div>
  );
}

function Timeline({ items }) {
  return (
    <ol className="timeline">
      {items.map((x, idx) => (
        <li key={idx}>
          <span>{idx + 1}</span>
          <p>{x}</p>
        </li>
      ))}
    </ol>
  );
}

function Tabs({ items, value, onChange }) {
  const [selected, setSelected] = useState(0);
  
  const handleSelect = (idx, item) => {
    setSelected(idx);
    if (onChange) onChange(idx, item);
  };
  
  const activeIdx = value !== undefined ? (typeof value === "number" ? value : items.findIndex(x => x.toLowerCase() === String(value).toLowerCase())) : selected;

  return (
    <div className="tabs">
      {items.map((x, i) => (
        <button key={x} className={i === activeIdx ? "selected" : ""} onClick={() => handleSelect(i, x)}>
          {x}
        </button>
      ))}
    </div>
  );
}

function Toolbar({ query = "", setQuery = () => {}, placeholder = "Search...", select }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="toolbar-wrap">
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} />
        </div>
        {select && (
          <select style={{maxWidth: 160}}>
            <option>{select}</option>
          </select>
        )}
        <button className="secondary" onClick={() => setOpen(!open)}>
          <Filter size={16} /><span>Filter</span>
        </button>
      </div>
      {open && (
        <div className="inline-filter">
          <Field label="Filter Status" as="select" />
          <Field label="Created Date Range" type="date" />
          <Field label="Assigned Recruiter Owner" as="select" />
          <button className="primary small" onClick={() => setOpen(false)} style={{marginTop: 10}}>Apply Filters</button>
        </div>
      )}
    </div>
  );
}

function Field({ label, textarea, as, type = "text", placeholder }) {
  return (
    <label className={textarea ? "span2" : ""}>
      {label}
      {textarea ? (
        <textarea placeholder={placeholder || label} />
      ) : as === "select" ? (
        <select>
          <option>Show All</option>
          <option>Active/Ready</option>
          <option>Pending/Draft</option>
        </select>
      ) : (
        <input type={type} placeholder={placeholder || label} />
      )}
    </label>
  );
}

function Plan({ name, price, detail, features, active, onClick }) {
  return (
    <article className={`plan ${active ? "current" : ""}`}>
      <Badge tone={active ? "green" : "gray"}>{active ? "Active Plan" : "Available Tier"}</Badge>
      <h2 style={{fontSize: 24, fontWeight: 800, margin: "14px 0 6px"}}>{name}</h2>
      <p className="muted" style={{fontSize: 13.5, margin: "0 0 16px"}}>{name === "Free Tier" ? "Explore base functionalities." : "Enterprise automation tier."}</p>
      <div className="price">{price}<span>{detail}</span></div>
      <div style={{display: "grid", gap: 10, margin: "24px 0"}}>
        {features.map(f => <p className="check" key={f} style={{margin:0}}>✓ {f}</p>)}
      </div>
      <button className={active ? "secondary full" : "primary full"} onClick={onClick}>{active ? "Current Plan Active" : "Request Tier Shift"}</button>
    </article>
  );
}

// ---------------- MOUNT ENTRY ----------------

createRoot(document.getElementById("root")).render(<App />);
