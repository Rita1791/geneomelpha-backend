const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

app.get("/", (req, res) => {
  res.json({ status: "Genexis Genomics backend running" });
});

// Main analysis endpoint
app.post("/api/analyse-report", upload.single("reportFile"), (req, res) => {
  try {
    const {
      name,
      place,
      labId,
      age,
      gender,
      reason,
      domain
    } = req.body;

    const fileInfo = req.file
      ? {
          originalName: req.file.originalname,
          storedName: req.file.filename,
          sizeBytes: req.file.size
        }
      : null;

    const safeName = name && name.trim() !== "" ? name.trim() : "Patient";
    const effectiveDomain = domain || "General genomics";

    let domainSentence = "";
    switch (effectiveDomain) {
      case "Oncology":
        domainSentence =
          "This analysis is focused on tumour and cancer‑related genes that may inform diagnosis or treatment.";
        break;
      case "Rare disease":
        domainSentence =
          "This analysis concentrates on genes that are known to be involved in inherited and rare conditions.";
        break;
      case "Pharmacogenomics":
        domainSentence =
          "This analysis focuses on genes that can influence how medicines work in the body.";
        break;
      case "Cardio genomics":
        domainSentence =
          "This analysis focuses on genes associated with the structure and rhythm of the heart.";
        break;
      case "Carrier screening":
        domainSentence =
          "This analysis looks at genes that can indicate carrier status for certain inherited conditions.";
        break;
      case "Research":
        domainSentence =
          "This analysis summarises genomic information in a way that can support research or project discussions.";
        break;
      default:
        domainSentence =
          "This analysis provides a structured overview of key genomic findings related to the reason for testing.";
    }

    const overview =
      `The report reviews selected genes and DNA regions that may be related to the reason for testing: ${reason}. ` +
      domainSentence +
      " It does not examine every gene in the genome, but focuses on areas that current evidence supports for this type of testing.";

    const summary = {
      header: {
        name: safeName,
        place: place || "",
        labId,
        age,
        gender,
        reason,
        domain: effectiveDomain,
        file: fileInfo
      },
      overview,
      terms: [
        "Benign or likely benign changes are usually not expected to cause disease by themselves.",
        "Pathogenic or likely pathogenic changes may increase the chance of a particular condition and should be discussed with a specialist.",
        "A variant of uncertain significance (VUS) means experts are not yet sure whether the change is important or harmless."
      ],
      limitations: [
        "The report cannot guarantee whether a condition will or will not develop in the future.",
        "It does not replace medical advice, physical examination, or other investigations recommended by your doctor."
      ],
      nextSteps: [
        "Share this summary and the original lab report with your treating doctor or genetic counsellor.",
        "Ask which findings are most important for you and whether relatives should consider testing.",
        "Keep a copy of this report for future reference as scientific knowledge and guidelines may change over time."
      ]
    };

    res.json({ ok: true, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: "Unable to process report at this time."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Genexis backend listening on port ${PORT}`);
});
