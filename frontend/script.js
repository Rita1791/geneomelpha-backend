const apiBase = "http://localhost:4000"; // change when deploying

// Footer year
const yearSpan = document.getElementById("yearNow");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Get query param
function getQueryParam(key) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

// Prefill domain on analysis page
const domainInput = document.getElementById("domain");
if (domainInput) {
  const domainFromUrl = getQueryParam("domain");
  if (domainFromUrl) {
    domainInput.value = domainFromUrl;
  }
}

// Handle analysis form: send to backend and show summary
const form = document.getElementById("analysisForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const resultSection = document.getElementById("resultSection");
    const resultContent = document.getElementById("resultContent");
    resultContent.innerHTML = "<p>Generating report analysis…</p>";
    resultSection.style.display = "block";

    const formData = new FormData(form);

    try {
      const resp = await fetch(`${apiBase}/api/analyse-report`, {
        method: "POST",
        body: formData
      });

      const data = await resp.json();

      if (!data.ok) {
        resultContent.innerHTML = `<p>Sorry, something went wrong: ${data.error || "Unknown error"}.</p>`;
        return;
      }

      const s = data.summary;
      const header = s.header;

      const introHtml = `
        <p><strong>Summary for:</strong> ${header.name}${header.age ? " (" + header.age + " years" : ""}${header.gender ? ", " + header.gender : ""}</p>
        <p><strong>Lab Report ID:</strong> ${header.labId}${header.place ? " · " + header.place : ""}</p>
        <p><strong>Reason for test:</strong> ${header.reason}</p>
        <p><strong>Service domain:</strong> ${header.domain}</p>
      `;

      const overviewHtml = `
        <h3>What this genomic report covers</h3>
        <p>${s.overview}</p>
      `;

      const termsHtml = `
        <h3>Interpreting common report terms</h3>
        <ul class="bullet-list">
          ${s.terms.map(t => `<li>${t}</li>`).join("")}
        </ul>
      `;

      const limitsHtml = `
        <h3>Important limitations</h3>
        <ul class="bullet-list">
          ${s.limitations.map(t => `<li>${t}</li>`).join("")}
        </ul>
      `;

      const stepsHtml = `
        <h3>Recommended next steps</h3>
        <ul class="bullet-list">
          ${s.nextSteps.map(t => `<li>${t}</li>`).join("")}
        </ul>
      `;

      resultContent.innerHTML = introHtml + overviewHtml + termsHtml + limitsHtml + stepsHtml;
    } catch (err) {
      console.error(err);
      resultContent.innerHTML = "<p>Unable to contact the analysis service. Please try again later.</p>";
    }

    window.scrollTo({ top: resultSection.offsetTop - 80, behavior: "smooth" });
  });
}

// PDF generation
const downloadBtn = document.getElementById("downloadPdfBtn");
if (downloadBtn && window.jspdf) {
  downloadBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const margin = 40;
    let y = margin;

    const name = (document.getElementById("name")?.value || "Patient").trim();
    const labId = (document.getElementById("labId")?.value || "").trim();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Genomic Report – Analysis Summary", margin, y);
    y += 24;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(90, 90, 90);

    const now = new Date().toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    doc.text(`Generated for: ${name}`, margin, y);
    y += 14;
    if (labId) {
      doc.text(`Lab Report ID: ${labId}`, margin, y);
      y += 14;
    }
    doc.text(`Generated on: ${now}`, margin, y);
    y += 18;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, 555, y);
    y += 20;

    const resultContent = document.getElementById("resultContent");
    const plainText = resultContent ? resultContent.innerText : "";

    const lines = doc.splitTextToSize(plainText, 520);
    lines.forEach((line) => {
      if (y > 780) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 14;
    });

    doc.save("genomic-report-analysis.pdf");
  });
}
