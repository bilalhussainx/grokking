export interface CSSProfileSection {
  id: string;
  title: string;
  content: string;
  schools?: string[];
  bullets?: string[];
}

export interface CSSProfileGuide {
  title: string;
  intro: string;
  sections: CSSProfileSection[];
  feeWaiver: {
    title: string;
    content: string;
  };
  nextStep: {
    label: string;
    href: string;
  };
}

export const CSS_PROFILE_GUIDE: CSSProfileGuide = {
  title: "The CSS Profile: Your Financial Aid Application as an International Student",
  intro:
    "If you're an international student applying to US colleges, you will NOT file the FAFSA — that form is only for US citizens and permanent residents. Instead, most US schools that offer aid to international students require the CSS Profile, a more detailed financial aid application run by the College Board.",
  sections: [
    {
      id: "what_is_it",
      title: "What is the CSS Profile?",
      content:
        "The CSS Profile (College Scholarship Service Profile) is a detailed financial aid application that collects information about your family's income, assets, and financial circumstances. It goes deeper than the FAFSA — schools use it to distribute their own institutional aid dollars, not just federal aid. It costs $25 for the first school and $16 for each additional school, with fee waivers available for qualifying families.",
    },
    {
      id: "who_uses_it",
      title: "Which schools require it?",
      content:
        "Over 400 US schools use the CSS Profile. For international students seeking aid, the schools most likely to award significant aid — the need-blind and full-need schools — almost all require it. If you're applying to any of the 8 US colleges that are need-blind for international students, you will file the CSS Profile.",
      schools: [
        "MIT",
        "Harvard",
        "Yale",
        "Princeton",
        "Columbia",
        "Dartmouth",
        "Amherst",
        "Williams",
        "Bowdoin",
        "Middlebury",
        "Pomona",
        "Wellesley",
      ],
    },
    {
      id: "pakistan_specific",
      title: "What Pakistani students specifically need to know",
      content:
        "Pakistani families will need to provide detailed information about assets that many households hold but don't document formally — property, gold, business interests, and agricultural income. Be accurate and honest — schools verify documents, and discrepancies can cost you an admission.",
      bullets: [
        "Parent income in PKR (the form converts to USD using recent exchange rates)",
        "Business income if parents are self-employed — common in Pakistan",
        "Property values — primary home, additional land, commercial real estate",
        "Savings, investment accounts, and prize bonds",
        "Gold and jewelry holdings if a significant portion of family wealth",
        "Agricultural income if the family owns farmland",
      ],
    },
    {
      id: "timeline",
      title: "When to file",
      content:
        "File the CSS Profile as early as possible. For Early Action and Early Decision applications, you want it submitted by early October. For Regular Decision, no later than November 1st. Many schools set CSS Profile deadlines that are earlier than the application deadline itself — check each school's financial aid page directly. The form opens every year on October 1st.",
    },
    {
      id: "documents",
      title: "Documents to gather before you start",
      content:
        "The CSS Profile asks more than 100 questions. Gathering the right documents first will save hours. Expect the form itself to take 2–3 hours once you have everything in one place.",
      bullets: [
        "Parents' most recent tax returns (both parents if divorced — the noncustodial parent often has to submit their own CSS Profile)",
        "Two years of bank statements for every family account",
        "Documentation of any business or self-employment income",
        "Estimates of monthly household expenses (rent, utilities, groceries, transportation)",
        "Current balances on any loans, mortgages, or family debts",
        "Your own earnings from jobs or freelance work",
      ],
    },
    {
      id: "noncustodial_parent",
      title: "Divorced or separated parents",
      content:
        "If your parents are divorced or separated, most CSS Profile schools require the noncustodial parent to also file. This is handled through a separate form called the Noncustodial Profile. If you have no contact with the noncustodial parent, you can request a waiver — each school decides on its own, but most grant waivers when there's documented estrangement.",
    },
  ],
  feeWaiver: {
    title: "Fee waivers",
    content:
      "CSS Profile fees are automatically waived for US domestic students whose families earn under ~$100k with modest assets. International students don't get automatic waivers, but individual schools often cover the fee — ask the financial aid office directly if the $25 + $16-per-school cost is a barrier.",
  },
  nextStep: {
    label: "See schools that meet 100% of need for international students",
    href: "/schools?meets_full_need_international=true",
  },
};
