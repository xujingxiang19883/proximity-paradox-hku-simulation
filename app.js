const startingStats = {
  allyship: 50,
  social: 50,
};

const turns = [
  {
    week: "Week 1",
    kicker: "The Charter",
    title: "HKU circulates an Inclusion Manifesto for student signatures.",
    description:
      "Most people treat it as symbolic. Signing takes seconds, but it also quietly signals what kind of campus you want to belong to.",
    choices: [
      {
        label: "Sign the manifesto",
        effectText: "+8 Moral Integrity, no change to Social Standing",
        delta: { allyship: 8, social: 0 },
        logText:
          "You sign. It costs you nothing yet, and you feel consistent with the values you claim in private.",
      },
      {
        label: "Ignore the form",
        effectText: "-8 Moral Integrity, no change to Social Standing",
        delta: { allyship: -8, social: 0 },
        logText:
          "You scroll past it. No one notices, but your support stays theoretical instead of practiced.",
      },
    ],
  },
  {
    week: "Week 3",
    kicker: "The Reveal",
    title: "Your lab partner Sam tells you they are transitioning.",
    description:
      "Sam asks you to use their name and not make a scene. Suddenly this is no longer a survey answer. It is a relationship.",
    choices: [
      {
        label: "Be openly supportive",
        effectText: "+12 Moral Integrity, no change to Social Standing",
        delta: { allyship: 12, social: 0 },
        logText:
          "You respond with warmth and clarity. Sam relaxes, and trust starts to build between you.",
      },
      {
        label: 'Say "let’s just keep it professional"',
        effectText: "-12 Moral Integrity, +6 Social Standing",
        delta: { allyship: -12, social: 6 },
        logText:
          "You protect your own comfort by making the moment smaller than it is. Sam hears the distance immediately.",
      },
    ],
  },
  {
    week: "Week 5",
    kicker: "The Canteen",
    title: "Your friend group jokes about Sam's appearance over lunch.",
    description:
      "The table laughs because everyone recognizes the script. The moment passes quickly if you let it. It gets awkward if you don't.",
    choices: [
      {
        label: "Call the joke out",
        effectText: "+18 Moral Integrity, -16 Social Standing",
        delta: { allyship: 18, social: -16 },
        logText:
          "You interrupt the rhythm of the table. The laughter dies. A few people roll their eyes, but Sam is no longer left alone in the silence.",
      },
      {
        label: "Fake laugh and move on",
        effectText: "-18 Moral Integrity, +8 Social Standing",
        delta: { allyship: -18, social: 8 },
        logText:
          "You stay socially fluent by treating harm like harmless banter. The group stays relaxed. Sam doesn't.",
      },
    ],
  },
  {
    week: "Week 8",
    kicker: "The Facility",
    title: "At the library, Sam hesitates outside the restroom.",
    description:
      "They say they will wait until they get home. You know why. Helping may mean being seen as part of the awkwardness yourself.",
    choices: [
      {
        label: "Offer to wait outside for Sam",
        effectText: "+10 Moral Integrity, -8 Social Standing",
        delta: { allyship: 10, social: -8 },
        logText:
          "You choose solidarity over efficiency. You miss a few minutes of class, but Sam does not have to navigate the moment alone.",
      },
      {
        label: "Say you should both hurry back",
        effectText: "-10 Moral Integrity, +4 Social Standing",
        delta: { allyship: -10, social: 4 },
        logText:
          "You treat the tension like a scheduling problem. Nothing dramatic happens, which is exactly how avoidable exclusion survives.",
      },
    ],
  },
  {
    week: "Week 11",
    kicker: "The Project",
    title: 'A teammate suggests dropping Sam because "it makes meetings awkward."',
    description:
      "Nobody says the quiet part out loud, but everyone understands it. If you push back, the group dynamic may turn on you next.",
    choices: [
      {
        label: "Defend Sam and keep them on the team",
        effectText: "+20 Moral Integrity, -18 Social Standing",
        delta: { allyship: 20, social: -18 },
        logText:
          "You force the group to confront what it is actually doing. The room cools toward you, but Sam is no longer disposable.",
      },
      {
        label: "Stay neutral",
        effectText: "-14 Moral Integrity, +8 Social Standing",
        delta: { allyship: -14, social: 8 },
        logText:
          "You let the decision drift toward convenience. The group appreciates that you did not make things harder for them.",
      },
    ],
  },
];

const personaRules = [
  {
    id: "bridge-builder",
    title: "The Careful Bridge-Builder",
    description:
      "You tried to preserve both principle and belonging. The simulator still pushed you toward compromise, showing how fragile performative acceptance becomes under pressure.",
    test: (allyship, social) => allyship >= 60 && social >= 45,
  },
  {
    id: "keyboard-warrior",
    title: "The Keyboard Warrior",
    description:
      "You believe in inclusion when it stays abstract, but your support faltered when the cost became public, social, and immediate.",
    test: (allyship, social) => allyship >= 45 && social < 30,
  },
  {
    id: "bystander",
    title: "The Bystander",
    description:
      "You protected your own ease and group comfort, even when the harm was visible. Social smoothness won over solidarity.",
    test: (allyship, social) => social >= 55 && allyship < 35,
  },
  {
    id: "isolated-ally",
    title: "The Socially Costly Ally",
    description:
      "You showed up for Sam when it mattered, and the social penalties were real. The game's point is that the cost should not be this high.",
    test: (allyship, social) => allyship >= 70 && social < 45,
  },
];

const elements = {
  allyshipFill: document.getElementById("allyship-fill"),
  socialFill: document.getElementById("social-fill"),
  allyshipValue: document.getElementById("allyship-value"),
  socialValue: document.getElementById("social-value"),
  allyshipCard: document.getElementById("allyship-card"),
  socialCard: document.getElementById("social-card"),
  turnPill: document.getElementById("turn-pill"),
  scenarioTag: document.getElementById("scenario-tag"),
  eventKicker: document.getElementById("event-kicker"),
  eventTitle: document.getElementById("event-title"),
  eventDescription: document.getElementById("event-description"),
  choiceList: document.getElementById("choice-list"),
  startButton: document.getElementById("start-button"),
  logWindow: document.getElementById("log-window"),
};

const state = {
  currentTurn: -1,
  allyship: startingStats.allyship,
  social: startingStats.social,
  logs: [],
  submitted: false,
};

function clampScore(value) {
  return Math.max(0, Math.min(100, value));
}

function renderMeters() {
  elements.allyshipFill.style.width = `${state.allyship}%`;
  elements.socialFill.style.width = `${state.social}%`;
  elements.allyshipValue.textContent = state.allyship;
  elements.socialValue.textContent = state.social;
  elements.allyshipFill.parentElement.setAttribute("aria-valuenow", String(state.allyship));
  elements.socialFill.parentElement.setAttribute("aria-valuenow", String(state.social));
}

function addLog(text, prefix = "Week 0") {
  state.logs.unshift({ text, prefix });
  elements.logWindow.innerHTML = state.logs
    .map(
      (entry) =>
        `<article class="log-entry"><strong>${entry.prefix}:</strong> ${entry.text}</article>`,
    )
    .join("");
}

function pulseStat(card, flashClass) {
  card.classList.remove("card-shake", flashClass);
  void card.offsetWidth;
  card.classList.add("card-shake", flashClass);
  window.setTimeout(() => {
    card.classList.remove("card-shake", flashClass);
  }, 450);
}

function updateStats(delta) {
  const previousAllyship = state.allyship;
  const previousSocial = state.social;

  state.allyship = clampScore(state.allyship + delta.allyship);
  state.social = clampScore(state.social + delta.social);

  renderMeters();

  if (previousAllyship !== state.allyship) {
    pulseStat(elements.allyshipCard, "card-flash-allyship");
  }

  if (previousSocial !== state.social) {
    pulseStat(elements.socialCard, "card-flash-social");
  }
}

function createChoiceButton(choice, turn) {
  const button = document.createElement("button");
  button.className = "choice-button";
  button.type = "button";
  button.innerHTML = `
    <span class="choice-button__title">${choice.label}</span>
    <span class="choice-button__effect">${choice.effectText}</span>
  `;

  button.addEventListener("click", () => {
    updateStats(choice.delta);
    addLog(choice.logText, turn.week);

    if (state.currentTurn >= turns.length - 1) {
      renderEnding();
      return;
    }

    state.currentTurn += 1;
    renderTurn();
  });

  return button;
}

function renderTurn() {
  const turn = turns[state.currentTurn];
  elements.turnPill.textContent = `${turn.week} / ${turns.length}`;
  elements.scenarioTag.textContent = `Turn ${state.currentTurn + 1} of ${turns.length}`;
  elements.eventKicker.textContent = turn.kicker;
  elements.eventTitle.textContent = turn.title;
  elements.eventDescription.textContent = turn.description;
  elements.choiceList.innerHTML = "";

  turn.choices.forEach((choice) => {
    elements.choiceList.appendChild(createChoiceButton(choice, turn));
  });
}

function getPersona(allyship, social) {
  return (
    personaRules.find((rule) => rule.test(allyship, social)) || {
      id: "proximity-paradox",
      title: "The Proximity Paradox",
      description:
        "You ended in the messy middle. That is the point. On a campus governed by binary norms, keeping both scores high is structurally difficult once allyship becomes public and relational.",
    }
  );
}

function buildResultMarkup() {
  const persona = getPersona(state.allyship, state.social);
  const closingLine =
    state.allyship > state.social
      ? "You absorbed more of the social cost yourself."
      : "You preserved more comfort for yourself than for Sam.";

  return `
    <div class="result-block">
      <span class="result-tag">Result Persona</span>
      <div>
        <h2>${persona.title}</h2>
        <p class="event-card__body">${persona.description}</p>
      </div>
      <div class="result-scores">
        <div class="result-score-card">
          Moral Integrity
          <strong>${state.allyship}</strong>
        </div>
        <div class="result-score-card">
          Social Standing
          <strong>${state.social}</strong>
        </div>
      </div>
      <p class="event-card__body">
        ${closingLine} This simulator is built to make one thing visible: many students say they are
        accepting until that acceptance becomes costly in public.
      </p>
    </div>
  `;
}

function renderEnding() {
  elements.turnPill.textContent = "Semester Complete";
  elements.scenarioTag.textContent = "Final reflection";
  elements.eventKicker.textContent = "End of Semester";
  elements.eventTitle.textContent = "You cannot max out both bars for long.";
  elements.eventDescription.textContent =
    "The semester ends with a simple question: what happened when inclusion stopped being abstract and started costing you something in front of other people?";
  elements.choiceList.innerHTML = `
    ${buildResultMarkup()}
    <button class="choice-button choice-button--primary" id="restart-button" type="button">
      Play Again
    </button>
  `;

  addLog(
    `Final scores recorded. Moral Integrity: ${state.allyship}. Social Standing: ${state.social}.`,
    "Final",
  );
  submitResults();

  document.getElementById("restart-button").addEventListener("click", resetGame);
}

function resetGame() {
  state.currentTurn = -1;
  state.allyship = startingStats.allyship;
  state.social = startingStats.social;
  state.logs = [];
  state.submitted = false;
  renderMeters();
  renderIntro();
}

function renderIntro() {
  elements.turnPill.textContent = "Week 0 / 5";
  elements.scenarioTag.textContent = "Semester starting...";
  elements.eventKicker.textContent = "Welcome";
  elements.eventTitle.textContent = "Can you stay principled when it gets socially expensive?";
  elements.eventDescription.textContent =
    "You play as an HKU student. In a few weeks, your project partner Sam will trust you with something personal. Your choices will show whether your acceptance survives public inconvenience, awkwardness, and peer pressure.";
  elements.choiceList.innerHTML = `
    <button class="choice-button choice-button--primary" id="start-button" type="button">
      Start Semester
    </button>
  `;

  elements.choiceList.querySelector("#start-button").addEventListener("click", () => {
    state.currentTurn = 0;
    addLog(
      "Semester begins. Both of your bars start balanced, but upcoming decisions will pull them apart.",
      "Week 0",
    );
    renderTurn();
  });
}

async function submitResults() {
  if (state.submitted) {
    return;
  }

  state.submitted = true;

  const analyticsEndpoint =
    window.SIM_CONFIG?.analyticsEndpoint ||
    new URLSearchParams(window.location.search).get("endpoint") ||
    "";

  if (!analyticsEndpoint) {
    return;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    allyship: state.allyship,
    social: state.social,
    persona: getPersona(state.allyship, state.social).id,
    turns: turns.length,
  };

  try {
    await fetch(analyticsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    addLog("A final score snapshot was sent to the shared results endpoint.", "System");
  } catch (error) {
    console.error("Analytics submission failed", error);
    addLog("The score submission hook was configured, but the endpoint could not be reached.", "System");
  }
}

renderMeters();
addLog(
  "Simulation loaded. Two bars, one friendship, and no perfect path through the semester.",
  "System",
);
renderIntro();
