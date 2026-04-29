export interface IndustryContent {
  heroTitle: string;
  heroSubtitle: string;
  whatWeCheck: string[];
  commonProblems: string[];
  ctaText: string;
}

export const auditContent: Record<string, IndustryContent> = {
  'Plumbing': {
    heroTitle: 'Free Plumbing Website Audit',
    heroSubtitle: 'Find out why your plumbing website may be losing calls, quote requests, and local Google traffic. We’ll review your website and highlight practical improvements to help you win more enquiries.',
    whatWeCheck: [
      'Mobile friendliness',
      'Click-to-call visibility',
      'Trust signals (reviews, guarantees, accreditations)',
      'Speed and user experience',
      'Plumbing service page structure',
      'Local SEO opportunities'
    ],
    commonProblems: [
      'No clear emergency call button',
      'Poor mobile layout',
      'Missing pages for boiler, leak, drain or bathroom services',
      'Weak trust signals',
      'Not targeting nearby towns'
    ],
    ctaText: 'Enter your details below and receive your free plumbing website audit.'
  },
  'Electrical': {
    heroTitle: 'Free Electrician Website Audit',
    heroSubtitle: 'See what may be stopping your website from generating more enquiries and quote requests. We’ll review your site and show clear ways to improve trust, visibility and conversions.',
    whatWeCheck: [
      'Mobile usability',
      'Contact form performance',
      'Click-to-call placement',
      'Trust badges / certifications',
      'Electrical service pages',
      'Local SEO setup'
    ],
    commonProblems: [
      'No clear CTA above the fold',
      'Missing pages for rewires, EICR, fuse board upgrades',
      'Weak local targeting',
      'Slow loading pages',
      'Outdated design reducing trust'
    ],
    ctaText: 'Submit your website below for a free electrician website audit.'
  },
  'Roofing': {
    heroTitle: 'Free Roofer Website Audit',
    heroSubtitle: 'Discover why your roofing website may not be bringing in enough quote requests. We’ll review your website and uncover opportunities to improve enquiries and Google visibility.',
    whatWeCheck: [
      'Mobile experience',
      'Quote request forms',
      'Roofing service pages',
      'Trust and credibility elements',
      'Before/after project visibility',
      'Local SEO opportunities'
    ],
    commonProblems: [
      'No pages for repairs, flat roofs, new roofs or guttering',
      'Poor trust signals',
      'Hard-to-use mobile layouts',
      'Weak call-to-actions',
      'No nearby location targeting'
    ],
    ctaText: 'Request your free roofer website audit below.'
  },
  'Locksmith': {
    heroTitle: 'Free Locksmith Website Audit',
    heroSubtitle: 'Find out what could be costing you emergency calls and local leads. We’ll assess your website and highlight practical ways to improve conversions and visibility.',
    whatWeCheck: [
      'Mobile click-to-call speed',
      'Emergency CTA visibility',
      'Trust signals and reviews',
      'Locksmith service pages',
      'Speed and responsiveness',
      'Local SEO setup'
    ],
    commonProblems: [
      'No instant call button',
      'Weak emergency messaging',
      'Missing pages for lockouts, lock changes, UPVC locks',
      'Slow loading pages',
      'Poor local rankings'
    ],
    ctaText: 'Get your free locksmith website audit today.'
  },
  'Cleaning': {
    heroTitle: 'Free Cleaning Website Audit',
    heroSubtitle: 'See how your website could generate more domestic or commercial cleaning enquiries. We’ll review your site and show where you may be losing bookings.',
    whatWeCheck: [
      'Mobile booking experience',
      'Quote/contact forms',
      'Service page structure',
      'Trust and testimonials',
      'Before/after visuals',
      'Local SEO setup'
    ],
    commonProblems: [
      'No clear booking CTA',
      'Missing domestic/commercial service pages',
      'Weak trust signals',
      'Poor mobile experience',
      'No pages targeting nearby towns'
    ],
    ctaText: 'Submit your details below for a free cleaning website audit.'
  },
  'Removals': {
    heroTitle: 'Free Removal Company Website Audit',
    heroSubtitle: 'Find out how your website can generate more moving enquiries and quote requests. We’ll review your current site and highlight practical ways to improve performance.',
    whatWeCheck: [
      'Mobile usability',
      'Quote form experience',
      'Service page structure',
      'Trust signals and reviews',
      'Local SEO opportunities',
      'Speed and conversion flow'
    ],
    commonProblems: [
      'No instant quote CTA',
      'Missing house moves / office moves pages',
      'Weak trust indicators',
      'Outdated design',
      'No nearby town targeting'
    ],
    ctaText: 'Request your free removals website audit below.'
  }
};
