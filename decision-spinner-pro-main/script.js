// =====================
// STATE
// =====================
const state = {
  options: [],
  history: [],
  angle: 0,
  spinning: false
};

// =====================
// ELEMENTS
// =====================
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const resultEl = document.getElementById("result");
const historyList = document.getElementById("historyList");
const optionText = document.getElementById("optionText");
const optionWeight = document.getElementById("optionWeight");

// =====================
// COLORS
// =====================
const colors = ["#00e5ff", "#ff2fd1", "#7c7cff", "#22c55e", "#f97316"];

// =====================
// DRAW WHEEL
// =====================
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (state.options.length === 0) return;

  const total = state.options.reduce((s, o) => s + o.weight, 0);
  let start = state.angle;

  state.options.forEach((opt, i) => {
    const slice = (opt.weight / total) * Math.PI * 2;

    ctx.beginPath();
    ctx.moveTo(160, 160);
    ctx.arc(160, 160, 150, start, start + slice);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    ctx.save();
    ctx.translate(160, 160);
    ctx.rotate(start + slice / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "14px system-ui";
    ctx.textAlign = "right";
    ctx.fillText(opt.text, 140, 5);
    ctx.restore();

    start += slice;
  });
}

// =====================
// ADD OPTION
// =====================
function addOption() {
  const text = optionText.value.trim();
  const weight = Number(optionWeight.value);

  if (!text || weight < 1) return;
  if (state.options.some(o => o.text === text)) return;

  state.options.push({ text, weight });
  optionText.value = "";
  drawWheel();
}

// =====================
// SPIN
// =====================
function spin() {
  if (state.spinning || state.options.length < 2) return;

  state.spinning = true;
  let velocity = Math.random() * 25 + 20;

  function animate() {
    velocity *= 0.97;
    state.angle += velocity * 0.01;
    drawWheel();

    if (velocity > 0.5) {
      requestAnimationFrame(animate);
    } else {
      state.spinning = false;
      resolveResult();
    }
  }

  animate();
}

// =====================
// RESULT
// =====================
function resolveResult() {
  const total = state.options.reduce((s, o) => s + o.weight, 0);

  // Normalize angle:
  // - Canvas starts at 3 o'clock
  // - Pointer is at 12 o'clock
  // - Rotation is clockwise
  const angle =
    (Math.PI * 1.5 - (state.angle % (2 * Math.PI)) + 2 * Math.PI) %
    (2 * Math.PI);

  let accumulated = 0;

  for (const opt of state.options) {
    const slice = (opt.weight / total) * Math.PI * 2;
    accumulated += slice;

    if (angle <= accumulated) {
      resultEl.textContent = `🎯 ${opt.text}`;
      state.history.unshift(opt.text);
      state.history = state.history.slice(0, 10);
      renderHistory();
      return;
    }
  }
}


// =====================
// HISTORY
// =====================
function renderHistory() {
  historyList.innerHTML = state.history
    .map(item => `<li>${item}</li>`)
    .join("");
}

// =====================
// RESET
// =====================
function resetAll() {
  state.options = [];
  state.history = [];
  state.angle = 0;
  drawWheel();
  renderHistory();
  resultEl.textContent = "Waiting for decision…";
}

// =====================
// EXPOSE FUNCTIONS (CRITICAL FIX)
// =====================
window.addOption = addOption;
window.spin = spin;
window.resetAll = resetAll;

// =====================
// INIT
// =====================
drawWheel();
renderHistory();
