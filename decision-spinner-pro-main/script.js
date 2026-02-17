const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let options = [];
let startAngle = 0;
let spinning = false;

function addOption() {
  const text = document.getElementById("optionText").value.trim();
  const weight = parseInt(document.getElementById("optionWeight").value);

  if (!text || weight < 1) return;

  options.push({ text, weight });
  document.getElementById("optionText").value = "";
  drawWheel();
}

function drawWheel() {
  const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);
  let angle = startAngle;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  options.forEach((option, index) => {
    const sliceAngle = (option.weight / totalWeight) * 2 * Math.PI;

    ctx.beginPath();
    ctx.moveTo(160, 160);
    ctx.arc(160, 160, 150, angle, angle + sliceAngle);
    ctx.fillStyle = `hsl(${index * 60}, 70%, 50%)`;
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(160, 160);
    ctx.rotate(angle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.fillText(option.text, 140, 10);
    ctx.restore();

    angle += sliceAngle;
  });
}

function spin() {
  if (spinning || options.length === 0) return;

  spinning = true;
  const spinAngle = Math.random() * 2000 + 2000;
  let currentSpin = 0;

  const interval = setInterval(() => {
    currentSpin += 20;
    startAngle += 0.2;
    drawWheel();

    if (currentSpin >= spinAngle) {
      clearInterval(interval);
      spinning = false;
      showResult();
    }
  }, 20);
}

function showResult() {
  const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);
  let random = Math.random() * totalWeight;

  for (let option of options) {
    if (random < option.weight) {
      document.getElementById("result").innerText = option.text;
      addToHistory(option.text);
      return;
    }
    random -= option.weight;
  }
}

function addToHistory(text) {
  const li = document.createElement("li");
  li.textContent = text;
  document.getElementById("historyList").appendChild(li);
}

function resetAll() {
  options = [];
  document.getElementById("historyList").innerHTML = "";
  document.getElementById("result").innerText = "Waiting for decision…";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

