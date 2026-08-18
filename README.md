<p align="center">
  <a href="https://genelpha.netlify.app/">
    <img src="assets/geneomelpha-banner.png" alt="Geneomelpha" width="100%" />
  </a>
</p>

# Geneomelpha

**A translational bioinformatics prototype for making genomic-report information easier to understand without hiding the scientific uncertainty.**

[Live demo](https://genelpha.netlify.app/) ·
[Architecture](docs/architecture.md) ·
[Research limitations](docs/research_limitations.md) ·
[Validation strategy](research/validation-strategy.md) ·
[Citation](CITATION.cff)

---

## Why I built this

The question behind Geneomelpha is not simply *“Can genomic information be simplified?”*

It is:

> **How much can we simplify a genomic report before we start losing the biological meaning, uncertainty, and clinical context that actually matter?**

I built this project as a small translational bioinformatics experiment around that question.

Genomic reports are usually written for laboratories, clinicians, genetic counsellors, and researchers. Terms such as *pathogenic*, *likely pathogenic*, *VUS*, *carrier status*, *pharmacogenomic response*, or *tumour biomarker* have precise meanings, but they are not necessarily intuitive to someone reading a report for the first time.

My aim with Geneomelpha was therefore not to build another variant classifier.

I wanted to explore the **communication layer around genomic interpretation**:

- how a user enters a report workflow,
- how different genomic domains can be separated,
- how technical terminology can be explained,
- how limitations can be shown alongside findings,
- and how the final output can encourage a better conversation with a clinician or genetic counsellor.

The repository represents that exploration in prototype form.

---

## What Geneomelpha is

Geneomelpha is a **proof-of-concept web application** built around a guided genomic-report explanation workflow.

The current prototype contains:

- a responsive HTML/CSS/JavaScript interface,
- genomic-domain selection,
- a demonstration report-upload form,
- an Express backend,
- file handling using Multer,
- domain-specific explanatory templates,
- structured summary rendering,
- limitations and suggested next steps,
- client-side PDF export,
- research documentation,
- interface screenshots,
- and a public frontend demonstration.

It is deliberately presented as a prototype rather than as a finished clinical platform.

---

## What Geneomelpha is **not**

This distinction is important to me because a polished interface can easily make an early-stage research prototype look more capable than it really is.

Geneomelpha currently **does not** perform:

- clinical diagnosis,
- ACMG/AMP variant classification,
- pathogenicity prediction,
- automated ClinVar interpretation,
- therapy recommendation,
- validated pharmacogenomic recommendation,
- genomic risk prediction,
- production-grade report parsing,
- clinical decision support,
- or autonomous AI-based genomic interpretation.

It is also **not clinically validated** and should not be used with real patient information for medical decision-making.

For the full boundary statement, see [`docs/research_limitations.md`](docs/research_limitations.md).

---

## A particularly important implementation detail

The current backend accepts a demonstration report file, but **the biological contents of that uploaded report are not yet parsed**.

At this stage, the backend uses:

- user-entered demonstration metadata,
- the selected genomic domain,
- the stated reason for testing,
- and predefined explanatory language

to construct a structured summary.

That means the current repository demonstrates the **workflow and communication architecture**, not a validated genomic interpretation engine.

I have kept this distinction explicit because the next research problem is exactly here: moving from an interface prototype to a traceable, evidence-based interpretation layer.

---

## Current workflow

The prototype follows this path:

```text
Select genomic domain
        ↓
Enter demonstration details
        ↓
Attach a non-sensitive sample file
        ↓
Send form data to the prototype API
        ↓
Generate a structured explanatory summary
        ↓
Show terminology + limitations + next steps
        ↓
Optionally export the summary as PDF
        ↓
Review the original report with a qualified professional
```

A visual version is available here:

<p align="center">
  <a href="assets/user-workflow.png">
    <img src="assets/user-workflow.png" alt="Geneomelpha workflow" width="90%" />
  </a>
</p>

---

## Genomic domains currently represented in the interface

The current services page contains six entry points:

| Domain | What I wanted the interface to explore |
|---|---|
| **Oncology** | Communicating tumour-panel and cancer-genomics terminology |
| **Rare disease** | Explaining inherited-disease and gene-panel concepts |
| **Pharmacogenomics** | Framing genetic influences on drug response |
| **Cardio genomics** | Presenting cardiac gene-panel concepts |
| **Carrier screening** | Explaining carrier status and inheritance |
| **Research** | Presenting genomic findings to non-specialist research stakeholders |

These are **communication prototypes**, not validated domain-specific interpretation pipelines.

---

## What happens in the code

The implementation is intentionally small enough that another researcher can inspect the entire workflow without having to understand a large framework.

### Frontend

The frontend is written in:

- HTML5
- CSS3
- vanilla JavaScript

The main workflow is handled in [`frontend/script.js`](frontend/script.js).

The browser:

1. reads the selected domain,
2. collects form data,
3. sends the request to the backend,
4. receives a structured JSON summary,
5. renders the explanation,
6. displays limitations and next steps,
7. and can generate a PDF using jsPDF.

The current API base configured in the frontend is:

```javascript
http://localhost:4000
```

and the analysis request is sent to:

```text
POST /api/analyse-report
```

---

### Backend

The prototype backend is in [`backend/server.js`](backend/server.js).

It uses:

```text
Node.js
Express
Multer
CORS
```

The backend currently:

- accepts the form submission,
- accepts one uploaded file,
- stores basic file metadata,
- applies a 10 MB file-size limit,
- selects explanatory wording according to the genomic domain,
- generates a structured response,
- and returns that response to the frontend.

The backend runs on:

```text
PORT 4000
```

unless a different `PORT` environment variable is supplied.

---

## Why I structured the output this way

One design decision I kept coming back to was that an explanation should not contain only a result.

A user also needs to know:

1. **What is being described?**
2. **What do the unfamiliar terms mean?**
3. **What can this information not tell them?**
4. **What should they discuss with a professional next?**

The prototype response therefore separates the output into:

```text
Report context
      │
      ├── Overview
      │
      ├── Common genomic terminology
      │
      ├── Limitations
      │
      └── Suggested next steps
```

I prefer this structure to a single generated paragraph because it makes uncertainty and limitations visible rather than burying them at the end.

---

## Interface preview

<p align="center">
  <a href="assets/geneomelpha-demo.gif">
    <img src="assets/geneomelpha-demo.gif" alt="Geneomelpha interface walkthrough" width="90%" />
  </a>
</p>

### A few screens from the prototype

<table>
  <tr>
    <td width="50%" align="center">
      <a href="screenshots/Homepage.png">
        <img src="screenshots/Homepage.png" alt="Homepage" width="100%" />
      </a>
      <br />
      <strong>Service-selection interface</strong>
    </td>
    <td width="50%" align="center">
      <a href="screenshots/analysis-page.png">
        <img src="screenshots/analysis-page.png" alt="Analysis page" width="100%" />
      </a>
      <br />
      <strong>Demonstration analysis workflow</strong>
    </td>
  </tr>
</table>

---

## Repository structure

```text
Geneomelpha/
│
├── frontend/
│   ├── index.html
│   ├── services.html
│   ├── analysis.html
│   ├── summary.html
│   ├── styles.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   └── package.json
│
├── research/
│   ├── project-concept.md
│   ├── clinical-motivation.md
│   ├── validation-strategy.md
│   ├── future-research.md
│   └── references.md
│
├── docs/
│   ├── architecture.md
│   ├── workflow.md
│   ├── reviewer_summary.md
│   ├── research_limitations.md
│   ├── installation.md
│   └── future-roadmap.md
│
├── assets/
├── screenshots/
├── CITATION.cff
├── LICENSE
├── package.json
├── server.js
└── README.md
```

---

## A note on the development history

This repository has gone through several iterations.

The interface originally used the working name **Genexis Genomics** before I moved the repository identity to **Geneomelpha**.

Because of that, some committed frontend files still contain the earlier name.

I have not tried to hide that development history in the README because this is still an evolving research prototype, and I think the unfinished parts are useful for understanding how the project developed.

There are also two pieces of legacy structure that are worth knowing about:

- the root [`package.json`](package.json) still points to `server.cjs`, which is not currently present;
- the root [`server.js`](server.js) belongs to an earlier browser-side prototype and uses a different route/port from the current `frontend/` + `backend/` workflow.

For the current local prototype, I use the code inside `frontend/` and `backend/`.

---

## Run the current prototype locally

### 1. Clone the repository

```bash
git clone https://github.com/Rita1791/Geneomelpha.git
cd Geneomelpha
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
```

The backend should start on:

```text
http://localhost:4000
```

### 3. Serve the frontend

From another terminal, return to the repository root and run a simple static server.

For example:

```bash
python -m http.server 8080 --directory frontend
```

or:

```bash
python3 -m http.server 8080 --directory frontend
```

Then open:

```text
http://localhost:8080
```

VS Code Live Server can also be used for the frontend.

---

## What I learned while building it

The useful part of this project for me has not been the amount of code.

It has been identifying where the difficult boundaries are.

### 1. Genomic interpretation and genomic communication are different problems

A technically correct variant classification can still be difficult for a patient to understand.

At the same time, simplifying the language too aggressively can remove uncertainty that is scientifically important.

That tension became one of the main design considerations in Geneomelpha.

### 2. Limitations need to be part of the output

I initially thought mainly about presenting the explanation.

While developing the workflow, it became clear that a responsible interface should give equal visibility to what the result **cannot** establish.

That is why limitations and professional follow-up are separate parts of the current summary structure.

### 3. A good interface cannot compensate for an unvalidated evidence layer

The UI can be polished long before the underlying genomic interpretation is scientifically mature.

For this reason, I now treat the interface and interpretation engine as separate layers.

The current repository demonstrates the interface layer.

The interpretation layer is the part that would require substantially more validation, provenance tracking, clinical expertise, and benchmarking.

### 4. Traceability matters more than impressive output

For any future automated interpretation system, I would want each biological statement to be traceable to:

```text
variant
→ evidence source
→ classification rule
→ interpretation
→ version/date
→ reviewer
```

Without that traceability, a fluent explanation is not enough.

---

## Current limitations I would want a reviewer to notice

Rather than presenting these as hidden technical debt, I consider them part of the current state of the research prototype.

### Report parsing

The uploaded report is currently accepted as a file, but its genomic contents are not parsed into variants or biomarkers.

### Interpretation

The current response is template-based and domain-aware. It is not evidence-backed variant interpretation.

### Database

There is no production genomic database or patient database implemented.

### Clinical evidence

There is no current integration with ClinVar, ClinGen, PharmGKB, CIViC, OncoKB, or another curated knowledge source.

### Variant classification

No ACMG/AMP classification engine is implemented.

### Clinical validation

No clinical validation, diagnostic benchmarking, or prospective patient evaluation has been performed.

### AI

The repository does **not** currently demonstrate an AI/LLM genomic interpretation system.

If an AI component is investigated later, I would treat it as an explanation layer around verified evidence rather than as the source of clinical truth.

### Privacy

The project is not designed to receive real patient genomic data in its current form.

**Please do not upload identifiable genomic reports or confidential health information.**

---

## One piece of old interface copy that should not be interpreted as a result

An early frontend version contains the phrase:

> `1000+ reports summarised`

This is **prototype interface copy**, not a measured usage statistic or validation claim.

I am documenting it here because I would rather make the status explicit than allow a reviewer to interpret a visual placeholder as research evidence.

---

## What I would work on next

If I continue this project toward a research-grade system, I would not begin by adding more visual features.

The next steps I consider more important are:

### 1. Build a reproducible parsing layer

Start with a controlled set of **synthetic or de-identified genomic reports** and define exactly which report structures can be extracted reliably.

Possible output:

```text
gene
variant
transcript
zygosity / allele fraction
classification
disease association
evidence source
```

### 2. Add evidence provenance

Every interpretation should carry its source and version.

For example:

```text
Variant
  ↓
Curated database evidence
  ↓
Classification rule
  ↓
Human-readable explanation
```

### 3. Separate evidence from language generation

The biological conclusion and the wording shown to the user should not be produced by the same uncontrolled step.

A safer architecture would be:

```text
validated structured evidence
            ↓
controlled interpretation layer
            ↓
patient-friendly explanation
            ↓
professional review
```

### 4. Evaluate comprehension

A useful translational genomics system should be evaluated not only for computational correctness but also for whether users actually understand the information better.

I would therefore want to test:

- terminology comprehension,
- perceived clarity,
- misunderstanding of risk,
- interpretation of uncertainty,
- usefulness of visual summaries,
- and whether users know when professional review is required.

### 5. Include clinical and genetic-counselling review

Before stronger claims are made, the wording and workflow should be reviewed by people who routinely communicate genomic findings in clinical settings.

More detail is in:

- [`research/validation-strategy.md`](research/validation-strategy.md)
- [`research/future-research.md`](research/future-research.md)
- [`docs/research_limitations.md`](docs/research_limitations.md)

---

## Architecture

The conceptual architecture is shown below.

<p align="center">
  <a href="assets/system-architecture.png">
    <img src="assets/system-architecture.png" alt="Geneomelpha system architecture" width="90%" />
  </a>
</p>

For the current repository, I think of the project as four practical layers:

| Layer | Current repository role |
|---|---|
| **Interface** | Domain selection, forms, result display and responsive views |
| **Prototype API** | Receives demonstration metadata and uploaded files |
| **Explanation layer** | Domain-specific structured educational text |
| **Research layer** | Documents scope, limitations, validation and future work |

The more advanced clinical interpretation components shown in conceptual diagrams should be treated as **future architecture**, not current functionality.

---

## Research documentation

For someone reviewing the repository from a research perspective, these are the files I would read after this README:

### [`docs/reviewer_summary.md`](docs/reviewer_summary.md)

Short description of the purpose and current contribution.

### [`docs/research_limitations.md`](docs/research_limitations.md)

The scientific and clinical boundary of the project.

### [`research/project-concept.md`](research/project-concept.md)

The original project idea.

### [`research/clinical-motivation.md`](research/clinical-motivation.md)

Why genomic communication is the problem being explored.

### [`research/validation-strategy.md`](research/validation-strategy.md)

What would need to be tested before stronger claims are justified.

### [`research/future-research.md`](research/future-research.md)

Longer-term research directions.

### [`docs/architecture.md`](docs/architecture.md)

Component-level architecture notes.

### [`docs/workflow.md`](docs/workflow.md)

User-flow documentation.

---

## How I would describe the contribution today

If I had to describe Geneomelpha in one sentence without overselling it:

> **Geneomelpha is a working interface prototype that I use to explore how genomic information could be organised and communicated more clearly while keeping uncertainty, limitations, and professional interpretation visible.**

Its contribution today is therefore mainly in:

- translational bioinformatics thinking,
- genomic communication,
- workflow design,
- human-centred interface development,
- and defining a path toward a more rigorous evidence-backed system.

It is not yet a contribution in automated clinical variant interpretation.

---

## Live demonstration

The public frontend demonstration is available at:

**https://genelpha.netlify.app/**

The live deployment should be treated as an **interface demonstration only**.

Do not upload real genomic reports or identifiable medical information.

---

## Citation

If you use or reference this project, citation metadata is available in [`CITATION.cff`](CITATION.cff).

```text
Ritika Rajendra Rawat
Geneomelpha
Version 1.0.0
2026
```

---

## License

This repository is released under the [MIT License](LICENSE).

The software license does not change the clinical-use restrictions described above.

---

## About the researcher

**Ritika Rajendra Rawat**

I am interested in the point where computational genomics stops being only an analysis problem and becomes a communication problem: how genomic evidence is structured, interpreted, visualised, and finally understood by another person.

Geneomelpha is one of my attempts to explore that interface through code rather than treating it only as a theoretical question.

- GitHub: [Rita1791](https://github.com/Rita1791)
- LinkedIn: [Ritika Rawat](https://in.linkedin.com/in/ritika-rawat-551107219)
- Email: [ritika.rawat27@outlook.com](mailto:ritika.rawat27@outlook.com)

---

### Final note

This repository is still evolving.

There are parts I would refactor, parts I would validate differently, and parts that are currently only conceptual. I have tried to keep those boundaries visible rather than make the project appear more finished than it is.

For me, the useful research question is not whether a prototype can produce a polished genomic summary.

It is whether we can eventually build a system in which **every simplified statement remains traceable to reliable biological evidence, preserves uncertainty, and helps rather than replaces the professional interpreting it.**
