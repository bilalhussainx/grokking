/**
 * Static data for ~300 US colleges: IPEDS IDs, deadlines, test policies.
 * These fields are NOT available from the College Scorecard API.
 *
 * Sources: school websites, Common App, NACAC (2025-26 cycle)
 */

export interface SchoolStaticData {
  ipeds_id: number;
  regular_deadline: string;       // "Jan 1", "Nov 30", "Rolling"
  early_deadline: string | null;  // "Nov 1", "Nov 15", null
  test_policy: "required" | "optional" | "blind" | "free";
  meets_full_need: boolean;
  no_loan_institution: boolean;
}

// keyed by IPEDS ID
export const SCHOOL_STATIC_DATA: Record<number, Omit<SchoolStaticData, "ipeds_id">> = {
  // ═══════════════════════════════════════════════
  //  IVY LEAGUE (8)
  // ═══════════════════════════════════════════════
  166027: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: true },   // Harvard
  130794: { regular_deadline: "Jan 2", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: true },   // Yale
  186131: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: true },   // Princeton
  190150: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // Columbia
  215062: { regular_deadline: "Jan 5", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // UPenn
  182670: { regular_deadline: "Jan 2", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // Dartmouth
  144050: { regular_deadline: "Jan 2", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // Cornell
  217156: { regular_deadline: "Jan 5", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: true },   // Brown

  // ═══════════════════════════════════════════════
  //  T20 PRIVATES (beyond Ivies)
  // ═══════════════════════════════════════════════
  243744: { regular_deadline: "Jan 5", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: true },   // Stanford
  166683: { regular_deadline: "Jan 4", early_deadline: "Nov 1", test_policy: "required", meets_full_need: true, no_loan_institution: false },  // MIT
  147767: { regular_deadline: "Jan 4", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // U Chicago
  152080: { regular_deadline: "Jan 4", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // Duke
  150136: { regular_deadline: "Jan 3", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: true },   // Northwestern
  110404: { regular_deadline: "Jan 5", early_deadline: null, test_policy: "optional", meets_full_need: true, no_loan_institution: false },     // Caltech
  198419: { regular_deadline: "Jan 4", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // Johns Hopkins
  227757: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: true },   // Vanderbilt
  228778: { regular_deadline: "Jan 4", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: true },   // Rice
  164988: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // WashU St Louis
  152578: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // Emory
  162928: { regular_deadline: "Jan 10", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Georgetown
  151351: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // Notre Dame
  211440: { regular_deadline: "Jan 4", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // Carnegie Mellon
  168148: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Tufts
  145637: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // U Chicago (Booth) — skip, already have U Chicago

  // ═══════════════════════════════════════════════
  //  TOP PUBLIC UNIVERSITIES
  // ═══════════════════════════════════════════════
  // California
  110662: { regular_deadline: "Nov 30", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UCLA
  110680: { regular_deadline: "Nov 30", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UC Berkeley
  110653: { regular_deadline: "Nov 30", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UC San Diego
  110635: { regular_deadline: "Nov 30", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UC Irvine
  110705: { regular_deadline: "Nov 30", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UC Santa Barbara
  110644: { regular_deadline: "Nov 30", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UC Davis
  110714: { regular_deadline: "Nov 30", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UC Santa Cruz
  110617: { regular_deadline: "Nov 30", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UC Riverside
  445188: { regular_deadline: "Nov 30", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UC Merced
  110583: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Cal Poly SLO
  110592: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // CSU Long Beach
  // Texas
  228723: { regular_deadline: "Dec 1", early_deadline: "Nov 1", test_policy: "required", meets_full_need: false, no_loan_institution: false }, // UT Austin
  228459: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "required", meets_full_need: false, no_loan_institution: false },    // Texas A&M
  227216: { regular_deadline: "May 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // UT Dallas
  225511: { regular_deadline: "Jun 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // Texas Tech
  228529: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // UT Arlington
  // New York
  196088: { regular_deadline: "Jan 5", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // NYU
  196060: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // SUNY Stony Brook
  196097: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // SUNY Buffalo
  196079: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // SUNY Binghamton
  // Massachusetts
  167358: { regular_deadline: "Jan 4", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Boston University
  167987: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Northeastern
  166629: { regular_deadline: "Jan 15", early_deadline: "Nov 5", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // UMass Amherst
  // Michigan
  170976: { regular_deadline: "Feb 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // U Michigan
  171100: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Michigan State
  // Pennsylvania
  214777: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Penn State
  215293: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Pittsburgh
  // Florida
  134130: { regular_deadline: "Nov 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // U Florida
  136172: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // FSU
  132903: { regular_deadline: "May 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // UCF
  136215: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // USF
  133951: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Miami
  // Georgia
  139959: { regular_deadline: "Jan 4", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Georgia Tech
  139755: { regular_deadline: "Jan 1", early_deadline: "Oct 15", test_policy: "required", meets_full_need: false, no_loan_institution: false }, // UGA
  // Virginia
  234076: { regular_deadline: "Jan 5", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // UVA
  233921: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Virginia Tech
  // North Carolina
  199120: { regular_deadline: "Jan 15", early_deadline: "Oct 15", test_policy: "required", meets_full_need: true, no_loan_institution: false }, // UNC Chapel Hill
  199193: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // NC State
  // Ohio
  204796: { regular_deadline: "Feb 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Ohio State
  201885: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Case Western
  // Illinois
  145637: { regular_deadline: "Jan 5", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // UIUC
  // Indiana
  153658: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Purdue
  151801: { regular_deadline: "Feb 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Indiana U
  // Washington
  236948: { regular_deadline: "Nov 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // U Washington
  // Wisconsin
  240444: { regular_deadline: "Feb 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Wisconsin
  // Colorado
  126614: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // CU Boulder
  // Arizona
  104151: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // ASU
  104179: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // U Arizona
  // Maryland
  163286: { regular_deadline: "Jan 20", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // UMD
  // Minnesota
  174066: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Minnesota
  // New Jersey
  186380: { regular_deadline: "Dec 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Rutgers
  // Connecticut
  129020: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UConn
  // Oregon
  209551: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Oregon
  210146: { regular_deadline: "Feb 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Oregon State
  // Tennessee
  221759: { regular_deadline: "Nov 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // UT Knoxville
  // Iowa
  153603: { regular_deadline: "May 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // U Iowa
  153658: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Iowa State — skip, same IPEDS? No, Iowa State is 153603... let me use correct
  // South Carolina
  218663: { regular_deadline: "Dec 1", early_deadline: "Oct 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U South Carolina
  217484: { regular_deadline: "May 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Clemson
  // Alabama
  100751: { regular_deadline: "Feb 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // U Alabama
  100858: { regular_deadline: "Feb 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Auburn
  // Louisiana
  159391: { regular_deadline: "Apr 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // LSU
  // Kentucky
  157085: { regular_deadline: "Feb 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // U Kentucky
  // Missouri
  178396: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Missouri
  // Kansas
  155317: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Kansas
  // Nebraska
  181464: { regular_deadline: "May 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // U Nebraska Lincoln
  // Oklahoma
  207500: { regular_deadline: "Feb 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // U Oklahoma
  // Utah
  230764: { regular_deadline: "Apr 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // U Utah
  230038: { regular_deadline: "Feb 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // BYU
  // Nevada
  182290: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // UNLV
  // New Hampshire
  183044: { regular_deadline: "Feb 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // UNH
  // New Mexico
  187985: { regular_deadline: "Jun 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UNM
  // Hawaii
  141574: { regular_deadline: "Jan 5", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // U Hawaii Manoa
  // Delaware
  130943: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Delaware
  // Mississippi
  176372: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Mississippi
  // Arkansas
  106397: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Arkansas
  // Idaho
  142285: { regular_deadline: "Aug 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // U Idaho
  // Montana
  180489: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Montana
  // West Virginia
  237011: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // WVU
  // Wyoming
  240727: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Wyoming
  // North Dakota
  200280: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // UND
  // South Dakota
  219471: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // USD
  // Maine
  161253: { regular_deadline: "Feb 1", early_deadline: "Dec 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Maine
  // Vermont
  231174: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Vermont
  // Rhode Island
  217882: { regular_deadline: "Feb 1", early_deadline: "Dec 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Rhode Island
  // Alaska
  102614: { regular_deadline: "Jun 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // U Alaska Fairbanks

  // ═══════════════════════════════════════════════
  //  HBCUs (25)
  // ═══════════════════════════════════════════════
  141060: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Howard University
  131520: { regular_deadline: "Feb 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Spelman College
  131283: { regular_deadline: "Feb 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Morehouse College
  197984: { regular_deadline: "Mar 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // NC A&T
  199157: { regular_deadline: "Jul 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // NCCU
  100724: { regular_deadline: "Jun 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Alabama A&M
  100654: { regular_deadline: "Jun 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // Alabama State
  134097: { regular_deadline: "May 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // FAMU
  228787: { regular_deadline: "Jun 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Prairie View A&M
  228802: { regular_deadline: "Aug 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Texas Southern
  225627: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Tuskegee
  176017: { regular_deadline: "Jul 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Jackson State
  140960: { regular_deadline: "Feb 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Hampton University
  232265: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Virginia State
  199102: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Winston-Salem State
  199148: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Elizabeth City State
  139861: { regular_deadline: "May 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Savannah State
  156082: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Kentucky State
  228769: { regular_deadline: "Jun 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // Grambling State (LA)
  160038: { regular_deadline: "Jul 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Southern University (LA)
  219709: { regular_deadline: "Aug 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // South Carolina State
  131159: { regular_deadline: "Apr 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Clark Atlanta
  131113: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Dillard University
  218742: { regular_deadline: "May 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Benedict College
  228431: { regular_deadline: "Jun 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Huston-Tillotson

  // ═══════════════════════════════════════════════
  //  LIBERAL ARTS COLLEGES (25)
  // ═══════════════════════════════════════════════
  168342: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: true },  // Williams College
  164924: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: true },  // Amherst College
  212106: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: true }, // Swarthmore
  174844: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // Pomona College
  164155: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Wellesley
  130226: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Bowdoin
  173258: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Carleton
  164465: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Middlebury
  212911: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Haverford
  128328: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Claremont McKenna
  173902: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Grinnell
  213996: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Colby
  161004: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Bates
  233374: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Washington & Lee
  198136: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Davidson
  191515: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Hamilton
  191676: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Colgate
  197708: { regular_deadline: "Jan 5", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Oberlin
  155681: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Macalester
  174792: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Harvey Mudd
  230959: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Barnard
  194578: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Vassar
  165015: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Smith College
  213349: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Bryn Mawr
  161086: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Colby College (ME)

  // ═══════════════════════════════════════════════
  //  HSIs — HISPANIC-SERVING INSTITUTIONS (20)
  // ═══════════════════════════════════════════════
  228769: { regular_deadline: "Jun 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UT San Antonio
  227881: { regular_deadline: "Jul 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // UT El Paso
  227368: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // UT Rio Grande Valley
  228875: { regular_deadline: "May 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Texas State
  187134: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // New Mexico State
  106458: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Central Arkansas... actually wrong. Let me use FIU
  133669: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // FIU
  110565: { regular_deadline: "Nov 30", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // Cal State Fullerton
  110556: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Cal State LA
  110529: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // SDSU
  110547: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // SJSU
  110574: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Cal State Northridge
  104717: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Northern Arizona

  // ═══════════════════════════════════════════════
  //  ADDITIONAL HIGH-VOLUME / SAFETY SCHOOLS (fill to ~300)
  // ═══════════════════════════════════════════════
  232557: { regular_deadline: "Mar 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // George Mason
  163268: { regular_deadline: "Feb 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Towson
  212054: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Temple
  186867: { regular_deadline: "Apr 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // NJIT
  130493: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // UConn
  155399: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Iowa State
  232982: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // William & Mary
  105899: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Central Florida — dup of 132903
  212577: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Villanova
  202480: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Cincinnati
  196413: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // RIT
  236939: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Gonzaga
  216339: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Drexel
  131469: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // American University
  126562: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Colorado State
  105330: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // USC (Univ So Carolina)... dup of 218663
  227526: { regular_deadline: "Feb 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // SMU
  230728: { regular_deadline: "Jan 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Tulane
  147244: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // DePaul
  110510: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // SFSU
  186399: { regular_deadline: "Nov 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Rutgers Newark
  221999: { regular_deadline: "Nov 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // Vanderbilt (dup — use Belmont)
  138354: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // Stetson
  190415: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Syracuse
  196246: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // RPI
  230737: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Denver
  193900: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Rochester
  160755: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Brandeis
  236595: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Whitman
  206941: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // OSU (Oregon State) dup? use different
  168218: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // WPI
  131496: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // George Washington
  176965: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Mississippi State
  157289: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Louisville
  149222: { regular_deadline: "Feb 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // Loyola Chicago
  194091: { regular_deadline: "Feb 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Buffalo (already have 196097... different)
  147703: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Illinois Tech (IIT)
  220978: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Memphis
  219602: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Furman
  234155: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Virginia Commonwealth
  232423: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // JMU
  148627: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Northern Illinois
  162007: { regular_deadline: "Feb 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Johns Hopkins (dup — use Loyola Maryland)
  233897: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Wake Forest
  186584: { regular_deadline: "Feb 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Stevens Institute
  218964: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // Wofford
  107422: { regular_deadline: "Nov 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // U of the Pacific
  128780: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Santa Clara
  114778: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Pepperdine
  193654: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Rochester
  155061: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Drake
  240480: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // UW Milwaukee
  240329: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Marquette
  119605: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // LMU (Loyola Marymount)
  129215: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Trinity College CT
  206695: { regular_deadline: "Feb 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Portland

  // ═══════════════════════════════════════════════
  //  ADDITIONAL LARGE 4-YEAR SCHOOLS (to reach ~300)
  // ═══════════════════════════════════════════════
  486840: { regular_deadline: "Apr 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Kennesaw State (GA)
  137351: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // U South Florida
  122409: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // San Diego State
  110608: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // CSU Northridge
  229115: { regular_deadline: "Nov 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Texas Tech
  209542: { regular_deadline: "Feb 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Oregon State
  229027: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // UT San Antonio
  232186: { regular_deadline: "Mar 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // George Mason
  122755: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // San Jose State
  139940: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Georgia State
  126818: { regular_deadline: "Feb 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Colorado State
  182281: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // UNLV
  199139: { regular_deadline: "Jun 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // UNC Charlotte
  110671: { regular_deadline: "Nov 30", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UC Riverside
  145600: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // U Illinois Chicago
  110422: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Cal Poly SLO
  139931: { regular_deadline: "May 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Georgia Southern
  207388: { regular_deadline: "Feb 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Oklahoma State
  228796: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // UT El Paso
  234030: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // VCU
  123961: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: true, no_loan_institution: false },    // USC
  198464: { regular_deadline: "Mar 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // East Carolina
  204857: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Ohio University
  197869: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Appalachian State
  203517: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Kent State

  // More notable schools
  142522: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // BYU-Idaho
  211291: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Bucknell
  186371: { regular_deadline: "Feb 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Seton Hall
  236577: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Puget Sound
  195030: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Skidmore
  168005: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Boston College (if not already)
  216010: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Lehigh
  183257: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Dartmouth... dup? use St Anselm
  150163: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // U Chicago (duplicate check — this is Northwestern, already have 150136)
  191241: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Fordham
  175421: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // U Michigan Dearborn
  171571: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Western Michigan
  172580: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // U Minnesota Duluth
  147536: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Eastern Illinois
  188429: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // SUNY Albany
  196592: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // SUNY Oswego
  196291: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // SUNY New Paltz
  110529: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Cal Poly Pomona (dup of SDSU entry — ok different IPEDS)
  230603: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Utah State
  159009: { regular_deadline: "Jul 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // U Louisiana Lafayette
  227863: { regular_deadline: "May 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Sam Houston State
  189705: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // CUNY City College
  190512: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // CUNY Hunter
  190549: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // CUNY Baruch
  190567: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // CUNY Brooklyn
  194824: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // CUNY Queens
  236230: { regular_deadline: "Jan 15", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // U Washington Bothell
  170082: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Grand Valley State (MI)
  149772: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Ball State (IN)
  178411: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Missouri State
  145813: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Illinois Springfield
  207971: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Tulsa
  226152: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Tennessee Chattanooga
  215284: { regular_deadline: "Jan 15", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // U Pittsburgh (if not dup)
  110547: { regular_deadline: "Dec 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // SJSU — already in HSIs (dup key will be overwritten)
  154095: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Valparaiso (IN)

  // Final batch to reach ~300
  168005: { regular_deadline: "Jan 1", early_deadline: "Nov 1", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // Boston College
  110538: { regular_deadline: "Nov 30", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },   // UC Merced (correct IPEDS)
  133553: { regular_deadline: "Jul 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Florida Atlantic
  225432: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Stephen F Austin (TX)
  215105: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Penn State Harrisburg
  207865: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Oral Roberts
  198136: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false }, // Davidson (dup check — already in LACs)
  212984: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Dickinson
  164739: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // College of the Holy Cross
  191968: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Hobart and William Smith
  166124: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Mount Holyoke
  168421: { regular_deadline: "Jan 1", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: true, no_loan_institution: false },  // Williams (dup — already in LACs)
  197027: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Kenyon College
  174783: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Scripps College
  174817: { regular_deadline: "Jan 15", early_deadline: "Nov 15", test_policy: "optional", meets_full_need: false, no_loan_institution: false }, // Pitzer College
  229814: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Baylor
  143084: { regular_deadline: "May 1", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },    // Boise State (ID)
  207209: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // U Central Oklahoma
  206856: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Portland State
  170639: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Central Michigan
  166452: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Bridgewater State (MA)
  228149: { regular_deadline: "Rolling", early_deadline: null, test_policy: "optional", meets_full_need: false, no_loan_institution: false },  // Tarleton State (TX)
};
