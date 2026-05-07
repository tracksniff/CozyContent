export interface SEOPageContentSection {
  title: string;
  subtitle?: string;
  points?: string[];
  description?: string;
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
}

export const seoPagesData: Record<string, SEOPageInfo> = {
  // Plumbing
  "plumber-web-design": {
    url: "plumber-web-design",
    keyword: "Web design for plumbers",
    metaTitle: "Website Design for Plumbers | From £59 Per Month",
    metaDescription: "We build high-converting websites for plumbers. Modern, fast and fully managed from 59 per month. Get more leads today.",
    industry: "Plumbing"
  },
  "plumber-web-design-luton": {
    url: "plumber-web-design-luton",
    keyword: "Web design for plumbers in Luton",
    metaTitle: "Plumber Website Design Luton | From £59 per month",
    metaDescription: "Professional website design for plumbers in Luton. Modern, fast-loading sites from £59 per month.",
    industry: "Plumbing",
    location: "Luton",
    heroTitle: "Plumber Website Design in Luton",
    heroSubtitle: "Turn Google searches into booked jobs — without lifting a finger",
    checklist: ["No upfront cost", "Fully managed — we handle everything", "Designed to generate calls and quote requests"],
    sections: [
      {
        title: "Why Luton Plumbers Are Losing Work Online",
        description: "With so many tradespeople operating across Luton, the ones who consistently win new customers aren't necessarily the most experienced — they're the most visible. If your website looks tired, takes too long to load, or isn't optimised for mobile, you're giving those enquiries away.",
        points: [
          "Designs that haven't been updated in years — instantly undermining trust",
          "Pages that load too slowly on mobile, causing visitors to bounce",
          "No clear way for customers to call or request a quote quickly",
          "Little to no local SEO — invisible to Luton searches on Google",
          "Generic content that could belong to any plumber, anywhere"
        ]
      },
      {
        title: "What You Get with a Cosy Content Website",
        description: "Every site we build for Luton plumbers is a lead generation tool — not just a digital business card. Here's what's included as standard:",
        points: [
          "Professional Design: A clean, modern layout that builds confidence the moment someone lands on your page.",
          "Mobile-First Build: The majority of plumbing searches happen on phones. Your site will look and perform perfectly on every device.",
          "Calls to Action That Work: Prominent phone numbers, quote request buttons, and contact forms positioned where customers expect them.",
          "Fully Managed Service: Hosting, security, updates — all taken care of. You focus on the plumbing; we'll look after the website.",
          "Ongoing Changes Included: Need to add a new service area or update your pricing? Just drop us a message."
        ]
      },
      {
        title: "Built Around How Luton Customers Search",
        description: "We know how people in Luton find a plumber. Whether they're dealing with a burst pipe at 11pm or shopping around for a bathroom installation, they search differently — and your website needs to speak to both. Your site will be structured to capture searches like emergency plumber Luton, boiler repair Luton, and local plumber near me — covering both urgent jobs and planned work."
      },
      {
        title: "Local SEO Built In From the Start",
        description: "Ranking on Google in Luton takes more than having a website — it takes a site that's been built with search in mind from day one. Every site we create includes:",
        points: [
          "Technical Foundations: Fast page speeds to satisfy Google's Core Web Vitals, clean site structure, XML sitemaps.",
          "Luton-Specific Local SEO: Dedicated pages for the areas you cover across Luton, Google Business Profile optimisation guidance.",
          "Schema & Structured Data: LocalBusiness, Service and FAQ schema markup, llms.txt for visibility in AI-powered search tools."
        ]
      },
      {
        title: "The Process — Simple from Start to Finish",
        points: [
          "1. We build your site: We design and write your new Luton plumbing website — no input needed from you beyond a few basic details.",
          "2. You review and approve: We'll send you a preview link. If anything needs tweaking, just say the word.",
          "3. It goes live: We handle the launch, the hosting setup, and the Google submission.",
          "4. We manage everything ongoing: Updates, security, changes — all handled as part of your plan."
        ]
      }
    ]
  },
  "plumber-web-design-bedford": {
    url: "plumber-web-design-bedford",
    keyword: "Web design for plumbers in Bedford",
    metaTitle: "Plumber Website Design Bedford | Affordable & Fast",
    metaDescription: "Affordable websites for plumbers in Bedford. We build and manage your site so you can focus on jobs.",
    industry: "Plumbing",
    location: "Bedford",
    heroTitle: "Plumber Website Design in Bedford",
    heroSubtitle: "A website that brings in enquiries — even while you're on a job",
    checklist: ["No upfront payment required", "We write the content, handle the build, manage the hosting", "Priced for sole traders and small plumbing businesses"],
    sections: [
      {
        title: "The Problem with Most Plumbing Websites in Bedford",
        description: "The honest truth is that most tradespeople's websites in Bedford were built once and forgotten about. They might have seemed fine at the time, but the web has moved on significantly — and a slow, outdated site can actually do more harm than having no site at all. Customers searching for a plumber in Bedford make snap decisions. If your site takes more than three seconds to load, or they can't immediately find a phone number, they're gone — straight to a competitor.",
        points: [
          "Slow load times that lose visitors before the page even appears",
          "No mobile optimisation — difficult to use on a smartphone",
          "Contact details buried or hard to find",
          "Missing from local Google searches despite years in business",
          "No trust signals — no reviews, accreditations, or guarantees highlighted"
        ]
      },
      {
        title: "Everything Included — Nothing Left Out",
        description: "When we build a website for a Bedford plumber, it's not a template with your name dropped in. Every site is tailored to your business, your service area, and the kind of jobs you want more of.",
        points: [
          "Conversion-Led Design: Laid out to guide visitors towards calling or requesting a quote — not just browsing and leaving.",
          "Written for You: We handle the copywriting. No need to write a word yourself.",
          "Speed Optimised: Fast-loading pages that keep visitors engaged and satisfy Google's ranking requirements.",
          "Managed Hosting Included: Your site lives on our reliable hosting infrastructure — no separate bills to worry about.",
          "Flexible Updates: As your business changes, your website can too. Up to five updates per month included on the monthly plan."
        ]
      },
      {
        title: "Designed to Rank for Bedford Plumbing Searches",
        description: "Appearing on the first page of Google for searches like plumber Bedford or emergency plumber Bedford MK40 takes a site built with local SEO in mind — not just one that looks good. Every site we build is structured from the ground up to compete in local search results, covering the areas Bedford plumbers actually serve.",
        points: [
          "Technical SEO: Optimised page speed scores, properly structured URLs, Search Console setup.",
          "Local Visibility: Service area pages covering Bedford and surrounding towns, location signals built into page content.",
          "Structured Data & Future-Proofing: LocalBusiness and Service schema, FAQ schema for featured snippets, llms.txt for AI search visibility."
        ]
      },
      {
        title: "How We Work With You",
        points: [
          "Step 1: Tell us about your business — the areas you cover, the jobs you want more of.",
          "Step 2: We build it. Design, copy, structure, SEO setup — all done by our team.",
          "Step 3: You review it. We'll make any changes before anything goes live.",
          "Step 4: We launch it and manage it. You get on with the plumbing."
        ]
      }
    ]
  },
  "plumber-web-design-dunstable": {
    url: "plumber-web-design-dunstable",
    keyword: "Web design for plumbers in Dunstable",
    metaTitle: "Plumber Website Design Dunstable | Get More Leads",
    metaDescription: "Outdated plumbing website? We design modern sites for plumbers in Dunstable. Fully managed, fast turnaround.",
    industry: "Plumbing",
    location: "Dunstable",
    heroTitle: "Plumber Website Design in Dunstable",
    heroSubtitle: "Stop relying on referrals — start getting found on Google",
    checklist: ["Nothing to pay upfront", "Content written by our team — not AI-generated filler", "Designed specifically to win local plumbing jobs"],
    sections: [
      {
        title: "Why Word-of-Mouth Alone Isn't Enough in Dunstable",
        description: "Referrals are great — but they're unpredictable. A slow month can follow a busy one, and there's no way to control the flow. A well-optimised website changes that, giving you a reliable source of new enquiries that doesn't depend on who happens to mention your name.",
        points: [
          "No Google presence — nowhere to be found for local searches",
          "A website that looks amateur compared to local competitors",
          "Pages that aren't set up for the specific areas you cover",
          "No clear call-to-action — visitors aren't sure what to do next",
          "Slow performance that pushes you down in search rankings"
        ]
      },
      {
        title: "A Website That Works as Hard as You Do",
        description: "Everything we include is chosen because it helps convert visitors into paying customers — nothing is added just to pad things out.",
        points: [
          "A Design That Builds Confidence: First impressions count. A polished, professional site tells customers you take your work seriously.",
          "Optimised for Phones: Most people searching for a local plumber in Dunstable are doing it on their mobile.",
          "Content Written for You: We write all the copy, so you don't have to stare at a blank page wondering what to say.",
          "No Tech Worries: Hosting, SSL certificates, security updates — all sorted.",
          "Easy Changes: Need to update your service list or add a new area? Just let us know."
        ]
      },
      {
        title: "Getting Found in Dunstable — How We Do It",
        description: "Dunstable sits within a competitive search area that includes Luton and Houghton Regis. Standing out in local results requires more than just having a website — it requires a site that signals clearly to Google that you're a credible local business.",
        points: [
          "On-Page SEO: Pages written around the actual terms Dunstable customers search for, proper title tags and headings.",
          "Location Relevance: Dedicated coverage for Dunstable and nearby areas like Houghton Regis and Kensworth.",
          "Technical & Schema: LocalBusiness schema to enhance your Google listing, Core Web Vitals optimisation, llms.txt for AI search compatibility."
        ]
      },
      {
        title: "From Briefing to Live in a Few Simple Steps",
        points: [
          "First: You tell us about your business — what you do, where you work, and any must-haves.",
          "Then: We design, write, and build the whole thing. No back-and-forth.",
          "Next: You get a chance to review and request any changes before we publish.",
          "After that: It goes live and we take care of everything from there — hosting and updates."
        ]
      }
    ]
  },
  "plumber-web-design-milton-keynes": {
    url: "plumber-web-design-milton-keynes",
    keyword: "Web design for plumbers in Milton Keynes",
    metaTitle: "Plumber Website Design Milton Keynes | Lead Generation",
    metaDescription: "Get a high-converting plumber website in Milton Keynes. Fully managed with updates included",
    industry: "Plumbing",
    location: "Milton Keynes",
    heroTitle: "Plumber Website Design in Milton Keynes",
    heroSubtitle: "Tap into one of the UK's fastest-growing markets for tradespeople",
    checklist: ["Zero upfront cost on our monthly plan", "Tailored to Milton Keynes — not a generic template", "Built to compete in a fast-moving local market"],
    sections: [
      {
        title: "Milton Keynes Is a Competitive Market — Your Website Needs to Reflect That",
        description: "Because MK attracts so many tradespeople chasing the same pool of new-build and growing-family customers, the bar for what a plumbing website needs to do is higher here than in smaller towns. A basic site that lists your services and has a phone number is no longer enough.",
        points: [
          "Generic designs that look identical to every other tradesperson in the area",
          "No coverage of specific MK districts — missing out on hyper-local searches",
          "Slow page speeds that damage rankings in a competitive local market",
          "Missing trust signals — no reviews, qualifications, or guarantees mentioned",
          "Not optimised for the mix of emergency and planned work MK customers search for"
        ]
      },
      {
        title: "What Makes Our MK Plumber Websites Different",
        description: "We don't use cookie-cutter templates. Every site is built to reflect your specific business, the areas of Milton Keynes you cover, and the type of work you want to attract most.",
        points: [
          "District-Level Content: Whether you focus on Central MK or the newer developments, we'll create targeting specific areas.",
          "Built for Conversions: Designed to make it simple for someone to contact you.",
          "Speed as Standard: MK customers expect things to work quickly. Your site will load fast on every device.",
          "Ongoing Management: As new areas of MK develop, your website can grow with it.",
          "Regular Updates Included: Need to promote a seasonal offer or update your service list? We'll make changes promptly."
        ]
      },
      {
        title: "Ranking for Plumbing Searches Across Milton Keynes",
        description: "MK has one of the most complex postcodes of any town in England — MK1 through MK19 — and customers often search with their specific area in mind. We build sites that capture this by targeting both broad MK searches and specific district-level terms.",
        points: [
          "Keyword and Content Strategy: Pages targeting plumber Milton Keynes alongside district-specific terms.",
          "Technical SEO: Core Web Vitals optimisation for stronger Google rankings, Search Console setup.",
          "Local Authority Signals: LocalBusiness and Service schema, Breadcrumb and FAQ schema, llms.txt for AI visibility."
        ]
      },
      {
        title: "Getting Started Is Simple",
        points: [
          "You brief us: Tell us which parts of MK you cover, what services you offer.",
          "We build everything: Design, copy, technical setup, and local SEO — our team handles all of it.",
          "You sign it off: Review the site before it goes live. We'll tweak anything needed.",
          "We manage it: Once it's live, we take care of the hosting, updates, and maintenance."
        ]
      }
    ]
  },
  "plumber-web-design-st-albans": {
    url: "plumber-web-design-st-albans",
    keyword: "Web design for plumbers in St Albans",
    metaTitle: "Plumber Website Design St Albans | Modern & Affordable",
    metaDescription: "We build modern websites for plumbers in St Albans. Improve your online presence and win more jobs.",
    industry: "Plumbing",
    location: "St Albans",
    heroTitle: "Plumber Website Design in St Albans",
    heroSubtitle: "Win more of the quality work that St Albans homeowners are looking for",
    checklist: ["No upfront cost — get started today", "Positions you as the go-to plumber in St Albans", "Managed entirely by our team — no time required from you"],
    sections: [
      {
        title: "The Standard Is Higher in St Albans — Your Website Should Match It",
        description: "St Albans homeowners are generally discerning. They research before they commit, and they pay close attention to how professional a tradesperson appears online. A poor website doesn't just fail to win work — it actively puts people off.",
        points: [
          "Designs that feel outdated — signalling the business hasn't kept pace",
          "No customer reviews or trust signals featured prominently",
          "Missing out on searches from surrounding villages like London Colney",
          "Not ranking for premium service searches such as bathroom installation",
          "Slow loading times on the high-end devices that AL1 and AL2 customers typically use"
        ]
      },
      {
        title: "A Website That Attracts the Work You Actually Want",
        description: "Not all enquiries are equal. A well-structured website can be built to attract the type of jobs you want more of — whether that's premium bathroom fitting, boiler installations, or reliable ongoing maintenance customers.",
        points: [
          "Polished, Trust-Building Design: A refined, professional look that resonates with St Albans homeowners.",
          "Tailored Content Strategy: We identify the searches most likely to bring in the jobs you want.",
          "Review Integration: We'll help you showcase testimonials and ratings in a way that builds trust quickly.",
          "Fully Handled: From the build to the hosting to updates — entirely managed on your behalf.",
          "Flexible Monthly Updates: Seasonal promotions, new services, extended coverage areas — just ask."
        ]
      },
      {
        title: "Ranking in St Albans and the Surrounding AL Postcodes",
        description: "St Albans sits within a cluster of desirable Hertfordshire postcodes — AL1 through AL4 — each with its own pool of potential customers. We build your site to capture searches across this wider area, not just the town itself.",
        points: [
          "Local SEO: Pages covering St Albans and the wider AL postcode area, targeting village areas.",
          "Technical Performance: Page speed optimised for high standards, secure and properly structured site.",
          "Long-Term Visibility: Future-proofed with llms.txt, FAQ schema, and regularly updated content."
        ]
      },
      {
        title: "Our Process — Straightforward From First Contact to Launch",
        points: [
          "Consultation: A brief conversation about your business, your target customer, and the areas you serve.",
          "Build: We create the full site — design, copywriting, SEO setup, and technical configuration.",
          "Review: You're sent a preview. We refine anything you're not completely happy with.",
          "Launch & manage: We take it live and manage everything from that point forward."
        ]
      }
    ]
  },
  "plumber-web-design-watford": {
    url: "plumber-web-design-watford",
    keyword: "Web design for plumbers in Watford",
    metaTitle: "Plumber Website Design Watford | Done For You",
    metaDescription: "Done-for-you plumber websites in Watford. We handle everything so you don’t have to.",
    industry: "Plumbing",
    location: "Watford",
    heroTitle: "Plumber Website Design in Watford",
    heroSubtitle: "Get ahead of the competition in one of Hertfordshire's busiest towns",
    checklist: ["No upfront cost on the monthly plan", "Built to outrank competitors in Watford search results", "Ongoing management — nothing for you to maintain"],
    sections: [
      {
        title: "Watford's Plumbing Market Rewards Visibility",
        description: "The sheer size of Watford's population — and its proximity to London — means there's a constant stream of residents and businesses searching for trustworthy local plumbers. The problem is that so many plumbers are competing for the same searches.",
        points: [
          "Ranking on page two or three of Google — where customers never scroll",
          "Websites that look fine on a desktop but break on mobile devices",
          "No presence in surrounding areas like Bushey, Oxhey, or Rickmansworth",
          "Calls to action that are too subtle — visitors don't know how to get in touch",
          "Out-of-date content that makes the business look inactive or unreliable"
        ]
      },
      {
        title: "What We Build for Watford Plumbers",
        description: "Every element of your website is chosen to help you win more local work. Nothing is included for show — it all has a purpose.",
        points: [
          "High-Impact Design: A confident, professional look that gives customers in Watford an immediate reason to stay.",
          "Structured for Leads: Phone numbers, quote forms, and clear descriptions positioned where expected.",
          "Mobile-Perfect: Built mobile-first from the start to capture searches happening on phones.",
          "Fully Managed Hosting: Your site is hosted on our fast, secure infrastructure. No technical upkeep.",
          "Regular Content Updates: Seasonal offers, new services, extended area coverage — all updated promptly."
        ]
      },
      {
        title: "Appearing in Watford's Local Search Results",
        description: "Watford sits in a dense search area that includes Hemel Hempstead, Harrow, and the wider WD postcode region. Getting your site to rank means going beyond the basics — it means building something Google genuinely trusts as a local authority.",
        points: [
          "Local Search Optimisation: Coverage of Watford alongside WD postcodes and surrounding towns like Bushey.",
          "Technical SEO: Fast load speeds to meet Core Web Vitals, properly structured URLs and metadata.",
          "Schema & Emerging Search: LocalBusiness, Service, and FAQ schema for richer Google results, llms.txt implementation."
        ]
      },
      {
        title: "How We Get You Live",
        points: [
          "Kick-off: You tell us about your Watford plumbing business — areas, services, and priorities.",
          "We build it: Full design, professional copywriting, local SEO setup, and technical configuration.",
          "You review it: We send you a preview and make any changes before anything goes live.",
          "We manage it: Launch, hosting, updates, and maintenance — all handled on an ongoing basis."
        ]
      }
    ]
  },

  // Electricians
  "electrician-web-design": {
    url: "electrician-web-design",
    keyword: "Web design for electricians",
    metaTitle: "Website Design for Electricians | Get More Leads",
    metaDescription: "We build high-converting websites for electricians built to generate enquiries. Fully managed from £59 per month. Start getting more jobs today.",
    industry: "Electrical"
  },
  "electrician-web-design-luton": {
    url: "electrician-web-design-luton",
    keyword: "Web design for electricians in Luton",
    metaTitle: "Electrician Website Design Luton | From £59 per month",
    metaDescription: "Professional websites for electricians in Luton. Fast, mobile-friendly and built to generate leads. From £59 per month.",
    industry: "Electrical",
    location: "Luton",
    heroTitle: "Electrician Website Design in Luton",
    heroSubtitle: "Get found by Luton homeowners looking for a reliable sparky",
    checklist: ["No upfront cost", "Fully managed", "Convert emergency and planned work"],
    sections: [
      {
        title: "Why Luton Electricians Lose Work Online",
        description: "Luton is a busy town, and when homeowners need an electrician, they go straight to Google. If you aren't on the first page, or if your site looks amateur, they'll call the next person on the list.",
        points: [
          "Outdated designs that don't build trust",
          "Slow loading times on mobile devices",
          "No clear emergency contact information",
          "Invisible to local Luton searches",
          "Difficult for customers to request a quote"
        ]
      },
      {
        title: "What Your Luton Electrician Website Will Include",
        description: "We don't just build a digital business card; we build a lead-generation tool tailored for the electrical trade.",
        points: [
          "Mobile-Optimised Layout: Looks perfect on every smartphone.",
          "Professional Copywriting: We write the words that sell your services.",
          "High-Speed Performance: Fast pages for better user experience and rankings.",
          "Clear Calls to Action: Make it easy for customers to call or message you.",
          "Fully Managed Service: We handle the tech so you can handle the tools."
        ]
      },
      {
        title: "Built Around How Luton Customers Search",
        description: "From emergency call-outs in the middle of the night to planned EICR inspections and rewires, your website will be structured to capture the full range of electrical work in Luton."
      },
      {
        title: "Local SEO for Luton Electricians",
        description: "We ensure your business shows up for searches like 'electrician Luton', 'emergency electrician near me', and 'EV charger installation Luton'.",
        points: [
          "Technical SEO foundations",
          "LocalBusiness schema markup",
          "Google Business Profile optimisation advice"
        ]
      },
      {
        title: "Our Simple Process",
        points: [
          "1. Brief: Tell us about your business.",
          "2. Build: We design and write everything.",
          "3. Review: You sign off on the design.",
          "4. Live: We launch and manage your site."
        ]
      }
    ]
  },
  "electrician-web-design-bedford": {
    url: "electrician-web-design-bedford",
    keyword: "Web design for electricians in Bedford",
    metaTitle: "Electrician Website Design Bedford | Get More Jobs",
    metaDescription: "Need more electrician leads in Bedford? We design high-converting websites with low upfront cost.",
    industry: "Electrical",
    location: "Bedford",
    heroTitle: "Electrician Website Design in Bedford",
    heroSubtitle: "A website that works as hard as you do to win Bedford clients",
    checklist: ["Nothing to pay upfront", "We write every word", "Attract urgent and planned projects"],
    sections: [
      {
        title: "Why Bedford Electricians Struggle Online",
        description: "Many electricians in Bedford rely on word-of-mouth, which is great until it dries up. A professional website ensures a steady stream of enquiries year-round.",
        points: [
          "No presence on Google for Bedford searches",
          "Websites that don't work on mobile phones",
          "Poorly explained services leading to bad leads",
          "Lack of trust signals like reviews and certifications",
          "Hard-to-find contact details"
        ]
      },
      {
        title: "Complete Electrician Website Package",
        description: "Everything you need to stand out in the Bedford electrical market.",
        points: [
          "Bespoke Design: Not a generic template.",
          "Lead-Focused Content: Written specifically for the electrical trade.",
          "Managed Hosting: Fast and secure infrastructure included.",
          "SEO Ready: Built to rank from day one.",
          "Ongoing Updates: We make changes whenever you need them."
        ]
      },
      {
        title: "Ranking Across Bedford",
        description: "We target the specific postcodes and areas you serve in Bedford, ensuring you appear for 'electrician Bedford' and surrounding village searches."
      },
      {
        title: "How We Work",
        points: [
          "Step 1: We gather your info.",
          "Step 2: Our team builds your site.",
          "Step 3: You review and approve.",
          "Step 4: Launch and ongoing management."
        ]
      }
    ]
  },
  "electrician-web-design-dunstable": {
    url: "electrician-web-design-dunstable",
    keyword: "Web design for electricians in Dunstable",
    metaTitle: "Electrician Website Design Dunstable | Affordable & Fast",
    metaDescription: "Affordable electrician websites in Dunstable. We design, build and manage everything for you. Low upfront cost.",
    industry: "Electrical",
    location: "Dunstable",
    heroTitle: "Electrician Website Design in Dunstable",
    heroSubtitle: "Put your electrical business in front of Dunstable customers first",
    checklist: ["No payment required upfront", "All content written for you", "Built to rank locally"],
    sections: [
      {
        title: "Solving the Trust Problem for Dunstable Electricians",
        description: "Homeowners in Dunstable want to know they are hiring a professional. A clean, modern website with your certifications and reviews builds that trust instantly.",
        points: [
          "Amateur looking websites that scare off big jobs",
          "Slow page speeds that frustrate users",
          "No mobile optimisation for on-the-go searches",
          "Missing out on local Dunstable traffic",
          "Generic content that doesn't showcase your expertise"
        ]
      },
      {
        title: "Everything Your Dunstable Electrical Website Needs",
        description: "We include everything necessary to turn visitors into quote requests.",
        points: [
          "Conversion-Optimised Layout",
          "Professional Industry Copywriting",
          "Fast & Secure Hosting",
          "Local SEO Setup",
          "Monthly Maintenance & Updates"
        ]
      },
      {
        title: "Ranking in Dunstable",
        description: "We help you dominate local search for 'electrician Dunstable', 'fuse board upgrade Dunstable', and 'rewires Dunstable'."
      },
      {
        title: "How We Get You Live",
        points: [
          "Discovery: We learn about your services.",
          "Creation: We build the full site.",
          "Approval: You review the draft.",
          "Growth: We launch and manage it."
        ]
      }
    ]
  },
  "electrician-web-design-milton-keynes": {
    url: "electrician-web-design-milton-keynes",
    keyword: "Web design for electricians in Milton Keynes",
    metaTitle: "Electrician Website Design Milton Keynes | Fast Setup",
    metaDescription: "Get a modern electrician website in Milton Keynes quickly. Fully managed and built to convert. Low upfront cost.",
    industry: "Electrical",
    location: "Milton Keynes",
    heroTitle: "Electrician Website Design in Milton Keynes",
    heroSubtitle: "Tap into MK's booming demand for electrical services",
    checklist: ["Zero upfront cost", "Targeting grid squares", "Built for domestic and commercial"],
    sections: [
      {
        title: "MK Electricians Need a Website That Goes Further",
        description: "Milton Keynes is a unique and competitive market. Your website needs to handle everything from domestic repairs to large-scale commercial installs.",
        points: [
          "Missing out on specific grid square searches",
          "Not appearing for new-build electrical work",
          "Slow performance in a tech-savvy town",
          "Weak mobile experience",
          "No clear differentiation from competitors"
        ]
      },
      {
        title: "What We Build for MK Electricians",
        description: "Advanced features and professional design for the modern MK market.",
        points: [
          "High-Impact Visual Design",
          "Strategic Service Area Targeting",
          "Ultra-Fast Load Speeds",
          "Expert Local SEO foundations",
          "Regular Technical Support"
        ]
      },
      {
        title: "Ranking Across MK's Complex Postcodes",
        description: "We ensure you are visible from Bletchley to Newport Pagnell and everywhere in between."
      },
      {
        title: "Straightforward Process",
        points: [
          "1. Strategic briefing.",
          "2. Professional build.",
          "3. Quality sign-off.",
          "4. Managed launch."
        ]
      }
    ]
  },
  "electrician-web-design-st-albans": {
    url: "electrician-web-design-st-albans",
    keyword: "Web design for electricians in St Albans",
    metaTitle: "Electrician Website Design St Albans | Lead Generation",
    metaDescription: "We create lead-generating websites for electricians in St Albans. Simple pricing, low upfront cost.",
    industry: "Electrical",
    location: "St Albans",
    heroTitle: "Electrician Website Design in St Albans",
    heroSubtitle: "Attract the quality electrical work St Albans homeowners are looking for",
    checklist: ["No upfront cost", "Built to attract quality work", "Fully managed"],
    sections: [
      {
        title: "St Albans Customers Expect More",
        description: "In St Albans, homeowners value quality and professionalism. If your website doesn't look the part, you're missing out on the best jobs in AL1 and AL2.",
        points: [
          "Designs that don't match St Albans standards",
          "No focus on premium electrical services",
          "Missing local search traffic",
          "Slow and unresponsive layouts",
          "Poor trust signals and accreditation visibility"
        ]
      },
      {
        title: "A Website That Attracts St Albans' Best Jobs",
        description: "We position you as the premium choice for electrical work in St Albans.",
        points: [
          "Elegant & Professional Design",
          "Tailored Service Pages (Rewires, Smart Home, EICR)",
          "Performance Optimisation",
          "Comprehensive Local SEO",
          "Continuous Managed Service"
        ]
      },
      {
        title: "Ranking in St Albans",
        description: "Dominate search results for 'electrician St Albans' and 'St Albans electrical contractor'."
      },
      {
        title: "Our Process",
        points: [
          "Consult: Define your ideal jobs.",
          "Create: We build your high-end site.",
          "Perfect: You request any final tweaks.",
          "Manage: We take care of everything ongoing."
        ]
      }
    ]
  },
  "electrician-web-design-watford": {
    url: "electrician-web-design-watford",
    keyword: "Web design for electricians in Watford",
    metaTitle: "Electrician Website Design Watford | Done For You",
    metaDescription: "Done-for-you websites for electricians in Watford. No hassle, low upfront cost. Start getting more enquiries.",
    industry: "Electrical",
    location: "Watford",
    heroTitle: "Electrician Website Design in Watford",
    heroSubtitle: "Get found by Watford homeowners looking for an electrician",
    checklist: ["No upfront cost", "Fully managed", "Built for Watford businesses"],
    sections: [
      {
        title: "Why Watford Electricians Lose Work",
        description: "Watford is a highly competitive area. To win work here, you need to be visible and look more professional than the competition.",
        points: [
          "Low Google rankings in the WD postcode",
          "Websites that break on mobile",
          "No clear way to get a quote",
          "Missing out on emergency call-out traffic",
          "Outdated design reducing credibility"
        ]
      },
      {
        title: "What Your Watford Electrician Website Will Include",
        description: "A complete solution designed to generate more electrical leads in Watford.",
        points: [
          "Modern, Fast-Loading Design",
          "Mobile-First Build",
          "Professional Copywriting",
          "Local SEO Targeting Watford & Bushey",
          "Reliable Hosting & Support"
        ]
      },
      {
        title: "Built Around How Watford Customers Search",
        description: "We target exactly what Watford residents are searching for, from emergency repairs to electric vehicle charger installations."
      },
      {
        title: "Local SEO for Watford",
        description: "Appearing for 'electrician Watford' and 'Watford electrical services' is our priority."
      },
      {
        title: "Simple Process",
        points: [
          "1. Discovery call.",
          "2. Full website build.",
          "3. Review & launch.",
          "4. 24/7 management."
        ]
      }
    ]
  },

  // Roofers
  "roofer-web-design": {
    url: "roofer-web-design",
    keyword: "web design for roofers",
    metaTitle: "Website Design for Roofers | More Enquiries",
    metaDescription: "We design websites for roofing companies that convert visitors into leads. Modern, fast and fully managed from £59 per month.",
    industry: "Roofing"
  },
  "roofer-web-design-luton": {
    url: "roofer-web-design-luton",
    keyword: "web design for roofers in Luton",
    metaTitle: "Roofer Website Design Luton | Get More Enquiries",
    metaDescription: "We design high-converting roofing websites in Luton. Modern, fast and built to generate leads. Tiny upfront cost.",
    industry: "Roofing",
    location: "Luton",
    heroTitle: "Roofer Website Design in Luton",
    heroSubtitle: "Win more roofing contracts across Luton and Bedfordshire",
    checklist: ["No upfront cost", "Showcase your portfolio", "Built for high-value leads"],
    sections: [
      {
        title: "Why Luton Roofers Need a Stronger Online Presence",
        description: "Roofing is a high-ticket service. Customers in Luton won't just hire anyone; they want to see proof of quality and a professional appearance. If your website is non-existent or outdated, you're handing work to your competitors.",
        points: [
          "Customers can't find you for local roofing searches",
          "Lack of high-quality project galleries",
          "Slow loading times on mobile devices",
          "No trust signals (guarantees, insurance, reviews)",
          "Difficult for customers to request a free quote"
        ]
      },
      {
        title: "What Your Luton Roofing Website Will Do",
        description: "We build websites that act as your best salesperson, 24/7.",
        points: [
          "Gallery-Focused Design: Highlight your best work.",
          "Mobile-Optimised: Perfect for local searches on the go.",
          "Lead-Generation Forms: Easy quote requests for homeowners.",
          "Local SEO: Rank for 'roofer Luton' and 'roof repairs Luton'.",
          "Managed Service: We handle all the updates and hosting."
        ]
      },
      {
        title: "Built Around How Luton Customers Search",
        description: "Whether it's an emergency leak after a storm or a planned re-roof, we ensure your business is the first one they see."
      },
      {
        title: "Local SEO for Luton Roofers",
        description: "We target the specific roofing services Luton residents need most.",
        points: [
          "Technical SEO setup",
          "Location-specific service pages",
          "Review and trust badge integration"
        ]
      },
      {
        title: "Simple Process",
        points: [
          "1. Strategic briefing.",
          "2. Custom build.",
          "3. Review and sign-off.",
          "4. Managed launch."
        ]
      }
    ]
  },
  "roofer-web-design-bedford": {
    url: "roofer-web-design-bedford",
    keyword: "web design for roofers in Bedford",
    metaTitle: "Roofer Website Design Bedford | Affordable & Modern",
    metaDescription: "Professional roofing websites in Bedford. We handle everything so you can focus on jobs. Low upfront cost.",
    industry: "Roofing",
    location: "Bedford",
    heroTitle: "Roofer Website Design in Bedford",
    heroSubtitle: "A professional website that helps you win more Bedford roofing jobs",
    checklist: ["Nothing to pay upfront", "Professional project galleries", "Managed hosting and updates"],
    sections: [
      {
        title: "Stand Out in the Bedford Roofing Market",
        description: "With so many roofers operating in Bedford, your website needs to prove why you're the best choice. A professional site builds the trust needed for large contracts.",
        points: [
          "Invisible on Google for 'roofer Bedford' searches",
          "Websites that don't display well on phones",
          "No easy way for clients to request a quote",
          "Lack of professional photos of past work",
          "Outdated information reducing customer confidence"
        ]
      },
      {
        title: "Complete Roofing Website Solution",
        description: "Everything you need to grow your roofing business in Bedford.",
        points: [
          "Modern, Fast-Loading Design",
          "Custom Portfolio Sections",
          "Managed SEO & Content",
          "Secure & Reliable Hosting",
          "Unlimited Minor Updates"
        ]
      },
      {
        title: "Ranking Across Bedford",
        description: "We help you capture local searches across the MK40-MK45 postcode areas."
      },
      {
        title: "How We Work",
        points: [
          "Step 1: Consultation.",
          "Step 2: Design & Build.",
          "Step 3: Client Review.",
          "Step 4: Launch."
        ]
      }
    ]
  },
  "roofer-web-design-dunstable": {
    url: "roofer-web-design-dunstable",
    keyword: "web design for roofers in Dunstable",
    metaTitle: "Roofer Website Design Dunstable | Affordable Sites",
    metaDescription: "Affordable website design for roofers in Dunstable. Upgrade your outdated site and win more work.",
    industry: "Roofing",
    location: "Dunstable",
    heroTitle: "Roofer Website Design in Dunstable",
    heroSubtitle: "Get more roofing leads in Dunstable with a professional website",
    checklist: ["No upfront cost", "Built to rank locally", "Fully managed"],
    sections: [
      {
        title: "Why Dunstable Roofers Struggle Online",
        description: "Many Dunstable roofing companies have slow, outdated sites that fail to convert. We fix that by creating high-performance lead machines.",
        points: [
          "Poor visibility in Dunstable search results",
          "Websites that look bad on mobile devices",
          "Missing out on high-value roof replacement jobs",
          "Weak trust signals and proof of work",
          "Difficult navigation for potential clients"
        ]
      },
      {
        title: "What Your Dunstable Roofing Website Includes",
        description: "A comprehensive package designed for the roofing trade.",
        points: [
          "Lead-Focused Home Page",
          "High-Resolution Portfolio",
          "Technical SEO foundations",
          "Professional Copywriting",
          "Managed Security & Updates"
        ]
      },
      {
        title: "Ranking in Dunstable",
        description: "We ensure you appear for 'roofer Dunstable' and related search terms."
      },
      {
        title: "Simple Process",
        points: [
          "1. Discovery.",
          "2. Build.",
          "3. Review.",
          "4. Launch."
        ]
      }
    ]
  },
  "roofer-web-design-milton-keynes": {
    url: "roofer-web-design-milton-keynes",
    keyword: "web design for roofers in Milton Keynes",
    metaTitle: "Roofer Website Design Milton Keynes | Fast & Modern",
    metaDescription: "Modern roofing websites in Milton Keynes built to convert visitors into customers. From £59 per month.",
    industry: "Roofing",
    location: "Milton Keynes",
    heroTitle: "Roofer Website Design in Milton Keynes",
    heroSubtitle: "The professional online presence your MK roofing business deserves",
    checklist: ["Zero upfront cost", "Targeting MK's growth", "Built for high conversion"],
    sections: [
      {
        title: "MK Roofers Need a Website That Scales",
        description: "In a fast-growing city like Milton Keynes, your website needs to capture the constant demand for both domestic and commercial roofing.",
        points: [
          "Missing out on new-build development work",
          "Slow page speeds in a tech-savvy market",
          "Poor mobile performance for urgent repairs",
          "No local authority signals for MK searches",
          "Difficult quote request process"
        ]
      },
      {
        title: "What We Build for MK Roofers",
        description: "High-performance websites tailored for the Milton Keynes market.",
        points: [
          "Cutting-Edge Visual Design",
          "Strategic Location Targeting",
          "Fast-Loading Project Galleries",
          "Expert Local SEO",
          "Continuous Support"
        ]
      },
      {
        title: "Ranking Across Milton Keynes",
        description: "We help you dominate search results from Bletchley to Newport Pagnell."
      },
      {
        title: "Straightforward Process",
        points: [
          "1. Briefing.",
          "2. Development.",
          "3. Approval.",
          "4. Go-live."
        ]
      }
    ]
  },
  "roofer-web-design-st-albans": {
    url: "roofer-web-design-st-albans",
    keyword: "web design for roofers in St Albans",
    metaTitle: "Roofer Website Design St Albans | More Leads",
    metaDescription: "We help roofers in St Albans get more leads with professional websites. Simple pricing, fast turnaround.",
    industry: "Roofing",
    location: "St Albans",
    heroTitle: "Roofer Website Design in St Albans",
    heroSubtitle: "Win more of the quality roofing work St Albans homeowners are looking for",
    checklist: ["No upfront cost", "Premium design for AL postcodes", "Fully managed"],
    sections: [
      {
        title: "St Albans Homeowners Demand Professionalism",
        description: "In St Albans, first impressions are everything. Your website needs to look as professional as the work you do to win the best contracts.",
        points: [
          "Designs that don't match St Albans standards",
          "Missing local search traffic in AL1-AL4",
          "Slow loading times on high-end devices",
          "Lack of professional project showcases",
          "Weak trust signals for premium clients"
        ]
      },
      {
        title: "A Website That Attracts St Albans' Best Jobs",
        description: "We position your roofing business as the premium choice in St Albans.",
        points: [
          "Elegant, High-End Design",
          "Detailed Service Showcases",
          "Optimised for Local Search",
          "Secure & Fast Hosting",
          "Personalised Content Strategy"
        ]
      },
      {
        title: "Ranking in St Albans",
        description: "Dominate search results for 'roofer St Albans' and 'roof repairs St Albans'."
      },
      {
        title: "Our Process",
        points: [
          "Consult: Define your niche.",
          "Create: We build your custom site.",
          "Perfect: Final adjustments.",
          "Manage: Ongoing growth and support."
        ]
      }
    ]
  },
  "roofer-web-design-watford": {
    url: "roofer-web-design-watford",
    keyword: "web design for roofers in Watford",
    metaTitle: "Roofer Website Design Watford | Done For You Service",
    metaDescription: "Done-for-you roofing websites in Watford. We build, design and manage your site. Low upfront cost.",
    industry: "Roofing",
    location: "Watford",
    heroTitle: "Roofer Website Design in Watford",
    heroSubtitle: "Get more roofing enquiries in Watford with a professional website",
    checklist: ["No upfront cost", "Fully managed", "Built for Watford results"],
    sections: [
      {
        title: "Why Watford Roofers Lose Work",
        description: "Watford is a competitive hub. To stay ahead, your roofing business needs a website that ranks well and converts visitors into leads.",
        points: [
          "Low rankings in WD postcode searches",
          "Websites that are difficult to use on mobile",
          "No clear call-to-action for quotes",
          "Missing out on local Watford traffic",
          "Outdated portfolio reducing trust"
        ]
      },
      {
        title: "What Your Watford Roofing Website Will Include",
        description: "A complete lead-generation package for Watford roofing companies.",
        points: [
          "Modern & Responsive Design",
          "Professional Gallery System",
          "Local SEO for Watford & Bushey",
          "Fast & Secure Infrastructure",
          "Managed Content Updates"
        ]
      },
      {
        title: "Built Around How Watford Customers Search",
        description: "We target the specific roofing services Watford residents are looking for right now."
      },
      {
        title: "Local SEO for Watford",
        description: "Ensuring you are the top choice for 'roofer Watford'."
      },
      {
        title: "Simple Process",
        points: [
          "1. Briefing.",
          "2. Full build.",
          "3. Quality check.",
          "4. Launch."
        ]
      }
    ]
  },

  // Locksmiths
  "locksmith-web-design": {
    url: "locksmith-web-design",
    keyword: "web design for locksmiths",
    metaTitle: "Website Design for Locksmiths | Get More Calls",
    metaDescription: "Lead-focused websites for locksmiths. Built to capture urgent enquiries and drive more calls. Low upfront cost, fully managed.",
    industry: "Locksmith"
  },
  "locksmith-web-design-luton": {
    url: "locksmith-web-design-luton",
    keyword: "web design for locksmiths in Luton",
    metaTitle: "Locksmith Website Design Luton | 24/7 Lead Ready",
    metaDescription: "Professional locksmith websites in Luton designed to capture urgent leads. Fast, modern and mobile-friendly.",
    industry: "Locksmith",
    location: "Luton",
    heroTitle: "Locksmith Website Design in Luton",
    heroSubtitle: "Capture urgent emergency calls and planned security work in Luton",
    checklist: ["No upfront cost", "Mobile-first for emergency calls", "Trust-focused design"],
    sections: [
      {
        title: "Why Luton Locksmiths Need a Fast Website",
        description: "When someone is locked out of their home in Luton at 2am, they don't browse — they call the first professional they find. If your website is slow or difficult to use on a phone, you've lost that job.",
        points: [
          "Slow page speeds that cause visitors to bounce",
          "No 'Click to Call' button prominent on mobile",
          "Lack of trust signals (DBS checked, reviews, local address)",
          "Not appearing for 'emergency locksmith Luton' searches",
          "Hidden or confusing service lists"
        ]
      },
      {
        title: "What Your Luton Locksmith Website Will Do",
        description: "We build websites designed for the speed of the locksmith trade.",
        points: [
          "Instant Click-to-Call: Positioned for immediate action.",
          "Emergency-Focused Layout: Highlight your 24/7 availability.",
          "Trust-Building Content: Showcase your credentials and reviews.",
          "Local SEO: Rank for the postcodes you actually cover.",
          "Fully Managed: We handle everything while you're on the road."
        ]
      },
      {
        title: "Built Around How Luton Customers Search",
        description: "We target both the 'locked out now' emergencies and the 'change my locks' planned work that Luton residents search for daily."
      },
      {
        title: "Local SEO for Luton Locksmiths",
        description: "Dominate search results for 'locksmith Luton' and 'emergency locksmith near me'.",
        points: [
          "Optimised for mobile 'near me' searches",
          "LocalBusiness schema for better Google visibility",
          "Location-specific pages for Luton districts"
        ]
      },
      {
        title: "Simple Process",
        points: [
          "1. Strategic brief.",
          "2. Fast-track build.",
          "3. Quality review.",
          "4. Live & managed."
        ]
      }
    ]
  },
  "locksmith-web-design-bedford": {
    url: "locksmith-web-design-bedford",
    keyword: "web design for locksmiths in Bedford",
    metaTitle: "Locksmith Website Design Bedford | Get Calls Fast",
    metaDescription: "Need more locksmith calls in Bedford? We build high-converting websites with no upfront cost.",
    industry: "Locksmith",
    location: "Bedford",
    heroTitle: "Locksmith Website Design in Bedford",
    heroSubtitle: "A website that turns Bedford residents into immediate calls",
    checklist: ["Nothing to pay upfront", "High-conversion mobile layout", "We handle the copywriting"],
    sections: [
      {
        title: "Winning More Work in Bedford",
        description: "Locksmithing in Bedford is a competitive game. Your website needs to look more trustworthy and be easier to use than the rest.",
        points: [
          "Poor mobile experience for emergency searches",
          "Missing out on local Bedford search traffic",
          "No clear evidence of being a local business",
          "Slow loading times on mobile networks",
          "Outdated design that reduces trust"
        ]
      },
      {
        title: "Complete Locksmith Website Package",
        description: "Everything you need to capture more leads in Bedford.",
        points: [
          "Lead-Optimised Design",
          "Professional Security Copywriting",
          "Fast & Secure Infrastructure",
          "Managed Google Visibility",
          "Unlimited Minor Updates"
        ]
      },
      {
        title: "Ranking Across Bedford",
        description: "We help you rank for 'locksmith Bedford' and surrounding area searches."
      },
      {
        title: "How We Work",
        points: [
          "Step 1: Briefing.",
          "Step 2: Rapid Build.",
          "Step 3: Review.",
          "Step 4: Launch."
        ]
      }
    ]
  },
  "locksmith-web-design-dunstable": {
    url: "locksmith-web-design-dunstable",
    keyword: "web design for locksmiths in Dunstable",
    metaTitle: "Locksmith Website Design Dunstable | Affordable Sites",
    metaDescription: "Affordable locksmith websites in Dunstable. Designed to convert visitors into customers. Low upfront cost.",
    industry: "Locksmith",
    location: "Dunstable",
    heroTitle: "Locksmith Website Design in Dunstable",
    heroSubtitle: "Your professional online presence for Dunstable security services",
    checklist: ["No upfront cost", "Built to capture urgent calls", "Fully managed"],
    sections: [
      {
        title: "Why Dunstable Locksmiths Need a Modern Site",
        description: "Most locksmith searches in Dunstable happen on a mobile phone during an emergency. If your site isn't ready for that, you're missing out.",
        points: [
          "Difficult to use on a smartphone",
          "Slow performance losing you customers",
          "Low visibility in Dunstable search results",
          "No trust signals featured prominently",
          "Confusing layout for urgent users"
        ]
      },
      {
        title: "What Your Dunstable Locksmith Website Includes",
        description: "A tailored solution for the locksmith trade.",
        points: [
          "Urgent CTA Layout",
          "Trust-Building Elements",
          "Technical SEO foundations",
          "Mobile-First Optimisation",
          "Ongoing Support & Updates"
        ]
      },
      {
        title: "Ranking in Dunstable",
        description: "Ensuring you are the first locksmith Dunstable residents see."
      },
      {
        title: "Simple Process",
        points: [
          "1. Brief.",
          "2. Build.",
          "3. Review.",
          "4. Live."
        ]
      }
    ]
  },
  "locksmith-web-design-milton-keynes": {
    url: "locksmith-web-design-milton-keynes",
    keyword: "web design for locksmiths in Milton Keynes",
    metaTitle: "Locksmith Website Design Milton Keynes | Fast Setup",
    metaDescription: "Get a modern locksmith website in Milton Keynes quickly. Built to generate calls and enquiries.",
    industry: "Locksmith",
    location: "Milton Keynes",
    heroTitle: "Locksmith Website Design in Milton Keynes",
    heroSubtitle: "The fast-track to more locksmith calls in Milton Keynes",
    checklist: ["Zero upfront cost", "Targeting the full MK area", "Built for high speed"],
    sections: [
      {
        title: "MK Locksmiths Need a High-Speed Presence",
        description: "In a tech-driven town like Milton Keynes, your website needs to be as fast as your response time.",
        points: [
          "Missing out on district-level searches (Bletchley, Fenny Stratford, etc.)",
          "Slow loading speeds losing tech-savvy clients",
          "Poor mobile experience for emergency lockouts",
          "Lack of local authority in MK search results",
          "No clear pricing or service indicators"
        ]
      },
      {
        title: "What We Build for MK Locksmiths",
        description: "High-performance websites for the Milton Keynes security market.",
        points: [
          "Modern Visual Design",
          "Strategic Grid-Square Targeting",
          "Ultra-Fast Load Speeds",
          "Expert Local SEO foundations",
          "Continuous Technical Management"
        ]
      },
      {
        title: "Ranking Across Milton Keynes",
        description: "We ensure you are visible to every MK postcode resident."
      },
      {
        title: "Straightforward Process",
        points: [
          "1. Strategic brief.",
          "2. Development phase.",
          "3. Final approval.",
          "4. Managed launch."
        ]
      }
    ]
  },
  "locksmith-web-design-st-albans": {
    url: "locksmith-web-design-st-albans",
    keyword: "web design for locksmiths in St Albans",
    metaTitle: "Locksmith Website Design St Albans | Lead Focused",
    metaDescription: "Lead-focused locksmith websites in St Albans. We design and manage everything for you.",
    industry: "Locksmith",
    location: "St Albans",
    heroTitle: "Locksmith Website Design in St Albans",
    heroSubtitle: "Professional security and locksmith websites for St Albans businesses",
    checklist: ["No upfront cost", "Premium design for AL homeowners", "Fully managed"],
    sections: [
      {
        title: "St Albans Residents Value Professionalism",
        description: "In St Albans, your online appearance is your digital storefront. To win the best security work, you need a site that looks the part.",
        points: [
          "Designs that don't match St Albans expectations",
          "Low visibility for 'locksmith St Albans' searches",
          "Slow loading times on high-end smartphones",
          "Lack of professional credentials on display",
          "No focus on high-end security services"
        ]
      },
      {
        title: "A Website That Attracts St Albans' Best Work",
        description: "We position you as the trusted security expert in St Albans.",
        points: [
          "Elegant, Trust-Building Design",
          "Detailed Service Showcases",
          "Optimised for Local AL Postcodes",
          "Secure & Fast Infrastructure",
          "Personalised Content Strategy"
        ]
      },
      {
        title: "Ranking in St Albans",
        description: "Dominate search results for 'locksmith St Albans' and 'St Albans security'."
      },
      {
        title: "Our Process",
        points: [
          "Consult: Define your service areas.",
          "Create: We build your high-end site.",
          "Perfect: Final adjustments.",
          "Manage: Ongoing support and growth."
        ]
      }
    ]
  },
  "locksmith-web-design-watford": {
    url: "locksmith-web-design-watford",
    keyword: "web design for locksmiths in Watford",
    metaTitle: "Locksmith Website Design Watford | Done For You",
    metaDescription: "Done-for-you locksmith websites in Watford. Low upfront cost. Start getting more calls today.",
    industry: "Locksmith",
    location: "Watford",
    heroTitle: "Locksmith Website Design in Watford",
    heroSubtitle: "Get more locksmith leads in Watford with a professional website",
    checklist: ["No upfront cost", "Fully managed", "Built for Watford calls"],
    sections: [
      {
        title: "Why Watford Locksmiths Lose Calls",
        description: "Watford is a busy, competitive market. If your site isn't appearing at the top of Google, you're invisible to the hundreds of people searching for a locksmith every month.",
        points: [
          "Low rankings in WD postcode searches",
          "Websites that are difficult to use during an emergency",
          "No clear 'Call Now' button on mobile",
          "Missing out on local Watford traffic",
          "Outdated design reducing credibility"
        ]
      },
      {
        title: "What Your Watford Locksmith Website Will Include",
        description: "A complete lead-generation tool for Watford locksmiths.",
        points: [
          "Modern & Responsive Design",
          "Emergency-Focused Layout",
          "Local SEO for Watford & Bushey",
          "Fast & Secure Infrastructure",
          "Managed Content Updates"
        ]
      },
      {
        title: "Built Around How Watford Customers Search",
        description: "We target the specific emergency and security services Watford residents need right now."
      },
      {
        title: "Local SEO for Watford",
        description: "Ensuring you are the top choice for 'locksmith Watford'."
      },
      {
        title: "Simple Process",
        points: [
          "1. Briefing.",
          "2. Full build.",
          "3. Quality check.",
          "4. Launch."
        ]
      }
    ]
  },

  // Cleaning
  "cleaning-company-web-design": {
    url: "cleaning-company-web-design",
    keyword: "web design for cleaning companies",
    metaTitle: "Website Design for Cleaning Companies | More Bookings",
    metaDescription: "We create websites for cleaning businesses that drive bookings. Simple, affordable and fully managed from £59 per month.",
    industry: "Cleaning"
  },
  "cleaning-company-web-design-luton": {
    url: "cleaning-company-web-design-luton",
    keyword: "web design for cleaning companies in Luton",
    metaTitle: "Cleaning Company Website Design Luton | £59 Per Month",
    metaDescription: "Professional websites for cleaning companies in Luton. Get more bookings with a modern site. Low upfront cost.",
    industry: "Cleaning",
    location: "Luton",
    heroTitle: "Cleaning Company Website Design in Luton",
    heroSubtitle: "Fill your cleaning schedule with regular Luton clients while we handle the tech",
    checklist: ["No upfront cost", "Built to attract regular clients", "Fully managed"],
    sections: [
      {
        title: "Why Luton Cleaning Companies Struggle Online",
        description: "Most cleaning businesses in Luton rely on Facebook groups or flyers. While these can work, they don't build a professional brand that attracts high-value regular clients or commercial contracts.",
        points: [
          "No professional presence for potential clients to find",
          "Websites that are hard to use on mobile phones",
          "No clear way for clients to book or request a quote",
          "Missing out on 'cleaning company Luton' search traffic",
          "Poor trust signals and lack of testimonials"
        ]
      },
      {
        title: "What Your Luton Cleaning Website Will Do",
        description: "We build websites that act as your 24/7 office manager.",
        points: [
          "Booking-Focused Design: Make it easy for clients to hire you.",
          "Mobile-Optimised: Perfect for busy people on the move.",
          "Professional Copywriting: We explain your services clearly.",
          "Local SEO: Rank for the areas of Luton you serve.",
          "Managed Updates: We keep your pricing and services current."
        ]
      },
      {
        title: "Built Around How Luton Customers Search",
        description: "From weekly domestic cleans to deep end-of-tenancy work, we ensure your business is visible when Luton residents search for help."
      },
      {
        title: "Local SEO for Luton",
        description: "Dominate search results for 'cleaner Luton' and 'cleaning services Luton'.",
        points: [
          "Technical SEO setup",
          "Location-specific service pages",
          "Review and trust badge integration"
        ]
      },
      {
        title: "Simple Process",
        points: [
          "1. Strategic briefing.",
          "2. Custom build.",
          "3. Quality sign-off.",
          "4. Managed launch."
        ]
      }
    ]
  },
  "cleaning-company-web-design-bedford": {
    url: "cleaning-company-web-design-bedford",
    keyword: "web design for cleaning companies in Bedford",
    metaTitle: "Cleaning Website Design Bedford | More Bookings",
    metaDescription: "We build websites for cleaning businesses in Bedford that generate more bookings.",
    industry: "Cleaning",
    location: "Bedford",
    heroTitle: "Cleaning Company Website Design in Bedford",
    heroSubtitle: "Attract more regular cleaning clients in Bedford with a professional site",
    checklist: ["Nothing to pay upfront", "Designed to build a steady pipeline", "Covers Bedford and wider area"],
    sections: [
      {
        title: "Why Referrals Alone Won't Grow Your Bedford Cleaning Business",
        description: "Word-of-mouth is great, but a professional website allows you to reach a much wider audience in Bedford and control your growth.",
        points: [
          "Invisible on Google for local Bedford searches",
          "Lack of a professional platform to showcase reviews",
          "No automated way for clients to request quotes",
          "Slow loading times on mobile devices",
          "Outdated design that reduces credibility"
        ]
      },
      {
        title: "What We Build for Bedford Cleaners",
        description: "A complete online package designed to win more work.",
        points: [
          "Modern, Fresh Visual Design",
          "Lead-Optimised Contact Forms",
          "Fast & Secure Infrastructure",
          "Expert Local SEO foundations",
          "Continuous Technical Support"
        ]
      },
      {
        title: "Ranking for Cleaning Searches in Bedford",
        description: "We ensure you appear for 'cleaner Bedford' and 'commercial cleaning Bedford'."
      },
      {
        title: "How We Work",
        points: [
          "Step 1: Briefing.",
          "Step 2: Rapid Build.",
          "Step 3: Review.",
          "Step 4: Launch."
        ]
      }
    ]
  },
  "cleaning-company-web-design-dunstable": {
    url: "cleaning-company-web-design-dunstable",
    keyword: "web design for cleaning companies in Dunstable",
    metaTitle: "Cleaning Website Design Dunstable | Affordable & Fast",
    metaDescription: "Affordable websites for cleaning companies in Dunstable. Fully managed and easy to update.",
    industry: "Cleaning",
    location: "Dunstable",
    heroTitle: "Cleaning Company Website Design in Dunstable",
    heroSubtitle: "Win the cleaning clients in Dunstable looking for reliable help",
    checklist: ["No payment required upfront", "Written and managed by our team", "Designed to build recurring revenue"],
    sections: [
      {
        title: "The Hidden Cost of an Underperforming Website",
        description: "If your Dunstable cleaning business has a site that doesn't rank or convert, you're losing money every day to competitors who are easier to find.",
        points: [
          "Low visibility in Dunstable search results",
          "Difficult navigation for potential clients",
          "Lack of professional service descriptions",
          "No mobile optimisation for local searches",
          "Poor trust signals and missing testimonials"
        ]
      },
      {
        title: "What a Cosy Content Cleaning Website Does",
        description: "We create a high-performance platform for your business.",
        points: [
          "Professional Industry Copywriting",
          "Booking-Focused Layout",
          "Technical SEO foundations",
          "Managed Security & Updates",
          "Service Area Targeting"
        ]
      },
      {
        title: "Getting Found in Dunstable",
        description: "Ensure you are the first choice for 'cleaning services Dunstable'."
      },
      {
        title: "From Brief to Live",
        points: [
          "1. Consultation.",
          "2. Full Build.",
          "3. Approval.",
          "4. Growth."
        ]
      }
    ]
  },
  "cleaning-company-web-design-milton-keynes": {
    url: "cleaning-company-web-design-milton-keynes",
    keyword: "web design for cleaning companies in Milton Keynes",
    metaTitle: "Cleaning Website Design Milton Keynes | Fast Setup",
    metaDescription: "Get a modern cleaning business website in Milton Keynes. Designed to convert visitors into customers.",
    industry: "Cleaning",
    location: "Milton Keynes",
    heroTitle: "Cleaning Company Website Design in Milton Keynes",
    heroSubtitle: "MK's growing population means more cleaning clients for your business",
    checklist: ["Zero upfront cost", "Postcode range coverage", "Built for recurring work"],
    sections: [
      {
        title: "Milton Keynes Is a Strong Market for Cleaning",
        description: "With a high concentration of professional families and new businesses, MK is a goldmine for cleaning services if you are visible.",
        points: [
          "Missing out on specific MK district searches",
          "Slow page speeds in a tech-savvy city",
          "Weak mobile experience for busy residents",
          "No focus on commercial cleaning opportunities",
          "Poor lead capture and quote request process"
        ]
      },
      {
        title: "Diversity of Cleaning Demand in MK",
        description: "Your website will be structured to handle everything from weekly house cleaning to office contracts.",
        points: [
          "Modern & Professional Visuals",
          "Strategic Service Area Targeting",
          "Fast-Loading Content",
          "Expert Local SEO",
          "Monthly Performance Support"
        ]
      },
      {
        title: "Ranking Across Milton Keynes",
        description: "We help you capture traffic from Bletchley to the new developments."
      },
      {
        title: "Getting Started",
        points: [
          "1. Discovery.",
          "2. Rapid build.",
          "3. Quality sign-off.",
          "4. Managed launch."
        ]
      }
    ]
  },
  "cleaning-company-web-design-st-albans": {
    url: "cleaning-company-web-design-st-albans",
    keyword: "web design for cleaning companies in St Albans",
    metaTitle: "Cleaning Website Design St Albans | More Leads",
    metaDescription: "We help cleaning companies in St Albans get more leads with professional websites.",
    industry: "Cleaning",
    location: "St Albans",
    heroTitle: "Cleaning Company Website Design in St Albans",
    heroSubtitle: "Attract the St Albans clients who value quality and reliability",
    checklist: ["No upfront cost", "Designed to attract premium clients", "Fully managed"],
    sections: [
      {
        title: "St Albans Clients Are Worth More",
        description: "In St Albans, homeowners and businesses are willing to pay for quality. Your website needs to reflect that premium standard to win their business.",
        points: [
          "Outdated designs that don't match St Albans standards",
          "Missing local search traffic in AL postcodes",
          "Lack of professional trust signals",
          "Slow loading times on high-end devices",
          "Generic content that doesn't build confidence"
        ]
      },
      {
        title: "Attract St Albans' Best Cleaning Clients",
        description: "We position your business as the most reliable choice in St Albans.",
        points: [
          "Elegant & Trustworthy Design",
          "Detailed Service Showcases",
          "Optimised for Local Search",
          "Secure & Fast Infrastructure",
          "Personalised Content Strategy"
        ]
      },
      {
        title: "Ranking in St Albans",
        description: "Dominate search results for 'cleaner St Albans' and 'St Albans cleaning company'."
      },
      {
        title: "Our Process",
        points: [
          "Consult: Define your niche.",
          "Create: We build your high-end site.",
          "Perfect: Final tweaks.",
          "Manage: Ongoing growth."
        ]
      }
    ]
  },
  "cleaning-company-web-design-watford": {
    url: "cleaning-company-web-design-watford",
    keyword: "web design for cleaning companies in Watford",
    metaTitle: "Cleaning Website Design Watford | Done For You",
    metaDescription: "Done-for-you websites for cleaning businesses in Watford. £59 per month, fully managed.",
    industry: "Cleaning",
    location: "Watford",
    heroTitle: "Cleaning Company Website Design in Watford",
    heroSubtitle: "Get more regular cleaning clients in Watford with a professional site",
    checklist: ["No upfront cost", "Built to attract regular clients", "Fully managed"],
    sections: [
      {
        title: "Why Watford Cleaning Companies Struggle Online",
        description: "Watford is a busy hub. If your cleaning business isn't visible on the first page of Google, you're missing out on hundreds of potential regular clients.",
        points: [
          "Low Google rankings in the WD postcode area",
          "Websites that are difficult to use on mobile phones",
          "No clear way for customers to book or request a quote",
          "Lack of professional brand appearance",
          "Missing out on commercial cleaning leads"
        ]
      },
      {
        title: "What Your Watford Cleaning Website Will Do",
        description: "We build websites designed to grow your recurring revenue.",
        points: [
          "Modern & Responsive Design",
          "Lead-Optimised Layout",
          "Local SEO for Watford & Bushey",
          "Fast & Secure Hosting",
          "Managed Content Updates"
        ]
      },
      {
        title: "Built Around How Watford Customers Search",
        description: "From weekly domestic cleans to deep end-of-tenancy work, we ensure your Watford business is the one they find first."
      },
      {
        title: "Local SEO for Watford",
        description: "Appearing for 'cleaner Watford' and 'Watford cleaning services' is our priority."
      },
      {
        title: "Simple Process",
        points: [
          "1. Discovery.",
          "2. Full Build.",
          "3. Quality sign-off.",
          "4. Managed launch."
        ]
      }
    ]
  },

  // Removals
  "removals-web-design": {
    url: "removals-web-design",
    keyword: "web design for removal companies",
    metaTitle: "Website Design for Removal Companies | Get More Leads",
    metaDescription: "High-converting websites for removals businesses. We design, build and manage everything. Low upfront cost, start today.",
    industry: "Removals"
  },
  "removals-web-design-luton": {
    url: "removals-web-design-luton",
    keyword: "web design for removal companies in Luton",
    metaTitle: "Removals Website Design Luton | Get More Enquiries",
    metaDescription: "We build high-converting websites for removal companies in Luton. Get more enquiries today.",
    industry: "Removals",
    location: "Luton",
    heroTitle: "Removal Company Website Design in Luton",
    heroSubtitle: "Win more Luton house moves before your competitors even get a look in",
    checklist: ["No upfront cost", "Built to attract local moves", "Fully managed"],
    sections: [
      {
        title: "Why Luton Removal Companies Lose Bookings Online",
        description: "Removal is a high-consideration purchase. Customers in Luton are handing their entire home over to a team of strangers — so the bar for trust is significant.",
        points: [
          "No visible insurance or goods-in-transit cover details",
          "Missing from local search for key removal terms",
          "No customer reviews or case studies to back up claims",
          "Unclear service offering for specific move types",
          "No easy online quote request process"
        ]
      },
      {
        title: "What Your Luton Removal Company Website Will Include",
        description: "Every part of your site is built around what actually converts a removal customer.",
        points: [
          "Insurance and Credentials Front and Centre",
          "Service Clarity (Domestic, Office, Man-and-Van)",
          "Quote Request Made Easy",
          "Fully Managed Hosting & Security",
          "Regular Content Updates Included"
        ]
      },
      {
        title: "Built Around How Luton Customers Search",
        description: "Removal searches in Luton cover everything from house moves and office relocations to man and van services and removals to London."
      },
      {
        title: "Local SEO That Keeps Your Booking Calendar Filled",
        description: "We build your site with local SEO at its core to compete in Luton's local results from day one."
      },
      {
        title: "From Brief to Live — A Straightforward Process",
        points: [
          "1. We build your site from a short brief.",
          "2. You review and request any changes.",
          "3. We handle the launch and Google submission.",
          "4. We manage updates and security ongoing."
        ]
      }
    ]
  },
  "removals-web-design-bedford": {
    url: "removals-web-design-bedford",
    keyword: "web design for removal companies in Bedford",
    metaTitle: "Removals Website Design Bedford | Low-Cost Build",
    metaDescription: "Affordable websites for removal companies in Bedford. Fully managed and built to convert.",
    industry: "Removals",
    location: "Bedford",
    heroTitle: "Removal Company Website Design in Bedford",
    heroSubtitle: "Be the removal company Bedford families trust with their move",
    checklist: ["Nothing to pay upfront", "Designed for how customers research", "Covers Bedford and wider area"],
    sections: [
      {
        title: "What Bedford Removal Customers Are Really Looking For",
        description: "A removal booking is one of the largest single purchases many households make. Trust is the deciding factor — more than price or availability.",
        points: [
          "Insurance and liability cover not clearly mentioned",
          "No local reviews to build Bedford credibility",
          "Vague service descriptions for specialist items",
          "Missing from postcode-specific searches (MK40-MK42)",
          "Complicated quote process losing customers"
        ]
      },
      {
        title: "A Removal Company Website That Works as Hard as Your Team",
        description: "We build every element around what Bedford customers need to see before they commit.",
        points: [
          "Credentials and Insurance Visible",
          "Destination and Service Clarity",
          "Customer Testimonials That Convert",
          "Streamlined Quote Request Form",
          "Fully Managed Performance"
        ]
      },
      {
        title: "Ranking for Removals Searches Across Bedford",
        description: "We capture demand from Bedford town centre to surrounding areas like Ampthill and Sandy."
      },
      {
        title: "How We Work With Bedford Removal Companies",
        points: [
          "Step 1: Tell us about your services.",
          "Step 2: We design and write the complete site.",
          "Step 3: You review the preview.",
          "Step 4: We launch and manage everything."
        ]
      }
    ]
  },
  "removals-web-design-dunstable": {
    url: "removals-web-design-dunstable",
    keyword: "web design for removal companies in Dunstable",
    metaTitle: "Removals Website Design Dunstable | More Bookings",
    metaDescription: "Get more bookings with a modern removals website in Dunstable. Low upfront cost.",
    industry: "Removals",
    location: "Dunstable",
    heroTitle: "Removal Company Website Design in Dunstable",
    heroSubtitle: "Every Dunstable house move starts with a search — be ready",
    checklist: ["No payment required upfront", "Written and managed by our team", "Designed to win domestic and office moves"],
    sections: [
      {
        title: "The Removal Industry Has a Trust Problem",
        description: "Customers worry about damaged items or late teams. We build websites that address these fears head-on to win the booking.",
        points: [
          "No mention of insurance or goods-in-transit cover",
          "Generic copy that doesn't build local trust",
          "No clear coverage information for destinations",
          "Missing social proof and customer reviews",
          "No differentiation from budget competitors"
        ]
      },
      {
        title: "What a Cosy Content Removal Website Does",
        description: "Your most effective sales tool, answering questions before they're asked.",
        points: [
          "Reassurance Architecture (Insurance/Vetting)",
          "Specific Coverage & Specialist Move Info",
          "Real Reviews Integrated Naturally",
          "Simple & Direct Quote Path",
          "Completely Managed Service"
        ]
      },
      {
        title: "Ranking in Dunstable",
        description: "Capture surrounding demand in Houghton Regis, Caddington, and the wider area."
      },
      {
        title: "From Brief to Live — Quickly and Simply",
        points: [
          "1. Brief us on your move types.",
          "2. We build design, copy, and SEO.",
          "3. Review your preview link.",
          "4. Launch and managed support."
        ]
      }
    ]
  },
  "removals-web-design-milton-keynes": {
    url: "removals-web-design-milton-keynes",
    keyword: "web design for removal companies in Milton Keynes",
    metaTitle: "Removals Website Design Milton Keynes | Fast Setup",
    metaDescription: "Professional removals websites in Milton Keynes. Designed to generate leads quickly.",
    industry: "Removals",
    location: "Milton Keynes",
    heroTitle: "Removal Company Website Design in Milton Keynes",
    heroSubtitle: "MK moves more people than almost any other town — capture your share",
    checklist: ["Zero upfront cost", "Targeting grid square to grid square", "Built for domestic and commercial"],
    sections: [
      {
        title: "Why MK's Removal Market Demands a Sophisticated Website",
        description: "In a fast-moving town like Milton Keynes, simply having a website isn't enough to beat the regional competition.",
        points: [
          "Only targeting generic MK searches",
          "No content for the massive new-build market",
          "Missing searches for relocations to/from London",
          "Designs that don't stand out in the grid",
          "Weak trust signals for thorough MK researchers"
        ]
      },
      {
        title: "A Website That Covers MK's Removal Market Properly",
        description: "Depth and structure to capture the full geographic range of Milton Keynes.",
        points: [
          "District and Estate-Level Targeting",
          "New-Build Move Specialisation",
          "Long-Distance and London Move Pages",
          "Commercial Relocation Coverage",
          "Fully Managed & Maintained"
        ]
      },
      {
        title: "Ranking Across Milton Keynes",
        description: "Capture removal searches from Bletchley to Newport Pagnell and everywhere in between."
      },
      {
        title: "Getting Started Is Simple",
        points: [
          "You brief us on your move types.",
          "We build design, copy, and technical SEO.",
          "You approve the final site.",
          "We manage hosting and updates."
        ]
      }
    ]
  },
  "removals-web-design-st-albans": {
    url: "removals-web-design-st-albans",
    keyword: "web design for removal companies in St Albans",
    metaTitle: "Removals Website Design St Albans | Lead Focused",
    metaDescription: "Lead-focused websites for removal companies in St Albans. Simple pricing, low upfront cost.",
    industry: "Removals",
    location: "St Albans",
    heroTitle: "Removal Company Website Design in St Albans",
    heroSubtitle: "Win the St Albans moves that are worth winning",
    checklist: ["No upfront cost", "Positioned for quality moves", "Fully managed"],
    sections: [
      {
        title: "St Albans Removal Customers Research Carefully",
        description: "Homeowners in St Albans take moving seriously and judge your business by its digital storefront.",
        points: [
          "Sites that don't match premium St Albans standards",
          "No evidence of specialist handling capability",
          "Limited coverage of surrounding AL villages",
          "Absence from high-value service searches",
          "Testimonials not used to build deep trust"
        ]
      },
      {
        title: "A Website That Wins St Albans' Best Removal Bookings",
        description: "Attract full-service moves, packing contracts, and specialist projects.",
        points: [
          "Premium Visual Presentation",
          "Specialist Service Visibility",
          "Insurance and Accreditation Prominence",
          "Testimonials That Persuade",
          "Fully Managed Performance"
        ]
      },
      {
        title: "Ranking in St Albans",
        description: "Dominate search results for 'removal company St Albans' and AL postcode areas."
      },
      {
        title: "Our Process",
        points: [
          "Consult: Define your move types.",
          "Build: Design, copywriting, and SEO.",
          "Review: Final quality checks.",
          "Manage: We take care of the rest."
        ]
      }
    ]
  },
  "removals-web-design-watford": {
    url: "removals-web-design-watford",
    keyword: "web design for removal companies in Watford",
    metaTitle: "Removals Website Design Watford | Done For You Service",
    metaDescription: "Done-for-you removal websites in Watford. We handle everything so you don’t have to.",
    industry: "Removals",
    location: "Watford",
    heroTitle: "Removal Company Website Design in Watford",
    heroSubtitle: "Get ahead in one of Hertfordshire's most active removal markets",
    checklist: ["No upfront cost", "Built to capture high volume", "Fully managed"],
    sections: [
      {
        title: "Watford's Removal Market Rewards Visibility",
        description: "Watford's proximity to London and high population density makes it a prime market for removals.",
        points: [
          "Only ranking for broad Watford searches",
          "No targeting of the London-Watford corridor",
          "Thin service pages lacking depth",
          "Trust signals absent or poorly positioned",
          "Poor mobile experience for busy commuters"
        ]
      },
      {
        title: "What We Build for Watford Removal Companies",
        description: "Capture both high-value homeowner moves and frequent rental turnover.",
        points: [
          "London Move Targeting Strategy",
          "WD Postcode Geographic Coverage",
          "Trust and Insurance Visibility",
          "Rental Market & Tenancy Content",
          "Fully Managed Infrastructure"
        ]
      },
      {
        title: "Appearing in Watford's Local Search",
        description: "Rank across Bushey, Croxley Green, and the wider WD postcode area."
      },
      {
        title: "How We Get You Live in Watford",
        points: [
          "Kick-off call.",
          "Professional build phase.",
          "Client review and sign-off.",
          "Managed launch and support."
        ]
      }
    ]
  }
};
