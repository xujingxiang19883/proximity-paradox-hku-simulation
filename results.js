import { appsScriptReady, fetchSummaryJsonp } from "./apps-script-client.js";

const personas = [
  {
    id: "bridge-builder",
    code: "VIBE",
    title: "The Vibe Juggler",
    tagline: "Keeping the peace, keeping the principle, somehow keeping both in the air.",
    meaning: "High allyship, high social standing",
    mascot: "assets/mascot-vibe-juggler.svg",
  },
  {
    id: "isolated-ally",
    code: "SHLD",
    title: "The Umbrella Friend",
    tagline: "When the room got cold, you chose to stand in the weather.",
    meaning: "High allyship, socially costly",
    mascot: "assets/mascot-umbrella-friend.svg",
  },
  {
    id: "bystander",
    code: "EASY",
    title: "The Room-Reader",
    tagline: "You understood the vibe instantly and let the vibe make the decision.",
    meaning: "Low allyship, high social comfort",
    mascot: "assets/mascot-room-reader.svg",
  },
  {
    id: "frayed-kite",
    code: "UMMM",
    title: "The Draft Reply",
    tagline: "You wanted to say the right thing. The room moved faster than your courage.",
    meaning: "Mixed allyship, low social standing",
    mascot: "assets/mascot-draft-reply.svg",
  },
  {
    id: "proximity-paradox",
    code: "HMMM",
    title: "The Loading Wheel",
    tagline: "Thinking... hesitating... still buffering between comfort and conviction.",
    meaning: "Messy middle / unresolved",
    mascot: "assets/mascot-loading-wheel.svg",
  },
];

const totalCountEl = document.getElementById("total-count");
const lastUpdatedEl = document.getElementById("last-updated");
const mascotGridEl = document.getElementById("mascot-grid");

function formatTime(date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function renderBoard(entries, totalValue) {
  const highest = Math.max(...entries.map((entry) => entry.value), 0);

  mascotGridEl.innerHTML = entries
    .map((entry) => {
      const highlight = entry.value === highest && entry.value > 0 ? " mascot-card--highlight" : "";

      return `
        <article class="mascot-card${highlight}">
          <div class="mascot-card__top">
            <span class="mascot-code">${entry.code}</span>
            <div class="mascot-count">
              <span>Runs</span>
              <strong>${entry.value}</strong>
            </div>
          </div>
          <img class="mascot-avatar" src="${entry.mascot}" alt="${entry.title}" />
          <h2 class="mascot-title">${entry.title}</h2>
          <p class="mascot-tagline">${entry.tagline}</p>
          <p class="mascot-meta">${entry.meaning}</p>
        </article>
      `;
    })
    .join("");

  totalCountEl.textContent = String(totalValue);
  lastUpdatedEl.textContent = formatTime(new Date());
}

function renderSummary(summary) {
  const totalValue = Number(summary.totalRuns || 0);
  const personaCounts = summary.personas || {};
  const entries = personas.map((persona, index) => ({
    ...persona,
    value: Number(personaCounts[persona.id] || 0),
  }));

  entries.sort((a, b) => b.value - a.value || a.title.localeCompare(b.title));
  renderBoard(entries, totalValue);
}

if (!appsScriptReady) {
  renderSummary({});
  lastUpdatedEl.textContent = "Apps Script not configured";
  totalCountEl.textContent = "0";
} else {
  function refreshSummary() {
    fetchSummaryJsonp(
      (summary) => {
        renderSummary(summary);
      },
      () => {
        renderSummary({});
        lastUpdatedEl.textContent = "Backend unavailable";
        totalCountEl.textContent = "0";
      },
    );
  }

  refreshSummary();
  window.setInterval(refreshSummary, 10000);
}
