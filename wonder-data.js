/* ============================================================
   WONDER BOOK CLUB — CORE DATA
   Week 1 content, NZC alignment, rubric criteria and marking guide.
   (Weeks 2–9 and Week 10 live in wonder-content.js.)
   Moved out of index.html unchanged during the redesign.
   ============================================================ */
/* ============ DATA ============ */
const WEEKS_META = window.WEEKS_META;
const WEEK10 = window.WEEK10;

const week1 = {
  learningIntention:"We can identify how a character's perspective shapes how a story is told, and infer a character's feelings from what they say and don't say.",
  successCriteria:"I can describe August's feelings about starting school and give evidence from the text; I can make a prediction based on clues in the story.",
  mon:{
    mode:"teach", label:"Monday", icon:"📖", modeLabel:"Teacher read",
    range:"Ordinary → Christopher's House",
    leadIn:["If a genie granted you one wish, what would it be — and why?","Do you think everyone's answer would be different?"],
    comprehension:[
      "Why does August say he's “not an ordinary kid” but also feels ordinary inside?",
      "What does this tell us about the difference between how people see us and how we see ourselves?",
      "Why do you think August avoids describing exactly what he looks like?"
    ],
    goAway:"Write 3 sentences about something people might misjudge about you before they get to know you.",
    rubric:["R1","R3","R8"],
    rubricNote:"Listen for R1 (inferring August's feelings with evidence) and R8 (predicting/reasoning) during the comprehension discussion."
  },
  tue:{
    mode:"group", label:"Tuesday", icon:"👥", modeLabel:"Group read",
    range:"Driving → Nice Mrs. Garcia",
    leadIn:["How would you feel meeting a brand-new school and brand-new people for the very first time, aged 10?"],
    comprehension:[
      "Why is August's mum being so protective before the school tour?",
      "What clues tell us Mr. Tushman is trying to make August feel comfortable?"
    ],
    goAway:"Describe one adult in your life who makes you feel safe when you're nervous, and how they do it.",
    rubric:["R4","R7","R9"],
    rubricNote:"Tick off R7 (turn-taking, listening) as groups read together, and R4/R9 from their written answers."
  },
  wed:{
    mode:"teach", label:"Wednesday", icon:"📖", modeLabel:"Teacher read",
    range:"Jack Will, Julian, and Charlotte → The Deal",
    leadIn:["If you had to show a new student around your school, what three things would you point out first?"],
    comprehension:[
      "What is “the deal” Mr. Tushman makes, and why might that be a smart plan — or an unfair one?",
      "Compare Jack, Julian, and Charlotte's first reactions to August — what's different about each?"
    ],
    goAway:"Predict which of the three kids will become August's real friend. Give one clue from the text to back up your guess.",
    rubric:["R1","R2","R8"],
    rubricNote:"R2 shows well here — comparing how three different characters react gives a clear window into structure/perspective. Watch for R1 and R8 in predictions."
  },
  thu:{
    mode:"group", label:"Thursday", icon:"👥", modeLabel:"Group read",
    range:"Home → Locks",
    leadIn:["Think of your own first day at a new place (school, club, team). What worried you most?"],
    comprehension:[
      "Why might August feel both excited and terrified on the night before school?",
      "What does the “combination lock” scene reveal about how nervous he is?"
    ],
    goAway:"Write a short diary entry as August, the night before his first day.",
    rubric:["R4","R5","R7"],
    rubricNote:"The diary entry is a strong R5 checkpoint — look for students writing convincingly in August's voice."
  },
  fri:{
    mode:"quiz", label:"Friday", icon:"📝", modeLabel:"Quiz day",
    rubric:["R2","R6","R10"],
    rubricNote:"Quiz results are your best R6 evidence. Use today to update all of this week's rubric criteria (R1–R10) based on the week's work."
  }
};

const projects1 = [
  {icon:"🖼️", title:"Poster", desc:"Design a “Welcome to Beecher Prep” poster from Mr. Tushman's office, including at least 3 things a new student should know."},
  {icon:"💬", title:"Comic strip", desc:"6-panel comic showing August's morning routine before his first day of school."},
  {icon:"🎭", title:"Drama scene", desc:"Act out the car ride to school (Driving) in groups of 3 — August, Mum, Dad — showing the mixed emotions."},
  {icon:"📓", title:"Journal reflection", desc:"Write a letter from August to his future self, to be read on his last day of Year 5."}
];

const quiz1 = [
  {type:"mc", q:"What does August say makes him “ordinary”?", opts:["He does ordinary kid things: eats ice cream, rides his bike, plays video games","He has an ordinary looking face","He goes to an ordinary school","He has an ordinary house"], correct:0},
  {type:"mc", q:"How many surgeries has August had by the story's start?", opts:["15","27","32","9"], correct:1},
  {type:"mc", q:"Why has August never been to a real school before?", opts:["His family couldn't afford school","There was no school near his house","His surgeries and his parents' choice to homeschool him","He was too advanced academically"], correct:2},
  {type:"mc", q:"Who is Christopher?", opts:["August's cousin","August's neighbour","August's teacher","August's childhood best friend, who moved away"], correct:3},
  {type:"mc", q:"What game did August and Christopher love playing together?", opts:["Chess","Star Wars, with action figures/lightsabers","Basketball","Board games only"], correct:1},
  {type:"mc", q:"What school is August about to start at?", opts:["Beecher Prep","Elm Street Elementary","Riverside School","Wonder Academy"], correct:0},
  {type:"short", q:"What joke does August's dad make before the school visit?", model:"About Mr. Tushman's funny surname over the loudspeaker."},
  {type:"mc", q:"Who works the front desk and everyone calls “Mrs. G”?", opts:["Mrs. Garcia","Mrs. Tushman","Mrs. Will","Mrs. Albans"], correct:0},
  {type:"short", q:"Name the three students Mr. Tushman picks to show August around.", model:"Jack Will, Julian, and Charlotte."},
  {type:"short", q:"What is “the deal” Mr. Tushman makes with the three students?", model:"He asks them to be welcoming, show August around, and be kind to him."},
  {type:"short", q:"Which of the three seems most reluctant or awkward about meeting August?", model:"Accept reasoned answers — e.g. Julian seems standoffish."},
  {type:"short", q:"What does August worry about most on the night before school starts?", model:"Fitting in, being stared at, whether kids will be nice."},
  {type:"mc", q:"What object does August struggle with the night before school (mentioned in “Locks”)?", opts:["His backpack zipper","His shoelaces","His combination lock","His watch"], correct:2},
  {type:"short", q:"Inference: Why might August's parents have waited until Year 5 (age 10) to send him to school?", model:"Accept reasoned answers: enough surgeries were done, they wanted to protect him, they felt he was ready."},
  {type:"short", q:"Inference: What does it suggest about August's character that he still makes jokes with his dad despite being nervous?", model:"Accept reasoned answers: good sense of humour, resilience, close family bond."},
  {type:"mc", q:"Vocabulary: What does “petrified” mean, as August uses it about starting school?", opts:["Extremely frightened","Extremely tired","Turned to stone","Very excited"], correct:0},
  {type:"mc", q:"True or False: August has an older sister named Via.", opts:["True","False"], correct:0},
  {type:"short", q:"Why do you think the author chose to start the book from August's own point of view?", model:"Accept reasoned answers: to build empathy, to show his inner ordinary self before others judge his appearance."},
  {type:"short", q:"In your own words, what is “The Deal” really asking the three students to do, and why might that be hard for a Year 5 student?", model:"Open answer — mark for understanding of peer pressure and social risk."},
  {type:"short", q:"Reflection: In your own words, describe how August might be feeling as he walks into Beecher Prep for the very first time.", model:"Open answer — mark for empathy and use of textual evidence."}
];

/* Merge Week 1 (hardcoded) with Weeks 2-9 (loaded from wonder-content.js) */
const WEEK_CONTENT = Object.assign({1: week1}, window.WEEK_CONTENT_2_9 || {});
const PROJECTS = Object.assign({1: projects1}, window.PROJECTS_2_9 || {});
const QUIZZES = Object.assign({1: quiz1}, window.QUIZZES_2_9 || {});

const NZC_ALIGNMENT = {
  strands:[
    {name:"Listening, Reading, and Viewing", points:[
      "Ideas — Show understanding of ideas within, across, and beyond texts.",
      "Structure and Language — Show understanding of how texts are shaped for different purposes and audiences.",
      "Processes and Strategies — Integrate sources of information, processes, and strategies confidently to identify, form, and express ideas."
    ]},
    {name:"Speaking, Writing, and Presenting", points:[
      "Ideas — Select, form, and communicate ideas on a range of topics.",
      "Structure and Language — Show understanding of language features, using them appropriately.",
      "Processes and Strategies — Select and use processes and strategies to communicate confidently."
    ]}
  ],
  competencies:"Relating to Others, Thinking, Managing Self, Participating & Contributing",
  values:"Diversity, inclusion, empathy, respect — supporting the NZC vision of confident, connected, actively involved, lifelong learners.",
  cross:"Health & PE — Relationships and Hauora (wellbeing), especially around the “Choose Kind” theme."
};

const TIMING = ["5 min · Settle & lead-in","15–20 min · Reading","15 min · Comprehension/inference","5 min · Go-away reflection"];

const RUBRIC_LEVELS = ["Beginning","Developing","Achieving","Extending"];
const RUBRIC_CRITERIA = [
  {code:"R1", strand:"Listening/Reading/Viewing · Ideas", title:"Understanding ideas in the text", ev:"Identifies character feelings and ideas within, across and beyond the text, with evidence."},
  {code:"R2", strand:"Listening/Reading/Viewing · Structure & Language", title:"How the text is shaped", ev:"Notices how narration, chapter structure or multiple viewpoints shape the story."},
  {code:"R3", strand:"Listening/Reading/Viewing · Processes & Strategies", title:"Comprehension strategies", ev:"Uses prediction, inference and questioning strategies to build understanding."},
  {code:"R4", strand:"Speaking/Writing/Presenting · Ideas", title:"Communicating ideas", ev:"Selects and shares ideas clearly in written responses, discussion and reflection."},
  {code:"R5", strand:"Speaking/Writing/Presenting · Structure & Language", title:"Using language features", ev:"Uses appropriate vocabulary, voice and sentence structure (e.g. writing in character)."},
  {code:"R6", strand:"Speaking/Writing/Presenting · Processes & Strategies", title:"Communicating with confidence", ev:"Plans, drafts and presents ideas confidently, including under quiz/assessment conditions."},
  {code:"R7", strand:"Key Competency · Relating to Others", title:"Working with others", ev:"Listens, takes turns and responds respectfully during group reading and discussion."},
  {code:"R8", strand:"Key Competency · Thinking", title:"Critical & creative thinking", ev:"Asks questions, makes predictions and reasons through inference tasks."},
  {code:"R9", strand:"Key Competency · Participating & Contributing", title:"Taking part", ev:"Completes tasks, contributes to group work and engages with weekly projects."},
  {code:"R10", strand:"Values · Diversity, Inclusion, Empathy, Respect", title:"“Choose Kind” values", ev:"Shows empathy and makes connections to kindness/inclusion themes in discussion and writing."}
];

/* ============ MARKING GUIDE (teacher pack) — 3-level version with exemplars ============
   A simplified, classroom-friendly version of the 10 rubric criteria above, for quick and
   consistent marking: Not Achieved / Working Towards / Achieved, each with a short example
   of what that actually looks like from a student, so marking stays fast and unambiguous. */
const MARKING_LEVELS = ["Not Achieved","Working Towards","Achieved"];
const MARKING_GUIDE = [
  {code:"R1", title:"Understanding ideas in the text", strand:"Listening, Reading & Viewing — Ideas",
   expectation:"Shows understanding of ideas within, across, and beyond texts (NZC Level 3–4).",
   notAchieved:"Retells simple events from the story but cannot identify a character's feelings or the ideas behind them, even with prompting.",
   workingTowards:"Identifies a character's feelings or a key idea with some prompting, but explanations are vague or not clearly linked to evidence from the text.",
   achieved:"Clearly identifies characters' feelings, motivations and ideas within, across and beyond the text, and supports this with specific evidence — e.g. explains why August feels “ordinary” inside despite how others see him, using a direct example from the chapter."},
  {code:"R2", title:"How the text is shaped", strand:"Listening, Reading & Viewing — Structure & Language",
   expectation:"Shows understanding of how texts are shaped for different purposes and audiences (NZC Level 3–4).",
   notAchieved:"Does not notice or comment on how the story is structured (e.g. chapter titles, multiple narrators), even when asked directly.",
   workingTowards:"Notices an obvious structural feature (e.g. that Via narrates Part Two) but cannot yet explain why the author made that choice.",
   achieved:"Explains how the author's choices — multiple narrators, chapter titles, changing points of view — shape the reader's understanding, e.g. explains why seeing events through Via's eyes changes what we know about August's family."},
  {code:"R3", title:"Comprehension strategies", strand:"Listening, Reading & Viewing — Processes & Strategies",
   expectation:"Integrates sources of information, processes, and strategies confidently to identify, form and express ideas (NZC Level 3–4).",
   notAchieved:"Rarely predicts or questions the text; needs the answer given rather than working it out.",
   workingTowards:"Makes simple predictions or asks questions about the text, but these are not always well reasoned or linked to clues in the story.",
   achieved:"Confidently uses prediction, inference and questioning to build understanding, e.g. predicts which character will become August's real friend and backs it up with a specific clue from the text."},
  {code:"R4", title:"Communicating ideas", strand:"Speaking, Writing & Presenting — Ideas",
   expectation:"Selects, forms, and communicates ideas on a range of topics (NZC Level 3–4).",
   notAchieved:"Written or spoken responses are very brief, off-topic, or do not answer the question asked.",
   workingTowards:"Shares an idea in response to a question, but it is underdeveloped or only partly relevant.",
   achieved:"Selects and communicates a clear, relevant idea in response to questions and discussion, developing it with detail or reasoning, e.g. writes a well-developed go-away reflection that stays on topic and includes personal detail."},
  {code:"R5", title:"Using language features", strand:"Speaking, Writing & Presenting — Structure & Language",
   expectation:"Shows understanding of language features, using them appropriately (NZC Level 3–4).",
   notAchieved:"Writing shows little control of vocabulary, voice or sentence structure appropriate to the task, e.g. cannot write convincingly “in character.”",
   workingTowards:"Attempts to use appropriate vocabulary or voice (e.g. writing as August or Via) but this is inconsistent through the piece.",
   achieved:"Uses vocabulary, voice and sentence structure appropriate to the task — e.g. writes a diary entry convincingly in a character's voice, sustained through the whole piece."},
  {code:"R6", title:"Communicating with confidence", strand:"Speaking, Writing & Presenting — Processes & Strategies",
   expectation:"Selects and uses processes and strategies to communicate confidently (NZC Level 3–4).",
   notAchieved:"Struggles to complete written tasks (e.g. the Friday quiz) independently and with confidence, even with support.",
   workingTowards:"Completes most written tasks and quiz questions but needs some support or reassurance to finish confidently.",
   achieved:"Plans, drafts and completes written tasks and quiz responses independently and confidently, including under timed/quiz conditions."},
  {code:"R7", title:"Working with others", strand:"Key Competency — Relating to Others",
   expectation:"Listens, takes turns and responds respectfully during group reading and discussion.",
   notAchieved:"Struggles to take turns or listen respectfully during group reading; often distracts or disengages the group.",
   workingTowards:"Takes turns and listens most of the time, but sometimes needs a reminder to include others or stay on task.",
   achieved:"Consistently listens, takes turns fairly and responds respectfully to others' ideas during group reading and discussion."},
  {code:"R8", title:"Critical & creative thinking", strand:"Key Competency — Thinking",
   expectation:"Asks questions, makes predictions and reasons through inference tasks.",
   notAchieved:"Rarely asks questions or offers reasoning; accepts the first idea given without thinking further.",
   workingTowards:"Sometimes asks questions or offers a reasoned idea, but doesn't always explain the thinking behind it.",
   achieved:"Regularly asks thoughtful questions, makes reasoned predictions and explains their thinking clearly during inference tasks."},
  {code:"R9", title:"Taking part", strand:"Key Competency — Participating & Contributing",
   expectation:"Completes tasks, contributes to group work and engages with weekly projects.",
   notAchieved:"Rarely completes tasks or contributes to group work or the weekly project without significant prompting.",
   workingTowards:"Completes most tasks and contributes to group work/projects, but engagement is inconsistent.",
   achieved:"Reliably completes tasks, contributes ideas to group work and engages fully with the weekly project menu."},
  {code:"R10", title:"“Choose Kind” values", strand:"Values — Diversity, Inclusion, Empathy, Respect",
   expectation:"Shows empathy and makes connections to kindness/inclusion themes in discussion and writing.",
   notAchieved:"Rarely makes connections to kindness/inclusion themes in discussion or writing; shows little empathy for characters different from themselves.",
   workingTowards:"Sometimes makes a connection to the “Choose Kind” theme, but empathy or insight is surface-level, e.g. states a character is “sad” without explaining why.",
   achieved:"Consistently shows empathy and makes thoughtful connections between the book's kindness/inclusion themes and real life, both in discussion and in writing."}
];


/* Week 10 final project rubric in the same 3 levels as the marking guide */
const WEEK10_RUBRIC_3 = [
  { criteria:"Understanding of text", ao:"Reading AO: Ideas",
    na:"Retells basic plot events only.",
    wt:"Explains some character motivations, with limited evidence from the book.",
    a:"Explains character motivations and themes (kindness, perspective, belonging) with clear evidence from the text." },
  { criteria:"Communication of ideas", ao:"Writing/Presenting AO",
    na:"Ideas are unclear or underdeveloped.",
    wt:"Ideas are mostly clear but not always organised for the audience.",
    a:"Ideas are clear, organised and suit the audience and purpose." },
  { criteria:"Creativity & effort", ao:"Processes & strategies",
    na:"Minimal effort or detail; work is unfinished.",
    wt:"Some care taken, but parts are rushed or unfinished.",
    a:"Finished work showing clear care, original ideas and improvements after feedback." },
  { criteria:"Collaboration (if group)", ao:"Key competency",
    na:"Limited teamwork; relies on others.",
    wt:"Works with others when prompted; does their own part.",
    a:"Works cooperatively, shares the work fairly and supports others." }
];
