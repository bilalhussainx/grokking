# Part 3 US research (catalog schools), accessed 2026-10-03

List edition: top-50 extension NOT started, so no US News edition was used. Catalog = 20 schools from school-deadlines-2026.json.

Method and caveats:
- Read directly with WebFetch: Harvard (2 pages), MIT (1), Yale apply, Stanford first-year + aid, Princeton dates, Penn requirements + deadlines FAQ.
- Everything else comes from WebSearch restricted to the official domain. The search tool returns a summary, not the page, so those values are search summaries of official pages (the cited URL is the page the summary pointed to, not one I read). Columbia, Princeton aid, Cornell pages returned 403/404 on direct fetch.
- status published_2026_27 only where the source text carries explicit 2026/2027 dates or names the cycle itself. Everything else, including undated standing policies (meets need etc.), is UNVERIFIED. No last_cycle labels assigned; last cycle's dates are in school-deadlines-2026.json.
- Princeton's deadlines page is labelled Class of 2029 (stale label). Columbia's testing page is internally ambiguous.
- Platforms listed are only those seen; others may be accepted.

| School | Deadlines | Test | Essays | Interview | CSS | Meets need | Need-blind intl | Aid deadline |
|---|---|---|---|---|---|---|---|---|
| Harvard | {'REA': 'Nov 1', 'RD': 'Jan 1', 'note': 'no entry year on pa | SAT or ACT required | 5 short answers, 150 words each | UNVERIFIED | UNVERIFIED: not stated on pages read | yes (page undated) | yes (page undated) | UNVERIFIED |
| MIT | {'EA': 'Nov 1', 'RA': 'Jan 4', 'note': 'no entry year on pag | SAT or ACT required | UNVERIFIED | optional, via Educational Counselor; waived with no penalty  | CSS Profile used for need analysis; 'required' wording not c | yes | yes (search summary of MIT pages) | UNVERIFIED |
| Yale | {'SCEA': 'Nov 1', 'RD': 'Jan 2', 'note': 'no entry year on p | ACT or SAT required | UNVERIFIED | UNVERIFIED | not required for international applicants unless requested;  | yes, 100%, regardless of citizenship | yes | UNVERIFIED |
| Princeton | {'SCEA': 'Nov 1', 'RD': 'Jan 1', 'note': 'fetched page is la | test-optional for fall 2027 entry; required from fall 2028 e | Princeton-specific questions for 2026-27 (one of two academi | optional alumni interview; no on-campus interviews | no: Princeton does not require or accept CSS Profile; uses P | yes, including international | yes | SCEA Nov 9; RD Feb 1 (year not confirmed) |
| Stanford | {'REA': 'Oct 15', 'RD': 'Jan 5', 'note': 'page updated 2026- | ACT or SAT required | UNVERIFIED | UNVERIFIED | yes, school code 4704 (ISAFA alternative for international) | yes, regardless of citizenship for admitted students who req | no: need-aware for international | UNVERIFIED |
| Columbia | {'ED': '2026-11-01', 'RD': '2027-01-01'} | UNVERIFIED: source says test-optional for 2026-27 but also s | UNVERIFIED | UNVERIFIED | yes for international (code 2116); domestic not confirmed | yes, including international | no: need-aware for international | ED aid 2026-11-15 |
| UPenn | {'ED': '2026-11-01', 'RD': '2027-01-05'} | SAT or ACT required (hardship waiver possible) | 3 Penn-specific prompts (thank-you note 150-200 words; commu | UNVERIFIED | yes, for aid applicants (with FAFSA for US; international wi | yes, incl. international admitted students | no: need-aware for international | ED 2026-11-06; RD 2027-02-01 |
| Cornell | {'ED': 'Nov 1', 'RD': 'Jan 2', 'note': 'year not on page tex | SAT or ACT required | Cornell Questions and Writing Supplement, college-specific s | neither required nor offered for most colleges; required for | yes for international applicants seeking aid; domestic not c | yes, incl. international | no: need-aware for international | UNVERIFIED |
| Brown | {'ED': 'Nov 1', 'RD': 'Jan 5'} | SAT or ACT required for first-year | search summary says 4 essays; only 3 prompts listed, count u | no alumni interviews; optional 90-second video introduction | yes; CSS filing deadlines 2026-11-02 (ED), 2027-02-01 (RD) | yes | yes, beginning Class of 2029 | CSS: ED 2026-11-02; RD 2027-02-01 |
| Dartmouth | {'ED': 'Nov 1', 'RD': 'Jan 1'} | SAT/ACT required for US high school applicants since Class o | personal statement + 3 brief supplement essays | optional alumni interview | UNVERIFIED | yes, incl. international | yes since Class of 2026 | ED Nov 1; RD Feb 1 (year not confirmed) |
| Georgetown | {'EA': 'Nov 1', 'RD': 'Jan 1'} | SAT or ACT required; no superscore | 4 essays in writing supplement | alumni interview required where alumni are available | yes for international; FAFSA + CSS to Georgetown by Feb 1 | yes for US citizens/permanent residents; not guaranteed for  | UNVERIFIED: international aid very limited | Feb 1 (year not confirmed) |
| UCLA | {'filing': 'Oct 1 - Nov 30 (verify exact dates on UC page)'} | test-blind (UC does not consider SAT/ACT) | 4 of 8 personal insight questions, 350 words each | UNVERIFIED | no: UC uses FAFSA / CA Dream Act (not CSS) | UNVERIFIED | international students ineligible for university, state or f | priority 2027-03-02 (for 2027-28) |
| UMich | {'ED': 'Nov 1', 'EA': 'Nov 1', 'RD': 'Feb 1'} | test-optional | UNVERIFIED | no interview | CSS Profile (code 1839) for institutional grants | yes for Michigan residents only | UNVERIFIED: limited scholarships, no federal aid | Mar 1 deadline; suggested Dec 15 (year not confirmed) |
| UNC | {'EA': 'Oct 15', 'RD': 'Jan 15'} | test-optional if weighted GPA 2.8+ (search summary) | UNVERIFIED | UNVERIFIED | yes for institutional need-based aid | yes for eligible (US citizens / permanent residents) | no need-based aid for international students | UNVERIFIED |
| NYU | {'ED1': 'Nov 1', 'ED2': 'Jan 1', 'RD': 'Jan 5'} | test-optional | UNVERIFIED | UNVERIFIED | yes, required for institutional aid | yes for first-year, New York campus, incl. international | UNVERIFIED | UNVERIFIED |
| Northwestern | {'ED': '2026-11-01', 'RD': '2027-01-04'} | test-optional | 1 required short answer (300 words) + optional short answers | no alumni interviews; optional Glimpse video (ED Nov 7, RD J | yes for international (code 1565); domestic not confirmed | yes, incl. international, loan-free | no: need-aware for international | ED 2026-12-01; RD 2027-02-01 |
| Duke | {'ED': 'Nov 2', 'RD': 'Jan 4'} | test-optional | one-page personal essay + Duke short-answer questions; count | optional alumni interview | yes for international; CSS+FAFSA due Nov 15 (ED), Feb 1 (RD) | yes | no: need-aware for international (20-25 international aid st | ED Nov 15; RD Feb 1 (year not confirmed) |
| USC | {'ED': '2026-11-01', 'EA': '2026-11-01', 'RD': '2026-12-01 ( | test-optional | Common App essay + USC short responses; count not stated | no evaluative interviews | yes with FAFSA, for eligible US applicants | yes for eligible US citizens/non-citizens; international ine | admission need-blind but international not eligible for need | ED 2026-11-01; EA 2026-11-15 |
| Vanderbilt | {'ED1': '2026-11-01', 'ED2': '2027-01-01', 'RD': '2027-01-01 | test-optional for fall 2027 and 2028 entry; required from fa | personal essay + 1 short answer (~250 words) | no interviews; optional Glimpse/InitialView video | yes for international aid requests; domestic not confirmed | yes, 100% | no: need-aware for international | UNVERIFIED |
| BU | {'ED1': 'Nov 2', 'ED2': 'Jan 5', 'RD': 'Jan 5'} | test-optional through fall 2028 | 1 BU supplemental essay (choice of 2 prompts) | not required (except some programs) | yes with FAFSA for need-based aid | yes for US citizens/permanent residents | no need-based aid for international students | CSS+FAFSA Nov 2 (ED1); Jan 5 (ED2/RD) (year not confirmed) |

```json
{
 "institutions": [
  {
   "name": "Harvard",
   "platforms": {
    "value": [
     "Common App",
     "QuestBridge"
    ],
    "source_url": "https://college.harvard.edu/admissions/apply/application-requirements",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "REA": "Nov 1",
     "RD": "Jan 1",
     "note": "no entry year on page"
    },
    "source_url": "https://college.harvard.edu/admissions/apply/application-requirements",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "SAT or ACT required",
    "source_url": "https://college.harvard.edu/admissions/apply/application-requirements",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "5 short answers, 150 words each",
    "source_url": "https://college.harvard.edu/admissions/apply/application-requirements",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "UNVERIFIED",
    "source_url": "https://college.harvard.edu/admissions/apply/application-requirements",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "UNVERIFIED: not stated on pages read",
    "source_url": "https://college.harvard.edu/financial-aid/how-aid-works",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes (page undated)",
    "source_url": "https://college.harvard.edu/financial-aid/how-aid-works",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "yes (page undated)",
    "source_url": "https://college.harvard.edu/financial-aid/how-aid-works",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "https://college.harvard.edu/financial-aid/net-price-calculator",
    "source_url": "https://college.harvard.edu/financial-aid/how-aid-works",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "UNVERIFIED",
    "source_url": "https://college.harvard.edu/financial-aid/how-aid-works",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "MIT",
   "platforms": {
    "value": [
     "MIT application portal (apply.mitadmissions.org)"
    ],
    "source_url": "https://www.mitadmissions.org/apply/firstyear/deadlines-requirements/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "EA": "Nov 1",
     "RA": "Jan 4",
     "note": "no entry year on page"
    },
    "source_url": "https://www.mitadmissions.org/apply/firstyear/deadlines-requirements/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "SAT or ACT required",
    "source_url": "https://www.mitadmissions.org/apply/firstyear/deadlines-requirements/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "UNVERIFIED",
    "source_url": "https://www.mitadmissions.org/apply/firstyear/deadlines-requirements/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "optional, via Educational Counselor; waived with no penalty if none available",
    "source_url": "https://www.mitadmissions.org/apply/firstyear/deadlines-requirements/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "CSS Profile used for need analysis; 'required' wording not confirmed",
    "source_url": "https://sfs.mit.edu/undergraduate-students/the-cost-of-attendance/making-mit-affordable/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes",
    "source_url": "https://www.mitadmissions.org/afford/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "yes (search summary of MIT pages)",
    "source_url": "https://sfs.mit.edu/undergraduate-students/the-cost-of-attendance/making-mit-affordable/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "https://mitadmissions.org/afford/cost-aid-basics/financial-aid-calculators/",
    "source_url": "https://www.mitadmissions.org/afford/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "UNVERIFIED",
    "source_url": "https://www.mitadmissions.org/afford/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "Yale",
   "platforms": {
    "value": [
     "Common App",
     "Coalition with Scoir",
     "QuestBridge"
    ],
    "source_url": "https://admissions.yale.edu/apply",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "SCEA": "Nov 1",
     "RD": "Jan 2",
     "note": "no entry year on page"
    },
    "source_url": "https://admissions.yale.edu/apply",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "ACT or SAT required",
    "source_url": "https://admissions.yale.edu/apply",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.yale.edu/apply",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.yale.edu/apply",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "not required for international applicants unless requested; domestic not confirmed",
    "source_url": "https://admissions.yale.edu/financial-aid-international-applicants",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes, 100%, regardless of citizenship",
    "source_url": "https://admissions.yale.edu/financial-aid-international-applicants",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "yes",
    "source_url": "https://admissions.yale.edu/financial-aid-international-applicants",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "admissions.yale.edu/financial-aid (Net Price Calculator and Quick Cost Estimator)",
    "source_url": "https://admissions.yale.edu/financial-aid-international-applicants",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "UNVERIFIED",
    "source_url": "https://finaid.yale.edu",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "Princeton",
   "platforms": {
    "value": [
     "Common App with Princeton-specific questions",
     "QuestBridge"
    ],
    "source_url": "https://admission.princeton.edu/apply/first-year-application-dates-deadlines",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "SCEA": "Nov 1",
     "RD": "Jan 1",
     "note": "fetched page is labelled Class of 2029 (stale label); cannot confirm fall 2027"
    },
    "source_url": "https://admission.princeton.edu/apply/first-year-application-dates-deadlines",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "test-optional for fall 2027 entry; required from fall 2028 entry (search-snippet quote of official page)",
    "source_url": "https://admission.princeton.edu/apply/standardized-testing",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "supplemental_essays": {
    "value": "Princeton-specific questions for 2026-27 (one of two academic prompts + 3 sections) plus graded written paper",
    "source_url": "https://admission.princeton.edu/apply/princeton-specific-questions",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "optional alumni interview; no on-campus interviews",
    "source_url": "https://admission.princeton.edu/faqs",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "no: Princeton does not require or accept CSS Profile; uses Princeton Financial Aid Application",
    "source_url": "https://admission.princeton.edu/cost-aid/how-financial-aid-works",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes, including international",
    "source_url": "https://admission.princeton.edu/cost-aid/how-financial-aid-works",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "yes",
    "source_url": "https://admission.princeton.edu/cost-aid/how-financial-aid-works",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "https://admission.princeton.edu/cost-aid/net-price-calculator",
    "source_url": "https://admission.princeton.edu/cost-aid/net-price-calculator",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "SCEA Nov 9; RD Feb 1 (year not confirmed)",
    "source_url": "https://admission.princeton.edu/apply/first-year-application-dates-deadlines",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "Stanford",
   "platforms": {
    "value": [
     "Common App"
    ],
    "source_url": "https://admission.stanford.edu/apply/first-year/index.html",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "deadlines": {
    "value": {
     "REA": "Oct 15",
     "RD": "Jan 5",
     "note": "page updated 2026-09-10"
    },
    "source_url": "https://admission.stanford.edu/apply/first-year/index.html",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "test_policy": {
    "value": "ACT or SAT required",
    "source_url": "https://admission.stanford.edu/apply/first-year/index.html",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "supplemental_essays": {
    "value": "UNVERIFIED",
    "source_url": "https://admission.stanford.edu/apply/first-year/index.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "UNVERIFIED",
    "source_url": "https://admission.stanford.edu/apply/first-year/index.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes, school code 4704 (ISAFA alternative for international)",
    "source_url": "https://financialaid.stanford.edu/site/faq/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes, regardless of citizenship for admitted students who requested aid",
    "source_url": "https://financialaid.stanford.edu/site/faq/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "no: need-aware for international",
    "source_url": "https://admission.stanford.edu/apply/international/index.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "https://financialaid.stanford.edu/calculator/index.html",
    "source_url": "https://financialaid.stanford.edu/undergrad/how/index.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "UNVERIFIED",
    "source_url": "https://financialaid.stanford.edu/undergrad/how/index.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "Columbia",
   "platforms": {
    "value": "UNVERIFIED",
    "source_url": "https://undergrad.admissions.columbia.edu/apply/firstyear",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "ED": "2026-11-01",
     "RD": "2027-01-01"
    },
    "source_url": "https://undergrad.admissions.columbia.edu/apply/firstyear/early-decision",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "test_policy": {
    "value": "UNVERIFIED: source says test-optional for 2026-27 but also says testing required from Aug 2027 entry; ambiguous",
    "source_url": "https://undergrad.admissions.columbia.edu/apply/process/testing",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "UNVERIFIED",
    "source_url": "https://undergrad.admissions.columbia.edu/apply/firstyear",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "UNVERIFIED",
    "source_url": "https://undergrad.admissions.columbia.edu/apply/firstyear",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes for international (code 2116); domestic not confirmed",
    "source_url": "https://cc-seas.financialaid.columbia.edu/faq-page/prospective-students",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes, including international",
    "source_url": "https://cc-seas.financialaid.columbia.edu/how/aid/works",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "no: need-aware for international",
    "source_url": "https://cc-seas.financialaid.columbia.edu/faq-page/prospective-students",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "https://undergrad.admissions.columbia.edu/affordability/calculator",
    "source_url": "https://undergrad.admissions.columbia.edu/affordability/calculator",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "ED aid 2026-11-15",
    "source_url": "https://undergrad.admissions.columbia.edu/apply/firstyear/early-decision",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   }
  },
  {
   "name": "UPenn",
   "platforms": {
    "value": [
     "Common App",
     "Coalition App",
     "QuestBridge"
    ],
    "source_url": "https://admissions.upenn.edu/how-to-apply/first-year-applicants/application-requirements",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "deadlines": {
    "value": {
     "ED": "2026-11-01",
     "RD": "2027-01-05"
    },
    "source_url": "https://admissions.upenn.edu/how-to-apply/first-year-applicants/application-requirements",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "test_policy": {
    "value": "SAT or ACT required (hardship waiver possible)",
    "source_url": "https://admissions.upenn.edu/how-to-apply/first-year-applicants/application-requirements",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "supplemental_essays": {
    "value": "3 Penn-specific prompts (thank-you note 150-200 words; community 150-200 words; school-specific)",
    "source_url": "https://admissions.upenn.edu/how-to-apply/first-year-applicants/application-requirements",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "interview": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.upenn.edu/how-to-apply/first-year-applicants/application-requirements",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes, for aid applicants (with FAFSA for US; international with tax docs)",
    "source_url": "https://admissions.upenn.edu/how-to-apply/first-year-applicants/application-requirements",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "meets_full_need": {
    "value": "yes, incl. international admitted students",
    "source_url": "https://admissions.upenn.edu/affording-penn/international-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "no: need-aware for international",
    "source_url": "https://admissions.upenn.edu/affording-penn/international-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "UNVERIFIED: Penn NPC exists, URL not captured",
    "source_url": "https://admissions.upenn.edu/affording-penn/financial-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "ED 2026-11-06; RD 2027-02-01",
    "source_url": "https://admissions.upenn.edu/how-to-apply/first-year-applicants/application-requirements",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   }
  },
  {
   "name": "Cornell",
   "platforms": {
    "value": [
     "Common App"
    ],
    "source_url": "https://admissions.cornell.edu/how-to-apply/first-year-applicants",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "ED": "Nov 1",
     "RD": "Jan 2",
     "note": "year not on page text seen"
    },
    "source_url": "https://admissions.cornell.edu/how-to-apply/first-year-applicants",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "SAT or ACT required",
    "source_url": "https://admissions.cornell.edu/policies/standardized-testing-policy",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "Cornell Questions and Writing Supplement, college-specific short essays; count varies",
    "source_url": "https://admissions.cornell.edu/how-to-apply/first-year-applicants/college-and-school-admissions-requirements",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "neither required nor offered for most colleges; required for architecture",
    "source_url": "https://admissions.cornell.edu/how-to-apply/first-year-applicants",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes for international applicants seeking aid; domestic not confirmed",
    "source_url": "https://finaid.cornell.edu/frequently-asked-questions-about-international-financial-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes, incl. international",
    "source_url": "https://finaid.cornell.edu/frequently-asked-questions-about-international-financial-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "no: need-aware for international",
    "source_url": "https://finaid.cornell.edu/frequently-asked-questions-about-international-financial-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "UNVERIFIED",
    "source_url": "https://finaid.cornell.edu",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "UNVERIFIED",
    "source_url": "https://finaid.cornell.edu",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "Brown",
   "platforms": {
    "value": [
     "Common App"
    ],
    "source_url": "https://admission.brown.edu/first-year/application-checklist",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "ED": "Nov 1",
     "RD": "Jan 5"
    },
    "source_url": "https://admission.brown.edu/first-year",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "SAT or ACT required for first-year",
    "source_url": "https://admission.brown.edu/ask/standardized-tests",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "search summary says 4 essays; only 3 prompts listed, count unreliable",
    "source_url": "https://admission.brown.edu/ask/supplementary-materials",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "no alumni interviews; optional 90-second video introduction",
    "source_url": "https://admission.brown.edu/ask/admission-process",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes; CSS filing deadlines 2026-11-02 (ED), 2027-02-01 (RD)",
    "source_url": "https://admission.brown.edu/tuition-aid/financial-aid",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "meets_full_need": {
    "value": "yes",
    "source_url": "https://admission.brown.edu/tuition-aid/financial-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "yes, beginning Class of 2029",
    "source_url": "https://admission.brown.edu/international/financial-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "MyinTuition calculator via admission.brown.edu/tuition-aid/financial-aid (URL not captured)",
    "source_url": "https://admission.brown.edu/tuition-aid/financial-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "CSS: ED 2026-11-02; RD 2027-02-01",
    "source_url": "https://admission.brown.edu/tuition-aid/financial-aid",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   }
  },
  {
   "name": "Dartmouth",
   "platforms": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.dartmouth.edu/apply-dartmouth",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "ED": "Nov 1",
     "RD": "Jan 1"
    },
    "source_url": "https://admissions.dartmouth.edu/glossary-term/application-deadline",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "SAT/ACT required for US high school applicants since Class of 2029",
    "source_url": "https://admissions.dartmouth.edu/apply-dartmouth/reactivating-dartmouths-testing-policy",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "personal statement + 3 brief supplement essays",
    "source_url": "https://admissions.dartmouth.edu/glossary-term/essay",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "optional alumni interview",
    "source_url": "https://admissions.dartmouth.edu/apply-dartmouth",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "UNVERIFIED",
    "source_url": "https://financialaid.dartmouth.edu/apply-aid/international-students",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes, incl. international",
    "source_url": "https://financialaid.dartmouth.edu/apply-aid/international-students",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "yes since Class of 2026",
    "source_url": "https://financialaid.dartmouth.edu/news/2022/01/universal-need-blind-admissions-policy",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "UNVERIFIED",
    "source_url": "https://financialaid.dartmouth.edu",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "ED Nov 1; RD Feb 1 (year not confirmed)",
    "source_url": "https://admissions.dartmouth.edu/glossary-question/when-financial-aid-deadline",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "Georgetown",
   "platforms": {
    "value": [
     "Georgetown Application",
     "Common App"
    ],
    "source_url": "https://uadmissions.georgetown.edu/apply/first-year-applicants/application-requirements-and-forms/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "EA": "Nov 1",
     "RD": "Jan 1"
    },
    "source_url": "https://uadmissions.georgetown.edu/apply/first-year-applicants/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "SAT or ACT required; no superscore",
    "source_url": "https://uadmissions.georgetown.edu/apply/first-year-applicants/application-requirements-and-forms/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "4 essays in writing supplement",
    "source_url": "https://uadmissions.georgetown.edu/apply/first-year-applicants/application-requirements-and-forms/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "alumni interview required where alumni are available",
    "source_url": "https://uadmissions.georgetown.edu/alumni-interview/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes for international; FAFSA + CSS to Georgetown by Feb 1",
    "source_url": "https://finaid.georgetown.edu/undergrad/how-to-apply/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes for US citizens/permanent residents; not guaranteed for international",
    "source_url": "https://finaid.georgetown.edu/undergrad/international-students/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "UNVERIFIED: international aid very limited",
    "source_url": "https://finaid.georgetown.edu/undergrad/international-students/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "UNVERIFIED",
    "source_url": "https://finaid.georgetown.edu/undergrad/how-to-apply/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "Feb 1 (year not confirmed)",
    "source_url": "https://finaid.georgetown.edu/undergrad/how-to-apply/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "UCLA",
   "platforms": {
    "value": [
     "UC Application"
    ],
    "source_url": "https://admission.universityofcalifornia.edu/how-to-apply/applying-as-a-first-year/dates-and-deadlines.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "filing": "Oct 1 - Nov 30 (verify exact dates on UC page)"
    },
    "source_url": "https://admission.universityofcalifornia.edu/how-to-apply/applying-as-a-first-year/dates-and-deadlines.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "test-blind (UC does not consider SAT/ACT)",
    "source_url": "https://admission.universityofcalifornia.edu/counselors/preparing-freshman-students/freshman-requirements.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "4 of 8 personal insight questions, 350 words each",
    "source_url": "https://admission.universityofcalifornia.edu/how-to-apply/applying-as-a-first-year/personal-insight-questions.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "UNVERIFIED",
    "source_url": "https://admission.ucla.edu/apply",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "no: UC uses FAFSA / CA Dream Act (not CSS)",
    "source_url": "https://financialaid.ucla.edu/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "UNVERIFIED",
    "source_url": "https://financialaid.ucla.edu/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "international students ineligible for university, state or federal aid",
    "source_url": "https://admission.ucla.edu/tuition-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "UNVERIFIED",
    "source_url": "https://admission.ucla.edu/tuition-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "priority 2027-03-02 (for 2027-28)",
    "source_url": "https://financialaid.ucla.edu/",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   }
  },
  {
   "name": "UMich",
   "platforms": {
    "value": [
     "Common App"
    ],
    "source_url": "https://admissions.umich.edu/apply/first-year-applicants/requirements-deadlines",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "ED": "Nov 1",
     "EA": "Nov 1",
     "RD": "Feb 1"
    },
    "source_url": "https://admissions.umich.edu/apply/first-year-applicants/first-year-application-plans",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "test-optional",
    "source_url": "https://admissions.umich.edu/apply/first-year-applicants/requirements-deadlines/application-changes",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.umich.edu/apply/first-year-applicants/requirements-deadlines",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "no interview",
    "source_url": "https://admissions.umich.edu/apply/first-year-applicants/requirements-deadlines",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "CSS Profile (code 1839) for institutional grants",
    "source_url": "https://finaid.umich.edu/getting-started/qualifying-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes for Michigan residents only",
    "source_url": "https://finaid.umich.edu/getting-started/qualifying-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "UNVERIFIED: limited scholarships, no federal aid",
    "source_url": "https://finaid.umich.edu/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.umich.edu/costs-aid/financial-aid",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "Mar 1 deadline; suggested Dec 15 (year not confirmed)",
    "source_url": "https://admissions.umich.edu/apply/first-year-applicants/first-year-application-plans",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "UNC",
   "platforms": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.unc.edu/apply/types-of-applications/first-year/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "EA": "Oct 15",
     "RD": "Jan 15"
    },
    "source_url": "https://admissions.unc.edu/apply/types-of-applications/first-year/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "test-optional if weighted GPA 2.8+ (search summary)",
    "source_url": "https://admissions.unc.edu/apply/types-of-applications/first-year/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.unc.edu/apply/types-of-applications/first-year/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.unc.edu/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes for institutional need-based aid",
    "source_url": "https://studentaid.unc.edu/incoming/how-to-apply/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes for eligible (US citizens / permanent residents)",
    "source_url": "https://admissions.unc.edu/afford/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "no need-based aid for international students",
    "source_url": "https://studentaid.unc.edu/faqs/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.unc.edu/afford/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "UNVERIFIED",
    "source_url": "https://studentaid.unc.edu/incoming/how-to-apply/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "NYU",
   "platforms": {
    "value": [
     "Common App"
    ],
    "source_url": "https://www.nyu.edu/admissions/undergraduate-admissions/how-to-apply/all-freshmen-applicants.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "ED1": "Nov 1",
     "ED2": "Jan 1",
     "RD": "Jan 5"
    },
    "source_url": "https://www.nyu.edu/admissions/undergraduate-admissions/how-to-apply/all-freshmen-applicants.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "test-optional",
    "source_url": "https://www.nyu.edu/admissions/undergraduate-admissions/how-to-apply/all-freshmen-applicants.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "UNVERIFIED",
    "source_url": "https://www.nyu.edu/admissions/undergraduate-admissions/how-to-apply/all-freshmen-applicants.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "UNVERIFIED",
    "source_url": "https://www.nyu.edu/admissions/undergraduate-admissions/how-to-apply/all-freshmen-applicants.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes, required for institutional aid",
    "source_url": "https://www.nyu.edu/admissions/financial-aid-and-scholarships/applying-as-a-prospective-undergraduate-student/first-year-applicants.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes for first-year, New York campus, incl. international",
    "source_url": "https://www.nyu.edu/admissions/financial-aid-and-scholarships/applying-as-a-prospective-undergraduate-student/first-year-applicants/the-nyu-promise.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "UNVERIFIED",
    "source_url": "https://www.nyu.edu/admissions/financial-aid-and-scholarships/frequently-asked-questions.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "https://www.nyu.edu/financial.aid/misc/npc/",
    "source_url": "https://www.nyu.edu/financial.aid/misc/npc/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "UNVERIFIED",
    "source_url": "https://www.nyu.edu/admissions/financial-aid-and-scholarships/financial-aid-at-nyu.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "Northwestern",
   "platforms": {
    "value": [
     "Common App",
     "Coalition with Scoir"
    ],
    "source_url": "https://admissions.northwestern.edu/apply/requirements.html",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "deadlines": {
    "value": {
     "ED": "2026-11-01",
     "RD": "2027-01-04"
    },
    "source_url": "https://admissions.northwestern.edu/apply/application-deadlines.html",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "test_policy": {
    "value": "test-optional",
    "source_url": "https://admissions.northwestern.edu/faqs/standardized-testing-policy/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "1 required short answer (300 words) + optional short answers; personal essay optional",
    "source_url": "https://admissions.northwestern.edu/faqs/writing-supplements/",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "interview": {
    "value": "no alumni interviews; optional Glimpse video (ED Nov 7, RD Jan 17)",
    "source_url": "https://admissions.northwestern.edu/apply/requirements.html",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes for international (code 1565); domestic not confirmed",
    "source_url": "https://admissions.northwestern.edu/tuition-aid/international-student-aid/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes, incl. international, loan-free",
    "source_url": "https://admissions.northwestern.edu/tuition-aid/international-student-aid/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "no: need-aware for international",
    "source_url": "https://admissions.northwestern.edu/tuition-aid/international-student-aid/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.northwestern.edu/tuition-aid/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "ED 2026-12-01; RD 2027-02-01",
    "source_url": "https://admissions.northwestern.edu/apply/application-deadlines.html",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   }
  },
  {
   "name": "Duke",
   "platforms": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.duke.edu/apply/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "ED": "Nov 2",
     "RD": "Jan 4"
    },
    "source_url": "https://admissions.duke.edu/checklist/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "test-optional",
    "source_url": "https://admissions.duke.edu/apply/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "one-page personal essay + Duke short-answer questions; count not stated",
    "source_url": "https://admissions.duke.edu/apply/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "optional alumni interview",
    "source_url": "https://admissions.duke.edu/alumni-interviews/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes for international; CSS+FAFSA due Nov 15 (ED), Feb 1 (RD)",
    "source_url": "https://admissions.duke.edu/checklist/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes",
    "source_url": "https://financialaid.duke.edu/international-students/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "no: need-aware for international (20-25 international aid students/year)",
    "source_url": "https://financialaid.duke.edu/international-students/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "UNVERIFIED",
    "source_url": "https://financialaid.duke.edu/undergraduate-applicants",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "ED Nov 15; RD Feb 1 (year not confirmed)",
    "source_url": "https://admissions.duke.edu/checklist/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "USC",
   "platforms": {
    "value": [
     "Common App"
    ],
    "source_url": "https://admission.usc.edu/prospective-students/how-to-apply/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "ED": "2026-11-01",
     "EA": "2026-11-01",
     "RD": "2026-12-01 (some programs); final 2027-01-10"
    },
    "source_url": "https://admission.usc.edu/apply/dates-deadlines/",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "test_policy": {
    "value": "test-optional",
    "source_url": "https://admission.usc.edu/test-optional-faq/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "Common App essay + USC short responses; count not stated",
    "source_url": "https://admission.usc.edu/prospective-students/how-to-apply/what-we-look-for/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "no evaluative interviews",
    "source_url": "https://admission.usc.edu/prospective-students/how-to-apply/international-students/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes with FAFSA, for eligible US applicants",
    "source_url": "https://financialaid.usc.edu/undergraduate-financial-aid/applying-for-financial-aid/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes for eligible US citizens/non-citizens; international ineligible for need-based aid",
    "source_url": "https://financialaid.usc.edu/undergraduate-financial-aid/prospective-students/financial-aid-at-usc/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "admission need-blind but international not eligible for need-based aid; proof of funds required",
    "source_url": "https://admission.usc.edu/prospective-students/how-to-apply/international-students/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "https://financialaid.usc.edu/undergraduate-financial-aid/calculate-your-costs/",
    "source_url": "https://financialaid.usc.edu/undergraduate-financial-aid/calculate-your-costs/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "ED 2026-11-01; EA 2026-11-15",
    "source_url": "https://admission.usc.edu/apply/dates-deadlines/",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   }
  },
  {
   "name": "Vanderbilt",
   "platforms": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.vanderbilt.edu/apply/first-year-process/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "ED1": "2026-11-01",
     "ED2": "2027-01-01",
     "RD": "2027-01-01"
    },
    "source_url": "https://admissions.vanderbilt.edu/apply/first-year-process/",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "test_policy": {
    "value": "test-optional for fall 2027 and 2028 entry; required from fall 2029",
    "source_url": "https://admissions.vanderbilt.edu/apply/testing-policies/",
    "accessed": "2026-10-03",
    "status": "published_2026_27"
   },
   "supplemental_essays": {
    "value": "personal essay + 1 short answer (~250 words)",
    "source_url": "https://admissions.vanderbilt.edu/apply/personal-essay-and-short-answer-prompts/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "no interviews; optional Glimpse/InitialView video",
    "source_url": "https://admissions.vanderbilt.edu/apply/first-year-process/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes for international aid requests; domestic not confirmed",
    "source_url": "https://admissions.vanderbilt.edu/affordability/international-costs-and-finances/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes, 100%",
    "source_url": "https://admissions.vanderbilt.edu/affordability/international-costs-and-finances/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "no: need-aware for international",
    "source_url": "https://admissions.vanderbilt.edu/affordability/international-costs-and-finances/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "UNVERIFIED: exists, URL not captured",
    "source_url": "https://admissions.vanderbilt.edu/affordability/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "UNVERIFIED",
    "source_url": "https://admissions.vanderbilt.edu/affordability/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  },
  {
   "name": "BU",
   "platforms": {
    "value": [
     "Common App"
    ],
    "source_url": "https://www.bu.edu/admissions/apply/first-year/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "deadlines": {
    "value": {
     "ED1": "Nov 2",
     "ED2": "Jan 5",
     "RD": "Jan 5"
    },
    "source_url": "https://www.bu.edu/admissions/apply/deadlines/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "test_policy": {
    "value": "test-optional through fall 2028",
    "source_url": "https://www.bu.edu/admissions/apply/first-year/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "supplemental_essays": {
    "value": "1 BU supplemental essay (choice of 2 prompts)",
    "source_url": "https://www.bu.edu/admissions/apply/first-year/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "interview": {
    "value": "not required (except some programs)",
    "source_url": "https://www.bu.edu/admissions/apply/first-year/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "css_profile_required": {
    "value": "yes with FAFSA for need-based aid",
    "source_url": "https://www.bu.edu/finaid/how-aid-works/eligibility/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "meets_full_need": {
    "value": "yes for US citizens/permanent residents",
    "source_url": "https://www.bu.edu/admissions/tuition-aid/financial-aid/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "need_blind_international": {
    "value": "no need-based aid for international students",
    "source_url": "https://www.bu.edu/finaid/undergraduate-students/international/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "net_price_calculator": {
    "value": "UNVERIFIED",
    "source_url": "https://www.bu.edu/admissions/tuition-aid/scholarships-financial-aid/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   },
   "aid_deadline": {
    "value": "CSS+FAFSA Nov 2 (ED1); Jan 5 (ED2/RD) (year not confirmed)",
    "source_url": "https://www.bu.edu/admissions/apply/deadlines/",
    "accessed": "2026-10-03",
    "status": "UNVERIFIED"
   }
  }
 ]
}
```

## Coverage
- All 20 catalog schools have a record, but many fields are UNVERIFIED (most often: net price calculator URL, interview, aid deadline, CSS for domestic applicants).
- Strongest (dated 2026-27 deadlines found): Columbia (ED only), Penn, Northwestern, USC, Vanderbilt, Stanford; Brown and UCLA for aid dates.
- Weakest (deadlines undated or entry year unconfirmed): Harvard, MIT, Yale, Princeton, Dartmouth, Duke, Cornell, UNC, NYU, Georgetown, UMich, BU, UCLA admission dates.
- Top-50 extension beyond the 20 catalog schools: not started.
