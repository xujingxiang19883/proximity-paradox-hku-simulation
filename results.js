const COUNT_NAMESPACE = "xujingxiang19883.proximity.paradox";
const COUNT_BASE_URL = "https://api.countapi.xyz/get";
const REFRESH_MS = 10000;

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

function countUrl(key) {
  return `${COUNT_BASE_URL}/${COUNT_NAMESPACE}/${key}`;
}

function formatTime(date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

async function fetchCounterValue(key) {
  try {
    const response = await fetch(countUrl(key), {
      cache: "no-store",
    });

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return Number(data.value || 0);
  } catch (error) {
    return null;
  }
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

async function fetchCounts() {
  const [totalValueRaw, ...personaValues] = await Promise.all([
    fetchCounterValue("total"),
    ...personas.map((persona) => fetchCounterValue(persona.id)),
  ]);

  const totalValue = totalValueRaw ?? 0;
  const entries = personas.map((persona, index) => ({
    ...persona,
    value: Number(personaValues[index] || 0),
  }));

  entries.sort((a, b) => b.value - a.value || a.title.localeCompare(b.title));
  renderBoard(entries, totalValue);

  if (totalValueRaw === null) {
    lastUpdatedEl.textContent = "Counter offline";
  }
}

fetchCounts();

window.setInterval(() => {
  fetchCounts();
}, REFRESH_MS);
