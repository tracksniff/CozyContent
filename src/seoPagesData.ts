export interface SEOPageContentSection {
  title: string;
  subtitle?: string;
  points?: string[];
  description?: string;
  image?: string;
}

export interface SEOPageInfo {
  url: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  industry: string;
  location?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  checklist?: string[];
  sections?: SEOPageContentSection[];
  demos?: { name: string; url: string; image: string }[];
}

// Plumbers
import p1 from "./assets/plumbers/asian-plumber-blue-overalls-clearing-blockage-drain.jpg";
import p2 from "./assets/plumbers/household-repair-middle-aged-man-inspecting-pipe-touching-hand-sink-stylish-modern-kitchen.jpg";
import p3 from "./assets/plumbers/male-plumber-working-fix-problems-client-s-house.jpg";
import p4 from "./assets/plumbers/man-installs-heating-system-house-checks-pipes-with-wrench.jpg";
import p5 from "./assets/plumbers/plumber-man-fixing-kitchen-sink.jpg";

// Industry Images (Pexels URLs)
const c1 = "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg";
const c2 = "https://images.pexels.com/photos/4099467/pexels-photo-4099467.jpeg";
const c3 = "https://images.pexels.com/photos/4098524/pexels-photo-4098524.jpeg";
const c4 = "https://images.pexels.com/photos/4098580/pexels-photo-4098580.jpeg";
const c5 = "https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg";

// Electricians
import e1 from "./assets/electrician/electrical-technician-working-switchboard-with-fuses.jpg";
import e2 from "./assets/electrician/male-electrician-working-electrical-panel-male-electrician-overalls.jpg";
import e3 from "./assets/electrician/male-electrician-works-switchboard-with-electrical-connecting-cable (1).jpg";
import e4 from "./assets/electrician/male-electrician-works-switchboard-with-electrical-connecting-cable.jpg";
import e5 from "./assets/electrician/man-electrical-technician-working-switchboard-with-fuses.jpg";

const l1 = "https://images.pexels.com/photos/101808/pexels-photo-101808.jpeg";
const l2 = "https://images.pexels.com/photos/4239113/pexels-photo-4239113.jpeg";
const l3 = "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg";
const l4 = "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg"; // Note: Shared ID check
const l5 = "https://images.pexels.com/photos/4246202/pexels-photo-4246202.jpeg";

const r1 = "https://images.pexels.com/photos/4569340/pexels-photo-4569340.jpeg";
const r2 = "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg";
const r3 = "https://images.pexels.com/photos/4246011/pexels-photo-4246011.jpeg";
const r4 = "https://images.pexels.com/photos/4246091/pexels-photo-4246091.jpeg";
const r5 = "https://images.pexels.com/photos/4246119/pexels-photo-4246119.jpeg";

// Roofers
import ro1 from "./assets/roofers/bottom-view-worker-sitting-brick-wall.jpg";
import ro2 from "./assets/roofers/construction-worker.jpg";
import ro3 from "./assets/roofers/man-working-roof-front-view.jpg";
import ro4 from "./assets/roofers/people-renovating-house-concept.jpg";
import ro5 from "./assets/roofers/portrait-construction-worker-standing-rooftops-high-silos-storage-tanks.jpg";

const industryImages = {
  Plumbing: [p1, p2, p3, p4, p5],
  Electrical: [e1, e2, e3, e4, e5],
  Roofing: [ro1, ro2, ro3, ro4, ro5],
  Locksmith: [l1, l2, l3, l4, l5],
  Cleaning: [c1, c2, c3, c4, c5],
  Removals: [r1, r2, r3, r4, r5],
};

const industryDemos = {
  Plumbing: [
    { name: "EcoFlow Plumbing", url: "https://demo-plumber-1.vercel.app/", image: p1 },
    { name: "Rapid Response Pipes", url: "https://demo-plumber-2.vercel.app/", image: p2 },
    { name: "Blue Diamond Heating", url: "https://demo-plumber-3.vercel.app/", image: p3 },
  ],
  Electrical: [
    { name: "VoltSafe Solutions", url: "https://electrical-demo-1.test", image: e1 },
    { name: "Bright Current Ltd", url: "https://electrical-demo-2.test", image: e2 },
    { name: "Zap Electrical Services", url: "https://electrical-demo-3.test", image: e3 },
  ],
  Roofing: [
    { name: "SkyGuard Roofing", url: "https://roofing-demo-1.test", image: ro1 },
    { name: "Peak Performance Roofs", url: "https://roofing-demo-2.test", image: ro2 },
    { name: "Durable Slate Co", url: "https://roofing-demo-3.test", image: ro3 },
  ],
  Locksmith: [
    { name: "SureLock Security", url: "https://locksmith-demo-1.test", image: l1 },
    { name: "QuickKey Responders", url: "https://locksmith-demo-2.test", image: l2 },
    { name: "Fortress Lock & Key", url: "https://locksmith-demo-3.test", image: l3 },
  ],
  Cleaning: [
    { name: "Sparkle & Shine Co", url: "https://cleaning-demo-1.test", image: c1 },
    { name: "Pristine Office Care", url: "https://cleaning-demo-2.test", image: c2 },
    { name: "EcoGreen Cleaners", url: "https://cleaning-demo-3.test", image: c3 },
  ],
  Removals: [
    { name: "SwiftMove Logistics", url: "https://removals-demo-1.test", image: r1 },
    { name: "Careful Carry Removals", url: "https://removals-demo-2.test", image: r2 },
    { name: "City to City Transit", url: "https://removals-demo-3.test", image: r3 },
  ],
};

const attachData = (pages: Record<string, SEOPageInfo>) => {
  Object.values(pages).forEach((page) => {
    const images = industryImages[page.industry as keyof typeof industryImages] || [];
    page.sections?.forEach((section, idx) => {
      section.image = images[idx % images.length];
    });
    page.demos = industryDemos[page.industry as keyof typeof industryDemos] || [];
  });
  return pages;
};

export const seoPagesData: Record<string, SEOPageInfo> = attachData({
  // Plumbing
  "plumber-web-design": {
    url: "plumber-web-design",
    keyword: "Web design for plumbers",
    metaTitle: "Website Design for Plumbers | From £59 Per Month",
    metaDescription:
      "We build high-converting websites for plumbers. Modern, fast and fully managed from 59 per month. Get more leads today.",
    industry: "Plumbing",
    heroTitle: "Website Design for Plumbers",
    heroSubtitle: "Get More Plumbing Jobs with a Website That Actually Converts",
    checklist: [
      "No upfront cost on our monthly plan",
      "Fully managed — hosting, maintenance, and updates",
      "Built to generate calls and quote requests",
    ],
    sections: [
      {
        title: "Why Your Plumbing Website Isn't Bringing in Leads",
        description:
          "A plumbing website that looks outdated or performs poorly doesn't just fail to impress — it actively drives customers away. In the time it takes a slow page to load, a potential customer has already hit back and called someone else.",
        points: [
          "Designs that haven't kept pace with customer expectations",
          "Page speeds that fail Google's Core Web Vitals",
          "Mobile layouts that are awkward to use on smartphones",
          "No clear call-to-action or way to request a quote",
          "Little to no local SEO — invisible to local customers",
          "Generic content that doesn't build local trust",
        ],
      },
      {
        title: "What You Get with a Cosy Content Plumber Website",
        description:
          "We don't just build websites — we build lead generation tools for your plumbing business. Every decision we make is made with one question in mind: will this help a local customer choose you?",
        points: [
          "Modern, Professional Design: Clean, trustworthy layouts designed specifically for plumbing businesses.",
          "Fast & Mobile-First: Capturing the majority of local plumbing searches which happen on phones.",
          "Built for Enquiries: Prominent phone numbers and quote request forms positioned where customers look.",
          "Fully Managed: Hosting, security patches, and maintenance all handled by our team.",
          "Ongoing Updates Included: Need to add a new service or update a price? We'll take care of it.",
          "Content Written for You: We write all the copy — service descriptions, location pages, and FAQs.",
        ],
      },
      {
        title: "Designed with SEO from Day One",
        description:
          "Your website isn't just built to look good — it's built to be found. Every plumber website we create is structured from the ground up to rank in local Google searches.",
        points: [
          "Technical SEO Foundations: Proper site structure and XML sitemaps for search engines.",
          "Local SEO Setup: Pages targeting your specific service areas and local search terms.",
          "Smart Schema Markup: LocalBusiness, Service, and FAQ schema for richer search results.",
          "Performance & Security: SSL certificates and caching for fast, secure browsing.",
        ],
      },
      {
        title: "How It Works",
        description:
          "We keep the process straightforward. Most plumber websites are live within a matter of days:",
        points: [
          "1. We build your site: We create a modern plumbing website tailored to your business — writing all the content, designing the layout, and setting up the full technical and SEO foundation.",
          "2. You review it: We share a preview link. If anything needs adjusting before launch, just say the word.",
          "3. We launch it: Your site goes live and begins working to generate enquiries. We handle the hosting setup and Google submission.",
          "4. We manage everything: From that point on, hosting, maintenance, security, and updates are all handled by our team — indefinitely.",
        ],
      },
      {
        title: "Who This Is For",
        description:
          "This service is built for plumbers who are serious about growing their business online. It works particularly well for:",
        points: [
          "Plumbers with outdated websites that aren't generating consistent enquiries",
          "New plumbing businesses that need to look established and credible from day one",
          "Sole traders who want a professional online presence without the hassle of managing it themselves",
          "Tradespeople who rely too heavily on word-of-mouth and want a more predictable source of leads",
          "Plumbing businesses looking to break into specific local search terms they're currently missing",
        ],
      },
    ],
  },
  "plumber-web-design-luton": {
    url: "plumber-web-design-luton",
    keyword: "Web design for plumbers in Luton",
    metaTitle: "Plumber Website Design Luton | From £59 per month",
    metaDescription:
      "Professional website design for plumbers in Luton. Modern, fast-loading sites from £59 per month.",
    industry: "Plumbing",
    location: "Luton",
    heroTitle: "Plumber Website Design Luton",
    heroSubtitle: "Turn Google searches into booked jobs — without lifting a finger",
    checklist: [
      "No upfront cost",
      "Fully managed — we handle everything",
      "Designed to generate calls and quote requests",
    ],
    sections: [
      {
        title: "Why Luton Plumbers Are Losing Work Online",
        description:
          "With so many tradespeople operating across Luton, the ones who consistently win new customers aren't necessarily the most experienced — they're the most visible. If your website looks tired, takes too long to load, or isn't optimised for mobile, you're giving those enquiries away.",
        points: [
          "Designs that haven't been updated in years — instantly undermining trust",
          "Pages that load too slowly on mobile, causing visitors to bounce",
          "No clear way for customers to call or request a quote quickly",
          "Little to no local SEO — invisible to Luton searches on Google",
          "Generic content that could belong to any plumber, anywhere",
        ],
      },
      {
        title: "What You Get with a Cosy Content Website",
        description:
          "Every site we build for Luton plumbers is a lead generation tool — not just a digital business card. Here's what's included as standard:",
        points: [
          "Professional Design: A clean, modern layout that builds confidence the moment someone lands on your page.",
          "Mobile-First Build: The majority of plumbing searches happen on phones. Your site will look and perform perfectly on every device.",
          "Calls to Action That Work: Prominent phone numbers, quote request buttons, and contact forms positioned where customers expect them.",
          "Fully Managed Service: Hosting, security, updates — all taken care of. You focus on the plumbing; we'll look after the website.",
          "Ongoing Changes Included: Need to add a new service area or update your pricing? Just drop us a message.",
        ],
      },
      {
        title: "Built Around How Luton Customers Search",
        description:
          "We know how people in Luton find a plumber. Whether they're dealing with a burst pipe at 11pm or shopping around for a bathroom installation, they search differently — and your website needs to speak to both. Your site will be structured to capture searches like emergency plumber Luton, boiler repair Luton, and local plumber near me — covering both urgent jobs and planned work.",
      },
      {
        title: "Local SEO Built In From the Start",
        description:
          "Ranking on Google in Luton takes more than having a website — it takes a site that's been built with search in mind from day one. Every site we create includes:",
        points: [
          "Technical Foundations: Fast page speeds to satisfy Google's Core Web Vitals, clean site structure, XML sitemaps.",
          "Luton-Specific Local SEO: Dedicated pages for the areas you cover across Luton, Google Business Profile optimisation guidance.",
          "Schema & Structured Data: LocalBusiness, Service and FAQ schema markup, llms.txt for visibility in AI-powered search tools.",
        ],
      },
      {
        title: "The Process — Simple from Start to Finish",
        points: [
          "1. We build your site: We design and write your new Luton plumbing website — no input needed from you beyond a few basic details.",
          "2. You review and approve: We'll send you a preview link. If anything needs tweaking, just say the word.",
          "3. It goes live: We handle the launch, the hosting setup, and the Google submission.",
          "4. We manage everything ongoing: Updates, security, changes — all handled as part of your plan.",
        ],
      },
    ],
  },
  "plumber-web-design-bedford": {
    url: "plumber-web-design-bedford",
    keyword: "Web design for plumbers in Bedford",
    metaTitle: "Plumber Website Design Bedford | Affordable & Fast",
    metaDescription:
      "Affordable websites for plumbers in Bedford. We build and manage your site so you can focus on jobs.",
    industry: "Plumbing",
    location: "Bedford",
    heroTitle: "Plumber Website Design Bedford",
    heroSubtitle: "Build local trust and win more jobs across Bedfordshire",
    checklist: ["No upfront cost", "Fully managed", "High-conversion design"],
    sections: [
      {
        title: "Bedford Plumbers Need a Competitive Edge",
        description:
          "The plumbing market in Bedford is competitive. To stand out, you need more than just being good at your trade — you need to be the easiest plumber to hire. If a customer can't find your number or book a quote in seconds, they'll call your competitor.",
        points: [
          "Outdated designs that fail to build immediate trust",
          "Slow loading speeds that annoy potential customers",
          "Hidden contact details or confusing navigation",
          "Poor ranking for 'plumber Bedford' or 'boiler repair Bedford'",
          "Websites that don't display properly on mobile phones",
        ],
      },
      {
        title: "Our Bedford-Focused Build Strategy",
        description:
          "We don't just build a website; we build a platform that speaks to Bedford customers.",
        points: [
          "Local Trust Elements: Highlighting your work across Bedford and Kempston.",
          "Mobile Optimization: Perfect performance for customers searching on the go.",
          "SEO Foundation: Targeting the specific search terms Bedford customers use.",
          "Managed Launch: We handle all the technical details so you don't have to.",
          "Ongoing Support: We're your outsourced web team, always available for changes.",
        ],
      },
      {
        title: "Covering Every Corner of Bedford",
        description:
          "Your site will be designed to rank not just in the town center, but in surrounding areas like Great Denham, Biddenham, and Wootton.",
      },
      {
        title: "How We Get You Live in Bedford",
        points: [
          "Design & Content Phase.",
          "Client Review.",
          "Live Launch.",
          "Continuous Management.",
        ],
      },
    ],
  },
  "plumber-web-design-dunstable": {
    url: "plumber-web-design-dunstable",
    keyword: "Web design for plumbers in Dunstable",
    metaTitle: "Plumber Website Design Dunstable | Get More Leads",
    metaDescription:
      "Outdated plumbing website? We design modern sites for plumbers in Dunstable. Fully managed, fast turnaround.",
    industry: "Plumbing",
    location: "Dunstable",
    heroTitle: "Plumber Website Design Dunstable",
    heroSubtitle: "Dominate the local Dunstable market with a modern website",
    checklist: ["No upfront cost", "Managed launch", "Lead-focused design"],
    sections: [
      {
        title: "Dunstable Customers Search Differently",
        description:
          "When people in Dunstable need a plumber, they want someone local, reliable, and fast. Your website needs to reflect these values immediately.",
        points: [
          "Not appearing for local Dunstable plumbing searches",
          "Sites that feel generic or corporate rather than local",
          "Missing trust signals like local reviews or area mentions",
          "Frustrating mobile experiences for emergency searches",
          "Lack of clear 'Book a Quote' or 'Call Now' buttons",
        ],
      },
      {
        title: "What We Build for Dunstable Trades",
        description: "We create websites that turn Dunstable locals into long-term clients.",
        points: [
          "Dunstable-Specific SEO: Targeting LU5 and LU6 postcode areas.",
          "Speed Optimized: Fast load times for urgent plumbing emergencies.",
          "Content Managed: We write all the local area and service pages.",
          "Security First: SSL and secure hosting standard for every site.",
          "Regular Updates: Your site evolves as your Dunstable business grows.",
        ],
      },
      {
        title: "From Houghton Regis to Totternhoe",
        description:
          "We ensure your business is visible to customers across Dunstable and its neighboring villages.",
      },
      {
        title: "The Dunstable Launch Process",
        points: [
          "Rapid Build: Live in days, not months.",
          "Review Stage: You sign off on the design.",
          "Managed Launch: We handle the DNS and domain setup.",
          "Ongoing Care: We're always here for updates.",
        ],
      },
    ],
  },
  "plumber-web-design-milton-keynes": {
    url: "plumber-web-design-milton-keynes",
    keyword: "Web design for plumbers in Milton Keynes",
    metaTitle: "Plumber Website Design Milton Keynes | ",
    metaDescription:
      "Get a high-converting plumber website in Milton Keynes. Fully managed with updates included",
    industry: "Plumbing",
    location: "Milton Keynes",
    heroTitle: "Plumber Website Design Milton Keynes",
    heroSubtitle: "Modern websites for the UK's fastest growing city",
    checklist: ["No upfront cost", "SEO-optimized", "Fully managed"],
    sections: [
      {
        title: "Standing Out in Milton Keynes",
        description:
          "Milton Keynes is a modern, fast-paced city. Your website needs to match that energy with a clean, tech-forward design that makes hiring you effortless.",
        points: [
          "Slow, 'clunky' sites that don't match the MK tech feel",
          "Invisible on Google for competitive MK plumbing terms",
          "Failing to capture the growing new-build market in MK",
          "Confusing navigation on mobile and tablet devices",
          "Lack of professional, modern branding elements",
        ],
      },
      {
        title: "Our Milton Keynes Build Package",
        description: "High-spec websites for high-performing plumbers in MK.",
        points: [
          "MK Grid System Targeting: SEO strategy for all MK areas.",
          "Lightning Fast Speeds: Built for the fiber-optic speed of MK.",
          "Professional Copywriting: We tell your MK success story.",
          "Managed Infrastructure: Cloud-hosting for 100% uptime.",
          "Priority Updates: Fast changes whenever you need them.",
        ],
      },
      {
        title: "Serving All of Milton Keynes",
        description:
          "From Bletchley to Newport Pagnell, we make sure your plumbing services are seen across the entire MK area.",
      },
      {
        title: "Getting Your MK Site Live",
        points: ["Consult & Build.", "Review & Refine.", "Go Live.", "Manage & Update."],
      },
    ],
  },
  "plumber-web-design-st-albans": {
    url: "plumber-web-design-st-albans",
    keyword: "Web design for plumbers in St Albans",
    metaTitle: "Plumber Website Design St Albans | Modern & Affordable",
    metaDescription:
      "We build modern websites for plumbers in St Albans. Improve your online presence and win more jobs.",
    industry: "Plumbing",
    location: "St Albans",
    heroTitle: "Plumber Website Design St Albans",
    heroSubtitle: "A premium online presence for St Albans' best plumbers",
    checklist: ["No upfront cost", "Premium design", "Local SEO built-in"],
    sections: [
      {
        title: "St Albans Customers Value Quality",
        description:
          "In St Albans, first impressions are everything. Your website needs to look premium and established to win high-value bathroom and heating jobs.",
        points: [
          "Amateur-looking sites that don't reflect St Albans quality",
          "Not ranking for 'plumber St Albans' or 'heating engineer AL1'",
          "Poor mobile experience for affluent, busy customers",
          "Lack of case studies or professional project galleries",
          "Slow performance causing high bounce rates",
        ],
      },
      {
        title: "The St Albans Premium Package",
        description:
          "Websites that reflect the high standards of your St Albans plumbing business.",
        points: [
          "High-End Design: Elegant, clean, and trustworthy layouts.",
          "Localized SEO: Targeting St Albans, Harpenden, and villages.",
          "Managed Hosting: Ultra-secure, fast, and reliable.",
          "Content Experts: We write professional, persuasive copy.",
          "Future-Proof: Built to grow as your St Albans business scales.",
        ],
      },
      {
        title: "Serving AL1, AL2, AL3 and Beyond",
        description:
          "We ensure your business is visible to customers across the entire St Albans and District area.",
      },
      {
        title: "The St Albans Roadmap",
        points: [
          "Blueprint: Planning your content.",
          "Build: Professional development.",
          "Review: Final sign-off.",
          "Launch: Managed live date.",
        ],
      },
    ],
  },
  "plumber-web-design-watford": {
    url: "plumber-web-design-watford",
    keyword: "Web design for plumbers in Watford",
    metaTitle: "Plumber Website Design Watford | Done For You",
    metaDescription:
      "Done-for-you plumber websites in Watford. We handle everything so you don’t have to.",
    industry: "Plumbing",
    location: "Watford",
    heroTitle: "Plumber Website Design Watford",
    heroSubtitle: "Win more local jobs across Watford and Southwest Herts",
    checklist: ["No upfront cost", "Lead-generation focus", "Fully managed"],
    sections: [
      {
        title: "Watford's Busy Market Needs Fast Sites",
        description:
          "Watford is a hub of activity. When a pipe bursts or a boiler fails in Watford, customers need to find you and call you instantly. If your site is slow, you're out.",
        points: [
          "Not appearing for Watford-specific plumbing searches",
          "Frustrating mobile experience for customers in a hurry",
          "Unprofessional designs that don't build Watford trust",
          "Hard-to-find contact info on mobile devices",
          "Generic content that doesn't mention Watford or local areas",
        ],
      },
      {
        title: "Our Watford Success Strategy",
        description: "We build websites that dominate the Watford plumbing market.",
        points: [
          "Watford-Centric SEO: Ranking for WD17, WD18, WD19 and more.",
          "Call-Driven Design: Buttons and forms that convert.",
          "Managed Maintenance: We keep your Watford site running fast.",
          "Local Content: We write about your services in Watford.",
          "Stress-Free Setup: We handle the tech; you handle the plumbing.",
        ],
      },
      {
        title: "From Cassiobury to Oxhey",
        description:
          "We make sure your plumbing business is visible to every household in the Watford area.",
      },
      {
        title: "Getting Live in Watford",
        points: [
          "1. Strategic Build.",
          "2. Review Link.",
          "3. Managed Launch.",
          "4. Ongoing Care.",
        ],
      },
    ],
  },

  // Electrical
  "electrician-web-design": {
    url: "electrician-web-design",
    keyword: "Web design for electricians",
    metaTitle: "Website Design for Electricians | Get More Leads",
    metaDescription:
      "We build high-converting websites for electricians built to generate enquiries. Fully managed from £59 per month. Start getting more jobs today.",
    industry: "Electrical",
    heroTitle: "Website Design for Electricians",
    heroSubtitle: "Build Trust and Win More Local Electrical Contracts",
    checklist: [
      "No upfront cost on monthly plan",
      "Fully managed hosting & updates",
      "Built for lead generation",
    ],
    sections: [
      {
        title: "Is Your Electrician Website Underperforming?",
        description:
          "In the electrical trade, safety and professionalism are paramount. If your website looks amateur or outdated, customers won't trust you with their home's wiring. A poor online presence is like showing up to a job without the right tools.",
        points: [
          "Outdated designs that fail to convey safety and expertise",
          "Slow loading times that frustrate potential customers",
          "Not optimized for mobile — where most emergency searches happen",
          "No clear way to request a quote or view certifications",
          "Invisible on Google for local electrical search terms",
          "Generic content that doesn't mention your local areas",
        ],
      },
      {
        title: "What We Build for Local Electricians",
        description:
          "We create professional, high-performance websites designed specifically to win more electrical work.",
        points: [
          "Credible & Trustworthy Design: Layouts that highlight your qualifications and safety standards.",
          "Fast & Mobile-Responsive: Ensuring you're found by customers searching for emergency electricians on their phones.",
          "Lead-Focused: Clear calls-to-action, quote forms, and click-to-call buttons.",
          "Managed Service: We handle all the technical details, security, and hosting.",
          "Regular Updates: We're here to add new services, project photos, or testimonials whenever you need.",
          "Professional Copywriting: We write your service pages and location content for you.",
        ],
      },
      {
        title: "SEO for Electricians from the Ground Up",
        description:
          "We ensure your business is visible to people in your area searching for an electrician.",
        points: [
          "Local Search Strategy: Targeting your specific service areas and towns.",
          "Technical Foundations: Built for speed and search engine visibility.",
          "Rich Schema Markup: Helping Google understand your services and location.",
          "Secure & Reliable: SSL certificates and secure hosting included.",
        ],
      },
      {
        title: "Our Simple Build Process",
        description: "Get your new electrician website live without any stress:",
        points: [
          "1. Build: We design and write your new site, focusing on your specific electrical services.",
          "2. Review: You check the preview link and let us know if any tweaks are needed.",
          "3. Launch: We handle the launch and set up your hosting and Google submission.",
          "4. Manage: We take care of everything ongoing so you can focus on your jobs.",
        ],
      },
    ],
  },
  "electrician-web-design-luton": {
    url: "electrician-web-design-luton",
    keyword: "Web design for electricians in Luton",
    metaTitle: "Electrician Website Design Luton | From £59 per month",
    metaDescription:
      "Professional websites for electricians in Luton. Fast, mobile-friendly and built to generate leads. From £59 per month.",
    industry: "Electrical",
    location: "Luton",
    heroTitle: "Electrician Website Design Luton",
    heroSubtitle: "Professional websites for Luton's best electrical contractors",
    checklist: ["No upfront cost", "Lead-focused build", "Fully managed"],
    sections: [
      {
        title: "Why Luton Electricians Need a Modern Website",
        description:
          "Luton is a busy, competitive area. To win the best residential and commercial jobs, you need to look more professional than the competition. A DIY website or a tired old page isn't enough to build the trust needed for electrical work.",
        points: [
          "Not appearing for local Luton electrical searches",
          "Unprofessional designs that don't convey safety and trust",
          "Hard-to-use mobile sites for emergency call-outs",
          "No clear way for Luton customers to contact you",
          "Sites that load too slowly, causing customers to call someone else",
        ],
      },
      {
        title: "Our Luton Electrician Package",
        description:
          "We build websites that generate more work for your Luton electrical business.",
        points: [
          "Luton-Specific SEO: Targeting the towns and neighborhoods you serve.",
          "Professional Credibility: Highlighting your NICEIC or similar accreditations.",
          "Lead-Driven Layout: Built to turn visitors into quote requests.",
          "Managed Hosting: 100% uptime and high security standard.",
          "Ongoing Maintenance: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Serving Luton and Beyond",
        description:
          "From Leagrave to Stopsley, we make sure your electrical services are seen by every household in Luton.",
      },
      {
        title: "The Luton Launch Roadmap",
        points: [
          "Phase 1: Build & Content.",
          "Phase 2: Review & Approve.",
          "Phase 3: Managed Launch.",
          "Phase 4: Ongoing Support.",
        ],
      },
    ],
  },
  "electrician-web-design-bedford": {
    url: "electrician-web-design-bedford",
    keyword: "Web design for electricians in Bedford",
    metaTitle: "Electrician Website Design Bedford | Get More Jobs",
    metaDescription:
      "Need more electrician leads in Bedford? We design high-converting websites with low upfront cost.",
    industry: "Electrical",
    location: "Bedford",
    heroTitle: "Electrician Website Design Bedford",
    heroSubtitle: "High-performance websites for Bedfordshire's electricians",
    checklist: ["No upfront cost", "Managed launch", "Lead-focused design"],
    sections: [
      {
        title: "The Bedford Electrical Market is Competitive",
        description:
          "To win the best jobs in Bedford, your website needs to look professional, load fast, and rank well on Google. Anything less is costing you enquiries.",
        points: [
          "Invisible on Google for 'electrician Bedford' searches",
          "Outdated designs that don't reflect your expertise",
          "Poor mobile performance for emergency call-outs",
          "No clear call-to-action for Bedford customers",
          "Slow loading speeds causing visitors to leave",
        ],
      },
      {
        title: "Our Bedford Build Strategy",
        description: "We create electrician websites that dominate the Bedford market.",
        points: [
          "Bedford-Focused SEO: Targeting the MK40, MK41 and MK42 areas.",
          "Trust-Building Design: Showcasing your skills and certifications.",
          "Fully Managed: Hosting, security, and updates all handled.",
          "Lead Generation: Built to convert visitors into booked jobs.",
          "Local Content: We write about your services in Bedford.",
        ],
      },
      {
        title: "Serving Every Part of Bedford",
        description:
          "We ensure your business is visible to customers across the entire Bedford area, including surrounding villages.",
      },
      {
        title: "Getting Live in Bedford",
        points: [
          "1. Rapid Development.",
          "2. Client Sign-off.",
          "3. Managed Launch.",
          "4. Ongoing Care.",
        ],
      },
    ],
  },
  "electrician-web-design-dunstable": {
    url: "electrician-web-design-dunstable",
    keyword: "Web design for electricians in Dunstable",
    metaTitle: "Electrician Website Design Dunstable | Affordable & Fast",
    metaDescription:
      "Affordable electrician websites in Dunstable. We design, build and manage everything for you. Low upfront cost.",
    industry: "Electrical",
    location: "Dunstable",
    heroTitle: "Electrician Website Design Dunstable",
    heroSubtitle: "Win more electrical work across Dunstable and LU postcode areas",
    checklist: ["No upfront cost", "Managed launch", "Lead-focused build"],
    sections: [
      {
        title: "Dunstable Electricians Need a Better Online Presence",
        description:
          "When people in Dunstable need an electrician, they search online. If your website isn't there, or if it doesn't look professional, you're missing out on jobs.",
        points: [
          "Not ranking for 'electrician Dunstable' or 'emergency electrician Dunstable'",
          "Amateur designs that don't inspire confidence in your safety standards",
          "Sites that don't work properly on mobile devices",
          "Missing or hidden contact information for Dunstable customers",
          "Generic content that doesn't mention your Dunstable service areas",
        ],
      },
      {
        title: "What We Build for Dunstable Electrical Businesses",
        description: "We create websites that turn Dunstable locals into loyal customers.",
        points: [
          "Dunstable-Specific SEO: Targeting the LU5 and LU6 areas.",
          "Safety-Focused Design: Highlighting your qualifications and experience.",
          "Fully Managed: Hosting, security, and maintenance all taken care of.",
          "Lead-Gen Focused: Clear buttons and forms to capture enquiries.",
          "Local Copywriting: We write your Dunstable-focused content for you.",
        ],
      },
      {
        title: "Covering the Entire Dunstable Area",
        description:
          "We make sure your electrical services are visible to every household across Dunstable and the surrounding villages.",
      },
      {
        title: "The Dunstable Onboarding Process",
        points: [
          "Consult & Build.",
          "Preview & Feedback.",
          "Launch & SEO Setup.",
          "Ongoing Management.",
        ],
      },
    ],
  },
  "electrician-web-design-milton-keynes": {
    url: "electrician-web-design-milton-keynes",
    keyword: "Web design for electricians in Milton Keynes",
    metaTitle: "Electrician Website Design Milton Keynes | Fast Setup",
    metaDescription:
      "Get a modern electrician website in Milton Keynes quickly. Fully managed and built to convert. Low upfront cost.",
    industry: "Electrical",
    location: "Milton Keynes",
    heroTitle: "Electrician Website Design Milton Keynes",
    heroSubtitle: "Modern websites for Milton Keynes' best electrical contractors",
    checklist: ["No upfront cost", "SEO-optimized", "Fully managed"],
    sections: [
      {
        title: "Standing Out in the Milton Keynes Electrical Market",
        description:
          "Milton Keynes is a fast-growing, high-tech city. Your website needs to reflect that with a clean, modern design that builds trust with both homeowners and commercial clients.",
        points: [
          "Outdated sites that don't match the modern Milton Keynes feel",
          "Invisible on Google for competitive MK electrical searches",
          "Failing to capture the growing new-build market in Milton Keynes",
          "Poor mobile performance for emergency electrical calls",
          "Lack of clear 'Call Now' or 'Book a Quote' buttons",
        ],
      },
      {
        title: "Our Milton Keynes Electrical Package",
        description:
          "We build high-spec websites for high-performing electricians in Milton Keynes.",
        points: [
          "Milton Keynes Grid Targeting: SEO strategy for all MK areas.",
          "Modern, Professional Design: Layouts that inspire confidence.",
          "Fully Managed Infrastructure: Fast, secure, and 100% reliable.",
          "Lead Generation Focus: Built to convert MK visitors into jobs.",
          "Ongoing Support: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Serving All of Milton Keynes",
        description:
          "From Wolverton to Fenny Stratford, we ensure your electrical business is seen by everyone across Milton Keynes.",
      },
      {
        title: "Getting Live in Milton Keynes",
        points: ["1. Build & Design.", "2. Review Link.", "3. Managed Launch.", "4. Ongoing Care."],
      },
    ],
  },
  "electrician-web-design-st-albans": {
    url: "electrician-web-design-st-albans",
    keyword: "Web design for electricians in St Albans",
    metaTitle: "Electrician Website Design St Albans | Lead Generation",
    metaDescription:
      "We create lead-generating websites for electricians in St Albans. Simple pricing, low upfront cost.",
    industry: "Electrical",
    location: "St Albans",
    heroTitle: "Electrician Website Design St Albans",
    heroSubtitle: "A premium online presence for St Albans' electrical experts",
    checklist: ["No upfront cost", "Premium design", "Local SEO built-in"],
    sections: [
      {
        title: "St Albans Customers Demand High Standards",
        description:
          "In St Albans, first impressions are critical. To win high-value residential and commercial contracts, your website must convey absolute professionalism and safety.",
        points: [
          "Amateur-looking sites that don't reflect St Albans quality",
          "Not ranking for 'electrician St Albans' or 'electrical contractor AL1'",
          "Poor mobile experience for busy, affluent customers",
          "Lack of clear information on qualifications and safety standards",
          "Slow performance causing high bounce rates",
        ],
      },
      {
        title: "The St Albans Electrician Package",
        description:
          "Websites that reflect the premium quality of your St Albans electrical business.",
        points: [
          "High-End Design: Clean, elegant, and trustworthy layouts.",
          "St Albans-Focused SEO: Targeting AL1, AL2 and AL3 postcode areas.",
          "Fully Managed hosting: Secure, reliable, and lightning fast.",
          "Professional Copywriting: We write your service and area content.",
          "Continuous Management: We're here for any changes you need.",
        ],
      },
      {
        title: "Serving St Albans and the District",
        description:
          "We make sure your electrical business is seen across the entire St Albans area, including Harpenden and neighboring villages.",
      },
      {
        title: "The St Albans Roadmap",
        points: [
          "Blueprint & Content.",
          "Build & Design.",
          "Review & Feedback.",
          "Launch & SEO Setup.",
        ],
      },
    ],
  },
  "electrician-web-design-watford": {
    url: "electrician-web-design-watford",
    keyword: "Web design for electricians in Watford",
    metaTitle: "Electrician Website Design Watford | Done For You",
    metaDescription:
      "Done-for-you websites for electricians in Watford. No hassle, low upfront cost. Start getting more enquiries.",
    industry: "Electrical",
    location: "Watford",
    heroTitle: "Electrician Website Design Watford",
    heroSubtitle: "Win more electrical work across Watford and Southwest Herts",
    checklist: ["No upfront cost", "Lead-generation focus", "Fully managed"],
    sections: [
      {
        title: "Watford Electricians Need Fast, Lead-Gen Sites",
        description:
          "Watford is a busy hub. When an electrical fault occurs, Watford customers need to find you and call you instantly. If your site is slow or hard to use, you're losing jobs.",
        points: [
          "Not ranking for Watford-specific electrical searches",
          "Frustrating mobile experience for customers in a hurry",
          "Unprofessional designs that don't build Watford trust",
          "Hidden or hard-to-find contact information on mobile",
          "Generic content that doesn't mention Watford or local areas",
        ],
      },
      {
        title: "Our Watford Success Strategy",
        description: "We build electrical websites that dominate the Watford market.",
        points: [
          "Watford-Centric SEO: Ranking for WD17, WD18 and WD19 areas.",
          "Professional Design: Conveying safety and expertise to Watford clients.",
          "Fully Managed Infrastructure: Fast, secure, and always live.",
          "Lead-Driven Design: Built to turn Watford visitors into booked jobs.",
          "Ongoing Support: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Covering Every Part of Watford",
        description:
          "We make sure your electrical business is visible to every household across the entire Watford area.",
      },
      {
        title: "Getting Live in Watford",
        points: [
          "1. Strategic Development.",
          "2. Preview & Sign-off.",
          "3. Managed Launch.",
          "4. Continuous Management.",
        ],
      },
    ],
  },

  // Roofing
  "roofer-web-design": {
    url: "roofer-web-design",
    keyword: "Web design for roofers",
    metaTitle: "Website Design for Roofers | More Enquiries",
    metaDescription:
      "We design websites for roofing companies that convert visitors into leads. Modern, fast and fully managed from £59 per month.",
    industry: "Roofing",
    heroTitle: "Website Design for Roofers",
    heroSubtitle: "Build Local Trust and Generate More Roofing Leads",
    checklist: [
      "No upfront cost on monthly plan",
      "Fully managed hosting & updates",
      "Built for lead generation",
    ],
    sections: [
      {
        title: "Is Your Roofing Website Costing You Work?",
        description:
          "In the roofing trade, your website is often the first thing a potential customer sees. If it looks amateur or outdated, they'll worry about the quality of your work. A professional online presence is essential to winning high-value roofing contracts.",
        points: [
          "Outdated designs that fail to convey quality and reliability",
          "Slow loading times that frustrate potential customers",
          "Not optimized for mobile — where most emergency searches happen",
          "No clear way to request a quote or view recent projects",
          "Invisible on Google for local roofing search terms",
          "Generic content that doesn't mention your local service areas",
        ],
      },
      {
        title: "What We Build for Local Roofers",
        description:
          "We create professional, high-performance websites designed specifically to win more roofing work.",
        points: [
          "Professional & Trustworthy Design: Highlighting your skills, experience, and certifications.",
          "Fast & Mobile-Responsive: Ensuring you're found by customers searching for emergency roof repairs on their phones.",
          "Lead-Focused: Clear calls-to-action, quote request forms, and click-to-call buttons.",
          "Fully Managed Service: We handle all the technical details, security, and hosting.",
          "Regular Updates: We're here to add new project photos, testimonials, or services whenever you need.",
          "Professional Copywriting: We write your service pages and location content for you.",
        ],
      },
      {
        title: "Roofing SEO from the Ground Up",
        description:
          "We ensure your business is visible to people in your area searching for a roofer.",
        points: [
          "Local Search Strategy: Targeting your specific service areas and towns.",
          "Technical Foundations: Built for speed and search engine visibility.",
          "Rich Schema Markup: Helping Google understand your services and location.",
          "Secure & Reliable: SSL certificates and secure hosting included.",
        ],
      },
      {
        title: "Our Stress-Free Build Process",
        description: "Get your new roofer website live without any hassle:",
        points: [
          "1. Build: We design and write your new site, focusing on your specific roofing services.",
          "2. Review: You check the preview link and let us know if any tweaks are needed.",
          "3. Launch: We handle the launch and set up your hosting and Google submission.",
          "4. Manage: We take care of everything ongoing so you can focus on your jobs.",
        ],
      },
    ],
  },
  "roofer-web-design-luton": {
    url: "roofer-web-design-luton",
    keyword: "Web design for roofers in Luton",
    metaTitle: "Roofer Website Design Luton | Get More Enquiries",
    metaDescription:
      "We design high-converting roofing websites in Luton. Modern, fast and built to generate leads. Tiny upfront cost.",
    industry: "Roofing",
    location: "Luton",
    heroTitle: "Roofer Website Design Luton",
    heroSubtitle: "Professional websites for Luton's best roofing contractors",
    checklist: ["No upfront cost", "Lead-focused build", "Fully managed"],
    sections: [
      {
        title: "Why Luton Roofers Need a Modern Online Presence",
        description:
          "Luton is a busy, competitive area. To win the best residential and commercial roofing jobs, you need to look more professional than the competition. A tired old site or a basic directory listing isn't enough to build the trust needed for roofing work.",
        points: [
          "Not appearing for local Luton roofing searches",
          "Unprofessional designs that don't convey quality and reliability",
          "Hard-to-use mobile sites for emergency roof repairs",
          "No clear way for Luton customers to contact you or request a quote",
          "Sites that load too slowly, causing customers to call someone else",
        ],
      },
      {
        title: "Our Luton Roofer Package",
        description: "We build websites that generate more work for your Luton roofing business.",
        points: [
          "Luton-Specific SEO: Targeting the towns and neighborhoods you serve.",
          "Trust-Building Design: Showcasing your previous work and customer reviews.",
          "Lead-Driven Layout: Built to turn visitors into quote requests.",
          "Managed Hosting: Ultra-secure, fast, and 100% reliable.",
          "Ongoing Maintenance: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Serving Luton and the Surrounding Area",
        description:
          "From Marsh Farm to Caddington, we make sure your roofing services are seen by every household across Luton.",
      },
      {
        title: "The Luton Launch Roadmap",
        points: [
          "Phase 1: Strategic Build.",
          "Phase 2: Review Link.",
          "Phase 3: Managed Launch.",
          "Phase 4: Ongoing Care.",
        ],
      },
    ],
  },
  "roofer-web-design-bedford": {
    url: "roofer-web-design-bedford",
    keyword: "Web design for roofers in Bedford",
    metaTitle: "Roofer Website Design Bedford | Affordable & Modern",
    metaDescription:
      "Professional roofing websites in Bedford. We handle everything so you can focus on jobs. Low upfront cost.",
    industry: "Roofing",
    location: "Bedford",
    heroTitle: "Roofer Website Design Bedford",
    heroSubtitle: "High-performance websites for Bedfordshire's roofers",
    checklist: ["No upfront cost", "Managed launch", "Lead-focused design"],
    sections: [
      {
        title: "The Bedford Roofing Market is Competitive",
        description:
          "To win the best jobs in Bedford, your website needs to look professional, load fast, and rank well on Google. Anything less is costing you enquiries.",
        points: [
          "Invisible on Google for 'roofer Bedford' searches",
          "Outdated designs that don't reflect the quality of your work",
          "Poor mobile performance for emergency roofing repairs",
          "No clear call-to-action for Bedford customers",
          "Slow loading speeds causing visitors to leave",
        ],
      },
      {
        title: "Our Bedford Build Strategy",
        description: "We create roofing websites that dominate the Bedford market.",
        points: [
          "Bedford-Focused SEO: Targeting the MK40, MK41 and MK42 areas.",
          "Portfolio-Led Design: Highlighting your recent local projects.",
          "Fully Managed: Hosting, security, and updates all handled.",
          "Lead Generation: Built to convert visitors into booked jobs.",
          "Local Content: We write about your services in Bedford.",
        ],
      },
      {
        title: "Serving Every Corner of Bedford",
        description:
          "We ensure your business is visible to customers across the entire Bedford area, including surrounding villages.",
      },
      {
        title: "Getting Live in Bedford",
        points: [
          "1. Rapid Development.",
          "2. Client Sign-off.",
          "3. Managed Launch.",
          "4. Ongoing Care.",
        ],
      },
    ],
  },
  "roofer-web-design-dunstable": {
    url: "roofer-web-design-dunstable",
    keyword: "Web design for roofers in Dunstable",
    metaTitle: "Roofer Website Design Dunstable | Affordable Sites",
    metaDescription:
      "Affordable website design for roofers in Dunstable. Upgrade your outdated site and win more work.",
    industry: "Roofing",
    location: "Dunstable",
    heroTitle: "Roofer Website Design Dunstable",
    heroSubtitle: "Win more roofing work across Dunstable and LU postcode areas",
    checklist: ["No upfront cost", "Managed launch", "Lead-focused build"],
    sections: [
      {
        title: "Dunstable Roofers Need a Better Online Presence",
        description:
          "When people in Dunstable need a roofer, they search online. If your website isn't there, or if it doesn't look professional, you're missing out on jobs.",
        points: [
          "Not ranking for 'roofer Dunstable' or 'roof repair Dunstable'",
          "Amateur designs that don't inspire confidence in your work",
          "Sites that don't work properly on mobile devices",
          "Missing or hidden contact information for Dunstable customers",
          "Generic content that doesn't mention your Dunstable service areas",
        ],
      },
      {
        title: "What We Build for Dunstable Roofing Businesses",
        description: "We create websites that turn Dunstable locals into loyal customers.",
        points: [
          "Dunstable-Specific SEO: Targeting the LU5 and LU6 areas.",
          "Trust-Building Design: Showcasing your skills and experience.",
          "Fully Managed: Hosting, security, and maintenance all taken care of.",
          "Lead-Gen Focused: Clear buttons and forms to capture enquiries.",
          "Local Copywriting: We write your Dunstable-focused content for you.",
        ],
      },
      {
        title: "Covering the Entire Dunstable Area",
        description:
          "We make sure your roofing services are visible to every household across Dunstable and the surrounding villages.",
      },
      {
        title: "The Dunstable Onboarding Process",
        points: [
          "Consult & Build.",
          "Preview & Feedback.",
          "Launch & SEO Setup.",
          "Ongoing Management.",
        ],
      },
    ],
  },
  "roofer-web-design-milton-keynes": {
    url: "roofer-web-design-milton-keynes",
    keyword: "Web design for roofers in Milton Keynes",
    metaTitle: "Roofer Website Design Milton Keynes | Fast & Modern",
    metaDescription:
      "Modern roofing websites in Milton Keynes built to convert visitors into customers. From £59 per month.",
    industry: "Roofing",
    location: "Milton Keynes",
    heroTitle: "Roofer Website Design Milton Keynes",
    heroSubtitle: "Modern websites for Milton Keynes' best roofing contractors",
    checklist: ["No upfront cost", "SEO-optimized", "Fully managed"],
    sections: [
      {
        title: "Standing Out in the Milton Keynes Roofing Market",
        description:
          "Milton Keynes is a fast-growing, modern city. Your website needs to reflect that with a clean, professional design that builds trust with both homeowners and commercial clients.",
        points: [
          "Outdated sites that don't match the modern Milton Keynes feel",
          "Invisible on Google for competitive MK roofing searches",
          "Failing to capture the growing new-build market in Milton Keynes",
          "Poor mobile performance for emergency roofing calls",
          "Lack of clear 'Call Now' or 'Book a Quote' buttons",
        ],
      },
      {
        title: "Our Milton Keynes Roofer Package",
        description: "We build high-spec websites for high-performing roofers in Milton Keynes.",
        points: [
          "Milton Keynes Grid Targeting: SEO strategy for all MK areas.",
          "Modern, Professional Design: Layouts that inspire confidence.",
          "Fully Managed Infrastructure: Fast, secure, and always live.",
          "Lead Generation Focus: Built to convert MK visitors into jobs.",
          "Ongoing Support: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Serving All of Milton Keynes",
        description:
          "From Bletchley to Newport Pagnell, we ensure your roofing business is seen by everyone across Milton Keynes.",
      },
      {
        title: "Getting Live in Milton Keynes",
        points: ["1. Build & Design.", "2. Review Link.", "3. Managed Launch.", "4. Ongoing Care."],
      },
    ],
  },
  "roofer-web-design-st-albans": {
    url: "roofer-web-design-st-albans",
    keyword: "Web design for roofers in St Albans",
    metaTitle: "Roofer Website Design St Albans | More Leads",
    metaDescription:
      "We help roofers in St Albans get more leads with professional websites. Simple pricing, fast turnaround.",
    industry: "Roofing",
    location: "St Albans",
    heroTitle: "Roofer Website Design St Albans",
    heroSubtitle: "A premium online presence for St Albans' roofing experts",
    checklist: ["No upfront cost", "Premium design", "Local SEO built-in"],
    sections: [
      {
        title: "St Albans Customers Demand High Standards",
        description:
          "In St Albans, first impressions are critical. To win high-value residential and commercial roofing contracts, your website must convey absolute professionalism and quality.",
        points: [
          "Amateur-looking sites that don't reflect St Albans quality",
          "Not ranking for 'roofer St Albans' or 'roofing contractor AL1'",
          "Poor mobile experience for busy, affluent customers",
          "Lack of high-quality photos of your previous St Albans projects",
          "Slow performance causing high bounce rates",
        ],
      },
      {
        title: "The St Albans Roofer Package",
        description:
          "Websites that reflect the premium quality of your St Albans roofing business.",
        points: [
          "High-End Design: Clean, elegant, and trustworthy layouts.",
          "St Albans-Focused SEO: Targeting AL1, AL2 and AL3 postcode areas.",
          "Fully Managed hosting: Secure, reliable, and lightning fast.",
          "Professional Copywriting: We write your service and area content.",
          "Continuous Management: We're here for any changes you need.",
        ],
      },
      {
        title: "Serving St Albans and the District",
        description:
          "We make sure your roofing business is seen across the entire St Albans area, including Harpenden and neighboring villages.",
      },
      {
        title: "The St Albans Roadmap",
        points: [
          "Blueprint & Content.",
          "Build & Design.",
          "Review & Feedback.",
          "Launch & SEO Setup.",
        ],
      },
    ],
  },
  "roofer-web-design-watford": {
    url: "roofer-web-design-watford",
    keyword: "Web design for roofers in Watford",
    metaTitle: "Roofer Website Design Watford | Done For You Service",
    metaDescription:
      "Done-for-you roofing websites in Watford. We build, design and manage your site. Low upfront cost.",
    industry: "Roofing",
    location: "Watford",
    heroTitle: "Roofer Website Design Watford",
    heroSubtitle: "Win more roofing work across Watford and Southwest Herts",
    checklist: ["No upfront cost", "Lead-generation focus", "Fully managed"],
    sections: [
      {
        title: "Watford Roofers Need Fast, Lead-Gen Sites",
        description:
          "Watford is a busy hub. When a roof leak occurs, Watford customers need to find you and call you instantly. If your site is slow or hard to use, you're losing jobs.",
        points: [
          "Not ranking for Watford-specific roofing searches",
          "Frustrating mobile experience for customers in a hurry",
          "Unprofessional designs that don't build Watford trust",
          "Hidden or hard-to-find contact information on mobile",
          "Generic content that doesn't mention Watford or local areas",
        ],
      },
      {
        title: "Our Watford Success Strategy",
        description: "We build roofing websites that dominate the Watford market.",
        points: [
          "Watford-Centric SEO: Ranking for WD17, WD18 and WD19 areas.",
          "Professional Design: Conveying quality and reliability to Watford clients.",
          "Fully Managed Infrastructure: Fast, secure, and always live.",
          "Lead-Driven Design: Built to turn Watford visitors into booked jobs.",
          "Ongoing Support: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Covering Every Part of Watford",
        description:
          "We make sure your roofing business is visible to every household across the entire Watford area.",
      },
      {
        title: "Getting Live in Watford",
        points: [
          "1. Strategic Development.",
          "2. Preview & Sign-off.",
          "3. Managed Launch.",
          "4. Continuous Management.",
        ],
      },
    ],
  },

  // Locksmiths
  "locksmith-web-design": {
    url: "locksmith-web-design",
    keyword: "Web design for locksmiths",
    metaTitle: "Website Design for Locksmiths | Get More Calls",
    metaDescription:
      "Lead-focused websites for locksmiths. Built to capture urgent enquiries and drive more calls. Low upfront cost, fully managed.",
    industry: "Locksmith",
    heroTitle: "Website Design for Locksmiths",
    heroSubtitle: "Build Trust and Win More Local Locksmith Jobs",
    checklist: [
      "No upfront cost on monthly plan",
      "Fully managed hosting & updates",
      "Built for lead generation",
    ],
    sections: [
      {
        title: "Is Your Locksmith Website Costing You Work?",
        description:
          "In the locksmith trade, customers are often in an emergency. If your website doesn't load instantly or looks unprofessional, they'll immediately call the next person on Google. Speed and trust are everything.",
        points: [
          "Outdated designs that fail to convey reliability and trust",
          "Slow loading times that frustrate emergency customers",
          "Not optimized for mobile — where most emergency searches happen",
          "Hard-to-find contact details or 'Call Now' buttons",
          "Invisible on Google for local locksmith search terms",
          "Generic content that doesn't build local credibility",
        ],
      },
      {
        title: "What We Build for Local Locksmiths",
        description:
          "We create professional, high-performance websites designed specifically to win more locksmith work.",
        points: [
          "Emergency-Focused Design: Clear click-to-call buttons and fast-loading pages.",
          "Trust & Reliability: Highlighting your certifications and local presence.",
          "Lead-Focused: Built to turn urgent searches into booked call-outs.",
          "Fully Managed Service: We handle all the technical details, security, and hosting.",
          "Regular Updates: We're here to add new services, project photos, or testimonials.",
          "Professional Copywriting: We write your service pages and location content for you.",
        ],
      },
      {
        title: "Locksmith SEO from the Ground Up",
        description:
          "We ensure your business is visible to people in your area searching for a locksmith.",
        points: [
          "Local Search Strategy: Targeting your specific service areas and towns.",
          "Technical Foundations: Built for speed and search engine visibility.",
          "Rich Schema Markup: Helping Google understand your services and location.",
          "Secure & Reliable: SSL certificates and secure hosting included.",
        ],
      },
      {
        title: "Our Hassle-Free Build Process",
        description: "Get your new locksmith website live without any stress:",
        points: [
          "1. Build: We design and write your new site, focusing on your specific locksmith services.",
          "2. Review: You check the preview link and let us know if any tweaks are needed.",
          "3. Launch: We handle the launch and set up your hosting and Google submission.",
          "4. Manage: We take care of everything ongoing so you can focus on your jobs.",
        ],
      },
    ],
  },
  "locksmith-web-design-luton": {
    url: "locksmith-web-design-luton",
    keyword: "Web design for locksmiths in Luton",
    metaTitle: "Locksmith Website Design Luton | 24/7 Lead Ready",
    metaDescription:
      "Professional locksmith websites in Luton designed to capture urgent leads. Fast, modern and mobile-friendly.",
    industry: "Locksmith",
    location: "Luton",
    heroTitle: "Locksmith Website Design Luton",
    heroSubtitle: "Professional websites for Luton's most reliable locksmiths",
    checklist: ["No upfront cost", "Emergency-focused build", "Fully managed"],
    sections: [
      {
        title: "Why Luton Locksmiths Need a Better Website",
        description:
          "Luton is a high-demand area for locksmith services. When someone is locked out in Luton, they want a local, trustworthy professional — fast. If your website is slow or amateurish, you're missing out on jobs.",
        points: [
          "Not appearing for local Luton locksmith searches",
          "Unprofessional designs that don't convey trust and reliability",
          "Hard-to-use mobile sites for urgent lockout situations",
          "No clear 'Call Now' buttons for Luton customers",
          "Sites that load too slowly, causing customers to call a competitor",
        ],
      },
      {
        title: "Our Luton Locksmith Package",
        description: "We build websites that generate more work for your Luton locksmith business.",
        points: [
          "Luton-Specific SEO: Targeting the towns and neighborhoods you serve.",
          "Trust-Building Layout: Highlighting your local Luton presence and skills.",
          "Lead-Driven Design: Built to turn urgent visitors into phone calls.",
          "Managed Hosting: 100% uptime and high security standard.",
          "Ongoing Maintenance: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Serving Luton and the Surrounding Area",
        description:
          "From Biscot to Wigmore, we make sure your locksmith services are seen by every household across Luton.",
      },
      {
        title: "The Luton Launch Process",
        points: [
          "Phase 1: Build & Content.",
          "Phase 2: Review & Approve.",
          "Phase 3: Managed Launch.",
          "Phase 4: Ongoing Care.",
        ],
      },
    ],
  },
  "locksmith-web-design-bedford": {
    url: "locksmith-web-design-bedford",
    keyword: "Web design for locksmiths in Bedford",
    metaTitle: "Locksmith Website Design Bedford | Get Calls Fast",
    metaDescription:
      "Need more locksmith calls in Bedford? We build high-converting websites with no upfront cost.",
    industry: "Locksmith",
    location: "Bedford",
    heroTitle: "Locksmith Website Design Bedford",
    heroSubtitle: "High-performance websites for Bedfordshire's locksmiths",
    checklist: ["No upfront cost", "Managed launch", "Lead-focused design"],
    sections: [
      {
        title: "The Bedford Locksmith Market is Competitive",
        description:
          "To win the best jobs in Bedford, your website needs to look professional, load fast, and rank well on Google. Anything less is costing you enquiries.",
        points: [
          "Invisible on Google for 'locksmith Bedford' searches",
          "Outdated designs that don't reflect your professional skills",
          "Poor mobile performance for emergency lockouts",
          "No clear call-to-action for Bedford customers",
          "Slow loading speeds causing visitors to leave",
        ],
      },
      {
        title: "Our Bedford Build Strategy",
        description: "We create locksmith websites that dominate the Bedford market.",
        points: [
          "Bedford-Focused SEO: Targeting the MK40, MK41 and MK42 areas.",
          "Trust-First Design: Showcasing your expertise and reliability.",
          "Fully Managed: Hosting, security, and updates all handled.",
          "Lead Generation: Built to convert visitors into phone calls.",
          "Local Content: We write about your services in Bedford.",
        ],
      },
      {
        title: "Serving Every Part of Bedford",
        description:
          "We ensure your business is visible to customers across the entire Bedford area, including surrounding villages.",
      },
      {
        title: "Getting Live in Bedford",
        points: [
          "1. Rapid Development.",
          "2. Client Sign-off.",
          "3. Managed Launch.",
          "4. Ongoing Care.",
        ],
      },
    ],
  },
  "locksmith-web-design-dunstable": {
    url: "locksmith-web-design-dunstable",
    keyword: "Web design for locksmiths in Dunstable",
    metaTitle: "Locksmith Website Design Dunstable | Affordable Sites",
    metaDescription:
      "Affordable locksmith websites in Dunstable. Designed to convert visitors into customers. Low upfront cost.",
    industry: "Locksmith",
    location: "Dunstable",
    heroTitle: "Locksmith Website Design in Dunstable",
    heroSubtitle: "Win more locksmith work across Dunstable and LU postcode areas",
    checklist: ["No upfront cost", "Managed launch", "Lead-focused build"],
    sections: [
      {
        title: "Dunstable Locksmiths Need a Better Online Presence",
        description:
          "When people in Dunstable are locked out, they search online. If your website isn't there, or if it doesn't look professional, you're missing out on jobs.",
        points: [
          "Not ranking for 'locksmith Dunstable' or 'emergency locksmith Dunstable'",
          "Amateur designs that don't inspire confidence in your skills",
          "Sites that don't work properly on mobile devices",
          "Missing or hidden contact information for Dunstable customers",
          "Generic content that doesn't mention your Dunstable service areas",
        ],
      },
      {
        title: "What We Build for Dunstable Locksmith Businesses",
        description: "We create websites that turn Dunstable locals into long-term clients.",
        points: [
          "Dunstable-Specific SEO: Targeting the LU5 and LU6 areas.",
          "Professional Credibility: Highlighting your expertise and local trust.",
          "Fully Managed: Hosting, security, and maintenance all taken care of.",
          "Lead-Gen Focused: Clear 'Call Now' buttons and urgent quote forms.",
          "Local Copywriting: We write your Dunstable-focused content for you.",
        ],
      },
      {
        title: "Covering the Entire Dunstable Area",
        description:
          "We make sure your locksmith services are visible to every household across Dunstable and the surrounding villages.",
      },
      {
        title: "The Dunstable Roadmap",
        points: [
          "Consult & Build.",
          "Preview & Feedback.",
          "Launch & SEO Setup.",
          "Ongoing Management.",
        ],
      },
    ],
  },
  "locksmith-web-design-milton-keynes": {
    url: "locksmith-web-design-milton-keynes",
    keyword: "Web design for locksmiths in Milton Keynes",
    metaTitle: "Locksmith Website Design Milton Keynes | Fast Setup",
    metaDescription:
      "Get a modern locksmith website in Milton Keynes quickly. Built to generate calls and enquiries.",
    industry: "Locksmith",
    location: "Milton Keynes",
    heroTitle: "Locksmith Website Design in Milton Keynes",
    heroSubtitle: "Modern websites for Milton Keynes' most reliable locksmiths",
    checklist: ["No upfront cost", "SEO-optimized", "Fully managed"],
    sections: [
      {
        title: "Standing Out in the Milton Keynes Locksmith Market",
        description:
          "Milton Keynes is a modern, fast-growing city. Your website needs to reflect that with a clean, professional design that builds trust with both homeowners and commercial clients.",
        points: [
          "Outdated sites that don't match the modern Milton Keynes feel",
          "Invisible on Google for competitive MK locksmith searches",
          "Failing to capture the growing new-build market in Milton Keynes",
          "Poor mobile performance for emergency locksmith calls",
          "Lack of clear 'Call Now' buttons for urgent jobs",
        ],
      },
      {
        title: "Our Milton Keynes Locksmith Package",
        description: "We build high-spec websites for high-performing locksmiths in Milton Keynes.",
        points: [
          "Milton Keynes Grid Targeting: SEO strategy for all MK areas.",
          "Modern, Professional Design: Layouts that inspire confidence.",
          "Fully Managed Infrastructure: Fast, secure, and always live.",
          "Lead Generation Focus: Built to convert MK visitors into calls.",
          "Ongoing Support: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Serving All of Milton Keynes",
        description:
          "From Bletchley to Newport Pagnell, we ensure your locksmith business is seen by everyone across Milton Keynes.",
      },
      {
        title: "Getting Live in Milton Keynes",
        points: ["1. Build & Design.", "2. Review Link.", "3. Managed Launch.", "4. Ongoing Care."],
      },
    ],
  },
  "locksmith-web-design-st-albans": {
    url: "locksmith-web-design-st-albans",
    keyword: "Web design for locksmiths in St Albans",
    metaTitle: "Locksmith Website Design St Albans | Lead Focused",
    metaDescription:
      "Lead-focused locksmith websites in St Albans. We design and manage everything for you.",
    industry: "Locksmith",
    location: "St Albans",
    heroTitle: "Locksmith Website Design in St Albans",
    heroSubtitle: "A premium online presence for St Albans' locksmith experts",
    checklist: ["No upfront cost", "Premium design", "Local SEO built-in"],
    sections: [
      {
        title: "St Albans Customers Value Quality & Reliability",
        description:
          "In St Albans, first impressions are critical. When someone is locked out, they want to see a website that conveys immediate professionalism and local trust.",
        points: [
          "Amateur-looking sites that don't reflect St Albans quality",
          "Not ranking for 'locksmith St Albans' or 'emergency locksmith AL1'",
          "Poor mobile experience for busy, affluent customers",
          "Lack of clear trust signals and professional branding",
          "Slow performance causing high bounce rates during emergencies",
        ],
      },
      {
        title: "The St Albans Locksmith Package",
        description:
          "Websites that reflect the premium quality of your St Albans locksmith business.",
        points: [
          "High-End Design: Clean, elegant, and trustworthy layouts.",
          "St Albans-Focused SEO: Targeting AL1, AL2 and AL3 postcode areas.",
          "Fully Managed hosting: Secure, reliable, and lightning fast.",
          "Professional Copywriting: We write your service and area content.",
          "Continuous Management: We're here for any changes you need.",
        ],
      },
      {
        title: "Serving St Albans and the Surrounding Area",
        description:
          "We make sure your locksmith business is visible to customers across the entire St Albans area, including Harpenden and villages.",
      },
      {
        title: "The St Albans Roadmap",
        points: [
          "Blueprint & Content.",
          "Build & Design.",
          "Review & Feedback.",
          "Launch & SEO Setup.",
        ],
      },
    ],
  },
  "locksmith-web-design-watford": {
    url: "locksmith-web-design-watford",
    keyword: "Web design for locksmiths in Watford",
    metaTitle: "Locksmith Website Design Watford | Done For You",
    metaDescription:
      "Done-for-you locksmith websites in Watford. Low upfront cost. Start getting more calls today.",
    industry: "Locksmith",
    location: "Watford",
    heroTitle: "Locksmith Website Design in Watford",
    heroSubtitle: "Win more locksmith work across Watford and Southwest Herts",
    checklist: ["No upfront cost", "Lead-generation focus", "Fully managed"],
    sections: [
      {
        title: "Watford Locksmiths Need Fast, Lead-Gen Sites",
        description:
          "Watford is a busy hub. When an emergency lockout occurs, Watford customers need to find you and call you instantly. If your site is slow or hard to use, you're losing jobs.",
        points: [
          "Not ranking for Watford-specific locksmith searches",
          "Frustrating mobile experience for customers in a hurry",
          "Unprofessional designs that don't build Watford trust",
          "Hidden or hard-to-find contact information on mobile",
          "Generic content that doesn't mention Watford or local areas",
        ],
      },
      {
        title: "Our Watford Success Strategy",
        description: "We build locksmith websites that dominate the Watford market.",
        points: [
          "Watford-Centric SEO: Ranking for WD17, WD18 and WD19 areas.",
          "Professional Design: Conveying reliability and expertise to Watford clients.",
          "Fully Managed Infrastructure: Fast, secure, and always live.",
          "Lead-Driven Design: Built to turn Watford visitors into phone calls.",
          "Ongoing Support: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Covering Every Part of Watford",
        description:
          "We make sure your locksmith business is visible to every household across the entire Watford area.",
      },
      {
        title: "Getting Live in Watford",
        points: [
          "1. Strategic Development.",
          "2. Preview & Sign-off.",
          "3. Managed Launch.",
          "4. Continuous Management.",
        ],
      },
    ],
  },

  // Cleaning
  "cleaning-company-web-design": {
    url: "cleaning-company-web-design",
    keyword: "Web design for cleaning companies",
    metaTitle: "Website Design for Cleaning Companies | More Bookings",
    metaDescription:
      "We create websites for cleaning businesses that drive bookings. Simple, affordable and fully managed from £59 per month.",
    industry: "Cleaning",
    heroTitle: "Website Design for Cleaning Companies",
    heroSubtitle: "Build Trust and Win More Local Cleaning Contracts",
    checklist: [
      "No upfront cost on monthly plan",
      "Fully managed hosting & updates",
      "Built for lead generation",
    ],
    sections: [
      {
        title: "Is Your Cleaning Website Costing You Clients?",
        description:
          "In the cleaning industry, trust and attention to detail are everything. If your website looks messy or outdated, potential clients will assume your cleaning is the same. A professional online presence is essential to winning high-value commercial and residential contracts.",
        points: [
          "Outdated designs that fail to convey cleanliness and professionalism",
          "Slow loading times that frustrate potential customers",
          "Not optimized for mobile — where many local searches happen",
          "No clear way to request a quote or view service packages",
          "Invisible on Google for local cleaning search terms",
          "Generic content that doesn't build local credibility",
        ],
      },
      {
        title: "What We Build for Local Cleaning Businesses",
        description:
          "We create professional, high-performance websites designed specifically to win more cleaning work.",
        points: [
          "Clean & Trustworthy Design: Layouts that reflect your high standards and reliability.",
          "Fast & Mobile-Responsive: Ensuring you're found by customers searching for cleaners on their phones.",
          "Lead-Focused: Clear calls-to-action, quote forms, and click-to-call buttons.",
          "Fully Managed Service: We handle all the technical details, security, and hosting.",
          "Regular Updates: We're here to add new services, testimonials, or areas whenever you need.",
          "Professional Copywriting: We write your service pages and location content for you.",
        ],
      },
      {
        title: "Cleaning SEO from the Ground Up",
        description:
          "We ensure your business is visible to people in your area searching for a cleaner.",
        points: [
          "Local Search Strategy: Targeting your specific service areas and towns.",
          "Technical Foundations: Built for speed and search engine visibility.",
          "Rich Schema Markup: Helping Google understand your services and location.",
          "Secure & Reliable: SSL certificates and secure hosting included.",
        ],
      },
      {
        title: "Our Simple Build Process",
        description: "Get your new cleaning website live without any stress:",
        points: [
          "1. Build: We design and write your new site, focusing on your specific cleaning services.",
          "2. Review: You check the preview link and let us know if any tweaks are needed.",
          "3. Launch: We handle the launch and set up your hosting and Google submission.",
          "4. Manage: We take care of everything ongoing so you can focus on your jobs.",
        ],
      },
    ],
  },
  "cleaning-company-web-design-luton": {
    url: "cleaning-company-web-design-luton",
    keyword: "Web design for cleaning companies in Luton",
    metaTitle: "Cleaning Company Website Design Luton | £59 Per Month",
    metaDescription:
      "Professional websites for cleaning companies in Luton. Get more bookings with a modern site. Low upfront cost.",
    industry: "Cleaning",
    location: "Luton",
    heroTitle: "Cleaning Company Website Design in Luton",
    heroSubtitle: "Professional websites for Luton's best cleaning services",
    checklist: ["No upfront cost", "Lead-focused build", "Fully managed"],
    sections: [
      {
        title: "Why Luton Cleaning Businesses Need a Better Website",
        description:
          "Luton is a competitive market for cleaning services. To win the best residential and commercial contracts, you need to look more professional than the competition. A DIY site or a basic listing isn't enough to build the trust needed for cleaning work.",
        points: [
          "Not appearing for local Luton cleaning searches",
          "Unprofessional designs that don't convey quality and reliability",
          "Hard-to-use mobile sites for customers searching on the go",
          "No clear way for Luton customers to contact you or request a quote",
          "Sites that load too slowly, causing customers to call someone else",
        ],
      },
      {
        title: "Our Luton Cleaning Package",
        description: "We build websites that generate more work for your Luton cleaning business.",
        points: [
          "Luton-Specific SEO: Targeting the towns and neighborhoods you serve.",
          "Trust-Building Layout: Highlighting your reliability and high standards.",
          "Lead-Driven Design: Built to turn visitors into quote requests.",
          "Managed Hosting: 100% uptime and high security standard.",
          "Ongoing Maintenance: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Serving Luton and the Surrounding Area",
        description:
          "From High Town to Bramingham, we make sure your cleaning services are seen by every household and business across Luton.",
      },
      {
        title: "The Luton Launch Roadmap",
        points: [
          "Phase 1: Build & Content.",
          "Phase 2: Review & Approve.",
          "Phase 3: Managed Launch.",
          "Phase 4: Ongoing Support.",
        ],
      },
    ],
  },
  "cleaning-company-web-design-bedford": {
    url: "cleaning-company-web-design-bedford",
    keyword: "Web design for cleaning companies in Bedford",
    metaTitle: "Cleaning Website Design Bedford | More Bookings",
    metaDescription:
      "We build websites for cleaning businesses in Bedford that generate more bookings.",
    industry: "Cleaning",
    location: "Bedford",
    heroTitle: "Cleaning Company Website Design in Bedford",
    heroSubtitle: "High-performance websites for Bedfordshire's cleaning services",
    checklist: ["No upfront cost", "Managed launch", "Lead-focused design"],
    sections: [
      {
        title: "The Bedford Cleaning Market is Competitive",
        description:
          "To win the best jobs in Bedford, your website needs to look professional, load fast, and rank well on Google. Anything less is costing you enquiries.",
        points: [
          "Invisible on Google for 'cleaner Bedford' searches",
          "Outdated designs that don't reflect your attention to detail",
          "Poor mobile performance for customers searching on their phones",
          "No clear call-to-action for Bedford customers",
          "Slow loading speeds causing visitors to leave",
        ],
      },
      {
        title: "Our Bedford Build Strategy",
        description: "We create cleaning websites that dominate the Bedford market.",
        points: [
          "Bedford-Focused SEO: Targeting the MK40, MK41 and MK42 areas.",
          "Service-Driven Design: Highlighting your specific cleaning expertise.",
          "Fully Managed: Hosting, security, and updates all handled.",
          "Lead Generation: Built to convert visitors into booked jobs.",
          "Local Content: We write about your services in Bedford.",
        ],
      },
      {
        title: "Serving Every Part of Bedford",
        description:
          "We ensure your business is visible to customers across the entire Bedford area, including surrounding villages.",
      },
      {
        title: "Getting Live in Bedford",
        points: [
          "1. Rapid Development.",
          "2. Client Sign-off.",
          "3. Managed Launch.",
          "4. Ongoing Care.",
        ],
      },
    ],
  },
  "cleaning-company-web-design-dunstable": {
    url: "cleaning-company-web-design-dunstable",
    keyword: "Web design for cleaning companies in Dunstable",
    metaTitle: "Cleaning Website Design Dunstable | Affordable & Fast",
    metaDescription:
      "Affordable websites for cleaning companies in Dunstable. Fully managed and easy to update.",
    industry: "Cleaning",
    location: "Dunstable",
    heroTitle: "Cleaning Company Website Design in Dunstable",
    heroSubtitle: "Win more cleaning work across Dunstable and LU postcode areas",
    checklist: ["No upfront cost", "Managed launch", "Lead-focused build"],
    sections: [
      {
        title: "Dunstable Cleaners Need a Better Online Presence",
        description:
          "When people in Dunstable need a cleaner, they search online. If your website isn't there, or if it doesn't look professional, you're missing out on jobs.",
        points: [
          "Not ranking for 'cleaner Dunstable' or 'commercial cleaning Dunstable'",
          "Amateur designs that don't inspire confidence in your reliability",
          "Sites that don't work properly on mobile devices",
          "Missing or hidden contact information for Dunstable customers",
          "Generic content that doesn't mention your Dunstable service areas",
        ],
      },
      {
        title: "What We Build for Dunstable Cleaning Businesses",
        description: "We create websites that turn Dunstable locals into loyal clients.",
        points: [
          "Dunstable-Specific SEO: Targeting the LU5 and LU6 areas.",
          "Trust-Building Design: Showcasing your standards and experience.",
          "Fully Managed: Hosting, security, and maintenance all taken care of.",
          "Lead-Gen Focused: Clear buttons and forms to capture enquiries.",
          "Local Copywriting: We write your Dunstable-focused content for you.",
        ],
      },
      {
        title: "Covering the Entire Dunstable Area",
        description:
          "We make sure your cleaning services are visible to every household across Dunstable and the surrounding villages.",
      },
      {
        title: "The Dunstable Onboarding Process",
        points: [
          "Consult & Build.",
          "Preview & Feedback.",
          "Launch & SEO Setup.",
          "Ongoing Management.",
        ],
      },
    ],
  },
  "cleaning-company-web-design-milton-keynes": {
    url: "cleaning-company-web-design-milton-keynes",
    keyword: "Web design for cleaning companies in Milton Keynes",
    metaTitle: "Cleaning Website Design Milton Keynes | Fast Setup",
    metaDescription:
      "Get a modern cleaning business website in Milton Keynes. Designed to convert visitors into customers.",
    industry: "Cleaning",
    location: "Milton Keynes",
    heroTitle: "Cleaning Company Website Design in Milton Keynes",
    heroSubtitle: "Modern websites for Milton Keynes' best cleaning services",
    checklist: ["No upfront cost", "SEO-optimized", "Fully managed"],
    sections: [
      {
        title: "Standing Out in the Milton Keynes Cleaning Market",
        description:
          "Milton Keynes is a modern, fast-growing city. Your website needs to reflect that with a clean, professional design that builds trust with both homeowners and commercial clients.",
        points: [
          "Outdated sites that don't match the modern Milton Keynes feel",
          "Invisible on Google for competitive MK cleaning searches",
          "Failing to capture the growing commercial market in Milton Keynes",
          "Poor mobile performance for customers searching on the go",
          "Lack of clear 'Book a Quote' or 'Call Now' buttons",
        ],
      },
      {
        title: "Our Milton Keynes Cleaning Package",
        description: "We build high-spec websites for high-performing cleaners in Milton Keynes.",
        points: [
          "Milton Keynes Grid Targeting: SEO strategy for all MK areas.",
          "Modern, Professional Design: Layouts that inspire confidence.",
          "Fully Managed Infrastructure: Fast, secure, and always live.",
          "Lead Generation Focus: Built to convert MK visitors into jobs.",
          "Ongoing Support: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Serving All of Milton Keynes",
        description:
          "From Simpson to Willen, we ensure your cleaning business is seen by everyone across Milton Keynes.",
      },
      {
        title: "Getting Live in Milton Keynes",
        points: ["1. Build & Design.", "2. Review Link.", "3. Managed Launch.", "4. Ongoing Care."],
      },
    ],
  },
  "cleaning-company-web-design-st-albans": {
    url: "cleaning-company-web-design-st-albans",
    keyword: "Web design for cleaning companies in St Albans",
    metaTitle: "Cleaning Website Design St Albans | More Leads",
    metaDescription:
      "We help cleaning companies in St Albans get more leads with professional websites.",
    industry: "Cleaning",
    location: "St Albans",
    heroTitle: "Cleaning Company Website Design in St Albans",
    heroSubtitle: "A premium online presence for St Albans' cleaning experts",
    checklist: ["No upfront cost", "Premium design", "Local SEO built-in"],
    sections: [
      {
        title: "St Albans Customers Demand High Standards",
        description:
          "In St Albans, first impressions are critical. To win high-value residential and commercial cleaning contracts, your website must convey absolute professionalism and trust.",
        points: [
          "Amateur-looking sites that don't reflect St Albans quality",
          "Not ranking for 'cleaner St Albans' or 'commercial cleaning AL1'",
          "Poor mobile experience for busy, affluent customers",
          "Lack of clear information on standards and reliability",
          "Slow performance causing high bounce rates",
        ],
      },
      {
        title: "The St Albans Cleaning Package",
        description:
          "Websites that reflect the premium quality of your St Albans cleaning business.",
        points: [
          "High-End Design: Clean, elegant, and trustworthy layouts.",
          "St Albans-Focused SEO: Targeting AL1, AL2 and AL3 postcode areas.",
          "Fully Managed hosting: Secure, reliable, and lightning fast.",
          "Professional Copywriting: We write your service and area content.",
          "Continuous Management: We're here for any changes you need.",
        ],
      },
      {
        title: "Serving St Albans and the District",
        description:
          "We make sure your cleaning business is visible across the entire St Albans area, including Harpenden and neighboring villages.",
      },
      {
        title: "The St Albans Roadmap",
        points: [
          "Blueprint & Content.",
          "Build & Design.",
          "Review & Feedback.",
          "Launch & SEO Setup.",
        ],
      },
    ],
  },
  "cleaning-company-web-design-watford": {
    url: "cleaning-company-web-design-watford",
    keyword: "Web design for cleaning companies in Watford",
    metaTitle: "Cleaning Website Design Watford | Done For You",
    metaDescription:
      "Done-for-you websites for cleaning businesses in Watford. £59 per month, fully managed.",
    industry: "Cleaning",
    location: "Watford",
    heroTitle: "Cleaning Company Website Design in Watford",
    heroSubtitle: "Win more cleaning work across Watford and Southwest Herts",
    checklist: ["No upfront cost", "Lead-generation focus", "Fully managed"],
    sections: [
      {
        title: "Watford Cleaners Need Fast, Lead-Gen Sites",
        description:
          "Watford is a busy hub. When someone needs a cleaner, Watford customers need to find you and contact you instantly. If your site is slow or hard to use, you're losing jobs.",
        points: [
          "Not ranking for Watford-specific cleaning searches",
          "Frustrating mobile experience for customers in a hurry",
          "Unprofessional designs that don't build Watford trust",
          "Hidden or hard-to-find contact information on mobile",
          "Generic content that doesn't mention Watford or local areas",
        ],
      },
      {
        title: "Our Watford Success Strategy",
        description: "We build cleaning websites that dominate the Watford market.",
        points: [
          "Watford-Centric SEO: Ranking for WD17, WD18 and WD19 areas.",
          "Professional Design: Conveying reliability and standards to Watford clients.",
          "Fully Managed Infrastructure: Fast, secure, and always live.",
          "Lead-Driven Design: Built to turn Watford visitors into booked jobs.",
          "Ongoing Support: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Covering Every Part of Watford",
        description:
          "We make sure your cleaning business is visible to every household across the entire Watford area.",
      },
      {
        title: "Getting Live in Watford",
        points: [
          "1. Strategic Development.",
          "2. Preview & Sign-off.",
          "3. Managed Launch.",
          "4. Continuous Management.",
        ],
      },
    ],
  },

  // Removals
  "removals-web-design": {
    url: "removals-web-design",
    keyword: "Web design for removal companies",
    metaTitle: "Website Design for Removal Companies | Get More Leads",
    metaDescription:
      "High-converting websites for removals businesses. We design, build and manage everything. Low upfront cost, start today.",
    industry: "Removals",
    heroTitle: "Website Design for Removal Companies",
    heroSubtitle: "Build Trust and Win More Local Removal Contracts",
    checklist: [
      "No upfront cost on monthly plan",
      "Fully managed hosting & updates",
      "Built for lead generation",
    ],
    sections: [
      {
        title: "Is Your Removals Website Costing You Jobs?",
        description:
          "Moving home is stressful. If your website looks amateur or outdated, potential customers will worry about the safety of their belongings. A professional online presence is essential to winning high-value house and office removal contracts.",
        points: [
          "Outdated designs that fail to convey care and reliability",
          "Slow loading times that frustrate potential customers",
          "Not optimized for mobile — where many local searches happen",
          "No clear way to request a quote or view service areas",
          "Invisible on Google for local removals search terms",
          "Generic content that doesn't build local credibility",
        ],
      },
      {
        title: "What We Build for Local Removal Businesses",
        description:
          "We create professional, high-performance websites designed specifically to win more removals work.",
        points: [
          "Trustworthy & Reliable Design: Layouts that highlight your care and professional standards.",
          "Fast & Mobile-Responsive: Ensuring you're found by customers searching for movers on their phones.",
          "Lead-Focused: Clear calls-to-action, quote forms, and click-to-call buttons.",
          "Fully Managed Service: We handle all the technical details, security, and hosting.",
          "Regular Updates: We're here to add new services, testimonials, or areas whenever you need.",
          "Professional Copywriting: We write your service pages and location content for you.",
        ],
      },
      {
        title: "Removals SEO from the Ground Up",
        description:
          "We ensure your business is visible to people in your area searching for a mover.",
        points: [
          "Local Search Strategy: Targeting your specific service areas and towns.",
          "Technical Foundations: Built for speed and search engine visibility.",
          "Rich Schema Markup: Helping Google understand your services and location.",
          "Secure & Reliable: SSL certificates and secure hosting included.",
        ],
      },
      {
        title: "Our Simple Build Process",
        description: "Get your new removals website live without any stress:",
        points: [
          "1. Build: We design and write your new site, focusing on your specific removals services.",
          "2. Review: You check the preview link and let us know if any tweaks are needed.",
          "3. Launch: We handle the launch and set up your hosting and Google submission.",
          "4. Manage: We take care of everything ongoing so you can focus on your jobs.",
        ],
      },
    ],
  },
  "removals-web-design-luton": {
    url: "removals-web-design-luton",
    keyword: "Web design for removal companies in Luton",
    metaTitle: "Removals Website Design Luton | Get More Enquiries",
    metaDescription:
      "We build high-converting websites for removal companies in Luton. Get more enquiries today.",
    industry: "Removals",
    location: "Luton",
    heroTitle: "Removals Website Design in Luton",
    heroSubtitle: "Professional websites for Luton's best removal services",
    checklist: ["No upfront cost", "Lead-focused build", "Fully managed"],
    sections: [
      {
        title: "Why Luton Removal Businesses Need a Better Website",
        description:
          "Luton is a busy, competitive market for removals. To win the best residential and commercial jobs, you need to look more professional than the competition. A DIY site or a basic listing isn't enough to build the trust needed for moving belongings.",
        points: [
          "Not appearing for local Luton removals searches",
          "Unprofessional designs that don't convey care and reliability",
          "Hard-to-use mobile sites for customers searching on the go",
          "No clear way for Luton customers to contact you or request a quote",
          "Sites that load too slowly, causing customers to call someone else",
        ],
      },
      {
        title: "Our Luton Removals Package",
        description: "We build websites that generate more work for your Luton removals business.",
        points: [
          "Luton-Specific SEO: Targeting the towns and neighborhoods you serve.",
          "Trust-Building Layout: Highlighting your care and professional standards.",
          "Lead-Driven Design: Built to turn visitors into quote requests.",
          "Managed Hosting: 100% uptime and high security standard.",
          "Ongoing Maintenance: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Serving Luton and the Surrounding Area",
        description:
          "From Round Green to Sundon Park, we make sure your removals services are seen by every household and business across Luton.",
      },
      {
        title: "The Luton Launch Roadmap",
        points: [
          "Phase 1: Build & Content.",
          "Phase 2: Review & Approve.",
          "Phase 3: Managed Launch.",
          "Phase 4: Ongoing Support.",
        ],
      },
    ],
  },
  "removals-web-design-bedford": {
    url: "removals-web-design-bedford",
    keyword: "Web design for removal companies in Bedford",
    metaTitle: "Removals Website Design Bedford | Low-Cost Build",
    metaDescription:
      "Affordable websites for removal companies in Bedford. Fully managed and built to convert.",
    industry: "Removals",
    location: "Bedford",
    heroTitle: "Removals Website Design in Bedford",
    heroSubtitle: "High-performance websites for Bedfordshire's removal services",
    checklist: ["No upfront cost", "Managed launch", "Lead-focused design"],
    sections: [
      {
        title: "The Bedford Removals Market is Competitive",
        description:
          "To win the best jobs in Bedford, your website needs to look professional, load fast, and rank well on Google. Anything less is costing you enquiries.",
        points: [
          "Invisible on Google for 'removals Bedford' searches",
          "Outdated designs that don't reflect your care and reliability",
          "Poor mobile performance for customers searching on their phones",
          "No clear call-to-action for Bedford customers",
          "Slow loading speeds causing visitors to leave",
        ],
      },
      {
        title: "Our Bedford Build Strategy",
        description: "We create removals websites that dominate the Bedford market.",
        points: [
          "Bedford-Focused SEO: Targeting the MK40, MK41 and MK42 areas.",
          "Service-Driven Design: Highlighting your specific removals expertise.",
          "Fully Managed: Hosting, security, and updates all handled.",
          "Lead Generation: Built to convert visitors into booked jobs.",
          "Local Content: We write about your services in Bedford.",
        ],
      },
      {
        title: "Serving Every Part of Bedford",
        description:
          "We ensure your business is visible to customers across the entire Bedford area, including surrounding villages.",
      },
      {
        title: "Getting Live in Bedford",
        points: [
          "1. Rapid Development.",
          "2. Client Sign-off.",
          "3. Managed Launch.",
          "4. Ongoing Care.",
        ],
      },
    ],
  },
  "removals-web-design-dunstable": {
    url: "removals-web-design-dunstable",
    keyword: "Web design for removal companies in Dunstable",
    metaTitle: "Removals Website Design Dunstable | More Bookings",
    metaDescription:
      "Get more bookings with a modern removals website in Dunstable. Low upfront cost.",
    industry: "Removals",
    location: "Dunstable",
    heroTitle: "Removals Website Design in Dunstable",
    heroSubtitle: "Win more removals work across Dunstable and LU postcode areas",
    checklist: ["No upfront cost", "Managed launch", "Lead-focused build"],
    sections: [
      {
        title: "Dunstable Removal Businesses Need a Better Online Presence",
        description:
          "When people in Dunstable are moving house, they search online. If your website isn't there, or if it doesn't look professional, you're missing out on jobs.",
        points: [
          "Not ranking for 'removals Dunstable' or 'house removals Dunstable'",
          "Amateur designs that don't inspire confidence in your reliability",
          "Sites that don't work properly on mobile devices",
          "Missing or hidden contact information for Dunstable customers",
          "Generic content that doesn't mention your Dunstable service areas",
        ],
      },
      {
        title: "What We Build for Dunstable Removal Businesses",
        description: "We create websites that turn Dunstable locals into loyal clients.",
        points: [
          "Dunstable-Specific SEO: Targeting the LU5 and LU6 areas.",
          "Trust-Building Design: Showcasing your standards and experience.",
          "Fully Managed: Hosting, security, and maintenance all taken care of.",
          "Lead-Gen Focused: Clear buttons and forms to capture enquiries.",
          "Local Copywriting: We write your Dunstable-focused content for you.",
        ],
      },
      {
        title: "Covering the Entire Dunstable Area",
        description:
          "We make sure your removals services are visible to every household across Dunstable and the surrounding villages.",
      },
      {
        title: "The Dunstable Roadmap",
        points: [
          "Consult & Build.",
          "Preview & Feedback.",
          "Launch & SEO Setup.",
          "Ongoing Management.",
        ],
      },
    ],
  },
  "removals-web-design-milton-keynes": {
    url: "removals-web-design-milton-keynes",
    keyword: "Web design for removal companies in Milton Keynes",
    metaTitle: "Removals Website Design Milton Keynes | Fast Setup",
    metaDescription:
      "Professional removals websites in Milton Keynes. Designed to generate leads quickly.",
    industry: "Removals",
    location: "Milton Keynes",
    heroTitle: "Removals Website Design in Milton Keynes",
    heroSubtitle: "Modern websites for Milton Keynes' best removal services",
    checklist: ["No upfront cost", "SEO-optimized", "Fully managed"],
    sections: [
      {
        title: "Standing Out in the Milton Keynes Removals Market",
        description:
          "Milton Keynes is a modern, fast-growing city. Your website needs to reflect that with a clean, professional design that builds trust with both homeowners and commercial clients.",
        points: [
          "Outdated sites that don't match the modern Milton Keynes feel",
          "Invisible on Google for competitive MK removals searches",
          "Failing to capture the growing commercial market in Milton Keynes",
          "Poor mobile performance for customers searching on the go",
          "Lack of clear 'Book a Quote' or 'Call Now' buttons",
        ],
      },
      {
        title: "Our Milton Keynes Removals Package",
        description:
          "We build high-spec websites for high-performing removal companies in Milton Keynes.",
        points: [
          "Milton Keynes Grid Targeting: SEO strategy for all MK areas.",
          "Modern, Professional Design: Layouts that inspire confidence.",
          "Fully Managed Infrastructure: Fast, secure, and always live.",
          "Lead Generation Focus: Built to convert MK visitors into jobs.",
          "Ongoing Support: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Serving All of Milton Keynes",
        description:
          "From Tattenhoe to Woburn Sands, we ensure your removals business is seen by everyone across Milton Keynes.",
      },
      {
        title: "Getting Live in Milton Keynes",
        points: ["1. Build & Design.", "2. Review Link.", "3. Managed Launch.", "4. Ongoing Care."],
      },
    ],
  },
  "removals-web-design-st-albans": {
    url: "removals-web-design-st-albans",
    keyword: "Web design for removal companies in St Albans",
    metaTitle: "Removals Website Design St Albans | Lead Focused",
    metaDescription:
      "Lead-focused websites for removal companies in St Albans. Simple pricing, low upfront cost.",
    industry: "Removals",
    location: "St Albans",
    heroTitle: "Removals Website Design in St Albans",
    heroSubtitle: "A premium online presence for St Albans' removals experts",
    checklist: ["No upfront cost", "Premium design", "Local SEO built-in"],
    sections: [
      {
        title: "St Albans Customers Demand High Standards",
        description:
          "In St Albans, first impressions are critical. To win high-value residential and commercial removals contracts, your website must convey absolute professionalism and care.",
        points: [
          "Amateur-looking sites that don't reflect St Albans quality",
          "Not ranking for 'movers St Albans' or 'removals contractor AL1'",
          "Poor mobile experience for busy, affluent customers",
          "Lack of clear information on standards and reliability",
          "Slow performance causing high bounce rates",
        ],
      },
      {
        title: "The St Albans Removals Package",
        description:
          "Websites that reflect the premium quality of your St Albans removals business.",
        points: [
          "High-End Design: Clean, elegant, and trustworthy layouts.",
          "St Albans-Focused SEO: Targeting AL1, AL2 and AL3 postcode areas.",
          "Fully Managed hosting: Secure, reliable, and lightning fast.",
          "Professional Copywriting: We write your service and area content.",
          "Continuous Management: We're here for any changes you need.",
        ],
      },
      {
        title: "Serving St Albans and the Surrounding Area",
        description:
          "We make sure your removals business is seen across the entire St Albans area, including Harpenden and neighboring villages.",
      },
      {
        title: "The St Albans Roadmap",
        points: [
          "Blueprint & Content.",
          "Build & Design.",
          "Review & Feedback.",
          "Launch & SEO Setup.",
        ],
      },
    ],
  },
  "removals-web-design-watford": {
    url: "removals-web-design-watford",
    keyword: "Web design for removal companies in Watford",
    metaTitle: "Removals Website Design Watford | Done For You Service",
    metaDescription:
      "Done-for-you removal websites in Watford. We handle everything so you don’t have to.",
    industry: "Removals",
    location: "Watford",
    heroTitle: "Removals Website Design in Watford",
    heroSubtitle: "Win more removals work across Watford and Southwest Herts",
    checklist: ["No upfront cost", "Lead-generation focus", "Fully managed"],
    sections: [
      {
        title: "Watford Removal Businesses Need Fast, Lead-Gen Sites",
        description:
          "Watford is a busy hub. When someone needs a mover, Watford customers need to find you and contact you instantly. If your site is slow or hard to use, you're losing jobs.",
        points: [
          "Not ranking for Watford-specific removals searches",
          "Frustrating mobile experience for customers in a hurry",
          "Unprofessional designs that don't build Watford trust",
          "Hidden or hard-to-find contact information on mobile",
          "Generic content that doesn't mention Watford or local areas",
        ],
      },
      {
        title: "Our Watford Success Strategy",
        description: "We build removals websites that dominate the Watford market.",
        points: [
          "Watford-Centric SEO: Ranking for WD17, WD18 and WD19 areas.",
          "Professional Design: Conveying reliability and standards to Watford clients.",
          "Fully Managed Infrastructure: Fast, secure, and always live.",
          "Lead-Driven Design: Built to turn Watford visitors into booked jobs.",
          "Ongoing Support: We handle the technical side so you don't have to.",
        ],
      },
      {
        title: "Covering Every Part of Watford",
        description:
          "We make sure your removals business is visible to every household across the entire Watford area.",
      },
      {
        title: "Getting Live in Watford",
        points: [
          "1. Strategic Development.",
          "2. Preview & Sign-off.",
          "3. Managed Launch.",
          "4. Continuous Management.",
        ],
      },
    ],
  },
});
