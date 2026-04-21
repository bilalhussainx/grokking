// Curated school branding: official colors + domain for logo lookup.
// Colors are hand-picked to remain legible on a near-black card background
// (contrast ratio ≥ 4.5 for normal text against #141414). For schools whose
// primary color would be unreadable (very dark navy, black, brown), we use a
// bright official accent or an off-white that still reads as "theirs".

export interface SchoolBrand {
  primary: string;       // School name color
  accent: string;        // Used for glow/stripe accents on the card
  domain: string;        // Used to fetch logo via Clearbit / Google S2 favicon
}

const FALLBACK: SchoolBrand = {
  primary: "#F4D03F",
  accent: "#D4AF37",
  domain: "",
};

// Keyed by a normalized lower-cased school name substring match.
// The longest matching key wins so "university of california, berkeley"
// picks up "berkeley" not "university of california".
const BRANDS: { match: string[]; brand: SchoolBrand }[] = [
  { match: ["harvard"], brand: { primary: "#E63946", accent: "#A51C30", domain: "harvard.edu" } },
  { match: ["yale"], brand: { primary: "#4A90E2", accent: "#0F4D92", domain: "yale.edu" } },
  { match: ["princeton"], brand: { primary: "#FF8F1C", accent: "#FF8F1C", domain: "princeton.edu" } },
  { match: ["mit", "massachusetts institute"], brand: { primary: "#E84A5F", accent: "#A31F34", domain: "mit.edu" } },
  { match: ["stanford"], brand: { primary: "#D35454", accent: "#8C1515", domain: "stanford.edu" } },
  { match: ["columbia"], brand: { primary: "#6CACE4", accent: "#003DA5", domain: "columbia.edu" } },
  { match: ["cornell"], brand: { primary: "#E23D3D", accent: "#B31B1B", domain: "cornell.edu" } },
  { match: ["brown"], brand: { primary: "#C8694C", accent: "#4E3629", domain: "brown.edu" } },
  { match: ["dartmouth"], brand: { primary: "#00A36C", accent: "#00693E", domain: "dartmouth.edu" } },
  { match: ["pennsylvania", "upenn", "penn"], brand: { primary: "#E23D3D", accent: "#990000", domain: "upenn.edu" } },
  { match: ["chicago", "uchicago"], brand: { primary: "#C85454", accent: "#800000", domain: "uchicago.edu" } },
  { match: ["northwestern"], brand: { primary: "#9B6FD8", accent: "#4E2A84", domain: "northwestern.edu" } },
  { match: ["duke"], brand: { primary: "#4A90E2", accent: "#00539B", domain: "duke.edu" } },
  { match: ["vanderbilt"], brand: { primary: "#D4A857", accent: "#866D4B", domain: "vanderbilt.edu" } },
  { match: ["ucla"], brand: { primary: "#4A90E2", accent: "#2774AE", domain: "ucla.edu" } },
  { match: ["berkeley"], brand: { primary: "#FDB515", accent: "#003262", domain: "berkeley.edu" } },
  { match: ["usc", "southern california"], brand: { primary: "#FFCC00", accent: "#990000", domain: "usc.edu" } },
  { match: ["michigan"], brand: { primary: "#FFCB05", accent: "#00274C", domain: "umich.edu" } },
  { match: ["virginia", "uva"], brand: { primary: "#E57200", accent: "#232D4B", domain: "virginia.edu" } },
  { match: ["nyu", "new york university"], brand: { primary: "#9B6FD8", accent: "#57068C", domain: "nyu.edu" } },
  { match: ["georgetown"], brand: { primary: "#7B8FA8", accent: "#041E42", domain: "georgetown.edu" } },
  { match: ["notre dame"], brand: { primary: "#C99700", accent: "#0C2340", domain: "nd.edu" } },
  { match: ["carnegie mellon", "cmu"], brand: { primary: "#E23D3D", accent: "#C41230", domain: "cmu.edu" } },
  { match: ["johns hopkins", "jhu"], brand: { primary: "#4A90E2", accent: "#002D72", domain: "jhu.edu" } },
  { match: ["rice"], brand: { primary: "#4A90E2", accent: "#002469", domain: "rice.edu" } },
  { match: ["emory"], brand: { primary: "#4A90E2", accent: "#012169", domain: "emory.edu" } },
  { match: ["washington university", "washu"], brand: { primary: "#E23D3D", accent: "#A51417", domain: "wustl.edu" } },
  { match: ["tufts"], brand: { primary: "#4A90E2", accent: "#3E8EDE", domain: "tufts.edu" } },
  { match: ["williams"], brand: { primary: "#E23D3D", accent: "#500082", domain: "williams.edu" } },
  { match: ["amherst"], brand: { primary: "#D4A857", accent: "#3F1F69", domain: "amherst.edu" } },
  { match: ["swarthmore"], brand: { primary: "#C85454", accent: "#990000", domain: "swarthmore.edu" } },
  { match: ["pomona"], brand: { primary: "#4A90E2", accent: "#0057B7", domain: "pomona.edu" } },
  { match: ["caltech", "california institute of technology"], brand: { primary: "#FF6A13", accent: "#FF6A13", domain: "caltech.edu" } },
  { match: ["georgia tech"], brand: { primary: "#B3A369", accent: "#003057", domain: "gatech.edu" } },
  { match: ["texas", "ut austin"], brand: { primary: "#E87500", accent: "#BF5700", domain: "utexas.edu" } },
  { match: ["boston college", "bc "], brand: { primary: "#D4A857", accent: "#8B0000", domain: "bc.edu" } },
  { match: ["boston university", "bu "], brand: { primary: "#CC0000", accent: "#CC0000", domain: "bu.edu" } },
  { match: ["wisconsin"], brand: { primary: "#E23D3D", accent: "#C5050C", domain: "wisc.edu" } },
  { match: ["illinois"], brand: { primary: "#E84A27", accent: "#13294B", domain: "illinois.edu" } },
  { match: ["ohio state"], brand: { primary: "#BB0000", accent: "#BB0000", domain: "osu.edu" } },
  { match: ["purdue"], brand: { primary: "#CEB888", accent: "#8E6F3E", domain: "purdue.edu" } },
  { match: ["washington", "uw "], brand: { primary: "#B7A57A", accent: "#4B2E83", domain: "washington.edu" } },
  { match: ["florida"], brand: { primary: "#FA4616", accent: "#0021A5", domain: "ufl.edu" } },
  { match: ["north carolina", "unc"], brand: { primary: "#4B9CD3", accent: "#13294B", domain: "unc.edu" } },
  { match: ["maryland"], brand: { primary: "#E03A3E", accent: "#FFD520", domain: "umd.edu" } },
];

function extractDomainFromWebsite(website: string | null): string {
  if (!website) return "";
  try {
    const url = new URL(website.startsWith("http") ? website : `https://${website}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function getSchoolBrand(name: string, website: string | null = null): SchoolBrand {
  const needle = name.toLowerCase();
  let best: { len: number; brand: SchoolBrand } | null = null;
  for (const entry of BRANDS) {
    for (const key of entry.match) {
      if (needle.includes(key) && (!best || key.length > best.len)) {
        best = { len: key.length, brand: entry.brand };
      }
    }
  }
  if (best) return best.brand;

  const domain = extractDomainFromWebsite(website);
  if (domain) {
    return { ...FALLBACK, domain };
  }
  return FALLBACK;
}

export function logoCandidates(brand: SchoolBrand): string[] {
  if (!brand.domain) return [];
  return [
    `https://logo.clearbit.com/${brand.domain}?size=128`,
    `https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`,
  ];
}
