# Part 5: data sources and access terms (access date 2026-10-03)

Method note: WebFetch answers through a small model, so quotes marked (fetch) are as returned by it, not independently diffed against the page. Firecrawl had no credits. robots.txt for ucas.com and ouac.on.ca came back verbatim; commonapp.org and collegeboard.org robots.txt came back summarised.

| Source | Contains | Access method | Terms (quote) | Automated access | Cadence | Useful fields |
|---|---|---|---|---|---|---|
| College Scorecard API | Federal institution data: costs, aid, completion, earnings, admissions | REST API, key required: https://api.data.gov/ed/collegescorecard/v1/schools | "To use the College Scorecard API you must have an API key"; "1,000 requests per IP address per hour" (429 beyond). Docs state no explicit licence/terms (data.gov licence UNVERIFIED; contact scorecarddata@rti.org). Source: https://collegescorecard.ed.gov/data/api-documentation/ | YES, sanctioned API within the rate limit | `latest` object refreshes "when new data is released" (annual, exact month UNVERIFIED) | school.name/state/city, latest.student.size, latest.admissions.admission_rate.overall, net price, earnings, completion |
| IPEDS (NCES) | Federal survey data on US institutions | Data Explorer, Complete Data Files (CSV from 1980-81), Custom Data Files, Compare Institutions CSV; no API seen | Page has no explicit terms or licence statement (fetch). Public-domain status UNVERIFIED. https://nces.ed.gov/ipeds/use-the-data | YES for bulk files (sanctioned download); no terms forbidding it found | Annual survey cycles (UNVERIFIED) | enrolment, admissions, tuition, graduation rates |
| Common Data Set (commondataset.org + per-school PDFs) | Standard admissions/aid template, published by each school | Page/PDF per school | Initiative text (search result, not fetched): institutions are "urged to ... posting them on their websites". commondataset.org fetch 403. Per-school terms UNVERIFIED | UNVERIFIED; curate by hand with per-school terms check | Annual, schools publish at different times | test policy, admit rate, ED/EA stats, aid, class profile |
| Net price calculators | Per-school cost estimates | Per-school web forms | UNVERIFIED (varies by school and vendor) | NO by default; forms ask for student financial data | n/a | net price estimate (link to the school's calculator, do not automate) |
| studentaid.gov / FSA Data Center | Federal aid data | Page/files | Fetch timed out twice; UNVERIFIED | UNVERIFIED | UNVERIFIED | school codes, aid limits |
| CSS Profile (College Board) | Schools requiring CSS Profile | Page | CSS Profile/IDOC terms s.16 (fetch): prohibit "Manual or automated software, devices, scripts robots, other means or processes to access, 'scrape', 'crawl' or 'spider' the Services or any related data or information" and "Bots or other automated methods to access the Services, add or download contacts, send or redirect messages". https://idoc.collegeboard.org/idoc/application/manage-docs-terms.aspx . Public-site terms page not read (404 at URLs tried). collegeboard.org robots.txt (summary): User-agent * blocks only admin/auth/search paths | NO for CSS Profile/IDOC. Public school-list page: UNVERIFIED, curate by hand | Annual | school CSS requirement (y/n) |
| Common App | Application platform, member list, deadlines | Page only | Terms page returned only header/footer (fetch); license-agreement URL 404. Clause UNVERIFIED. robots.txt (summary): `User-agent: * Allow: /`; blocks GPTBot, Google-Extended, Claude-Web | UNVERIFIED; robots.txt allows generic agents but blocks Claude-Web by name. Curate by hand | Annual | platforms, deadlines |
| UCAS | UK application service pages and open data | Web pages; CSV via 'Data and analysis' | (fetch) s.5.6 "You may not create a database by systematically downloading substantial parts of the Website."; s.5.2 "Copying, distributing or any use of the material contained on the Website for any commercial purpose is prohibited."; Data and analysis CSVs are "licensed under Creative Commons Attribution 4.0 International". https://www.ucas.com/terms-and-conditions . Permissions: https://www.ucas.com/contact-us . robots.txt (verbatim): `Crawl-delay: 10`; Disallow `/search/`, `/data/documents/search/`, `/ucas/events/find/type/key-date/`, `/ucas/events/find/type/open-day/` | NO for site pages (permission needed); YES for CC BY 4.0 data CSVs with attribution | Annual cycle | key dates (hand-curated), UK admissions statistics |
| OUAC | Ontario application centre | Page only | Terms page 403, UNVERIFIED. robots.txt (verbatim): Disallow `/apply/`, `/psc/`, `/psp/`, `/cs/`, `/ps/` | NO for /apply/ (robots); marketing pages UNVERIFIED, curate | Annual | Group A/B dates (hand-curated) |
| OSAP / ontario.ca | Ontario student aid | Page | OSAP page fetch 404. Ontario Open Government Licence (fetch): "worldwide, royalty-free, perpetual, non-exclusive licence to use the Information"; attribution "Contains information licensed under the Open Government Licence - Ontario." Whether OSAP pages fall under it: UNVERIFIED | UNVERIFIED; OGL covers only datasets so licensed | Annual | aid basics (hand-curated) |
| Discover Uni / HESA dataset (UK) | Course, outcome and satisfaction data | Downloadable open dataset | OfS page (fetch): "is available for reuse as a downloadable dataset". Licence name UNVERIFIED (HESA page not read) | YES for the downloadable dataset (sanctioned) | Weekly updates to open data (search result) | course-level outcomes, student satisfaction |
| Statistics Canada | Canadian statistics | Downloads/tables | Open Licence (fetch): "worldwide, royalty-free, non-exclusive licence to: use, reproduce, publish, freely distribute, or sell the Information"; attribution "Source: Statistics Canada, name of product, reference date. Reproduced and distributed on an 'as is' basis with the permission of Statistics Canada." https://statcan.gc.ca/reference/licence | YES for published information, with attribution | Per product | context only; little admissions use |
| Universities Canada | Member data | UNVERIFIED | Not read | UNVERIFIED | UNVERIFIED | - |
| Exa | Search API | API | Terms URL returned a PDF the fetcher could not parse. UNVERIFIED | n/a | n/a | - |
| Firecrawl | Scrape API | API | (fetch) "You represent, covenant, and warrant that you will use the Services only in compliance with all applicable laws and regulations."; "We are not responsible for the timeliness, propriety, or accuracy of third-party content." The fetch summary says the terms do not address robots.txt or target-site terms explicitly. https://firecrawl.dev/terms-of-service | Firecrawl does not clear target-site terms; compliance duty stays with us | n/a | - |
| Typical .edu terms page | per-school | Not read | UNVERIFIED | UNVERIFIED | | |

## Recommended allowlist (automated refresh)
1. College Scorecard API (key, stay under 1,000 req/hr/IP).
2. IPEDS Complete Data Files (bulk CSV).
3. UCAS 'Data and analysis' CSVs (CC BY 4.0, attribute).
4. Discover Uni open dataset (confirm licence name first).
5. Statistics Canada and Ontario OGL datasets (attribute); low value for the agent.
Conditional: studentaid.gov data files once terms are read.

## Curate by hand (no automated fetch)
Common App (all pages), College Board and CSS Profile list and IDOC, UCAS site pages and key dates, OUAC (never /apply/), OSAP, per-school CDS PDFs, net price calculators, per-school deadline and policy pages, any .edu page until its terms are read.

## Still UNVERIFIED
Common App and OUAC terms clauses, College Board public-site terms, studentaid.gov, CDS terms, HESA licence name, Exa terms, Universities Canada, .edu terms.

```json
{"data_sources":[
{"name":"College Scorecard API","access":"API (key)","terms_quote":"\"To use the College Scorecard API you must have an API key\"; \"1,000 requests per IP address per hour\"","automated":"yes","cadence":"annual (exact UNVERIFIED)","url":"https://collegescorecard.ed.gov/data/api-documentation/","accessed":"2026-10-03","tier":"allowlist"},
{"name":"IPEDS","access":"bulk CSV","terms_quote":"no explicit terms on page","automated":"yes (bulk)","url":"https://nces.ed.gov/ipeds/use-the-data","accessed":"2026-10-03","tier":"allowlist"},
{"name":"UCAS data and analysis CSVs","access":"CSV download","terms_quote":"\"licensed under Creative Commons Attribution 4.0 International\"","automated":"yes with attribution","url":"https://www.ucas.com/terms-and-conditions","accessed":"2026-10-03","tier":"allowlist"},
{"name":"UCAS site pages","access":"page","terms_quote":"\"You may not create a database by systematically downloading substantial parts of the Website.\"","automated":"no without permission","url":"https://www.ucas.com/terms-and-conditions","accessed":"2026-10-03","tier":"curate"},
{"name":"CSS Profile / IDOC","access":"page","terms_quote":"\"Manual or automated software, devices, scripts robots, other means or processes to access, 'scrape', 'crawl' or 'spider' the Services\"","automated":"no","url":"https://idoc.collegeboard.org/idoc/application/manage-docs-terms.aspx","accessed":"2026-10-03","tier":"curate"},
{"name":"Common App","access":"page","terms_quote":"UNVERIFIED","automated":"UNVERIFIED (robots blocks Claude-Web)","url":"https://www.commonapp.org/robots.txt","accessed":"2026-10-03","tier":"curate"},
{"name":"OUAC","access":"page","terms_quote":"UNVERIFIED; robots: Disallow /apply/","automated":"no for /apply/","url":"https://www.ouac.on.ca/robots.txt","accessed":"2026-10-03","tier":"curate"},
{"name":"Discover Uni dataset","access":"download","terms_quote":"\"available for reuse as a downloadable dataset\"","automated":"yes (licence name UNVERIFIED)","url":"https://www.officeforstudents.org.uk/for-providers/student-protection-and-choice/discover-uni-and-the-discover-uni-dataset/","accessed":"2026-10-03","tier":"allowlist"},
{"name":"Statistics Canada","access":"download","terms_quote":"\"worldwide, royalty-free, non-exclusive licence to: use, reproduce, publish, freely distribute, or sell the Information\"","automated":"yes with attribution","url":"https://statcan.gc.ca/reference/licence","accessed":"2026-10-03","tier":"allowlist-low-value"},
{"name":"Firecrawl","terms_quote":"\"use the Services only in compliance with all applicable laws and regulations\"","url":"https://firecrawl.dev/terms-of-service","accessed":"2026-10-03"},
{"name":"Common Data Set","status":"UNVERIFIED","tier":"curate"},
{"name":"Net price calculators","status":"UNVERIFIED","tier":"curate"},
{"name":"studentaid.gov","status":"UNVERIFIED"},
{"name":"OSAP","status":"UNVERIFIED","tier":"curate"},
{"name":"Exa","status":"UNVERIFIED"},
{"name":"Universities Canada","status":"UNVERIFIED"}
]}
```
