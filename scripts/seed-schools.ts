/**
 * Seed cc_schools with top 50 US schools by application volume.
 * Run: npx tsx scripts/seed-schools.ts
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface School {
  name: string;
  city: string;
  state: string;
  school_type: "public" | "private";
  acceptance_rate: number;
  avg_net_price: number;
  test_policy: "required" | "optional" | "blind" | "free";
  regular_deadline: string;
  early_deadline: string | null;
  website: string;
  ceeb_code: string;
  enrollment: number;
}

const schools: School[] = [
  { name: "University of California, Los Angeles", city: "Los Angeles", state: "CA", school_type: "public", acceptance_rate: 0.09, avg_net_price: 14000, test_policy: "optional", regular_deadline: "Nov 30", early_deadline: null, website: "ucla.edu", ceeb_code: "4837", enrollment: 46000 },
  { name: "University of California, San Diego", city: "La Jolla", state: "CA", school_type: "public", acceptance_rate: 0.24, avg_net_price: 15000, test_policy: "optional", regular_deadline: "Nov 30", early_deadline: null, website: "ucsd.edu", ceeb_code: "4836", enrollment: 42000 },
  { name: "University of California, Berkeley", city: "Berkeley", state: "CA", school_type: "public", acceptance_rate: 0.11, avg_net_price: 16000, test_policy: "optional", regular_deadline: "Nov 30", early_deadline: null, website: "berkeley.edu", ceeb_code: "4833", enrollment: 45000 },
  { name: "University of California, Irvine", city: "Irvine", state: "CA", school_type: "public", acceptance_rate: 0.21, avg_net_price: 13000, test_policy: "optional", regular_deadline: "Nov 30", early_deadline: null, website: "uci.edu", ceeb_code: "4859", enrollment: 36000 },
  { name: "University of California, Santa Barbara", city: "Santa Barbara", state: "CA", school_type: "public", acceptance_rate: 0.26, avg_net_price: 15000, test_policy: "optional", regular_deadline: "Nov 30", early_deadline: null, website: "ucsb.edu", ceeb_code: "4835", enrollment: 26000 },
  { name: "University of California, Davis", city: "Davis", state: "CA", school_type: "public", acceptance_rate: 0.37, avg_net_price: 16000, test_policy: "optional", regular_deadline: "Nov 30", early_deadline: null, website: "ucdavis.edu", ceeb_code: "4834", enrollment: 40000 },
  { name: "California State University, Long Beach", city: "Long Beach", state: "CA", school_type: "public", acceptance_rate: 0.31, avg_net_price: 8000, test_policy: "optional", regular_deadline: "Dec 1", early_deadline: null, website: "csulb.edu", ceeb_code: "4389", enrollment: 39000 },
  { name: "New York University", city: "New York", state: "NY", school_type: "private", acceptance_rate: 0.12, avg_net_price: 35000, test_policy: "optional", regular_deadline: "Jan 5", early_deadline: "Nov 1", website: "nyu.edu", ceeb_code: "2562", enrollment: 59000 },
  { name: "Boston University", city: "Boston", state: "MA", school_type: "private", acceptance_rate: 0.14, avg_net_price: 33000, test_policy: "optional", regular_deadline: "Jan 4", early_deadline: "Nov 1", website: "bu.edu", ceeb_code: "3087", enrollment: 37000 },
  { name: "University of Michigan, Ann Arbor", city: "Ann Arbor", state: "MI", school_type: "public", acceptance_rate: 0.18, avg_net_price: 17000, test_policy: "optional", regular_deadline: "Feb 1", early_deadline: "Nov 1", website: "umich.edu", ceeb_code: "1839", enrollment: 48000 },
  { name: "University of Texas at Austin", city: "Austin", state: "TX", school_type: "public", acceptance_rate: 0.31, avg_net_price: 13000, test_policy: "required", regular_deadline: "Dec 1", early_deadline: "Nov 1", website: "utexas.edu", ceeb_code: "6882", enrollment: 52000 },
  { name: "University of Florida", city: "Gainesville", state: "FL", school_type: "public", acceptance_rate: 0.23, avg_net_price: 10000, test_policy: "optional", regular_deadline: "Nov 1", early_deadline: null, website: "ufl.edu", ceeb_code: "5812", enrollment: 56000 },
  { name: "Penn State University", city: "University Park", state: "PA", school_type: "public", acceptance_rate: 0.54, avg_net_price: 21000, test_policy: "optional", regular_deadline: "Rolling", early_deadline: null, website: "psu.edu", ceeb_code: "2660", enrollment: 47000 },
  { name: "University of Washington", city: "Seattle", state: "WA", school_type: "public", acceptance_rate: 0.48, avg_net_price: 12000, test_policy: "optional", regular_deadline: "Nov 15", early_deadline: null, website: "washington.edu", ceeb_code: "4854", enrollment: 48000 },
  { name: "University of Illinois Urbana-Champaign", city: "Champaign", state: "IL", school_type: "public", acceptance_rate: 0.45, avg_net_price: 16000, test_policy: "optional", regular_deadline: "Jan 5", early_deadline: "Nov 1", website: "illinois.edu", ceeb_code: "1836", enrollment: 56000 },
  { name: "Northeastern University", city: "Boston", state: "MA", school_type: "private", acceptance_rate: 0.07, avg_net_price: 32000, test_policy: "optional", regular_deadline: "Jan 1", early_deadline: "Nov 1", website: "northeastern.edu", ceeb_code: "3667", enrollment: 22000 },
  { name: "Rutgers University–New Brunswick", city: "New Brunswick", state: "NJ", school_type: "public", acceptance_rate: 0.66, avg_net_price: 18000, test_policy: "optional", regular_deadline: "Dec 1", early_deadline: "Nov 1", website: "rutgers.edu", ceeb_code: "2765", enrollment: 51000 },
  { name: "Ohio State University", city: "Columbus", state: "OH", school_type: "public", acceptance_rate: 0.53, avg_net_price: 16000, test_policy: "optional", regular_deadline: "Feb 1", early_deadline: "Nov 1", website: "osu.edu", ceeb_code: "1592", enrollment: 61000 },
  { name: "Georgia Institute of Technology", city: "Atlanta", state: "GA", school_type: "public", acceptance_rate: 0.17, avg_net_price: 13000, test_policy: "optional", regular_deadline: "Jan 4", early_deadline: "Nov 1", website: "gatech.edu", ceeb_code: "5248", enrollment: 45000 },
  { name: "University of Virginia", city: "Charlottesville", state: "VA", school_type: "public", acceptance_rate: 0.19, avg_net_price: 17000, test_policy: "optional", regular_deadline: "Jan 5", early_deadline: "Nov 1", website: "virginia.edu", ceeb_code: "5820", enrollment: 26000 },
  { name: "University of North Carolina at Chapel Hill", city: "Chapel Hill", state: "NC", school_type: "public", acceptance_rate: 0.17, avg_net_price: 11000, test_policy: "required", regular_deadline: "Jan 15", early_deadline: "Oct 15", website: "unc.edu", ceeb_code: "5816", enrollment: 31000 },
  { name: "Purdue University", city: "West Lafayette", state: "IN", school_type: "public", acceptance_rate: 0.53, avg_net_price: 14000, test_policy: "optional", regular_deadline: "Jan 15", early_deadline: "Nov 1", website: "purdue.edu", ceeb_code: "1631", enrollment: 50000 },
  { name: "University of Wisconsin–Madison", city: "Madison", state: "WI", school_type: "public", acceptance_rate: 0.49, avg_net_price: 15000, test_policy: "optional", regular_deadline: "Feb 1", early_deadline: "Nov 1", website: "wisc.edu", ceeb_code: "1846", enrollment: 49000 },
  { name: "Virginia Tech", city: "Blacksburg", state: "VA", school_type: "public", acceptance_rate: 0.57, avg_net_price: 15000, test_policy: "optional", regular_deadline: "Jan 15", early_deadline: "Nov 1", website: "vt.edu", ceeb_code: "5859", enrollment: 38000 },
  { name: "University of Southern California", city: "Los Angeles", state: "CA", school_type: "private", acceptance_rate: 0.12, avg_net_price: 38000, test_policy: "optional", regular_deadline: "Jan 15", early_deadline: null, website: "usc.edu", ceeb_code: "4852", enrollment: 49000 },
  { name: "Harvard University", city: "Cambridge", state: "MA", school_type: "private", acceptance_rate: 0.03, avg_net_price: 18000, test_policy: "optional", regular_deadline: "Jan 1", early_deadline: "Nov 1", website: "harvard.edu", ceeb_code: "3434", enrollment: 22000 },
  { name: "Stanford University", city: "Stanford", state: "CA", school_type: "private", acceptance_rate: 0.04, avg_net_price: 17000, test_policy: "optional", regular_deadline: "Jan 5", early_deadline: "Nov 1", website: "stanford.edu", ceeb_code: "4704", enrollment: 17000 },
  { name: "Massachusetts Institute of Technology", city: "Cambridge", state: "MA", school_type: "private", acceptance_rate: 0.04, avg_net_price: 22000, test_policy: "required", regular_deadline: "Jan 4", early_deadline: "Nov 1", website: "mit.edu", ceeb_code: "3514", enrollment: 12000 },
  { name: "Yale University", city: "New Haven", state: "CT", school_type: "private", acceptance_rate: 0.05, avg_net_price: 18000, test_policy: "optional", regular_deadline: "Jan 2", early_deadline: "Nov 1", website: "yale.edu", ceeb_code: "3987", enrollment: 14000 },
  { name: "Princeton University", city: "Princeton", state: "NJ", school_type: "private", acceptance_rate: 0.04, avg_net_price: 15000, test_policy: "optional", regular_deadline: "Jan 1", early_deadline: "Nov 1", website: "princeton.edu", ceeb_code: "2672", enrollment: 8500 },
  { name: "Columbia University", city: "New York", state: "NY", school_type: "private", acceptance_rate: 0.04, avg_net_price: 20000, test_policy: "optional", regular_deadline: "Jan 1", early_deadline: "Nov 1", website: "columbia.edu", ceeb_code: "2116", enrollment: 33000 },
  { name: "University of Pennsylvania", city: "Philadelphia", state: "PA", school_type: "private", acceptance_rate: 0.06, avg_net_price: 24000, test_policy: "optional", regular_deadline: "Jan 5", early_deadline: "Nov 1", website: "upenn.edu", ceeb_code: "2926", enrollment: 28000 },
  { name: "Duke University", city: "Durham", state: "NC", school_type: "private", acceptance_rate: 0.06, avg_net_price: 22000, test_policy: "optional", regular_deadline: "Jan 4", early_deadline: "Nov 1", website: "duke.edu", ceeb_code: "5156", enrollment: 17000 },
  { name: "Northwestern University", city: "Evanston", state: "IL", school_type: "private", acceptance_rate: 0.07, avg_net_price: 27000, test_policy: "optional", regular_deadline: "Jan 3", early_deadline: "Nov 1", website: "northwestern.edu", ceeb_code: "1565", enrollment: 23000 },
  { name: "Cornell University", city: "Ithaca", state: "NY", school_type: "private", acceptance_rate: 0.08, avg_net_price: 27000, test_policy: "optional", regular_deadline: "Jan 2", early_deadline: "Nov 1", website: "cornell.edu", ceeb_code: "2098", enrollment: 25000 },
  { name: "Rice University", city: "Houston", state: "TX", school_type: "private", acceptance_rate: 0.08, avg_net_price: 19000, test_policy: "optional", regular_deadline: "Jan 4", early_deadline: "Nov 1", website: "rice.edu", ceeb_code: "6609", enrollment: 8000 },
  { name: "Vanderbilt University", city: "Nashville", state: "TN", school_type: "private", acceptance_rate: 0.06, avg_net_price: 24000, test_policy: "optional", regular_deadline: "Jan 1", early_deadline: "Nov 1", website: "vanderbilt.edu", ceeb_code: "1871", enrollment: 14000 },
  { name: "Georgetown University", city: "Washington", state: "DC", school_type: "private", acceptance_rate: 0.12, avg_net_price: 28000, test_policy: "optional", regular_deadline: "Jan 10", early_deadline: "Nov 1", website: "georgetown.edu", ceeb_code: "5244", enrollment: 20000 },
  { name: "University of Notre Dame", city: "Notre Dame", state: "IN", school_type: "private", acceptance_rate: 0.12, avg_net_price: 28000, test_policy: "optional", regular_deadline: "Jan 1", early_deadline: "Nov 1", website: "nd.edu", ceeb_code: "1841", enrollment: 14000 },
  { name: "Emory University", city: "Atlanta", state: "GA", school_type: "private", acceptance_rate: 0.13, avg_net_price: 26000, test_policy: "optional", regular_deadline: "Jan 1", early_deadline: "Nov 1", website: "emory.edu", ceeb_code: "5187", enrollment: 15000 },
  { name: "Carnegie Mellon University", city: "Pittsburgh", state: "PA", school_type: "private", acceptance_rate: 0.11, avg_net_price: 30000, test_policy: "optional", regular_deadline: "Jan 4", early_deadline: "Nov 1", website: "cmu.edu", ceeb_code: "2074", enrollment: 16000 },
  { name: "University of Georgia", city: "Athens", state: "GA", school_type: "public", acceptance_rate: 0.43, avg_net_price: 13000, test_policy: "required", regular_deadline: "Jan 1", early_deadline: "Oct 15", website: "uga.edu", ceeb_code: "5813", enrollment: 41000 },
  { name: "Florida State University", city: "Tallahassee", state: "FL", school_type: "public", acceptance_rate: 0.25, avg_net_price: 12000, test_policy: "optional", regular_deadline: "Mar 1", early_deadline: null, website: "fsu.edu", ceeb_code: "5219", enrollment: 46000 },
  { name: "University of Maryland, College Park", city: "College Park", state: "MD", school_type: "public", acceptance_rate: 0.45, avg_net_price: 14000, test_policy: "optional", regular_deadline: "Jan 20", early_deadline: "Nov 1", website: "umd.edu", ceeb_code: "5814", enrollment: 41000 },
  { name: "Arizona State University", city: "Tempe", state: "AZ", school_type: "public", acceptance_rate: 0.88, avg_net_price: 12000, test_policy: "optional", regular_deadline: "Rolling", early_deadline: null, website: "asu.edu", ceeb_code: "4007", enrollment: 78000 },
  { name: "University of Minnesota–Twin Cities", city: "Minneapolis", state: "MN", school_type: "public", acceptance_rate: 0.73, avg_net_price: 15000, test_policy: "optional", regular_deadline: "Rolling", early_deadline: null, website: "umn.edu", ceeb_code: "6874", enrollment: 52000 },
  { name: "Texas A&M University", city: "College Station", state: "TX", school_type: "public", acceptance_rate: 0.63, avg_net_price: 14000, test_policy: "required", regular_deadline: "Dec 1", early_deadline: null, website: "tamu.edu", ceeb_code: "6003", enrollment: 74000 },
  { name: "Indiana University Bloomington", city: "Bloomington", state: "IN", school_type: "public", acceptance_rate: 0.80, avg_net_price: 14000, test_policy: "optional", regular_deadline: "Feb 1", early_deadline: "Nov 1", website: "iu.edu", ceeb_code: "1324", enrollment: 48000 },
  { name: "University of Colorado Boulder", city: "Boulder", state: "CO", school_type: "public", acceptance_rate: 0.80, avg_net_price: 17000, test_policy: "optional", regular_deadline: "Jan 15", early_deadline: "Nov 15", website: "colorado.edu", ceeb_code: "4841", enrollment: 40000 },
  { name: "Michigan State University", city: "East Lansing", state: "MI", school_type: "public", acceptance_rate: 0.88, avg_net_price: 16000, test_policy: "optional", regular_deadline: "Rolling", early_deadline: null, website: "msu.edu", ceeb_code: "1465", enrollment: 50000 },
];

async function seed() {
  const rows = schools.map((s) => ({
    name: s.name,
    city: s.city,
    state: s.state,
    school_type: s.school_type,
    acceptance_rate: s.acceptance_rate,
    avg_net_price: s.avg_net_price,
    test_policy: s.test_policy,
    regular_deadline: s.regular_deadline,
    early_deadline: s.early_deadline,
    website: s.website,
    ceeb_code: s.ceeb_code,
    enrollment: s.enrollment,
  }));

  const { error } = await supabase
    .from("cc_schools")
    .upsert(rows, { onConflict: "name" });

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${schools.length} schools successfully.`);
}

seed();
