// Datum setzen
document.getElementById("today-date").textContent =
  new Date().toLocaleDateString("de-DE");

// Material-Presets je Auftragsart
const jobPresets = {
  "daikin-heatpump": [
    { label: "Kupferrohr 35mm", unit: "m" },
    { label: "Kupferrohr 28mm", unit: "m" },
    { label: "Kupferrohr 22mm", unit: "m" },
    { label: "Isolierung 35mm", unit: "m" },
    { label: "Isolierung 28mm", unit: "m" },
    { label: "Isolierung 22mm", unit: "m" },
    { label: "Fittinge 35mm", unit: "Stk" },
    { label: "Fittinge 28mm", unit: "Stk" },
    { label: "Fittinge 22mm", unit: "Stk" },
    { label: "Rotguss 35 x Gewindefitting", unit: "Stk" },
    { label: "Rotguss 28 x Gewindefitting", unit: "Stk" },
    { label: "Rotguss 22 x Gewindefitting", unit: "Stk" },
    { label: 'Rotgussgewindefittinge diverse 1/2 bis 3/4"', unit: "Stk" },
    { label: 'Rotgussgewindefittinge diverse 1 bis 1 1/4"', unit: "Stk" },
    { label: "Kesselsicherheitsgruppe", unit: "Stk" },
    { label: 'KFE-Hähne 1/2"', unit: "Stk" },
    { label: 'Automatische Schnellentlüfter 1/2"', unit: "Stk" },
    { label: "Pumpenverschraubungen", unit: "Stk" },
    { label: 'Kugelhähne 1/2"', unit: "Stk" },
    { label: 'Kugelhähne 3/4"', unit: "Stk" },
    { label: 'Kugelhähne 1"', unit: "Stk" },
    { label: "Schrägsitz-Absperrventil", unit: "Stk" },
    { label: "Erdleitung DN35", unit: "m" },
    { label: "Wanddurchführung", unit: "Stk" }
    // "Sonstiges" über Textfeld
  ]
};

const jobTypeSelect = document.getElementById("job-type");
const materialsBody = document.getElementById("materials-body");

function renderMaterials(presetKey) {
  materialsBody.innerHTML = "";

  const list = jobPresets[presetKey];
  if (!list || list.length === 0) {
    materialsBody.innerHTML =
      '<div class="materials-placeholder">Für diese Auftragsart ist noch keine Materialliste hinterlegt.</div>';
    return;
  }

  list.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "material-row";

    const label = document.createElement("div");
    label.className = "material-label";
    label.textContent = item.label;

    const input = document.createElement("input");
    input.className = "material-input";
    input.type = "number";
    input.min = "0";
    input.step = "0.01";
    input.placeholder = "0";
    input.dataset.materialLabel = item.label;
    input.dataset.materialUnit = item.unit;
    input.dataset.materialIndex = index;

    const unit = document.createElement("div");
    unit.className = "material-unit";
    unit.textContent = item.unit;

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(unit);

    materialsBody.appendChild(row);
  });
}

jobTypeSelect.addEventListener("change", (e) => {
  const value = e.target.value;

  if (!value) {
    materialsBody.innerHTML =
      '<div class="materials-placeholder">Wähle oben eine <strong>Auftragsart</strong>, um eine Materialliste vorzuschlagen.</div>';
    return;
  }

  // Material-Vorschlag laden
  renderMaterials(value);

  // Auto-Fill für Daikin-Aufträge
  if (value === "daikin-heatpump") {
    const jobTitleInput = document.getElementById("job-title");
    const workDescriptionInput = document.getElementById("work-description");

    const defaultJobTitle = "1KOMMA5";
    const defaultWorkDescription =
      "-Entleeren der vorhandenen Anlage\n" +
      "-Rückbau der alten Komponenten und Leitungen\n" +
      "-Aufstellen und montieren der neuen Komponenten\n" +
      "-Verlegen und isolieren der neuen Leitungen\n" +
      "-Dichtheitsprobe\n" +
      "-Fachgerechte Entsorgung der alten Anlage";

    // Nur setzen, wenn noch nichts drin steht (damit du es bei Bedarf überschreiben kannst)
    if (!jobTitleInput.value.trim()) {
      jobTitleInput.value = defaultJobTitle;
    }

    if (!workDescriptionInput.value.trim()) {
      workDescriptionInput.value = defaultWorkDescription;
    }
  }
});

// Signatur-Setup
function initSignatureCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  const placeholder = canvas.parentElement.querySelector(".sign-placeholder");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  function startDrawing(x, y) {
    drawing = true;
    lastX = x;
    lastY = y;
    if (placeholder) placeholder.style.display = "none";
  }

  function draw(x, y) {
    if (!drawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
  }

  function stopDrawing() {
    drawing = false;
  }

  // Maus
  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    startDrawing(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    draw(e.clientX - rect.left, e.clientY - rect.top);
  });

  window.addEventListener("mouseup", stopDrawing);

  // Touch
  canvas.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      draw(touch.clientX - rect.left, touch.clientY - rect.top);
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      stopDrawing();
    },
    { passive: false }
  );

  return {
    clear() {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.scale(ratio, ratio);
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#111827";
      if (placeholder) placeholder.style.display = "flex";
    }
  };
}

const signatureTech = initSignatureCanvas("signature-tech");
const signatureCustomer = initSignatureCanvas("signature-customer");

// Clear Buttons
document.querySelectorAll("[data-clear]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-clear");
    if (targetId === "signature-tech") signatureTech.clear();
    if (targetId === "signature-customer") signatureCustomer.clear();
  });
});

// "Done" -> Export als Bild (Download)
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", async () => {
  const workOrderElement = document.getElementById("work-order");
  const jobNumberInput = document.getElementById("job-number");

  try {
    const canvas = await html2canvas(workOrderElement, {
      scale: 2,
      backgroundColor: "#ffffff"
    });

    const dataUrl = canvas.toDataURL("image/png");

    const dateStr = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
    const jobNumber = jobNumberInput.value.trim() || "ohne-auftragsnr";
    const safeJobNumber = jobNumber.replace(/[^a-zA-Z0-9_-]/g, "-");
    const filename = `Arbeitsnachweis_${dateStr}_${safeJobNumber}.png`;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(
      "Arbeitsnachweis wurde als Bild gespeichert. Du kannst ihn jetzt z.B. per E-Mail verschicken."
    );
  } catch (error) {
    console.error(error);
    alert("Fehler beim Export. Prüfe die Browser-Konsole für Details.");
  }
});
