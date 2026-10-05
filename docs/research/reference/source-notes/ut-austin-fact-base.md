# UT Austin fact base for a "career roulette" game

Research date: 2026-10-05. Every number carries its year and a source URL. Web search + page fetch only.

**How to read the reliability tags**

| Tag | Meaning |
|---|---|
| **[O]** | Official UT / government / company page |
| **[N]** | Reputable news (KUT, Statesman, Texas Tribune, Daily Texan, etc.) |
| **[C]** | Admissions-consultant blog. Mostly Tex Admissions (ex-UT admissions counselor); informed but unofficial, often quoting McCombs/CNS info sessions |
| **[3P]** | Third-party aggregator / SEO site. Treat as approximate |
| **EST** | My own estimate or inference, derived from sourced numbers; not a published figure |
| **NOT FOUND** | Looked for it, could not find a published figure |

Caveat on method: several official pages (UT catalog tuition tables, Statistical Summaries, Academic Warning page) render their tables client-side and the fetch tool returned only navigation. Where that happened the number comes from the search engine's extraction of that same official page, and the row says so.

---

## 1. Admissions structure

### 1.1 Automatic admission (the "top X%" rule)

| Fact | Value | Year | Source |
|---|---|---|---|
| Current auto-admit threshold | **Top 5%** of a Texas high school class | Applies from **Fall 2026** entry | [N] https://www.kut.org/education/2024-09-16/ut-austin-automatic-enrollment-texas-high-school-students-top-5-graduating-class |
| Previous threshold | Top 6% (in effect for students entering fall 2019 through spring 2026) | 2019–2026 | [N] same KUT article |
| Before that | Top 7%; cut to 6% in 2017 for students entering fall 2019 | 2017 | [N] same KUT article |
| When the cut to 5% was announced | Sept 16, 2024, by then-President Jay Hartzell at Faculty Council | 2024 | [N] https://www.statesman.com/story/news/education/2024/09/16/ut-austin-cut-auto-admission-5-percent-fall-2026-admissions-texas-high-school-students/75254008007/ |
| Why it keeps dropping | A 2009 state law lets UT cap rank-based admits at 75% of Texas-resident freshman seats; more applicants means a tighter rank cut. UT's statement: the change lets it "meet the state's requirement that 75% of the Texas residents in each freshman class are admitted based on high-school class rank" | 2024 | [N] same KUT article |
| Statute | Texas Education Code §51.803 (automatic admission) | — | [O] https://texas.public.law/statutes/tex._educ._code_section_51.803 |
| Everyone else in Texas | Other Texas public universities still use top 10%; UT Austin is the exception with its own cap | — | [3P] https://generalacademic.com/automatic-admission-in-texas/ |

**Auto-admission does NOT guarantee your major.** Catalog language: state law "offers automatic admission to the University for eligible undergraduate applicants, [but] it does not guarantee admission to an applicant's requested major"; all applicants "are considered on a competitive basis through holistic review for admission to the majors they request." [O] https://catalog.utexas.edu/general-information/admission/undergraduate-admission/

This is the single most important structural joke for the game: a top-5% valedictorian can be "admitted to UT" and still land in Liberal Arts undeclared instead of CS.

### 1.2 First-choice / second-choice major

| Fact | Source |
|---|---|
| Applicants list a first-choice and second-choice major. UT: "You may be considered for your second-choice major if you qualify for automatic admission and are not admitted to your first-choice major." | [O] https://admissions.utexas.edu/apply/frequently-asked-questions/ |
| For non-auto-admits the second choice rarely matters ("in 98% of cases, UT will only consider your first choice") | [C] https://www.texadmissions.com/blog/does-your-second-choice-major-matter |
| Auto-admits who miss both choices are usually placed as undeclared, in practice Liberal Arts. One consultant summarises it as the top 5% receiving "automatic admission to the College of Liberal Arts" | [C] https://www.collegematchpoint.com/utaustin2026admissionsresults ; [C] https://www.collegematchpoint.com/two-chances-one-application-making-the-most-of-your-second-choice-major-at-ut-austin |
| Every component is read "through the lens of the chosen major" (fit-to-major) | [C] https://www.texadmissions.com/blog/2025/6/2/the-truth-about-ut-austin-admissions-holistic-review-demystified |

### 1.3 Holistic review and application mechanics

| Fact | Value | Year | Source |
|---|---|---|---|
| Factors | Class rank, course rigor, test scores, essays, expanded resume, recommendation letters, special circumstances. No demonstrated interest. | 2025 | [C] https://www.texadmissions.com/blog/2025/6/2/the-truth-about-ut-austin-admissions-holistic-review-demystified |
| SAT/ACT | **Required again** starting with Fall 2025 applicants (test-optional 2020–2024). Announced March 11, 2024. | 2024 | [O] https://news.utexas.edu/2024/03/11/ut-austin-reinstates-standardized-test-scores-in-admissions/ |
| Superscoring | UT does not superscore; uses highest single test date. CLT also accepted. | 2026 | [O] https://admissions.utexas.edu/apply/frequently-asked-questions/ |
| Early Action | Apply by Oct 15 (materials Oct 22); decision by Jan 15. New with the Fall 2025 cycle. | 2024–26 | [O] FAQ above; [N] https://www.kut.org/education/2024-03-11/ut-austin-standardized-test-scores-admission-requirement |
| Regular | Apply by Dec 1 (materials Dec 10); decision by Feb 15 | 2026 | [O] FAQ above; [O] https://csb.utexas.edu/admissions-faq |

### 1.4 Volume and admit rates

| Cycle | Freshman applications | Admitted | Admit rate | Enrolled (FTIC) | Source |
|---|---|---|---|---|---|
| Fall 2024 | 72,885 | — | — | — | [O] https://news.utexas.edu/2024/12/06/demand-soars-as-ut-shatters-record-for-freshman-applications/ |
| Fall 2025 | 90,690 | 20,154 | **22.2%** (record low) | 9,900 | Apps + FTIC: [O] https://news.utexas.edu/2025/09/18/ut-sets-all-time-highs-for-enrollment-and-student-performance/ ; admits/rate from UT's 2025–26 Common Data Set as reported by [3P] https://www.gradgpt.com/common-data-set/university-of-texas-at-austin |
| Fall 2026 | **98,841** (+9%; +64.6% vs five years earlier) | NOT FOUND | NOT FOUND. **EST ~19–20%**, assuming the Fall 2025 yield (9,900 / 20,154 ≈ 49%) held: 9,487 / 0.49 ≈ 19,400 admits | 9,487 | [O] https://news.utexas.edu/2026/09/22/ut-sets-academic-performance-records-remains-the-no-1-public-university-in-texas/ |

Other enrollment context:

| Fact | Value | Year | Source |
|---|---|---|---|
| Total enrollment | 55,172 | Fall 2026 | [O] https://www.utexas.edu/about/facts-and-figures |
| Undergraduates | 44,675 | Fall 2026 | [O] same |
| Previous year | 55,000 total, 44,314 undergrads | Fall 2025 | [O] https://news.utexas.edu/2025/09/18/ut-sets-all-time-highs-for-enrollment-and-student-performance/ |
| Student body mix | 80.5% Texas residents, 10.2% out-of-state, 9.3% international (all students) | Fall 2025 | [O] same |
| First-generation undergrads | 22.6% | Fall 2025 | [O] same |

### 1.5 In-state vs out-of-state

| Fact | Value | Year | Source |
|---|---|---|---|
| Legal cap | Non-residents limited to roughly 10% of first-time undergraduate capacity; about 90% of the freshman class must be Texans | — | [O] https://texas.public.law/statutes/tex._educ._code_section_51.803 ; [3P] https://orieladmissions.com/ut-austin-out-of-state-acceptance-rate/ |
| In-state admit rate | ~35.9% (16,828 of 46,879) | Fall 2025 | [3P, from CDS] https://www.ivystrides.com/blog/ut-austin-acceptance-rate/ |
| Out-of-state admit rate | ~7.5% (2,653 of 35,268) | Fall 2025 | [3P] same |
| International (EST, remainder) | ~7.9% (673 of 8,543) | Fall 2025 | EST: 20,154 − 16,828 − 2,653 admits over 90,690 − 46,879 − 35,268 applicants |
| OOS application growth | +48% in one cycle vs +12% for Texans | Fall 2025 | [O] https://news.utexas.edu/2024/12/06/demand-soars-as-ut-shatters-record-for-freshman-applications/ |
| Holistic (non-auto) Texans | Historical figure quoted by a consultant: ~11% admit rate for non-auto-admit applicants in a prior cycle | pre-2026 | [C] https://www.collegematchpoint.com/utaustin2026admissionsresults |

### 1.6 Typical admitted-student stats

| Group | Stat | Year | Source |
|---|---|---|---|
| UT overall SAT middle 50% | **UT leaves this section of its Common Data Set blank** (2024–25 and 2025–26). Third-party figure: ~1230–1500 SAT, 27–33 ACT | 2025 | [3P] https://www.kollegio.ai/blog/ut-austin-sat-scores ; [3P] https://www.gradgpt.com/common-data-set/university-of-texas-at-austin |
| Class rank overall | ~75% of in-state enrollees come in via the rank rule (top 6% at the time) | 2025 | [N] KUT article above |
| Cockrell | "Average SAT score for entering freshmen: over 1400" | 2025 | [O] https://cockrell.utexas.edu/about/facts-and-rankings/ |
| McCombs, Fall 2023 | Avg SAT 1450, ACT 32, class rank top 4.8% | 2023 | [C, citing McCombs info sessions] https://www.texadmissions.com/blog/2025/6/18/applying-for-the-mccombs-school-of-business-and-canfield-business-honors-cbhp |
| McCombs, Fall 2024 | Avg SAT 1470, ACT 33, class rank top 4% | 2024 | [C] same |
| Canfield BHP | Typical admit: 1484 SAT / 34 ACT, top 1.7% rank; floor ≈ top 5%, 1450 / 32 | ~2024 | [C] same |
| CS | No official profile. Consultant view: "outside the top 10%, it's almost impossible"; competitive = top 5% and 1500+ SAT | 2025 | [C] https://www.texadmissions.com/blog/2025/6/5/ut-austin-computer-science-is-highly-competitive-consider-these-alternatives |
| Turing Scholars | Competitive ≈ 1550 SAT (780–800 math), top 1%; program "denies approximately 85% of valedictorians" | 2025 | [C] https://www.texadmissions.com/blog/2025/4/29/ut-austin-ece-honors-turing-scholars-ecb-csb-robotics-honors |

### 1.7 Selectivity by major (nothing here is officially published except McCombs figures relayed from info sessions)

| Program | Applications | Admits | Admit rate | Year | Source |
|---|---|---|---|---|---|
| **Computer Science** | ~600 | — | >50% | 2011 | [C] https://www.texadmissions.com/blog/2025/6/5/ut-austin-computer-science-is-highly-competitive-consider-these-alternatives |
| Computer Science | ~2,700–3,000 | — | >20% | 2016 | [C] same |
| Computer Science | **EST 10,000–13,000** | **EST ~700** | **EST ~5–7%** (range quoted 5–10%) | "recent cycles" (2024–26) | [C] same. "UT refuses to make the CS admissions statistics public." |
| **McCombs** | 11,433 | 1,625 (1,044 enrolled) | **14%** | Fall 2023 | [C, McCombs info sessions] https://www.texadmissions.com/blog/2025/6/18/applying-for-the-mccombs-school-of-business-and-canfield-business-honors-cbhp |
| McCombs | 12,813 | 1,454 (924 enrolled) | **11%** | Fall 2024 | [C] same |
| McCombs | ~16,500 | EST ~1,400 | **EST ~8%** | Fall 2025 | [C] same |
| Canfield BHP | — | — | EST 10–15% (self-selecting pool) | ~2025 | [C] same |
| **Cockrell overall** | ~11,000 | ~3,000 | ~27% | 2016 | [C] https://www.texadmissions.com/blog/2022/2/21/tips-for-applying-to-ut-computer-science-cockrell-school-of-engineering-and-the-college-of-natural-sciences |
| Cockrell overall | EST >17,000 (2022) | — | **EST 10–20%** | 2022–25 | [C] same |
| ECE, Biomedical | — | — | Most competitive tier. A low-quality site says ECE ~10–15% | 2025 | Tiering: [C] same. Number: [3P, weak] https://instateutaustin.com/ut-austin-engineering-admission |
| Aerospace, Mechanical, Chemical | — | — | Middle tier | 2022 | [C] same |
| Architectural, Civil, Petroleum | — | — | Least competitive tier | 2022 | [C] same |
| Texas Robotics honors | 3,500+ (later "nearly 7,000") | ~50 slots (later "100 spots") | EST ~1.4% | Fall 2025 entry | [O] https://news.utexas.edu/2025/03/06/gurley-investment-will-sustain-texas-robotics-undergraduate-program-as-leader/ ; [O] https://x.com/UTAustin/status/1860397294857728240 |
| Architecture, Nursing | — | — | ~10% freshman admit | ~2020 | [C] https://www.texadmissions.com/blog/2020/11/18/internal-transfer-and-changing-majors-for-current-ut-austin-students |

Cockrell admits by first-choice major, not as a single pool. [C] texadmissions 2022 article above.

### 1.8 Consolation outcomes

| Pathway | What it is | Key numbers | Status | Source |
|---|---|---|---|---|
| **CAP** (Coordinated Admission Program) | Texas residents not offered regular admission spend freshman year at another system school, then transfer | 30 transferable hours, **3.2 GPA**, no grade below C, one math course beyond college algebra, transcript by June 1 | Active | [O] https://admissions.utexas.edu/apply/alternative-pathways-to-enrollment/cap/ |
| CAP campuses | UT Arlington, UT El Paso, UT Permian Basin, UT Rio Grande Valley, UT San Antonio, Stephen F. Austin State University, UT Tyler | 7 schools | 2026 | [O] same |
| CAP guarantee | **Only the College of Liberal Arts** is guaranteed (not a specific major). Other colleges are a competitive transfer; Architecture and Nursing are excluded. | — | 2026 | [O] same |
| CAP fine print | Economics and Psychology quietly became competitive even within Liberal Arts; "the closer you are to 4.0, the better" | — | 2025 | [C] https://www.ivyscholars.com/ut-austin-has-updated-their-cap-policies/ |
| CAP reality check | "No advantage or benefit for other majors like natural sciences, business, communications, or engineering"; CAP-then-CS risks "needing to transfer a second time away from UT." Only Texas residents get CAP. | — | 2025 | [C] https://www.texadmissions.com/blog/2025/5/1/should-you-enroll-in-uts-coordinated-admissions-program-cap |
| **PACE** | Co-enrollment at Austin Community College (Rio Grande campus, ~1 mile from UT) plus 3 UT credit hours per semester; invitation-only, "a few hundred" offers a year | — | **Discontinued**; not offered for Fall 2026 applicants | [O] https://www.austincc.edu/academic-and-career-programs/university-transfer/pace/ ; [C] texadmissions CAP article above |
| **SSP** (Spring Start Program) | New pilot from Fall 2026: one supported fall semester at ACC, then conditional Spring 2027 admission to UT | — | New, Fall 2026 | [O] https://admissions.utexas.edu/apply/alternative-pathways-to-enrollment/ssp/ |
| **TAP** (Transfer Admission Pathway) | New pilot from Fall 2026: freshman year at **St. Edward's University**; 30 hours + 3.2 GPA guarantees transfer into Liberal Arts or Social Work | 30 hrs, 3.2 GPA | New, Fall 2026 | [O] https://admissions.utexas.edu/apply/alternative-pathways-to-enrollment/tap/ ; [O] https://www.stedwards.edu/admission/tap-ut |

### 1.9 External transfer

| Fact | Value | Year | Source |
|---|---|---|---|
| Overall transfer admit rate | 21.96% (vs 22.22% freshman), i.e. no easier | Fall 2025 | [3P, from CDS] https://www.deweysmart.com/resources/ut-austin-transfer-acceptance-rate |
| External transfer into CS | **6 admits of 1,037 applicants (0.6%)**; ~2% in Fall 2022–23. "99% of you are not going to get into UT CS as a transfer." | Fall 2024 | [C] https://www.texadmissions.com/blog/2025/5/6/external-transfer-to-ut-austin-computer-science-mccombs-business-cockrell-engineering |
| External transfer into McCombs | EST ~10% for Texans, ~3% OOS; competitive GPA 3.9+ | 2025 | [C] same |
| External transfer into Cockrell | ECE / BME need a 4.0; most others 3.9 overall + 4.0 STEM; civil / architectural / petroleum sometimes admit ≤3.5. "Most of the transfer spaces are for current UT students." | 2025 | [C] same |
| Transfer applicants | Do not need SAT/ACT | 2026 | [O] https://admissions.utexas.edu/apply/frequently-asked-questions/ |

---

## 2. Colleges and majors that matter

UT has 16 colleges and schools and 156 undergraduate degree programs (2026). [O] https://www.utexas.edu/about/facts-and-figures

### 2.1 Undergraduate headcount by college

Fall 2025 figures, compiled by a third party citing UT Institutional Reporting (reports.utexas.edu). The Cockrell and CNS totals match the official college pages, which supports the rest.

| College | Undergrads (Fall 2025) | Source |
|---|---|---|
| Liberal Arts | 11,592 | [3P citing reports.utexas.edu] https://school.chicardgo.com/news/20260610-ut-student-trend/ |
| Natural Sciences | 11,355 (CNS's own page says 11,430) | [3P] same ; [O] https://cns.utexas.edu/about-the-college/facts-and-rankings |
| Engineering (Cockrell) | 6,097 | [O] https://cockrell.utexas.edu/about/facts-and-rankings/program-enrollments-and-degrees/ |
| Business (McCombs) | 4,645 | [3P] chicardgo link above |
| Communication (Moody) | 4,250 | [3P] same |
| Education | 2,638 | [3P] same |
| Fine Arts | 1,667 | [3P] same |
| Nursing | 464 | [3P] same |
| Geosciences (Jackson) | 390 | [3P] same |
| Information (iSchool) | 384 | [3P] same |
| Architecture | 377 | [3P] same |
| Social Work | 248 | [3P] same |
| Civic Leadership | 103 | [3P] same |
| Public Affairs (LBJ) | 92 | [3P] same |

### 2.2 College of Natural Sciences (CNS)

| Fact | Value | Year | Source |
|---|---|---|---|
| Size | 11,430 undergrads; 1,424 residential grad students; 4,410 online master's students; 760 faculty. UT's largest college. | 2025–26 | [O] https://cns.utexas.edu/about-the-college/facts-and-rankings |
| Majors (all 16) | Astronomy, Biochemistry, Biology, Chemistry, **Computer Science**, Environmental Science, Human Development and Family Sciences, **Informatics**, **Mathematics**, Medical Laboratory Science, Neuroscience, Nutrition, **Physics**, Public Health, **Statistics and Data Science**, Textiles and Apparel | 2026 | [O] https://cns.utexas.edu/academics/undergraduate-study/majors |
| Restricted majors | CS, Neuroscience, and Statistics & Data Science entry-level majors are restricted to students admitted directly or via internal transfer | 2026 | [O] https://catalog.utexas.edu/undergraduate/natural-sciences/admission-and-registration/ |
| **New School of Computing** | Approved Feb 19, 2026; opened Fall 2026 **inside CNS**. Merges the Department of Computer Science, the Department of Statistics and Data Sciences, and the iSchool. Plans 50 faculty hires and "significant enrollment expansion in computing-related majors." Peter Stone is head (from Aug 2026). | 2026 | [O] https://news.utexas.edu/2026/02/19/ut-launches-new-school-of-computing-uniting-computer-and-data-science-statistics-information-disciplines/ ; [N] https://www.kxan.com/news/education/university-of-texas-new-school-of-computing-to-open-this-fall/ |

Per-major notes:

| Major | Size | Reputation | Feeds | Source |
|---|---|---|---|---|
| **Computer Science** | Department total 7,600 undergrad + grad (includes the large online master's). Undergrad majors: **NOT FOUND officially**; third-party figure 2,600–2,800. 87 full-time faculty, 20,000+ alumni, founded 1969. | U.S. News: grad CS #10; undergrad CS #9–#11 depending on which UT page / edition; AI #7–#10 | Big Tech SWE, quant/trading, startups, ML research, grad school | [O] https://www.cs.utexas.edu/about ; [O] CNS facts page above ; [3P] search summary of cs.utexas.edu and Quora for the undergrad count |
| **Mathematics** | NOT FOUND | CNS: "5th best in world" (math), #12 U.S. News grad | Quant, actuarial, data, grad school; common CS fallback ("Applied Mathematics") | [O] CNS facts page ; [C] texadmissions CS-alternatives article |
| **Statistics & Data Science** | BS launched Fall 2022 with ~50 students, initially by lottery | New; now in the School of Computing | Data science / analytics / ML | [O] https://stat.utexas.edu/news/announcements/ut-austin-offers-new-undergraduate-major-statistics-and-data-science |
| **Physics** | NOT FOUND | #14 U.S. News grad; plasma physics #3 | Grad school, quant, semiconductor, quantum | [O] CNS facts page |
| **Informatics** (BA / BSI) | iSchool ~400 undergrads | Launched Fall 2021 (goal: 50–100 students in year one). Six concentrations: human-centered data science, UX design, social justice informatics, health informatics, cultural heritage informatics, social informatics | UX, product, data, "CS-adjacent" jobs; listed as a "less competitive" CS alternative | [O] https://ischool.utexas.edu/news/texas-ischool-launches-new-undergraduate-program-informatics ; [O] https://ischool.utexas.edu/programs/informatics ; [C] texadmissions CS-alternatives article |
| Biology / Neuroscience / Biochemistry / Public Health | Bulk of CNS | Pre-med track | Med school, biotech, research | [O] CNS majors page |

### 2.3 Cockrell School of Engineering

School-level facts:

| Fact | Value | Year | Source |
|---|---|---|---|
| Students | 8,517 total; ~6,000 undergrad; ~2,000 grad | Fall 2025 | [O] https://cockrell.utexas.edu/about/facts-and-rankings/ |
| Faculty | 297 tenured / tenure-track | 2025 | [O] same |
| Women | 34% of undergrads | 2025 | [O] same |
| Rankings | #11 undergraduate engineering (U.S. News 2026–27; #6 among publics, #1 in Texas); #6 graduate | 2026 | [O] https://cockrell.utexas.edu/about/facts-and-rankings/program-rankings/ |
| Outcomes | "90%+ of B.S. graduates receive job offers or pursue graduate school"; 90% do an internship or research | 2025 | [O] facts page above |
| Student orgs | 80+ | 2025 | [O] same |
| Alumni | 70,000+ | 2025 | [O] same |

All 11 undergraduate majors (Fall 2025 enrollment; U.S. News 2026–27 undergraduate specialty rank; average BS starting salary from the school's page updated 5/22/2025):

| Major | Undergrads (F2025) | U.S. News rank | Avg BS starting salary | Feeds |
|---|---|---|---|---|
| **Electrical and Computer Engineering** | 1,506 (largest) | Computer #8, Electrical #9 | $101,938 | Semiconductors (AMD, Apple silicon, Samsung, TI, NXP), embedded, Big Tech SWE, power |
| **Mechanical Engineering** | 1,261 | #10 | $86,665 | Tesla, aerospace / defense, energy, robotics |
| Chemical Engineering | 682 | #4 | $87,514 | Oil & gas, chemicals, semiconductors |
| Civil Engineering | 620 | #4 | $73,969 | Construction, TxDOT, consulting |
| **Aerospace Engineering** | 524 | #9 | $81,227 | NASA JSC, SpaceX, Lockheed, Blue Origin, Firefly |
| **Biomedical Engineering** | 505 | #11 | $85,025 | Med devices, pre-med, biotech |
| Petroleum Engineering | 423 | **#1** | $104,539 (highest) | Houston / Permian oil & gas |
| Environmental Engineering | 224 | #5 | $73,969 | Water, consulting |
| Architectural Engineering | 214 | — | $73,434 | Building systems / structures |
| **Computational Engineering** | 98 | — | $85,025 | Simulation / HPC, Oden Institute pipeline |
| Geosystems Engineering & Hydrogeology | 11 | (Petroleum & Geosystems #1) | (grouped with petroleum) | Subsurface energy, groundwater |
| Undeclared | 29 | — | — | — |
| **Total** | **6,097** | — | **$88,141 overall** | — |

Sources: enrollment [O] https://cockrell.utexas.edu/about/facts-and-rankings/program-enrollments-and-degrees/ ; ranks [O] https://cockrell.utexas.edu/about/facts-and-rankings/program-rankings/ ; salaries [O] https://cockrell.utexas.edu/student-life/career-services/salaries-and-statistics/ . The "feeds" column is my characterization, not a published list.

Degrees awarded 2024–25: 1,320 bachelor's (ECE 361, ME 270), 494 master's, 240 doctoral. [O] enrollment page above.

**ECE "technical cores."** ECE students pick a focus area at the end of sophomore year. [O] https://ece.utexas.edu/academics/undergraduate/techcore

| Side | Technical core |
|---|---|
| Electrical | Communication, Signal Processing, Networks and Systems |
| Electrical | Electronics and Integrated Circuits |
| Electrical | Energy Systems and Renewable Energy |
| Electrical | Fields, Waves and Electromagnetic Systems |
| Electrical | Nanoelectronics and Nanotechnology |
| Computer | Computer Architecture and Embedded Systems |
| Computer | Data Science and Information Processing |
| Computer | Software Engineering and Design |

Most popular cores: Computer Architecture & Embedded Systems, Software Engineering & Design, Data Science & Information Processing (search summary of the ECE academic pages). [O] https://ece.utexas.edu/academics/academic-policies

Course prefix note: ECE courses are now numbered **ECE** (ECE 302, 306, 312, 319K), not "EE." [O] https://catalog.utexas.edu/general-information/coursesatoz/ece/

### 2.4 McCombs School of Business

| Fact | Value | Year | Source |
|---|---|---|---|
| Undergrads | 4,645 | Fall 2025 | [3P citing reports.utexas.edu] https://school.chicardgo.com/news/20260610-ut-student-trend/ |
| Ranking | #6 undergraduate business program (U.S. News, Sept 2026) | 2026 | [O] https://www.mccombs.utexas.edu/recruiters-and-corporations/recruiters/recruiting-statistics/ |
| BBA majors | Accounting, Business Analytics, Finance, International Business, Management, Management Information Systems (MIS), Marketing, Supply Chain Management, plus the five-year Integrated MPA (iMPA) and the Canfield Business Honors Program (CBHP) | 2026 | [O] https://www.mccombs.utexas.edu/undergraduate-programs/bba/academics/majors/ |
| Specialty ranks (U.S. News 2026 edition, via search summary; verify before quoting) | Accounting #2, Marketing #3, Finance #5, Business Analytics #6, Management #6, MIS #7, Supply Chain #10 | 2026 | [3P] https://poetsandquantsforundergrads.com/school-profile/university-texas-austin-mccombs-school-business/ |
| Freshmen enter as | "Unspecified Business" | 2026 | [O] https://csb.utexas.edu/admissions-faq |

Graduating class by major, 2024–25 (a proxy for relative size) with mean base salary:

| Major | Graduates | Mean base salary |
|---|---|---|
| Finance | 407 | $92,315 |
| MIS | 171 | $91,650 |
| Canfield Business Honors | 135 | **$108,466** |
| Marketing | 68 | $66,542 |
| Business Analytics | 42 | $89,662 |
| Management | 30 | $73,775 |
| Supply Chain | 19 | $76,917 |
| International Business | 15 | $74,576 |
| Accounting (BBA only) | 13 | $78,833 |
| **All BBA** | — | **Mean $89,377; median $85,000; range $30,000–$206,000** |

Source: [O] https://www.mccombs.utexas.edu/recruiters-and-corporations/recruiters/recruiting-statistics/salary-statistics/ . EST: the tiny Accounting count is almost certainly because most accounting students are in the five-year iMPA, which is reported separately.

Feeds: Finance → investment banking (Houston energy, Dallas, some NYC), PE, corporate finance. MIS → tech consulting (Deloitte / Accenture / EY), product, Big Tech. CBHP → MBB consulting and banking. (Industry split in §7.)

### 2.5 "Fallback" destinations

| Where | Fact | Source |
|---|---|---|
| **Liberal Arts, undeclared** | The default landing spot for auto-admits who miss their major. Undeclared students must declare by their fifth semester; students over 60 hours cannot enter as undeclared. | [O] https://liberalarts.utexas.edu/undergraduate-students/student-division/exploratory-and-undeclared-advising.html |
| **Economics** (Liberal Arts) | One of the largest Liberal Arts majors: 1,627 undergraduate majors (current page); an older department page says 2,800+. Classic "couldn't get McCombs" major; competitive even for CAP students. | [O] https://liberalarts.utexas.edu/economics/ ; [C] ivyscholars CAP article |
| **Informatics** | "Less competitive" CS alternative | [C] https://www.texadmissions.com/blog/2025/6/5/ut-austin-computer-science-is-highly-competitive-consider-these-alternatives |
| Other suggested CS alternatives | Moderately competitive: McCombs MIS, Statistics & Data Science, Applied Mathematics, Computational Biology, Physics. Less competitive: Informatics, Arts & Entertainment Technologies, BS in Behavioral and Social Data Sciences. Certificates / minors: Statistics & Data Science, Computational Science & Engineering, Quantum Information Science. | [C] same |
| Psychology | <20% internal-transfer rate, 3.9 average GPA | [C] https://www.texadmissions.com/blog/2020/11/18/internal-transfer-and-changing-majors-for-current-ut-austin-students |

---

## 3. Honors programs

UT's official list: [O] https://admissions.utexas.edu/explore/texas-honors/

| Program | College | Cohort size | Selectivity | Applied when | Known for | Source |
|---|---|---|---|---|---|---|
| **Turing Scholars** | CNS / CS | ~50 matriculate per year (~150 in the program at a time per one older source); honors classes of ~45 | Older data: 127 admits from 1,192 applicants (~11%), ~58 enrolled (c. 2016–18). Current rate NOT FOUND. Consultant: denies ~85% of valedictorians. Staff once reported admitting 14 of 80 valedictorians. | **Freshman application**; current CS students can also apply each semester (windows Nov 15–Dec 10 and Apr 15–May 10) | 10 honors courses, intensive first-year honors sequence (CS 314H / 311H / 429H / 439H), required honors thesis with a defense; honors housing in the Honors Quad; Big/Little mentoring; director Calvin Lin | [O] https://www.cs.utexas.edu/turing-scholars ; [3P] https://en.wikipedia.org/wiki/Wikipedia:WikiProject_University_of_Texas_at_Austin/Turing_Scholars ; [C] https://www.texadmissions.com/blog/2025/4/29/ut-austin-ece-honors-turing-scholars-ecb-csb-robotics-honors ; gender gap coverage [N] https://thedailytexan.com/2018/09/19/something-we-want-to-fix-just-7-women-enrolled-as-freshmen-in-the-computer-science/ |
| **Texas CSB** (CS + Business honors) | CNS + McCombs | "Up to 40" | NOT FOUND; "arguably the most competitive honors programs." Program decision by March 1. | **Freshman application only**; current UT students cannot apply | Two bachelor's degrees in four years: CS honors + Canfield Business Honors. Launched 2018. If denied, considered for Turing (CS first choice) or CBHP (business first choice). USACO "strongly encouraged." | [O] https://csb.utexas.edu/ ; [O] https://csb.utexas.edu/admissions-faq ; [O] https://www.cs.utexas.edu/news/2018/new-dual-degree-honors-program-university-texas-austin-combines-computer-science-business |
| **Texas ECB** (ECE + Business honors) | Cockrell + McCombs | 30–40 | NOT FOUND | **Freshman application only**; first applicants were for Fall 2022 | Dual degree: BS ECE + Canfield BHP in four years; two honors capstones | [O] https://ecb.utexas.edu/ ; [O] https://ece.utexas.edu/news/new-dual-degree-honors-program-combines-business-electrical-and-computer-engineering |
| **Canfield Business Honors (CBHP)** | McCombs | ~135 graduates per year (2024–25); classes of 30–50 | EST 10–15% | Freshman application; also accepts transfers. Internal route needs roughly a 4.0 with at most one A− | Case-based "MBA-style" curriculum; highest McCombs salaries ($108,466 mean) | [O] McCombs salary page ; [C] texadmissions McCombs article ; [O] https://catalog.utexas.edu/undergraduate/business/degrees-and-programs/bachelor-of-business-administration/business-honors-program/ |
| **Dean's Scholars** | CNS | ~50 freshmen per year; ~200 total; founded 1983 | NOT FOUND | Freshman application (also transfers) | Research-track science honors with thesis | [O] texas-honors page ; [3P] https://en.wikipedia.org/wiki/Wikipedia:WikiProject_University_of_Texas_at_Austin/Dean's_Scholars |
| **Health Science Scholars** | CNS | NOT FOUND. EST ~50 per year (the three CNS honors programs serve ~600 students combined) | NOT FOUND | Freshman application (also transfers) | Pre-health honors with a service emphasis | [O] texas-honors page ; [3P] https://en.wikipedia.org/wiki/University_of_Texas_at_Austin_College_of_Natural_Sciences |
| **Polymathic Scholars** | CNS | ~50 first-years per year | NOT FOUND | Freshman application (also transfers) | Science majors who design a second field of study; thesis | [O] https://honors.cns.utexas.edu/polymathic-scholars |
| **Plan II Honors** | Liberal Arts | ~175 entering; ~370 offers | ~2,500 complete applications → ~15% | Freshman application | Interdisciplinary arts-and-sciences major; popular double major for pre-law / pre-med / engineers. Most from the top 5%, average SAT >1400. | [O] https://liberalarts.utexas.edu/plan2/prospective-students/application/faqs.html |
| **Engineering Honors Program (EHP)** | Cockrell | Roughly the top 10% of admitted Cockrell applicants | "Mechanical process based on Office of Admissions scores" | Freshman application (checkbox, no extra essay). Current students are invited after 24 hours if in the top 10% of class and major. | Not curriculum-based; merit scholarships to most or all members; honors housing; optional thesis | [O] https://cockrell.utexas.edu/admissions/undergraduate/honors-program/ ; [C] texadmissions honors article |
| **ECE Honors** | Cockrell | NOT FOUND | NOT FOUND | Freshman application (ECE first choice; no extra essay) | Faster-paced honors sections | [O] texas-honors page |
| **Texas Robotics honors** | Cockrell + CNS | ~50 inaugural (UT News, Mar 2025); UT's own social post said 100 spots | 3,500+ applicants by March 2025; "nearly 7,000" per UT's Nov 2024 post (the two official figures conflict) | Freshman application, first cohort **Fall 2025**; 500-word essay | "Nation's first" freshman-entry robotics program. Major must be Aerospace, Computational, ECE, Mechanical, or CS. Guaranteed Robotics minor, FRI robotics stream, living-learning community. Backed by a $5M Bill Gurley gift. | [O] https://news.utexas.edu/2025/03/06/gurley-investment-will-sustain-texas-robotics-undergraduate-program-as-leader/ ; [O] https://x.com/UTAustin/status/1860397294857728240 |
| **Cockrell–McCombs BS/MS Honors** | Cockrell + McCombs | NOT FOUND | NOT FOUND | Freshman application | Five-year engineering + business program for Mechanical and Petroleum majors | [O] texas-honors page |
| **Liberal Arts Honors (LAH)** | Liberal Arts | 120–140 freshmen | ~1,900 applications for 2025–26 | Freshman application | Small honors seminars layered on any Liberal Arts major | [O] https://liberalarts.utexas.edu/lahonors/lah-programs/liberal-arts-honors-scholars-program/ ; [O] https://liberalarts.utexas.edu/plan2/prospective-students/application/ut-freshman-honors-programs.html |
| **Jefferson Scholars** | Liberal Arts (Thomas Jefferson Center) | NOT FOUND | "Selective" | Separate application as an incoming freshman | Six-course great-books sequence earning the Core Texts and Ideas certificate; living-learning community in Moore-Hill; founded 2014 | [O] https://liberalarts.utexas.edu/coretexts/jefferson-scholars-program/ |
| Moody College Honors, Human Ecology Honors, Nursing Honors | Various | NOT FOUND | NOT FOUND | Freshman application | — | [O] texas-honors page |
| School of Civic Leadership majors (Civics Honors, Great Books Honors) and Strategy & Statecraft Honors | Civic Leadership / Clements Center | Civic Leadership has 103 undergrads (Fall 2025) | NOT FOUND | Freshman application | Great-books, civics, and strategy majors in UT's newest school | [O] texas-honors page ; [3P] chicardgo enrollment table |
| Humanities Honors, Junior Fellows, departmental honors | Liberal Arts | — | — | **Later** (current students) | Self-designed major / research society | [O] texas-honors page |

### Five-year integrated bachelor's + master's programs

| Program | Structure | Requirements | Source |
|---|---|---|---|
| **Integrated 5-Year BS/MS in CS** | BS CS "Option IV" (120 hours) + MSCS (30 hours) = 150 hours | Apply as a junior; minimum 3.0 GPA, competitive at 3.5+ CS GPA; five long semesters in residence; all CS core done (312, 311, 314, 429, 439, 331); fall admission only | [O] https://www.cs.utexas.edu/undergraduate/academics/curriculum-degree-plans/5-year-cs-bsms |
| BS CS + MS in Computational Science, Engineering & Mathematics (Oden Institute) | Five-year | For CS undergrads | [O] https://oden.utexas.edu/academics/undergraduates/csem-integrated-degree/ |
| Computational Engineering + CSEM | Five-year | For COE undergrads | [O] https://oden.utexas.edu/academics/undergraduates/coe-csem-integrated-degree/ |
| BS CS + MS Information Studies ("4+1") | Five-year | With the iSchool | [O] https://ischool.utexas.edu/programs/dual-degree/integrated-computer-science-msis |
| **Integrated BSECE/MSE** | BS hours reduced from 125 to 120; MSE unchanged | Current UT ECE undergrads only | [O] https://ece.utexas.edu/academics/integrated |
| Integrated BS/MSE in Biomedical and Mechanical Engineering | Simultaneous BS + MSE | — | [O] https://catalog.utexas.edu/graduate/areas-of-study/engineering/engineering/ |
| **iMPA** (Integrated Master in Professional Accounting) | Five-year BBA + MPA | McCombs | [O] https://www.mccombs.utexas.edu/undergraduate-programs/bba/academics/majors/ |
| Online MS in Computer Science (for alumni who "stay" remotely) | 10 courses at $1,000 each = **$10,000** total | — | [O] https://cdso.utexas.edu/mscs |

---

## 4. Internal transfer (the classic UT storyline)

University-wide rule of thumb: you get two attempts per college, and you should be done by the end of your second year. [C] https://www.texadmissions.com/blog/2020/11/18/internal-transfer-and-changing-majors-for-current-ut-austin-students

### 4.1 Into CNS / Computer Science

| Rule | Detail | Source |
|---|---|---|
| CS is a "closed" major | "Computer Science requires an application for all students, including current CNS majors." | [O] https://cns.utexas.edu/info-undergraduate-students/academics-advising-policies/internal-transfer/faqs-and-info-sessions |
| Eligibility | 24 hours in residence (30 for a simultaneous second major); **minimum 3.0 GPA**; fewer than 90 hours in residence (under 60 preferred; appeal needed between 60 and 90); must be able to graduate in four years total | [O] https://cns.utexas.edu/info-undergraduate-students/academics-advising-policies/internal-transfer |
| Required courses | One math (M 408C / D / K / L / N / M / R / S / Q or SDS 302) and two sciences (BIO 311C / D, CH 301 / 302, PHY 303K / L) | [O] same |
| Timing | One cycle a year: application opens in February, for fall entry; decisions sent in **July** by Secure Academic Note | [O] FAQ page above |
| Attempts | "Students are allowed to apply to internally transfer two times." Decisions are final, no appeal. | [O] internal transfer page above |
| What is reviewed | Short answers plus one essay; holistic review of academic performance. **No resume, no recommendation letters.** | [C] texadmissions internal transfer article ; [O] https://cns.utexas.edu/info-undergraduate-students/academics-advising-policies/internal-transfer/internal-transfer |
| What helps | 12–15 hours a semester, no Q-drops, grades of B− or better in CNS courses, single major | [O] FAQ page above |
| Published acceptance rate | **None.** "Internal transfer admission to CNS is a very competitive process... offered on a space-available basis, which varies by major." | [O] internal transfer page above |
| Unofficial CS numbers | 250–300 applicants a year, "around a third" admitted (the same article also says 40–50%). Recommended: 3.9 overall, 4.0 STEM; "some 4.0s will get denied." | [C] https://www.texadmissions.com/blog/2020/11/18/internal-transfer-and-changing-majors-for-current-ut-austin-students |
| Conflicting claim | A low-quality site says ~5% (15–25 of 300–400) with a 3.95+ GPA. I could not corroborate this; treat the true rate as unknown, somewhere between "brutal" and "a third." | [3P, weak] https://instateutaustin.com/ut-austin-computer-science-admission |
| Why spots exist at all | Seats freed by students leaving CS go mainly to internal applicants, not external transfers | [C] texadmissions external transfer article |
| Staying in once you are in | CS entry-level students must pass **CS 312, CS 311, CS 314 with at least a C−** and hold a 2.0 UT GPA, in **no more than two attempts each**, to be promoted to upper division | [O] https://cs.utexas.edu/node/69868 |
| Recent structural change | The School of Computing (Fall 2026) is explicitly meant to expand computing enrollment; no revised internal-transfer numbers published yet | [O] UT News Feb 2026 article above |

### 4.2 Into Cockrell majors

| Rule | Detail | Source |
|---|---|---|
| Eligibility | Minimum cumulative **and** technical GPA of 3.0; in-residence credit for calculus and other technical courses; 500-word essay | [O] https://cockrell.utexas.edu/admissions/undergraduate/internal-transfer/ |
| Hours | First-semester engineering students: 12 hours in residence; continuing: 24 hours | [O] https://catalog.utexas.edu/undergraduate/engineering/admission-and-registration/ |
| Published GPA cutoff | None: "The Cockrell School does not have a standard GPA requirement... The cumulative and required technical GPAs of admitted students vary by semester and requested major, as does the number of seats offered." | [O] internal transfer page above |
| Acceptance rate (unofficial) | 2017–18: 67.3% of qualified applicants got an offer; overall ~45%. About 500 students try to change engineering major each term. Double-blind review. Non-engineers get two attempts. | [C] texadmissions internal transfer article |
| By major | NOT FOUND. ECE and BME are consistently described as the hardest to enter. | [C] texadmissions 2022 STEM article |
| Detail pages | Deadlines and info sessions sit behind an EID login (ENGR Direct) | [O] internal transfer page above |

### 4.3 Into McCombs

| Rule | Detail | Source |
|---|---|---|
| Eligibility | In-residence GPA of **3.25+**; micro/macroeconomics and first-year calculus done or in progress | [C] https://www.texadmissions.com/blog/2018/11/12/requirements-and-tips-for-transferring-into-the-mccombs-school-of-business |
| Limits | Two attempts; no review past 90 hours | [C] texadmissions internal transfer article |
| Average admitted GPA | **3.87**; recommended 3.9 with business / leadership extracurriculars; "many 4.0s will get denied" | [C] same |
| Review style | Used to be a pure GPA cutoff; now holistic with heavy weight on the resume, so the occasional sub-3.75 with strong activities gets in | [C] 2018 texadmissions article above |
| Acceptance rate | Quoted as ~40% (self-selected pool, described as "misleading"); other summaries say 10–15%. No official figure found. | [C] texadmissions internal transfer article |

### 4.4 Other colleges

| College | Detail | Source |
|---|---|---|
| Liberal Arts | Generally the easy direction; exceptions Psychology (<20%, 3.9 average), International Relations, Environmental Science | [C] texadmissions internal transfer article |
| Architecture, Nursing | 2–5 internal admits a year; "don't bother trying" | [C] same |

---

## 5. Academics

### 5.1 Grades

| Fact | Detail | Source |
|---|---|---|
| Scale | 4.0, with plus/minus since Fall 2009 | [O] https://graduate.utexas.edu/navigating/policies/academic/grades/plus-minus |
| Grade points | A 4.00, A− 3.67, B+ 3.33, B 3.00, B− 2.67, C+ 2.33, C 2.00, C− 1.67, D+ 1.33, D 1.00, D− 0.67, F 0.00 | [O] same |
| No A+ | An A is the ceiling, so one A− permanently ends a 4.0 (relevant to internal transfer and CBHP) | [3P] https://texasgpacalc.com/gpa-calculator/ut-austin-gpa-calculator/ ; student op-ed [N] https://thedailytexan.com/2020/02/18/ut-needs-to-abandon-the-a-for-more-forgiving-grades/ |

### 5.2 Probation and dismissal

| Fact | Detail | Source |
|---|---|---|
| Trigger | Cumulative UT GPA **below 2.00** at the end of a grading period | [O] https://catalog.utexas.edu/general-information/academic-policies-and-procedures/scholastic-probation-and-dismissal/ |
| Name change | The catalog section is now titled "Academic Warning and Dismissal" (formerly "Scholastic Probation and Dismissal"; the 2023–24 archive still uses the old name) | [O] same ; [O] https://catalog.utexas.edu/archive/2023-24/general-information/academic-policies-and-procedures/scholastic-probation-and-dismissal/scholastic-probation-and-dismissal.pdf |
| Dismissal table (GPA after a term on warning, by total hours undertaken) | Under 15 hours: below 1.50. 15–44 hours: below 1.70. 45–59 hours: below 1.85. 60+ hours: below 2.00. (Values from the search engine's extraction of the catalog page.) | [O] catalog page above |
| Getting off | Raise cumulative GPA to 2.00 | [O] same ; [O] https://www.cs.utexas.edu/faq/611 |

### 5.3 Academic integrity

| Fact | Detail | Source |
|---|---|---|
| Office | Student Conduct and Academic Integrity (Office of the Dean of Students); rules in Chapter 11 of the Institutional Rules | [O] https://catalog.utexas.edu/general-information/appendices/appendix-c/student-conduct-and-academic-integrity/ |
| Process | Instructors can no longer resolve a suspected case alone; the office is involved. Outcome is an administrative disposition or a hearing; five days to appeal. | [3P, law-firm explainer] https://www.studentdisciplinedefense.com/university-of-texas-at-austin-academic-misconduct |
| Sanctions | Grade penalties (zero on the assignment, reduced or failing course grade), academic integrity probation, deferred suspension, suspension, **expulsion**, plus educational sanctions | [O] catalog chapter above |
| AI | Unauthorized or uncited use of AI tools is an academic integrity violation; UT's framework since Fall 2024 is "AI-Forward, AI-Responsible" | [N] https://thedailytexan.com/2025/12/02/maintaining-academic-integrity-in-age-of-ai/ ; [O] https://security.utexas.edu/ai-tools |
| Case statistics | NOT FOUND | — |

### 5.4 Weed-out / notorious courses

Course identities are official; the "weed-out" reputation is student folklore and the cited review sites are informal.

| Major | Course | What it is | Reputation | Source |
|---|---|---|---|---|
| CS | **CS 312** | Introduction to Programming (Java) | First of the three gatekeeper courses | [O] https://cs.utexas.edu/node/69868 |
| CS | **CS 311** | Discrete Math for Computer Science | Proofs shock | [O] same |
| CS | **CS 314** | Data Structures (long associated with Mike Scott) | Gatekeeper to upper division; C− or better in two attempts | [O] same ; [O] https://www.cs.utexas.edu/~scottm/ |
| CS | **CS 429** | Computer Organization and Architecture | "The CS major's first systems gauntlet... one wrong byte produces baffling behavior" | [O] https://www.cs.utexas.edu/courses/429-computer-organization-and-architecture ; [3P] https://www.fennie.ai/universities/ut-austin/cs-429 |
| CS | **CS 439** | Principles of Computer Systems ("OS") | "Usually seen as the hardest class of undergrad"; threads, virtual memory, building pieces of an OS | [O] https://www.cs.utexas.edu/courses/439-principles-computer-systems ; [3P] https://www.coursicle.com/utexas/courses/CS/439/ |
| CS | CS 331 | Algorithms and Complexity | Last core course | [O] 5-year BS/MS page |
| Math (everyone) | **M 408C / 408D** | Differential & Integral Calculus; Sequences, Series, Multivariable | 408C covers "roughly a course and a half of calculus" in one semester | [3P] https://www.fennie.ai/universities/ut-austin/m-408c ; [O] https://www.cs.utexas.edu/sites/default/files/2023-05/Choosing%20your%20Calculus%20Course.pdf |
| Engineering / CNS | **PHY 303K / 303L** | Engineering Physics I / II (homework on UT's own "Quest" system) | Timed exams with no partial credit; one section's exam averages were 68, 66, 56, 51 | [3P] https://www.fennie.ai/universities/ut-austin/phy-303k ; [3P] https://www.coursicle.com/utexas/courses/PHY/303K/ |
| ECE | **ECE 302** | Introduction to Electrical Engineering | Start of the "bottom-up" sequence | [O] https://users.ece.utexas.edu/~valvano/mspm0/EE319KSp24.html |
| ECE | **ECE 306** | Introduction to Computing (gates up to assembly) | Prerequisite to 319K | [O] same |
| ECE | **ECE 319K / 319H** | Introduction to Embedded Systems (Valvano's course) | "319K is just a weed out class you have to go through"; one exam is writing and debugging an assembly program in an hour, worth 25%: it works or it does not | [3P] https://www.coursicle.com/utexas/courses/ECE/319K/ |
| ECE | ECE 312 | Software Design and Implementation I (C) | Part of the first-year sequence | [O] https://catalog.utexas.edu/undergraduate/engineering/degrees-and-programs/bs-electrical-engineering/suggested-arrangement-of-courses-electrical-engineering/ |
| Pre-med / ChE / BME | **CH 301, CH 320M** | General Chemistry; Organic Chemistry I | "Some of the most intense weed-out classes" | [3P] https://chanestutoring.com/ut-austin/ |
| Economics | **ECO 420K** | Microeconomic Theory | Grade can be 100% exams; difficulty depends heavily on the instructor | [3P] https://www.coursicle.com/utexas/courses/ECO/420K/ |
| McCombs | ACC 311 | Fundamentals of Financial Accounting | Cumulative; "not hard if you keep up" | [3P] https://www.coursicle.com/utexas/courses/ACC/311/ |

Note: Quest (UT's in-house homework system, a staple of intro math and science since the late 1980s) charges $30 per course per semester, which students complain about. [N] https://thedailytexan.com/2020/10/07/paid-homework-program-quest-raises-financial-concerns-for-ut-austin-students/

### 5.5 Registration, drops, calendar

| Fact | Detail | Source |
|---|---|---|
| Registration time slots | Access periods are assigned by progress toward degree; the slot is on your Registration Information Sheet (RIS). Seniors and juniors usually register in the first week, sophomores and freshmen in the second. | [O] https://onestop.utexas.edu/registration-and-degree-planning/registering-for-classes/registration-times/ ; [O] https://moody.utexas.edu/academics/undergraduate/policies/registration |
| Classification | Based on hours passed and transferred, so AP / dual credit moves you up the queue | [O] https://catalog.utexas.edu/general-information/academic-policies-and-procedures/classification-of-students/ |
| Waitlists | Up to two lists per course, four at once; active through the 6th class day | [O] https://onestop.utexas.edu/registration-and-degree-planning/registering-for-classes/add-drop-a-course/ |
| UT Registration Plus | Student-built Chrome extension (grade distributions, syllabi, schedule conflicts); **60,000+ students per registration season**; maintained by the student org Longhorn Developers; recommended at orientation | [O] https://www.cs.utexas.edu/news/2026/longhorn-developers-discord-server-campus-institution |
| Add/drop | Add through the 6th class day (fall/spring). A drop after the **12th class day** is a **Q-drop**. | [O] add/drop page above |
| Q-drop limit | **Six** Q-drops in an undergraduate career (state law) | [O] same |
| One-Time Exception (OTE) | Every undergrad gets one late drop or withdrawal after the Q-drop deadline, through the last class day; it counts as one of the six | [O] same |
| Full-time | 12 hours for undergrads | [O] same |
| Semester structure | Fall (classes began Aug 24, 2026) and spring long semesters, plus optional summer sessions | [N] https://www.kut.org/transportation/2026-08-11/austin-tx-university-of-texas-ebikes-scooters-dismount-zone ; [O] add/drop page (summer class-day rules) |
| **No mandatory co-op** | Internships happen in summers, and students can switch employers each summer; possible from the summer after first year | [O] https://cockrell.utexas.edu/student-life/career-services/co-ops-and-internships/ |
| Optional Cockrell co-op | At least one summer **and** one long semester of full-time work with the same employer; 1–2 hours of letter-grade credit per work term; honor society Kappa Theta Epsilon | [O] same ; [O] https://cockrell.utexas.edu/student-life/student-organizations/ |

### 5.6 Time to degree

| Metric | Value | Year | Source |
|---|---|---|---|
| Four-year graduation rate | **77.7%** (record) | 2026 | [O] https://news.utexas.edu/2026/09/22/ut-sets-academic-performance-records-remains-the-no-1-public-university-in-texas/ |
| Four-year rate, earlier | 75.7% (2025), 74.8% (2024), 52.0% (2013) | — | [O] https://news.utexas.edu/2025/09/18/ut-sets-all-time-highs-for-enrollment-and-student-performance/ ; [O] https://news.utexas.edu/2024/12/06/demand-soars-as-ut-shatters-record-for-freshman-applications/ |
| Six-year graduation rate | ~88% (first-time, full-time) | 2025 | [3P] https://www.collegefactual.com/colleges/the-university-of-texas-at-austin/academic-life/graduation-and-retention/ |
| First-year retention | 97.1% | 2025 | [O] UT News 2025 article |
| Degrees awarded | 16,801 | 2025–26 | [O] UT News 2026 article |

---

## 6. Money

### 6.1 Tuition (flat rate, 12+ hours, per semester, 2026–27)

Values are from UT's official tuition tables as extracted by the search engine (the table itself did not render in the fetch tool).

| College | Texas resident | Non-resident |
|---|---|---|
| Liberal Arts | **EST $5,429** (low end of the official annual range ÷ 2) | $21,277 |
| Natural Sciences | $5,883 | $22,485 |
| Engineering | $6,484 | $24,197 |
| Business | $6,788 | $25,553 |

Source: [O] https://catalog.utexas.edu/general-information/registration-tuition-and-fees/tuition-and-fees/tables-tuition-for-fall-and-spring/ ; ranges cross-checked against [O] https://onestop.utexas.edu/managing-costs/cost-tuition-rates/cost-of-attendance/ (resident $10,858–$13,576 a year; non-resident $42,554–$51,106 a year). Out-of-state students pay roughly 3.8× in-state.

### 6.2 Cost of attendance (fall + spring, 2026–27)

| Line | Resident, on/off campus | Resident, with parents | Non-resident |
|---|---|---|---|
| Tuition | $10,858–$13,576 | same | $42,554–$51,106 |
| Housing and food | $15,420–$15,580 | $7,910 | $15,420–$15,580 |
| Transportation | $1,840 | $1,840 | $1,840 |
| Books and supplies | $724 | $724 | $724 |
| Personal | $3,666 | $3,666 | $3,666 |
| **Total** | **$32,508–$35,386** | **$24,998–$27,716** | **$64,204–$72,916** |

Source: [O] https://onestop.utexas.edu/managing-costs/cost-tuition-rates/cost-of-attendance/

### 6.3 Need-based aid

| Fact | Value | Year | Source |
|---|---|---|---|
| **Texas Advance Commitment**, full tuition | Texas residents with family AGI **up to $100,000** (raised from $65,000) | From Fall 2025 | [O] https://admissions.utexas.edu/cost-aid/financial-aid/texas-advance-commitment/ ; [O] https://news.utexas.edu/2024/12/06/demand-soars-as-ut-shatters-record-for-freshman-applications/ |
| TAC, partial | AGI $100,001–$125,000 | From Fall 2025 | [O] TAC page |
| TAC renewal | 2.0 GPA and 67% course completion; up to four years | 2026 | [O] same |
| TAC housing scholarship | $2,500 a year (full-coverage recipients) or $1,500 (partial) for those in specified housing | 2025–26 | [O] same |
| TAC participants | 12,200+ | 2025 | [O] UT News 2025 article |
| Average net tuition, full-time Texas undergrads | **$3,852** (sticker average $11,823); $2,528 for incoming Texas freshmen | 2024–25 | [O] same |

### 6.4 Merit scholarships

| Scholarship | Value / scale | Source |
|---|---|---|
| **Forty Acres Scholars** (Texas Exes) | UT's premier full ride plus stipend. ~20–25 scholars a year; 50–60 finalists invited to a finalist weekend (60 for the Class of 2026); 3,400+ applicants in one cited year, 4,000–5,000 by a consultant's count | [O] https://www.texasexes.org/scholarships/news/forty-acres-scholars-program-class-2026-finalists ; [C] https://www.texadmissions.com/blog/2025/7/28/applying-for-the-forty-acres-scholars-program-fasp-and-ut-austin-scholarships |
| Merit aid in general | **Fewer than 5%** of enrolling freshmen get institutional merit money; average ~$4,000; ~$25M merit vs ~$240M need-based. "International and out-of-state students virtually never receive scholarships." | [C] same |
| Presidential Scholars | Up to $20,000 ($5,000 a year); merit plus high need | [O] https://news.utexas.edu/2019/10/02/top-scholarships-awarded-by-the-university-of-texas-at-austin/ |
| Impact Scholarship | $48,000 over four years ($12,000 a year), covering tuition | [3P, school-district news] https://www.desotoisd.org/news/newsroom/u_t_impact_scholar |
| Terry Foundation | Texas-resident scholarship at affiliated universities; average traditional award $18,000 (2015–16, old figure) | [O] https://news.utexas.edu/2015/10/02/five-great-ut-scholarships/ ; [O] https://terryfoundation.org/apply/affiliated-universities/ |
| **National Merit** | UT **stopped sponsoring** National Merit scholarships from Fall 2010 and redirected the money to need-based aid; no automatic rank- or score-based awards | [N] https://www.chronicle.com/article/u-of-texas-at-austin-wont-sponsor-national-merit-scholars-anymore/ ; [N] https://www.chron.com/news/houston-texas/article/ut-to-end-its-national-merit-scholarship-program-1743770.php |
| Cockrell | $15.4M a year in scholarships and fellowships across 1,500+ awards; Engineering Honors gives merit aid to most or all members | [O] https://cockrell.utexas.edu/about/facts-and-rankings/ ; [C] texadmissions honors article |
| Texas Exes chapter scholarships | ~300 incoming freshmen, average $1,750 | [C] texadmissions FASP article |
| Turing Scholars scholarship amounts | NOT FOUND | — |

### 6.5 Housing

| Option | Price | Year | Source |
|---|---|---|---|
| Residence hall, shared, community bath | $14,465 for fall + spring, including unlimited meal plan and $400 Dine In Dollars per term | 2026–27 | [O] https://housing.utexas.edu/housing/residence-halls/residence-hall-rates |
| **Jester** shared, community bath | $14,937 | 2026–27 | [O] same |
| Jester shared, connecting / private bath | $15,884 | 2026–27 | [O] same |
| San Jacinto or Duren shared | $18,164 | 2026–27 | [O] same |
| Dobie shared with private bath (Dobie is now university housing) | $13,324 | 2026–27 | [O] same |
| Singles | $16,364–$20,961 | 2026–27 | [O] same |
| **West Campus**, per person | ~$1,000 a month for a bed in a 4x4 or 5x5, up to $2,400+ for a studio or premium one-bedroom | 2026 | [3P] https://www.brightplace.ai/guides/ut-austin-student-housing |
| West Campus listing average | $1,562 a month (studio $1,848; 1BR $1,619; 2BR $1,752; 3BR $1,237) | Sept 2026 | [3P] https://www.apartments.com/west-campus-austin-austin-tx/ |
| West Campus premium over the city | One-bedroom median $2,164 vs $1,309 citywide (65% higher), while Austin rents overall were falling | Feb 2024 | [N] https://thedailytexan.com/2024/02/09/west-campus-rent-rates-surge-amid-decrease-in-austin-area-rent-prices/ |
| "Affordable" unit example | A bedroom in a 4-bed went from $746 to $928 | 2024 | [N] same |

### 6.6 Campus wages

| Job | Pay | Year | Source |
|---|---|---|---|
| Typical UT student employee | Average ~$16.42/hr, most between $14.52 and $18.37 | Sept 2026 | [3P] https://www.ziprecruiter.com/Jobs/Ut-Student/-in-Austin,TX ; [3P] https://www.glassdoor.com/Hourly-Pay/University-of-Texas-at-Austin-Student-Employee-Hourly-Pay-E133952_D_KO30,46.htm |
| TACC professional internship | $25/hr, full-time for 12 weeks | 2026 | [O] https://tacc.utexas.edu/about/internships/aci/ |
| ARL:UT student technician | Paid, flexible, 10–15 hrs/week during semesters; rate NOT FOUND | 2026 | [O] https://www.arlut.utexas.edu/students.shtml |
| Official campus minimum for student workers | NOT FOUND (no university-wide $15 mandate located) | — | Low-wage coverage: [N] https://thedailytexan.com/2023/02/16/on-campus-workers-face-low-wages-high-living-costs/ |

---

## 7. Recruiting and outcomes

### 7.1 Career fairs

| Event | Detail | Year | Source |
|---|---|---|---|
| **Fall Engineering Expo** | Run by the Student Engineering Council; "one of the largest student-run career fairs in the nation"; two days; **300+ employers, 6,000 students**; Sept 9–10, 2026 | 2026 | [O] https://cockrell.utexas.edu/student-life/career-services/career-fairs/engineering-expo-information-for-students/ |
| **CNS Fall Career Fair** | "Hundreds of employers"; Sept 15, 2026, 12–4 PM. CNS also runs a Technology and Science Career Fair and a spring pop-up fair. | 2026 | [O] https://careerservices.cns.utexas.edu/events/career-fairs/cns-fall-2026-career-fair |
| **FoCS Career Brunch** | Flagship CS-only networking event, held the morning of the CNS tech fair; plus Spring Reconnect Night | 2026 | [O] https://www.cs.utexas.edu/giving-collaboration/focs/focs-career-brunch |
| **Friends of Computer Science (FoCS)** | Corporate partner program. Tiers: $35,000 (FoCS+), $20,000 (corporate), $10,000 (government / startup). | 2026 | [O] https://www.cs.utexas.edu/engage/industry/focs |
| FoCS partner list | Apple, Bloomberg, Boeing, Capital One, Chevron, **Citadel**, Dell Technologies, Google, **Hudson River Trading**, Intuit, **Jane Street**, Lockheed Martin, Sandia National Laboratories, SerpApi, ServiceNow, Stripe, Visa, and others | 2026 | [O] same |
| McCombs career fairs | NOT FOUND (BBA career fair names, dates, and employer counts not located) | — | Calendar hub: [O] https://careersuccess.utexas.edu/career-fair-calendar/ |

### 7.2 Published outcomes

**Computer Science** (CNS graduation survey; salary figures are pooled, mostly 2014–2023 respondents, collected at graduation):

| Metric | Value | Source |
|---|---|---|
| Employed at graduation | 81% | [O] https://careerservices.cns.utexas.edu/explore-careers/career-guides-major/computer-science |
| Seeking employment | **11%** | [O] same |
| Graduate school | 6% | [O] same |
| Other / medical school | 3% / 0.3% | [O] same |
| Average salary | **$114,620** | [O] https://www.cs.utexas.edu/undergraduate/careers |
| Salary distribution | 75% accept $85,000+; 50% accept $110,500+; 25% accept $145,000+; 17% accept $155,000+ | [O] same |
| Average bonus | $26,615 | [O] same |
| Extras | 70% sign-on bonus, 53% relocation, 40% equity | [O] same |
| Industry, Class of 2024 | Science / technology / engineering 71%, **financial services 17%**, manufacturing / natural resources 4%, consulting 3% | [O] same |
| Official top-employer list | NOT FOUND in rendered pages (CNS keeps it in a download). Third-party claims: Google, Meta, Apple, Amazon, Microsoft, Stripe, Palantir, Jane Street, Oracle, IBM, Dell, Indeed | [3P, weak] https://instateutaustin.com/ut-austin-computer-science-admission |
| Market caution | Recent CS grads nationally face 6.1–7.5% unemployment, about double biology or art history | [C] https://www.texadmissions.com/blog/2025/6/5/ut-austin-computer-science-is-highly-competitive-consider-these-alternatives |

**Cockrell** (page updated May 22, 2025): overall BS average $88,141; ECE $101,938; Petroleum $104,539; ME $86,665; ChE $87,514; BME and Computational $85,025; Aerospace $81,227; Civil / Environmental $73,969; Architectural $73,434. "90%+" placed or in grad school. [O] https://cockrell.utexas.edu/student-life/career-services/salaries-and-statistics/ ; [O] https://cockrell.utexas.edu/about/facts-and-rankings/

**McCombs BBA** (2024–25): mean $89,377, median $85,000; by major in §2.4.

| McCombs cut | Value | Source |
|---|---|---|
| Industry: financial services | 38.8% of accepted offers; mean $96,640; range $45K–$200K | [O] https://www.mccombs.utexas.edu/recruiters-and-corporations/recruiters/recruiting-statistics/salary-statistics/ |
| Industry: consulting | 19.7%; mean $91,743; range $62K–$114K | [O] same |
| Industry: technology | 18.2%; mean $90,373; range $55K–$206K | [O] same |
| Median base by location | Texas overall $80,000; Austin $75,000; Dallas $80,000; **Houston $92,500**; Northeast $110,000; West $100,000; Mid-Atlantic $106,000 | [O] same |
| Placement rate and top-employer list | NOT FOUND | — |
| Function-level figures (e.g. investment banking ≈10% of accepts) | Appeared only in a search-engine summary with implausible salary values; UNVERIFIED, do not use | — |

### 7.3 Intern pay

| Group | Pay | Year | Source |
|---|---|---|---|
| Cockrell BS interns, overall | **$4,428/month** (EST ≈ $25.50/hr at 173 hrs/month) | 2025 | [O] https://cockrell.utexas.edu/student-life/career-services/salaries-and-statistics/ |
| Cockrell BS co-ops, overall | $4,630/month | 2025 | [O] same |
| ECE co-op | **$5,752/month** (EST ≈ $33/hr) | 2025 | [O] same |
| ECE BS intern | $4,744/month (search-engine extraction of the same page) | 2025 | [O] same |
| ChE co-op / ME co-op / Aerospace-Computational co-op | $4,713 / $4,615 / $4,317 per month | 2025 | [O] same |
| MS / PhD engineering interns | $5,182 / $6,922 per month | 2025 | [O] same |
| McCombs BBA interns | Mean **$4,972/month**; financial services $6,052; consulting $6,135; range $305–$22,560 | 2024–25 | [O] McCombs salary page |
| UT CS intern pay | **NOT FOUND** (no UT-published figure) | — | — |
| Market reference: software interns | Most internships pay $20–35/hr; most tech companies $45–60/hr; top tier $65+/hr (Google listed at $67.79/hr) | 2026 | [3P] https://www.levels.fyi/blog/software-internship-salaries.html ; [3P] https://www.levels.fyi/internships/Google/Software-Engineer-Intern/ |
| Market reference: quant interns | Around **$150/hr** at SIG, Radix, Vatic | 2026 | [3P] https://www.levels.fyi/internships/SIG/Software-Engineer-Intern/ |
| EST range for a game | Campus job $15–18/hr; local startup or lab $20–30; engineering intern $25–35; Big Tech $45–70; quant $100–150 | 2026 | EST from the rows above |

### 7.4 The Austin employer scene

Headcounts are approximate and come from one secondary compilation; treat as order-of-magnitude.

| Employer | Austin-area footprint | Source |
|---|---|---|
| **Tesla** | Gigafactory Texas, ~16,500 employees (end of 2025) | [3P] https://austinapartmentlocators.com/blog/big-tech-companies-in-austin-tx/ |
| **Dell Technologies** | ~14,000, headquartered in Round Rock | [3P] same |
| **Apple** | 13,000+ across Texas; North Austin campus planned for 15,000+ | [3P] same |
| **Samsung** | ~9,000+ across the Austin fab and the Taylor fab | [3P] same |
| IBM | ~6,000 (the Domain) | [3P] same |
| **Amazon** | ~5,000+ (the Domain / North Austin) | [3P] same |
| **Indeed** | 3,000+ (headquarters) | [3P] same |
| **Google** | ~2,500 downtown | [3P] same |
| **AMD** | ~2,400 on Parmer Lane | [3P] same |
| **Oracle** | ~2,000+ (Riverside campus) | [3P] same |
| **Meta** | ~1,000, scaled back | [3P] same |
| **NI and Emerson** (Emerson acquired NI) | ~1,000+ each | [3P] same |
| Startups | ~60 Y Combinator-funded companies list Austin as headquarters | [O] https://www.ycombinator.com/companies/location/austin |
| Space | Firefly Aerospace partners with a UT student group on launch-vehicle work | [O] https://www.ae.utexas.edu/undergraduate/student-community/project-based-teams-and-programs |

**Trading firms with Austin offices:** Optiver (11501 Alterra Parkway; trading, research, tech roles and internships) [O] https://optiver.com/about-us/locations/austin/ ; also reported in Austin: Virtu Financial, DRW, Jump Trading, Citadel Securities, Quantlab [3P] https://www.builtinaustin.com/articles/trading-firms-austin ; [3P] https://www.tradermath.org/proprietary-trading-firms/austin

### 7.5 Pipelines

| Pipeline | Evidence | Source |
|---|---|---|
| **Quant trading out of CS / Turing** | Citadel, Hudson River Trading, and Jane Street are paying FoCS partners; 17% of the CS Class of 2024 went into financial services; student orgs Texas UCF and USIT QMI exist for it | [O] FoCS page ; [O] CS careers page ; org sources in §8 |
| **Houston energy investment banking** | "Rice, UT Austin (McCombs), and Texas A&M (Mays) place consistently into Houston energy groups at both bulge brackets and boutiques." Houston pays McCombs grads the highest Texas median ($92,500). | [3P] https://ibinterviewquestions.com/guides/energy-investment-banking/recruiting-for-energy-ib ; [O] McCombs salary page |
| Forum folklore | "Every Houston bank recruits like half their analysts from UT" (anonymous forum claim, not data) | [3P] https://www.wallstreetoasis.com/forum/school/is-mccombs-business-school-of-ut-austin-a-good-school-to-get-an-investment-banking-job |
| McCombs support | Investment Banking Accelerator (open to non-business undergrads); Undergraduate Energy Programming | [O] https://www.mccombs.utexas.edu/texas-mccombs-academy/investment-banking-accelerator/ ; [O] https://www.mccombs.utexas.edu/centers-initiatives/undergraduate-energy-programming/careers/ |
| **Consulting** | 19.7% of BBA accepted offers; Dallas median $80,000. Named firm list for undergrads NOT FOUND (MBA-level sources name McKinsey, BCG, Bain, Deloitte). | [O] McCombs salary page ; [3P] https://menlocoaching.com/top-mba-programs/ut-austin-mccombs/employment/ |
| **Engineering** | Expo (300+ employers); ECE and petroleum are the six-figure majors | [O] §7.1, §7.2 sources |

---

## 8. Student orgs and project teams (résumé-builders)

UT has 1,000+ student organizations (2026). [O] https://www.utexas.edu/about/facts-and-figures

Axis key: **SYS** systems / software, **PROD** product, **AI** AI / data, **QUANT** quant / finance, **EE** electrical / hardware, **MECH** mechanical / robotics / aero, **BIO** bio / nano, **BIZ** consulting / business (no Waterloo equivalent, but UT needs it).

"List" sources: CS = https://www.cs.utexas.edu/undergraduate-program/student-organizations ; Cockrell = https://cockrell.utexas.edu/student-life/student-organizations/ ; ECE = https://ece.utexas.edu/academics/studentorgs ; McCombs = https://www.mccombs.utexas.edu/BBA/Student-Life/Student-Organizations ; AE = https://www.ae.utexas.edu/undergraduate/student-community/project-based-teams-and-programs

### Software, product, and security

| # | Org (real name) | One line | Axis | Source |
|---|---|---|---|---|
| 1 | **Association for Computing Machinery (ACM), UT student chapter** | "The oldest organization for students and professionals in computer science" | SYS | [O] CS list |
| 2 | **Freetail Hackers** | Runs **HackTX**, the annual 24-hour hackathon: 1,000+ attendees, 60+ organizers, 9,000+ hackers across 14 editions | SYS / PROD | [O] CS list ; https://hacktx.com/ |
| 3 | **Texas Convergent (TX Convergent)** | Cross-functional "build teams" of 8–12 ship a product in a semester and present at Demo Day; ~200 members, 25+ majors; founded 2016 | PROD | https://txconvergent.org/ ; [O] CS list |
| 4 | **Texas Product Engineering Organization (TPEO)** | Teaches software engineering, UI/UX, and product management through semester courses and projects for campus clients | PROD / SYS | [O] CS list |
| 5 | **Longhorn Developers** | Builds and maintains UT Registration Plus (60,000+ users) and other campus tools; ~900-member Discord | SYS / PROD | [O] https://www.cs.utexas.edu/news/2026/longhorn-developers-discord-server-campus-institution |
| 6 | **Information & Systems Security Society (ISSS)** | Security talks, workshops, CTF team; hosts **UTCTF**, an annual 48-hour international CTF | SYS | [O] CS list ; https://www.isss.io/ |
| 7 | **UTCS Competitive Programming Club** | Represents UT at ICPC | SYS / QUANT | [O] CS list |
| 8 | **Electronic Game Developers Society (EGaDS!)** | Game development club | SYS / PROD | [O] CS list |
| 9 | **Directed Reading Program (DiRP)** | Pairs undergrads with mentors to read papers and do projects in a CS research area | AI / SYS | [O] CS list |
| 10 | **Turing Scholars Student Association (TSSA)** | Honors-program org: socials, Big/Little mentoring | SYS | [O] CS list |
| 11 | **Texas CSBA (Computer Science and Business Association)** | Org for Texas CSB honors students | PROD / BIZ | [O] CS list |
| 12 | **Women in Computer Science (WiCS)** | Academic and social community for women in CS | SYS | [O] CS list |
| 13 | **Hispanic Association of Computer Scientists (HACS)** | Leadership, networking, mentoring | SYS | [O] CS list |
| 14 | **Association of Black Computer Scientists (ABCS)** | Pathways for Black and underrepresented CS students | SYS | [O] CS list |
| 15 | **Q++** | LGBTQ+ people in tech at UT | SYS | [O] CS list |
| 16 | **Computer Science Transfers' Society (CSTS)** | Community for transfer students into CS (thematically perfect for the internal-transfer storyline) | SYS | [O] CS list |
| 17 | **CS Roadshow** | Outreach visits to local schools | SYS | [O] CS list |
| 18 | **Coders Across Disciplines (CAD)** | Coding community for non-CS engineers | SYS | [O] Cockrell list |
| 19 | **Product@TX** | Student product-management org; mentorship toward PM internships | PROD | https://product-tx.github.io/ |
| 20 | **Product Prodigy Institute** | Selective two-semester product management / design / sales training program for undergrads (a UT program, not a club) | PROD | [O] https://community.utexas.edu/innovation/programs/ |
| 21 | **Management Information Systems Association (MISA)** | McCombs MIS majors' org; co-hosts Datahack | PROD / AI | [O] McCombs list ; https://datahack.txconvergent.org/ |

### AI, data, and quantum

| # | Org | One line | Axis | Source |
|---|---|---|---|---|
| 22 | **Machine Learning and Data Science (MLDS)** | "Learn by doing" ML community; runs the **Datahack** datathon | AI | [O] ECE list ; https://github.com/MLDS-UT-Austin |
| 23 | **ECLAIR** (Engineering and Computational Learning of Artificial Intelligence in Robotics) | Autonomy, reinforcement learning, sim-to-real robotics | AI / MECH | [O] CS list |
| 24 | **The Quantum Collective** | Makes quantum science accessible to undergrads | AI / EE | [O] CS list |
| 25 | **Austin AI Alignment** | AI safety and governance fellowships for UT students | AI | https://austinaialignment.com/ |
| 26 | **USIT Quantitative Market Intelligence (QMI)** | Selective quant finance / applied data science group inside USIT | QUANT / AI | https://usitqmi.com/ |
| 27 | **Business of Sports Student Organization (BOSSO)** | Sports business and analytics org of McCombs' Business of Sports Institute; founded 2025 | AI / BIZ | https://txbosso.com/ |
| 28 | **UT Austin Villa** | RoboCup robot-soccer team under Peter Stone and Joydeep Biswas; 4th of 22 at RoboCup 2026 with three undergrads on the roster | AI / MECH | [O] https://news.utexas.edu/2026/07/14/ut-austin-villa-finishes-strong-at-robocup-2026/ |

### Quant, finance, and investing

| # | Org | One line | Axis | Source |
|---|---|---|---|---|
| 29 | **University Securities Investment Team (USIT)** | UT's largest investing org: 300+ members of all majors, $50K+ student-run portfolio, founded 2010; hosts Texas Stock Pitch, Texas Charity Pitch, Texas Shark Tank | QUANT | https://www.texasusit.org/about-usit ; [O] McCombs list |
| 30 | **Texas Undergraduate Computational Finance (Texas UCF)** | Quant trading org: algorithmic strategies, market making, options, sports betting; manages a portfolio of equities and options | QUANT | https://www.linkedin.com/company/texasucf |
| 31 | **Texas Undergraduate Investment Team (TUIT)** | "The first, premier investment team" at UT, founded 2007 | QUANT | https://www.texasuit.com/ |
| 32 | **Texas Equity Group (TEG)** | Student-run real-money portfolio, founded 2007; recruits freshmen each semester | QUANT | https://www.texasequitygroup.org/ |
| 33 | **University Finance Association (UFA)** | UT's oldest and largest finance org (since 1951); has an investment team | QUANT / BIZ | https://texasufa.org/ ; [O] McCombs list |
| 34 | **Texas Investment Banking Association (Texas IBA)** | Selective; mentors students through investment banking recruiting with technical training | QUANT / BIZ | https://www.texasiba.com/ |
| 35 | **Longhorn Investment Team (LIT)** | Student-run finance org founded 2018 | QUANT | https://longhorninvestmentteam.org/ |
| 36 | **Texas Finance Team** | Finance training and mentorship; a branch of the Asian Business Students Association | QUANT | https://www.instagram.com/texasfinanceteam/ |
| 37 | **Energy Finance Group** | Energy investment banking prep: NAV modeling, Houston banker speakers | QUANT / BIZ | https://texasefg.com/ |
| 38 | **Wealth Management Student Organization** | Wealth management careers | QUANT | [O] McCombs list |
| 39 | **Texas Blockchain** | Blockchain / crypto org | QUANT / SYS | [O] McCombs list |
| 40 | **Texas Venture Group** | Students doing hands-on venture work with startups | QUANT / PROD | https://www.texasventuregroup.com/ |
| 41 | **Genesis** | Student-run startup fund (~$2M), founded 2016 by Cockrell alumni and students; open to all majors | QUANT / PROD | https://www.genesisut.com/ ; [O] https://news.utexas.edu/2018/05/15/uts-first-startup-investment-fund-for-all/ |

### Consulting, business, and entrepreneurship

| # | Org | One line | Axis | Source |
|---|---|---|---|---|
| 42 | **Texas Consulting** | Student consulting org | BIZ | [O] McCombs list |
| 43 | **180 Degrees Consulting** | Pro-bono consulting for nonprofits | BIZ | [O] McCombs list |
| 44 | **Consult Your Community** | Consulting for local small businesses | BIZ | [O] McCombs list |
| 45 | **Undergraduate Business Council** | McCombs student government | BIZ | [O] McCombs list |
| 46 | **Honors Business Association** | Canfield BHP students' org | BIZ | [O] McCombs list |
| 47 | **Alpha Kappa Psi** | Business fraternity | BIZ | [O] McCombs list |
| 48 | **Delta Sigma Pi** | Business fraternity | BIZ | [O] McCombs list |
| 49 | **Phi Chi Theta** | Business fraternity | BIZ | [O] McCombs list |
| 50 | **National Organization for Business & Engineering (NOBE)** | Engineers who want business careers | BIZ / PROD | [O] Cockrell list |
| 51 | **Texas Momentum** | Student startup accelerator pairing founders with PMs, engineers, and designers | PROD | [O] https://undergraduates.utexas.edu/launchpad/ut-opportunities/student-orgs |
| 52 | **Longhorn Entrepreneurship Agency (LEA)** | Student Government agency: Freshman Founders program, co-working space, Entrepreneurship Week | PROD / BIZ | [N] https://thedailytexan.com/2015/02/18/longhorn-entrepreneurship-agency-helps-student-entrepreneurs-grow-succeed/ |
| 53 | **Freshman Launch** | McCombs first-year org | BIZ | [O] McCombs list |
| 54 | **Women in Business Association**, **Asian Business Student Association**, **Hispanic Business Student Association**, **Black Business Student Association** | Large identity-based business orgs that double as recruiting networks | BIZ | [O] McCombs list |

### Electrical and hardware

| # | Org | One line | Axis | Source |
|---|---|---|---|---|
| 55 | **IEEE (UT student branch)** | Main ECE student society | EE | [O] ECE list |
| 56 | **IEEE Robotics and Automation Society (IEEE RAS)** | Since 1997, open to all majors. Committees: **RoboMaster** (team "Stampede"), **VEXU** (won the VEX AI World Championship), **Demobots** (the famous Couchbot), **Robotathon** (fall beginner competition) | EE / MECH | https://ras.ece.utexas.edu/ ; [N] https://thedailytexan.com/2023/09/20/ut-robomaster-team-stampede-gears-up-for-annual-robotics-competition/ ; [O] https://robotics.utexas.edu/news/UT-Austin%E2%80%99s-VEX-U-Robotics-Team-Wins-1st-Place |
| 57 | **IEEE Power & Energy Society (IEEE PES)** | Power systems, renewables, grid | EE | [O] ECE list |
| 58 | **Eta Kappa Nu (HKN)** | ECE honor society | EE | [O] ECE list |
| 59 | **Women in Electrical and Computer Engineering (WECE)** | Community for women in ECE | EE | [O] ECE list |
| 60 | **UT Amateur Radio Club (UTARC)** | Ham radio | EE | [O] Cockrell list |
| 61 | **Longhorn Racing (LHR)** | UT's Formula SAE organization, with three teams: **Combustion, Electric, Solar** | MECH / EE | https://www.longhornracing.org/ ; [N] https://thedailytexan.com/2024/03/05/a-look-inside-longhorn-racing-uts-very-own-race-car-club/ |
| 62 | **UT Solar Vehicles Team → Longhorn Racing Solar** | The historic solar car team is now the solar branch of Longhorn Racing | EE / MECH | [N] https://thedailytexan.com/2021/05/02/longhorn-racing-showcases-new-generation-of-solar-car/ ; https://en.wikipedia.org/wiki/University_of_Texas_Solar_Vehicles_Team |

### Mechanical, aerospace, and robotics

| # | Org | One line | Axis | Source |
|---|---|---|---|---|
| 63 | **Texas Rocket Engineering Lab (TREL)** | Student-run lab founded 2018; 120+ members building liquid bipropellant rockets (Neptune, Halcyon); Lockheed Martin support | MECH | https://texasrocketlab.ae.utexas.edu/ ; [O] https://alcalde.texasexes.org/2026/02/texas-rocket-engineering-lab-is-shaping-a-new-generation-of-engineers |
| 64 | **Longhorn Rocketry Association (LRA)** | Student-run amateur rocketry | MECH | [O] https://sites.utexas.edu/sec/organizations/lra/ |
| 65 | **Texas Aerial Robotics (TAR)** | Autonomous drones for the International Aerial Robotics Competition | MECH / AI | [O] AE list |
| 66 | **Texas Spacecraft Laboratory (TSL)** | Builds small satellites (FASTRAC, Bevo-1, Bevo-2 reached orbit) | MECH / EE | [O] AE list |
| 67 | **Texas Flight** | UT's official AIAA Design/Build/Fly team | MECH | [O] AE list |
| 68 | **Texas Guadaloop** | Undergraduate hyperloop R&D team; two SpaceX Hyperloop Pod Competition innovation awards | MECH / EE | https://www.linkedin.com/company/texas-guadaloop ; [O] https://give.utexas.edu/texas-guadaloop-s-hyperloop-innovation |
| 69 | **American Institute of Aeronautics & Astronautics (AIAA)** | Aerospace society | MECH | [O] Cockrell list |
| 70 | **American Society of Mechanical Engineers (ASME)** | ME society | MECH | [O] Cockrell list |
| 71 | **Texas Theme Park Engineering Group (TXTPEG)** | Ride and attraction design | MECH | [O] Cockrell list |
| 72 | **Women in Aerospace for Leadership and Development (WIALD)** | Aerospace community | MECH | [O] Cockrell list |
| 73 | **Texas Inventionworks** | Cockrell's makerspace and hands-on program in the EER (a 23,000 sq ft maker space) | MECH / EE | [O] https://cockrell.utexas.edu/student-life/research-and-projects/texas-inventionworks/ |
| 74 | **Student Engineering Council (SEC)** | Engineering student government; runs the Engineering Expo | BIZ / all | [O] Cockrell list |
| 75 | **Theta Tau** | Professional engineering fraternity | all | [O] Cockrell list |
| 76 | **Tau Beta Pi** | Engineering honor society | all | [O] Cockrell list |
| 77 | **SHPE, NSBE, SWE, SASE** | The large identity-based engineering societies; major recruiting pipelines through their national conferences | all | [O] Cockrell list |

### Bio, health, energy, and service

| # | Org | One line | Axis | Source |
|---|---|---|---|---|
| 78 | **UT Austin iGEM team** | Synthetic biology competition team formed through the FRI; 2025 project: a DNA-based sensor that detects and degrades algal toxins | BIO | [O] https://fri.cns.utexas.edu/research-streams/igem ; [O] https://eureka.utexas.edu/project/2025-igem-synthetic-biology-team |
| 79 | **Biomedical Engineering Society (BMES)** | BME society | BIO | [O] Cockrell list |
| 80 | **Texas Engineering World Health (TEWH)** | Low-cost medical device design | BIO | [O] Cockrell list |
| 81 | **Longhorn Neurotech** | Neuroengineering org; competes in the NeuroTechX student competition; journal club | BIO / AI | [O] https://calendar.utexas.edu/event/longhorn-neurotech-journal-club |
| 82 | **Women in Biomedical Engineering (WBME)** | BME community | BIO | [O] Cockrell list |
| 83 | **Synapse** | Neuroscience students' org | BIO | [O] https://cns.utexas.edu/student-experience/find-community/student-organizations |
| 84 | **American Institute of Chemical Engineers (AIChE)** | ChE society | BIO / MECH | [O] Cockrell list |
| 85 | **Engineers for a Sustainable World (ESW)** | Sustainability engineering projects | MECH / BIO | [O] Cockrell list |
| 86 | **Projects with Underserved Communities (PUC)** | Year-long engineering + social work service-learning course with a summer build abroad (a program, not a club) | MECH | [O] https://global.utexas.edu/abroad/programs/service-learning/projects-underserved-communities |
| 87 | **American Nuclear Society (ANS)** | Nuclear engineering | EE / MECH | [O] Cockrell list |
| 88 | Petroleum orgs: **American Association of Drilling Engineers (AADE)**, **Pi Epsilon Tau** | Oil-and-gas pipeline orgs | MECH | [O] Cockrell list |
| 89 | Pre-health honor societies (**Alpha Epsilon Delta**, **American Medical Student Association**) | Pre-med résumé-builders | BIO | [O] CNS org list above |

Names requested but not confirmed under that exact name: "Texas Quant" (the real orgs are Texas UCF and USIT QMI); "Texas Sports Analytics Group" (closest is BOSSO); a UT-only "Engineers Without Borders" student chapter (it merged in 2009 into the professional Engineers Without Borders – Greater Austin chapter, https://www.ewbgreateraustin.org/about-us/).

---

## 9. Research and special paths

| Item | Fact | Year | Source |
|---|---|---|---|
| **Freshman Research Initiative (FRI)** | Largest program of its kind in the U.S.: ~1,100 new students a year plus ~700 returning peer mentors; 36 research "streams" of ~35 students each; 16,000+ participants over 20 years | 2026 | [O] https://news.utexas.edu/2026/04/17/for-20-years-a-ut-initiative-has-put-first-year-students-at-the-forefront-of-discovery/ ; [O] https://fri.cns.utexas.edu/about-fri |
| **IFML** | NSF AI Institute for Foundations of Machine Learning, headquartered at UT since 2020 (in the Gates-Dell Complex) | 2020– | [3P] https://heartlandforward.org/pulse/austins-position-in-the-ai-cluster-race/ ; [O] https://www.ifml.institute/node/418 |
| **Machine Learning Laboratory / Center for Generative AI** | The center launched with a 600-GPU NVIDIA H100 cluster ("Vista," hosted at TACC), later doubled to 1,000+ GPUs | 2024–25 | [O] https://news.utexas.edu/2024/01/25/new-texas-center-will-create-generative-ai-computing-cluster-among-largest-of-its-kind/ ; [O] https://www.ifml.institute/node/572 |
| "Year of AI" | UT branded 2024 as the Year of AI | 2024 | [O] https://x.com/UTAustin/status/1750596572700656057 |
| **Texas Robotics** | 16 core faculty, 40 affiliates, 200+ researchers; housed in the renovated **Anna Hiss Gym** (55,000 sq ft: motion capture studio, mock apartment, mock operating room, heavy robotics bay); undergraduate Robotics minor | 2025 | [O] UT News Gurley article ; [O] https://www.cs.utexas.edu/about |
| Campus robots | Five-year study with Boston Dynamics and Unitree robot dogs making deliveries around campus (announced Oct 2022) | 2022– | [O] https://news.utexas.edu/2022/10/17/can-robots-and-humans-co-exist-in-public-ut-campus-study-will-offer-answers/ |
| **TACC** (Texas Advanced Computing Center) | **Horizon** enters production in 2026 as the largest academic supercomputer in the U.S.: ~1 million CPU cores, 4,000 GPUs, 300 petaflops, 10× Frontera; centerpiece of the NSF Leadership-Class Computing Facility (NSF investing $457M); hosted at a data center in Round Rock | 2025–26 | [N] https://www.hpcwire.com/2025/11/19/horizon-takes-shape-at-tacc-as-nsf-leadership-class-facility-moves-forward/ ; [O] https://tacc.utexas.edu/systems/horizon/ ; [N] https://www.datacenterdynamics.com/en/news/national-science-foundation-to-invest-457m-in-computing-facility-to-house-horizon-supercomputer/ |
| **Oden Institute** | Computational science and engineering; undergrad certificate and research options; Moncrief Undergraduate Summer Internship | 2026 | [O] https://oden.utexas.edu/academics/undergraduates/ |
| **Applied Research Laboratories (ARL:UT)** | Defense-oriented university lab; paid student jobs for science and engineering undergrads at 10–15 hrs/week | 2026 | [O] https://www.arlut.utexas.edu/students.shtml |
| University research scale | $1.37B research expenditures; 154 new patent applications | FY2025 | [O] https://www.utexas.edu/about/facts-and-figures |
| **Study abroad for engineers** | Cockrell has exchange agreements with 35+ universities (KAIST, Kyoto, National Taiwan University, NUS, Melbourne, ETH Zurich, TU Munich). Faculty-led "Maymesters" of 3–9 weeks (2027 sites include Copenhagen, Madrid, Tokyo, Barcelona, Nice, Florence, Santiago, Kenya). Nearly 500 engineering students went abroad in 2024. | 2024–27 | [O] https://cockrell.utexas.edu/student-life/study-abroad/semester-programs/ ; [O] https://global.utexas.edu/news/cockrell-study-abroad-programs-enhance-engineering-skills-and-cultural-learning |
| **Graduate school pipeline** | 6% of CS grads go straight to grad school; 5-year BS/MS programs in §3; UT's own $10,000 online MSCS | 2014–2026 | [O] CNS CS career page ; [O] https://cdso.utexas.edu/mscs |
| Law / medicine in-house | UT Law is #16 (tie) in U.S. News 2026; Dell Medical School enrolls ~50 per class, with at most 10% non-residents by state law | 2026 | [3P] https://www.usnews.com/best-graduate-schools/top-law-schools/the-university-of-texas-at-austin-03155 ; [O] https://dellmed.utexas.edu/education/how-to-apply/faqs |

### Entrepreneurship

| Item | Fact | Source |
|---|---|---|
| **Longhorn Startup** | Undergraduate practicum started by Ethernet inventor Bob Metcalfe and Capital Factory founder Joshua Baer: fall seminar, spring lab, Demo Day | [N] https://thedailytexan.com/2015/09/11/students-learn-to-become-entrepreneurs-in-longhorn-startup-course/ ; https://www.siliconhillsnews.com/2014/04/25/eleven-startups-launch-out-of-uts-longhorn-startup-lab/ |
| **Jon Brumley Texas Venture Labs** | Campus-wide accelerator at McCombs; runs the TVL Investment Competition | [O] https://www.mccombs.utexas.edu/centers-initiatives/jon-brumley-texas-venture-labs/about/our-history/ |
| **Blackstone LaunchPad** | Cross-campus entrepreneurship program in Undergraduate Studies, started with a $1M Blackstone grant | [O] https://launchpad.utexas.edu/about |
| **Genesis** | ~$2M student-run startup fund | https://www.genesisut.com/ |
| **Kendra Scott Women's Entrepreneurial Leadership Institute** | Founded 2019; $13.25M endowment | [O] http://kswelinstitute.utexas.edu/about/ks-weli/ |
| **Michael Dell** | Started PC's Limited in 1984 from **Room 2713 of Dobie Center** as a UT freshman (pre-med) with about $1,000; left after freshman year | https://en.wikipedia.org/wiki/Michael_Dell ; https://www.referenceforbusiness.com/businesses/A-F/Dell-Computer-Corporation.html |
| Other Longhorn founders named in secondary lists | John Mackey (Whole Foods), Rony Kahan (Indeed). Note: Bumble's Whitney Wolfe Herd is an SMU graduate, not UT, though Bumble is Austin-based. | [3P] https://www.builtinaustin.com/articles/meet-35-ut-alumni-behind-some-austins-top-startups ; https://en.wikipedia.org/wiki/Whitney_Wolfe_Herd |
| Bill Gurley | Benchmark VC, McCombs MBA; gave $5M to Texas Robotics | [O] UT News Gurley article |
| **Y Combinator alumni from UT** | **NOT FOUND**: no authoritative list located. The only data points are that ~60 YC companies are headquartered in Austin and YC's founder directory mentions UT-educated founders without a filterable list. A "YC dropout" ending is plausible but unsourced. | [O] https://www.ycombinator.com/companies/location/austin |

---

## 10. Campus culture and in-jokes (random-event material)

Valence: **+** good for the player, **−** bad, **0** neutral or flavor.

### Wildlife and superstitions

| # | Item | One-line explanation | +/−/0 | Source |
|---|---|---|---|---|
| 1 | Albino squirrel | Seeing the white squirrel on the way to an exam means you will ace it | + | [O] https://undergraduates.utexas.edu/legend-albino-squirrel |
| 2 | It is not actually albino | The white squirrels are leucistic fox squirrels with brown eyes: "everything you know about the albino squirrel is a lie" | 0 | [N] https://thedailytexan.com/2015/03/25/science-scene-everything-you-know-about-the-albino-squirrel-is-a-lie/ |
| 3 | Albino Squirrel Preservation Society | A real student org founded at UT in 2001 that spread to other campuses | 0 | https://en.wikipedia.org/wiki/Squirrels_on_college_campuses |
| 4 | Grackle attack | Nesting grackles got aggressive enough that UT's safety office issued campus warnings | − | [N] https://thedailytexan.com/2017/06/19/aggressive-grackles-prompt-campus-warnings/ |
| 5 | Grackle poop | In the 1980s UT spent ~50 staff-hours a week cleaning up after grackles and fired blank "shell crackers" at them | − | [N] https://www.kut.org/austin/2016-03-31/that-time-ut-austin-waged-a-war-on-grackles |
| 6 | Turtle Pond | Built 1939 north of the Tower; a calm study-break spot and Tower-shooting memorial; a fundraiser symbolically named 600+ turtles | + | https://www.texasmonthly.com/travel/turtle-pond-university-texas-life-moves-slowly/ ; [N] https://thedailytexan.com/2022/08/03/ut-austin-fundraiser-symbolically-names-over-600-turtles-at-the-turtle-pond/ |
| 7 | Littlefield Fountain curse | Jump in before your graduation is confirmed and you graduate late; seniors pose in it anyway | − | [N] https://thedailytexan.com/2026/09/04/students-build-community-through-ut-superstitions/ |
| 8 | Congress Avenue bats | ~1.5 million Mexican free-tailed bats, the largest urban bat colony in the world, a short trip from campus | + | https://www.batcon.org/7-tips-for-an-unforgettable-night-at-congress-avenue-bridge/ |
| 9 | Cedar fever | December–February juniper pollen (up to 20,000 grains per cubic meter) flattens students who never had allergies | − | https://www.fox7austin.com/news/cedar-fever-season-central-texas-2024 |

### The Tower, traditions, and slogans

| # | Item | Explanation | +/−/0 | Source |
|---|---|---|---|---|
| 10 | Tower lit orange | Normally white; orange top for wins, full orange for commencement, beating A&M, or academic honors | + | https://texaslonghorns.com/sports/2013/7/28/traditions_0728133009 ; [N] https://www.statesman.com/story/news/2016/09/23/tower-power-when-and-how-does-ut-light-its-iconic-tower/10012666007/ |
| 11 | Tower "#1" | A "1" on all four sides means a national championship | + | same |
| 12 | Gone to Texas | Welcome ceremony at the Tower the night before fall classes, with band and Tower lighting | + | [O] https://longhornwelcome.utexas.edu/gone-to-texas |
| 13 | "What Starts Here Changes the World" | The slogan (in use since the mid-2000s) and a recurring essay prompt; students quote it ironically | 0 | [N] https://thedailytexan.com/2022/02/01/what-starts-here-students-discuss-university-motto-future-endeavors/ |
| 14 | "Hook 'em" | Hand sign introduced by head cheerleader Harley Clark at a 1955 Gregory Gym pep rally | + | https://texaslonghorns.com/sports/2013/7/28/traditions_0728135417 |
| 15 | "The Eyes of Texas" | Alma mater with minstrel-show origins; a 2021 UT committee found "no racist intent," which did not end the argument | − / 0 | [N] https://www.kut.org/education/2021-03-09/ut-austin-committee-determines-intent-of-the-eyes-of-texas-was-not-overtly-racist |
| 16 | "Texas Fight" | Fight song, played after touchdowns | + | https://en.wikipedia.org/wiki/Texas_Fight |
| 17 | Smokey the Cannon | Fired after every Texas score; built by UT's mechanical engineering lab in 1953; run by the Texas Cowboys | + | https://texaslonghorns.com/sports/2013/7/28/traditions_0728135646 |
| 18 | Texas Travesty | UT's official humor publication, billed as the country's largest student satire paper (since 1997) | + | https://en.wikipedia.org/wiki/Texas_Travesty |
| 19 | Round Up → "West Fest" | The spring fraternity party weekend (15,000+ people) was rebranded West Fest in 2023 to distance itself from a racist history | 0 | [N] https://thedailytexan.com/2023/02/16/roundup-event-changed-to-west-fest-to-distance-from-past/ |
| 20 | UT meme accounts | Active Instagram meme scene about West Campus, co-ops, campus news | + | [N] https://thedailytexan.com/2024/04/17/a-look-at-uts-meme-culture/ |
| 21 | "McCombs snakes" | Long-running meme that business students are snakes | 0 | https://www.sputnikatx.com/austin-startup-tips-blog/2019/3/18/ut-business-students-are-fighting-snakes-with-memes-heresnbspwhy |
| 22 | "Wampus" | Student slang for West Campus | 0 | https://en.wikipedia.org/wiki/West_Campus,_Austin,_Texas |

### Football and athletics

| # | Item | Explanation | +/−/0 | Source |
|---|---|---|---|---|
| 23 | Bevo XV | Live longhorn steer, 1,700+ lb with a 58-inch horn span, handled by the Silver Spurs | + | https://en.wikipedia.org/wiki/Bevo_(mascot) |
| 24 | Bevo banned | Bevo was barred from the 2024 SEC Championship game | − | [N] https://spectrumlocalnews.com/tx/south-texas-el-paso/news/2024/12/06/texas--bevo-barred-from-sec-championship-game |
| 25 | SEC move | Texas and Oklahoma officially joined the SEC on July 1, 2024 | + | https://www.si.com/college/texas/news/where-we-belong-texas-officially-joins-sec-alongside-oklahoma-01j1qg0qcqsh |
| 26 | DKR | Darrell K Royal–Texas Memorial Stadium seats 100,119 | 0 | https://en.wikipedia.org/wiki/Darrell_K_Royal%E2%80%93Texas_Memorial_Stadium |
| 27 | The Big Ticket | Student sports pass rose from $250 to **$270** for 2026–27, and still does not guarantee a football seat | − | [N] https://thedailytexan.com/2026/04/22/another-year-another-increase-big-ticket-price-goes-up-again-ahead-of-2026-27-school-year/ |
| 28 | Paying to get in line | Students add a Longhorn Foundation membership to claim football tickets 24 hours before regular Big Ticket holders | − | [N] same |
| 29 | Sold out | 2026 football tickets sold out before the season | − | https://texaslonghorns.com/news/2026/8/11/texas-football-tickets-sold-out-in-advance-of-2026-season |
| 30 | OU weekend | Red River Rivalry at the Cotton Bowl during the State Fair in Dallas: a separate $250 student ticket; the Oct 10, 2026 allotment is sold out | + / − | [N] Daily Texan Big Ticket article ; https://texaslonghorns.com/sports/2026/4/6/the-big-ticket-the-ticket-option-for-ut-students |
| 31 | Beat OU | Texas beat Oklahoma 23–6 in the 2025 meeting (Oct 11, 2025) | + | https://soonersports.com/news/2025/10/11/football-sooners-drop-red-river-rivalry |
| 32 | 2025 letdown | 10–3, missed the College Football Playoff, won the Citrus Bowl over Michigan | − | https://en.wikipedia.org/wiki/2025_Texas_Longhorns_football_team |
| 33 | Arch Manning | Returned for 2026 instead of the NFL; permanent hype cycle | 0 | https://www.statesman.com/sports/columns/article/arch-manning-texas-football-longhorns-2026-22352224.php |
| 34 | A&M is back | The rivalry resumed Nov 30, 2024 after 13 years: Texas won 17–7 at Kyle Field. Next: Nov 27, 2026 in College Station. | + | https://12thman.com/news/2024/11/29/rivalry-renewed-no-20-am-hosts-no-3-texas ; https://en.wikipedia.org/wiki/Texas%E2%80%93Texas_A%26M_football_rivalry |
| 35 | So close | Back-to-back CFP semifinal exits, most recently to Ohio State in the Cotton Bowl on Jan 10, 2025 | − | https://en.wikipedia.org/wiki/2025_Cotton_Bowl_Classic_(January) |
| 36 | Longhorn Network, RIP | ESPN's UT-only channel shut down in 2024 with the SEC move | 0 | https://en.wikipedia.org/wiki/Longhorn_Network |
| 37 | Moody Center | Arena that replaced the Erwin Center; opened April 2022 with two John Mayer shows; UT basketball plus major concerts next to campus | + | https://en.wikipedia.org/wiki/Moody_Center |

### Buildings and study life

| # | Item | Explanation | +/−/0 | Source |
|---|---|---|---|---|
| 38 | Jester | 3,200-bed dorm complex, the largest in North America when built (1969); had its own ZIP code, 78787, until 1986 | 0 / − | https://en.wikipedia.org/wiki/Jester_Center |
| 39 | "Jendy's" | The Wendy's inside Jester | + | same |
| 40 | J2 vs Kins | The two all-you-can-eat dining halls; reviewers call Kinsolving "slightly better: smaller, cleaner, friendlier" | 0 | https://wanderlog.com/place/details/10057977/j2-dining ; [O] https://housing.utexas.edu/spotlights/where-eat-forty |
| 41 | "The Jester Jester" | A student in a jester costume haunting Jester to promote a spirit org | 0 | [N] https://thedailytexan.com/2023/09/19/the-jester-jester-evokes-students-advertising-new-spirit-organization/ |
| 42 | PCL all-nighter | Perry-Castañeda Library is open 24 hours five days a week, with extended finals hours | 0 / − | [N] https://thedailytexan.com/2012/08/29/pcl-extends-hours-to-stay-open-overnight/ ; https://lib.utexas.edu/visit-us/library-spaces/reserve-study-room-pcl |
| 43 | Gregory Gym | "Greg": 1933 building with 250,000 sq ft of rec space and an outdoor aquatic complex | + | https://campusrecmag.com/take-a-look-inside-gregory-gym-at-the-university-of-texas-at-austin/ |
| 44 | GDC | Gates Computer Science Complex and Dell Hall (opened 2013; Bill Gates attended): atrium, three computer labs, 24+ discussion rooms, Turing lounge; CS students more or less live there | 0 | [O] https://www.cs.utexas.edu/about ; [N] https://www.kut.org/education/2013-03-06/bill-gates-helps-open-uts-new-computer-science-building |
| 45 | "GDC basement" lab culture | NOT VERIFIED as a documented phrase; the building's labs and late-night culture are real, the specific "basement" meme is not sourced | 0 | — |
| 46 | EER | Engineering Education and Research Center: 430,000 sq ft, opened 2017, three-story atrium, 23,000 sq ft maker space; the default engineering study spot | + | [O] https://news.utexas.edu/2017/09/28/new-era-begins-with-opening-of-engineering-building/ |
| 47 | Anna Hiss Gym | A historic gymnasium converted into the robotics building | + | [N] https://thedailytexan.com/2019/02/12/construction-begins-on-anna-hiss-gym-to-house-robotics-programs/ |
| 48 | Dobie | The off-campus tower where Michael Dell started Dell is now a UT residence hall | 0 | [O] https://housing.utexas.edu/housing/residence-halls/residence-hall-rates |
| 49 | Honors Quad | Honors housing for Turing, Plan II, and friends | + | [O] https://www.cs.utexas.edu/turing-scholars |

### Getting around

| # | Item | Explanation | +/−/0 | Source |
|---|---|---|---|---|
| 50 | Speedway dismount zone | From Aug 24, 2026, e-scooters and e-bikes must be walked between Guadalupe and San Jacinto from 21st to 24th Street, including the Speedway Mall; 5 mph limit there, 15 mph elsewhere | − | [N] https://www.kut.org/transportation/2026-08-11/austin-tx-university-of-texas-ebikes-scooters-dismount-zone ; [N] https://thedailytexan.com/2026/08/11/university-updates-mobility-guidelines-creates-a-new-pedestrian-friendly-zone/ |
| 51 | Scooter dies under you | Rental Lime and Bird scooters automatically power down when they enter the zone | − | [N] https://www.statesman.com/business/transportation/article/ut-austin-e-scooter-e-bike-rules-22382494.php |
| 52 | Scooter impound | $150 fee if your scooter is impounded from the Speedway Mall or Main Mall; $75 elsewhere | − | [O] https://parking.utexas.edu/transportation/electric-scooters |
| 53 | Parking permit | Student "C" permit $184 for 2026–27 (C+ $277); the range runs up to $1,027 | − | [O] https://parking.utexas.edu/parking/student-parking |
| 54 | Parking ticket | UT citations run $15–$75 by tier | − | https://www.utsystem.edu/offices/police/system-parking-rules/parking-offense-fines |
| 55 | Donations for Citations | Each April you can pay off qualifying tickets with canned food and baby wipes | + | [O] https://parking.utexas.edu/donations |
| 56 | City tickets too | Austin started enforcing higher parking fines in 2025 | − | [N] https://thedailytexan.com/2025/03/12/city-of-austin-enforcing-higher-parking-fines/ |
| 57 | CapMetro shuttle cuts | From Aug 16, 2026 the Far West (661) and North Riverside (670) UT shuttles run every 15–20 minutes instead of 8–10 | − | [O] https://www.capmetro.org/servicechange/august-2026-service-changes ; [N] https://www.kxan.com/traffic/transportation/capmetro-proposes-austin-bus-route-adjustments-including-ut-shuttle-cuts/ |
| 58 | Waymo | Driverless Waymos have been bookable through Uber in Austin since March 2025; federal regulators later asked about them passing stopped school buses in Austin | 0 | [N] https://www.statesman.com/story/news/state/2025/03/06/waymo-uber-austin-texas-how-to-request-ride/81636306007/ ; https://techcrunch.com/2025/12/04/feds-ask-waymo-about-robotaxis-repeatedly-passing-school-buses-in-austin/ |
| 59 | Tesla Robotaxi | Launched in Austin on June 22, 2025 with a safety monitor in the passenger seat | 0 | https://www.cnbc.com/2025/06/23/tesla-stock-robotaxi-austin.html |
| 60 | Robot dogs | Research robot dogs deliver things around campus as part of a five-year study | + | [O] https://news.utexas.edu/2022/10/17/can-robots-and-humans-co-exist-in-public-ut-campus-study-will-offer-answers/ |

### Weather

| # | Item | Explanation | +/−/0 | Source |
|---|---|---|---|---|
| 61 | Winter Storm Uri | February 2021: days without power or water; dorms ran short of food and toilets would not flush | − | [N] https://www.texastribune.org/2021/02/18/texas-universities-power-outages-dorms/ |
| 62 | 2023 ice storm | Classes canceled; about half of campus trees (~2,500) damaged; long power outages | − | [N] https://thedailytexan.com/2023/02/09/students-ut-campus-deal-with-damages-following-last-weeks-winter-storm/ |
| 63 | Heat | 2023 had 78 triple-digit days, including a record 45 in a row | − | https://www.kxan.com/weather/weather-blog/july-2023-100-degrees-streak/ |
| 64 | Flash flood | Waller Creek runs through campus and floods fast; flash flooding near campus is routine local news | − | [O] https://sustainability.utexas.edu/campus-sustainability/self-guided-green-tours/walking-waller-creek-self-guided-tour ; https://www.kxan.com/video/flash-flooding-near-university-of-texas-campus-on-wednesday-afternoon/10876573/ |
| 65 | Barton Springs | Spring-fed pool; the standard heat remedy | + | https://www.austintexas.gov/services/visit-barton-springs-pool |

### Austin, housing, and food

| # | Item | Explanation | +/−/0 | Source |
|---|---|---|---|---|
| 66 | ACL | Austin City Limits festival, two weekends in Zilker Park (Oct 2–4 and Oct 9–11, 2026), right at midterms; weekend two collides with OU weekend | + / − | https://tribeza.com/events/austin-city-limits-music-festival-2026/ |
| 67 | SXSW | March 12–18, 2026, shortened by two days with the second music weekend eliminated | + | https://sxsw.com/news/2025/see-you-next-year-sxsw-2026-dates-announced/ ; https://www.statesman.com/story/entertainment/music/2025/03/16/sxsw-2026-dates-new-schedule-early-bird-discount-badges-on-sale/78979562007/ |
| 68 | Sixth Street | "Dirty Sixth" reopened to weekend-night car traffic in January 2025 after years of closures, with new barricades and wider sidewalks | 0 | [N] https://www.kut.org/austin/2025-01-15/6th-street-will-reopen-to-vehicles-this-weekend-with-new-safety-measures-in-place |
| 69 | Rainey Street | Old bungalows turned into bars; the older-student alternative to Sixth | + | https://en.wikipedia.org/wiki/Rainey_Street_Historic_District |
| 70 | The Drag | Guadalupe Street along the west edge of campus; the name comes from horse-drawn trolleys | 0 | [N] https://www.kut.org/austin/2020-08-27/why-is-the-stretch-of-guadalupe-that-runs-parallel-to-ut-campus-called-the-drag |
| 71 | West Campus rent | One-bedroom median 65% above the city's while city rents fell | − | [N] https://thedailytexan.com/2024/02/09/west-campus-rent-rates-surge-amid-decrease-in-austin-area-rent-prices/ |
| 72 | Move-in delayed | Rise at West Campus told residents about four weeks before move-in that the building would not be ready (2023) | − | [N] https://thedailytexan.com/2023/08/07/rise-at-west-campus-delays-move-in-date/ |
| 73 | Move-in delayed, again | A second new West Campus building emailed a delay the night before move-in day (Aug 2023) | − | https://www.fox7austin.com/news/ut-austin-delayed-move-in-rambler-apartment |
| 74 | Overbooked | A West Campus complex overbooked and left students without units | − | https://www.kxan.com/news/local/austin/ut-students-left-in-a-pinch-after-west-campus-apartment-complex-overbooks/ |
| 75 | Flooded out | A 2026 flood in a West Campus apartment tower sent dozens of residents to a hotel to start the semester | − | [N] https://thedailytexan.com/2026/02/26/west-campus-apartment-flood-leaves-residents-to-start-semester-in-hotel-rooms/ |
| 76 | Surprise remodel | A mid-semester remodel displaced residents of 23 units with 12 days' notice (2024) | − | [N] https://thedailytexan.com/2024/03/08/remodeling-project-in-west-campus-apartment-disrupts-residents-forces-temporary-relocation/ |
| 77 | Lease a year ahead | Pre-leasing pressure is bad enough that the UT Tenants' Union asked the city to restrict early leasing contracts | − | [N] https://thedailytexan.com/2025/03/06/ut-tenants-union-recommends-austin-imposes-restrictions-accountability-measures-for-early-leasing-contracts/ |
| 78 | Kerbey Lane | Guadalupe diner known for Kerbey Queso and late-night pancakes; returned to 24 hours on weekends in 2021 | + | [N] https://thedailytexan.com/2021/12/15/kerbey-lane-goes-back-to-24-hours-on-fridays-and-saturdays/ |
| 79 | Torchy's Tacos | Started as an Austin food truck in 2006; now 125+ locations | + | https://en.wikipedia.org/wiki/Torchy's_Tacos |
| 80 | Whataburger | Texas chain founded in Corpus Christi in 1950; the 2 a.m. default | + | https://en.wikipedia.org/wiki/Whataburger |
| 81 | H-E-B | The Texas grocery chain (founded Kerrville, 1905); object of statewide devotion | + | https://en.wikipedia.org/wiki/H-E-B |
| 82 | Buc-ee's | Road trips home are planned around the beaver | + | https://roadtripbeaver.com/texas-bucees-road-trip |
| 83 | In-N-Out and Kerbey by Duren | UT Housing itself lists them as dorm-adjacent staples | + | [O] https://housing.utexas.edu/spotlights/where-eat-forty |

### Tech, registration, and campus politics (2024–2026 news)

| # | Item | Explanation | +/−/0 | Source |
|---|---|---|---|---|
| 84 | Free Claude and ChatGPT | From June 2026 every student, faculty, and staff member gets ChatGPT Edu and Claude for Education free with their EID, alongside Copilot and Gemini | + | [N] https://thedailytexan.com/2026/06/22/claude-chatgpt-now-free-for-ut-community/ |
| 85 | UT Sage | UT's homegrown AI tutor built with AWS: instructors configure Socratic-style course tutors | + / 0 | [O] https://tech.utexas.edu/news/ut-austin-and-aws-launch-ut-sage-ut-austins-homegrown-ai-tutor-platform |
| 86 | UT Spark, RIP | UT's own free AI chat platform, launched for Fall 2025 and retired July 1, 2026 | 0 | [N] https://thedailytexan.com/2025/08/21/university-launches-official-ai-platform-for-students-faculty-free-of-cost/ ; [N] Daily Texan June 2026 article above |
| 87 | Canvas hacked during finals | In May 2026 a cyberattack on Canvas's vendor (ShinyHunters claimed 275 million records from ~9,000 schools) took Canvas down in finals week across the UT System; exams were rescheduled | − | [O] https://tech.utexas.edu/news/canvas-vendor-security-incident-may-2026 ; https://www.kltv.com/2026/05/08/cyberattack-potentially-affects-thousands-schools-during-finals/ |
| 88 | Canvas down (AWS) | An Oct 20, 2025 AWS outage took down Canvas, Gradescope, and friends for ~17 hours; at least one large midterm was postponed | + / − | [N] https://thedailytexan.com/2025/10/20/why-is-canvas-down/ |
| 89 | Wi-Fi outage | Campus-wide Wi-Fi outage acknowledged by UT's official account (May 2025) | − | https://x.com/UTAustin/status/1924817279788687856 |
| 90 | Registration roulette | Your access slot depends on hours earned; 60,000+ students lean on a student-built Chrome extension to survive it | − | [O] https://www.cs.utexas.edu/news/2026/longhorn-developers-discord-server-campus-institution |
| 91 | Quest | Paying $30 a course for UT's own homework system | − | [N] https://thedailytexan.com/2020/10/07/paid-homework-program-quest-raises-financial-concerns-for-ut-austin-students/ |
| 92 | School of Computing | CS, statistics, and the iSchool merged into one school in Fall 2026 | 0 | [O] UT News Feb 2026 article |
| 93 | Horizon | UT now hosts the largest academic supercomputer in the country | + | [N] hpcwire article above |
| 94 | Auto-admit squeeze | The cutoff fell to top 5% as applications approached 100,000 | 0 | [N] KUT article in §1 |
| 95 | New president | Jay Hartzell left to run SMU (announced Jan 2025); Jim Davis, the former COO, went from interim to president in August 2025 | 0 | [N] https://www.texastribune.org/2025/01/07/texas-ut-austin-smu-jay-hartzell/ ; [N] https://www.kut.org/education/2025-02-19/ut-austin-interim-president-jim-davis-board-of-regents |
| 96 | Faculty senate abolished | Under Texas SB 37 the UT System let faculty senates lapse (Aug 2025) | − | [N] https://www.texastribune.org/2025/08/21/university-texas-system-faculty-senates-protests-campus-speech/ |
| 97 | Protest rules | The same 2025 changes restricted campus protest; students sued and rallied at the Capitol | − | [N] https://www.kut.org/politics/2025-09-05/austin-tx-university-of-texas-system-state-law-free-speech-protests |
| 98 | Department consolidations | Students protested UT's 2026 consolidation of ethnic and gender studies departments | − | https://www.kvue.com/article/news/education/university-of-texas/student-protest-ut-austin-consolidation-liberal-arts-departments/269-fe78ec4b-a70e-492c-8534-7edd497a7fa5 |
| 99 | The Compact | UT stayed publicly silent past the deadline on the federal "compact" offered to select universities (Nov 2025) | 0 | [N] https://www.texastribune.org/2025/11/17/university-of-texas-trump-policy-changes-federal-funding/ |
| 100 | April 2024 protests | Pro-Palestinian protests ended in mass arrests by state troopers on the South Lawn | − | https://en.wikipedia.org/wiki/2024_University_of_Texas_at_Austin_pro-Palestinian_campus_protests |
| 101 | Career fair season | Engineering Expo (300+ employers, 6,000 students) and the CNS fair land in the same September week as the first exams | + / − | [O] Cockrell Expo page ; [O] CNS career fair page |
| 102 | Q-drop | Six for life, plus one "One-Time Exception" panic button | + | [O] One Stop add/drop page |
| 103 | One A− | No A+ exists, so a single A− ends the 4.0 that internal transfer folklore says you need | − | [O] plus/minus page ; [C] texadmissions internal transfer article |

---

## 11. Endings unique to UT and Texas

| Ending | Grounding facts | Source |
|---|---|---|
| **Big Tech in Austin** (never leave) | Apple (13,000+ in Texas), Amazon (~5,000), Google (~2,500), Meta (~1,000), Oracle (~2,000), Indeed (3,000+), IBM (~6,000). McCombs median base in Austin is the lowest of its regions at $75,000. | [3P] austinapartmentlocators list ; [O] McCombs salary page |
| **Tesla Giga Texas** | ~16,500 employees; also the Robotaxi launch city | [3P] same ; CNBC article in §10 |
| **Semiconductors: Samsung Taylor** | Taylor Fab 1 began production in 2026 on a 2 nm process for Tesla's AI5 chip (volume in H2 2027); Fab 2 construction to start late 2026 for 2030 production | https://electrek.co/2026/07/13/samsung-taylor-fab-tesla-ai5-chip-2nm/ ; https://www.koreatimes.co.kr/amp/business/companies/20260730/samsung-to-begin-construction-of-2nd-chip-fab-in-texas-at-end-of-2026 |
| **Semiconductors: TI / AMD / NXP** | Texas Instruments opened its first 300 mm fab in Sherman in December 2025 (a site billed at up to $40B); AMD has ~2,400 in Austin | [N] https://www.dallasnews.com/business/2025/12/18/texas-instruments-opens-first-semiconductor-factory-at-massive-sherman-site/ ; [3P] austinapartmentlocators list |
| **Houston oil and gas** | Petroleum engineering is UT's #1-ranked and best-paid engineering BS ($104,539); Chevron is an FoCS partner | [O] Cockrell salary and ranking pages ; [O] FoCS page |
| **Houston energy investment banking** | UT, Rice, and A&M feed Houston energy groups; Houston median base for McCombs grads is $92,500 | [3P] ibinterviewquestions guide ; [O] McCombs salary page |
| **Dallas consulting / corporate** | Consulting takes 19.7% of BBA offers; Dallas median $80,000 | [O] McCombs salary page |
| **Wall Street / West Coast escape** | Northeast median $110,000; West $100,000 | [O] same |
| **Quant trading** (Chicago, NYC, or Optiver Austin) | Citadel, HRT, and Jane Street sponsor UT CS; 17% of CS grads enter financial services; intern pay around $150/hr at top shops | [O] FoCS page ; [O] CS careers page ; [3P] levels.fyi |
| **DFW defense** | Lockheed Martin employs ~20,000 in Fort Worth (every F-35 is built there) and ~4,800 in Grand Prairie; Bell 5,000+; RTX 6,000+ in North Texas (Raytheon in McKinney, Collins in Richardson); L3Harris in Greenville, Plano, Arlington. Lockheed is an FoCS partner. | https://dallasinnovates.com/north-texas-defense-industry-drives-35-3b-economic-impact-study-says/ ; [O] FoCS page |
| **NASA JSC / space** | Aerospace is a top-10 program ($81,227 average); student teams have flown satellites and work with Firefly. Specific NASA Johnson hiring numbers NOT FOUND. | [O] Cockrell pages ; [O] AE teams page |
| **ARL:UT / Sandia** (cleared research) | ARL:UT hires students; Sandia is an FoCS partner | [O] ARL page ; [O] FoCS page |
| **Stay for the fifth year** | Integrated BS/MS in CS (150 hours), BSECE/MSE, iMPA | [O] §3 sources |
| **Online master's while working** | UT's MSCS online costs $10,000 total | [O] https://cdso.utexas.edu/mscs |
| **Law school** | UT Law is #16 (tie); Plan II and Liberal Arts Honors are the classic feeders | [3P] U.S. News link in §9 ; [O] Plan II FAQ |
| **Med school** | Dell Med takes ~50 a year; 0.3% of CS grads go to medical school | [O] Dell Med FAQ ; [O] CNS CS career page |
| **PhD** | 6% of CS grads go straight to grad school; Turing requires a thesis and a defense "resembling PhD defense preparation" | [O] CNS CS career page ; [O] Turing page |
| **Founder / dropout** | Michael Dell left after freshman year from Dobie 2713; Genesis fund, Longhorn Startup, Texas Venture Labs; ~60 YC companies are based in Austin | §9 sources |
| **Still seeking** (unemployed) | 11% of CS grads report "seeking employment" at graduation (2014–2023 pooled) | [O] CNS CS career page |
| **Moved back in with parents** | UT's own budget prices living with parents at $7,910 a year for housing and food versus $15,420+ on your own; 80.5% of students are Texans, mostly from the big metros | [O] One Stop cost of attendance ; [O] UT News 2025 |
| **Never got the major** | Graduates from Liberal Arts / Economics / Informatics after two failed internal transfers (two-attempt cap) | [O] CNS internal transfer page |
| **Kicked out of CS** | Failing to clear CS 312 / 311 / 314 with a C− in two attempts blocks upper-division CS | [O] https://cs.utexas.edu/node/69868 |
| **Academic dismissal** | Cumulative GPA under 2.00 → academic warning → dismissal by the hours table | [O] catalog page in §5.2 |
| **Expelled** | Expulsion is an available sanction for academic integrity violations | [O] catalog Chapter 11 |
| **Transferred out** | A CAP student who cannot get into CS, engineering, or business may need "to transfer a second time away from UT" (UT Dallas and Texas A&M are the usual CS / engineering backups) | [C] texadmissions CAP article ; [C] texadmissions CS-alternatives article |
| **Never made it to Austin** | CAP at UTSA / UTA, TAP at St. Edward's, or the ACC Spring Start | [O] §1.8 sources |

---

## 12. Not found, conflicting, or unverified (read before hard-coding numbers)

| Item | Status |
|---|---|
| Official CS freshman admit rate | **Not published by UT.** Best estimate ~5–10% (consultant), ~700 admits from 10,000–13,000 applicants. |
| Per-major Cockrell admit rates | Not published. Only a consultant's three-tier ordering plus a weak-source ECE figure of 10–15%. |
| McCombs admit rates | 14% (F2023) and 11% (F2024) come from McCombs info sessions via a consultant, not a public UT page. The F2025 ~8% is that consultant's estimate. |
| Fall 2026 overall admit rate and admit count | Not found. My ~19–20% figure is an estimate from applications, class size, and prior-year yield. |
| UT-wide SAT / ACT middle 50% | UT leaves the Common Data Set field blank. The 1230–1500 range is third-party. |
| In-state vs out-of-state admit rates (35.9% / 7.5%) | Third-party reading of the 2025–26 CDS; I did not open the CDS itself. |
| Turing Scholars current acceptance rate | Not found. The 127 / 1,192 figure is roughly a decade old. Cohort ~50. |
| Texas CSB and ECB admit rates; Health Science Scholars, ECE Honors, Jefferson Scholars cohort sizes | Not found. |
| Texas Robotics honors cohort | Two official UT figures conflict: "~50 slots, 3,500+ applications" (UT News, Mar 2025) vs "100 spots, nearly 7,000 applicants" (UT's X account, Nov 2024). |
| Internal transfer acceptance rates | **None are official.** CS: "a third" to "40–50%" (consultant, 2020-era) vs "~5%" (weak source). Cockrell ~45–67% (2017–18, consultant). McCombs "40%" vs "10–15%". Treat all as soft. |
| McCombs internal transfer requirements | Taken from consultant posts (2018, 2020); the current official McCombs page was not retrieved. |
| Number of CS undergraduate majors | Not found officially; 2,600–2,800 is a third-party figure. |
| Official top-employer lists for CS and BBA | Not retrieved (CNS keeps them in downloads; McCombs page did not list them). |
| CS intern pay at UT | Not found. Only market references from levels.fyi. |
| McCombs career fair details, placement rate | Not found. |
| McCombs salary by job function (investment banking share and pay) | Seen only in a search summary with implausible values; excluded. |
| McCombs specialty rankings by major | From a search summary; not confirmed against U.S. News directly. |
| Tuition by college | Official table did not render in the fetch tool; figures are the search engine's extraction of that page and agree with the official annual ranges. Liberal Arts resident rate is inferred. |
| Dismissal GPA table | Same situation: extracted from the catalog page by the search engine, not read directly. |
| Austin employer headcounts | Single secondary compilation; approximate. |
| Trading firms in Austin other than Optiver | Secondary listings only. |
| UT Spark launch date | Daily Texan's Aug 2025 article announces it; a later article's summary said 2024. I used Fall 2025. |
| Official student-worker minimum wage | Not found. |
| Impact Scholarship and Terry award amounts | From a school-district news item and a 2015 UT article; possibly stale. |
| Y Combinator alumni from UT | No authoritative list found. Do not name specific YC companies as UT-founded without checking. |
| "GDC basement" as a named meme; r/UTAustin-specific memes | Could not source. Reddit was not directly searchable; the meme items above come from Daily Texan coverage and Wikipedia. |
| NASA JSC hiring numbers from UT | Not found. |
| 2026 football season results | Deliberately omitted: search results for the Oct 2026 Red River game were inconsistent (the game is scheduled for Oct 10, 2026, after this research date). The 23–6 win over Oklahoma is the **2025** game. |
