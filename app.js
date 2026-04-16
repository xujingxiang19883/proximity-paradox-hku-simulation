const startingStats = {
  allyship: 50,
  social: 50,
};

const turns = [
  {
    week: "Week 1",
    kicker: "The First Meeting",
    title: "You finally meet your lab partner Sam in person.",
    description:
      "You only knew Sam from email. At the classroom door, a classmate mutters, <strong>\"Oh, that's the trans student.\"</strong> Sam hears it.",
    choices: [
      {
        label: "Step in, greet Sam normally, and keep the conversation moving",
        delta: { allyship: 10, social: -2 },
        logText:
          "You cut through the weirdness before it can harden into a scene. Sam settles into the room, and everyone else has to adjust to your cue.",
      },
      {
        label: "Pretend you didn't hear it and focus on the worksheet",
        delta: { allyship: -10, social: 4 },
        logText:
          "You avoid becoming part of the moment, which also means leaving Sam alone in it. The class moves on more comfortably than Sam does.",
      },
    ],
  },
  {
    week: "Week 3",
    kicker: "The Group Chat",
    title: "A teammate drops Sam's old name into your project group chat.",
    description:
      "A teammate posts Sam's old name with a laughing emoji and an old class list. The chat goes quiet. <strong>Everyone is waiting</strong> to see whether anyone will step in.",
    choices: [
      {
        label: "Correct it immediately and ask everyone to use Sam's name",
        delta: { allyship: 14, social: -6 },
        logText:
          "You set a line in plain language. The chat gets a little colder, but Sam no longer has to defend their own right to stay in it.",
      },
      {
        label: "Say nothing and wait for the topic to pass",
        delta: { allyship: -12, social: 6 },
        logText:
          "Silence keeps the chat easy for everyone except Sam. The deadname lingers on screen because no one with social cover chose to interrupt it.",
      },
    ],
  },
  {
    week: "Week 5",
    kicker: "The Canteen",
    title: "Your friend group jokes about Sam's appearance over lunch.",
    description:
      "The whole table laughs. If you stay quiet, the moment passes quickly. If you speak up, <strong>the mood changes immediately</strong>.",
    choices: [
      {
        label: "Call the joke out",
        delta: { allyship: 18, social: -16 },
        logText:
          "You interrupt the rhythm of the table. The laughter dies. A few people roll their eyes, but Sam is no longer left alone in the silence.",
      },
      {
        label: "Fake laugh and move on",
        delta: { allyship: -18, social: 8 },
        logText:
          "You stay socially fluent by treating harm like harmless banter. The group stays relaxed. Sam doesn't.",
      },
    ],
  },
  {
    week: "Week 8",
    kicker: "The Attendance Sheet",
    title: "A tutor pauses over Sam's name during attendance and asks, \"Which one do you go by now?\"",
    description:
      "The room goes quiet. Sam looks down at the desk. <strong>No one wants to be the first person</strong> to interrupt the awkwardness.",
    choices: [
      {
        label: "Step in and redirect with Sam's actual name",
        delta: { allyship: 12, social: -10 },
        logText:
          "You interrupt the public examination before it goes further. The tutor looks mildly annoyed, but the room no longer gets to treat Sam like an explanation.",
      },
      {
        label: "Keep your eyes down and let Sam handle it alone",
        delta: { allyship: -10, social: 4 },
        logText:
          "No one can accuse you of causing a scene, because you didn't. Sam still had to stand there and absorb one in public.",
      },
    ],
  },
  {
    week: "Week 11",
    kicker: "The Project",
    title: 'A teammate suggests dropping Sam because "it makes meetings awkward."',
    description:
      "No one says the quiet part out loud, but everyone understands it. If you defend Sam, <strong>you may become the next problem</strong> in the room.",
    choices: [
      {
        label: "Defend Sam and keep them on the team",
        delta: { allyship: 20, social: -18 },
        logText:
          "You force the group to confront what it is actually doing. The room cools toward you, but Sam is no longer disposable.",
      },
      {
        label: "Stay neutral",
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

function advanceFromChoice(choice, turn) {
  updateStats(choice.delta);
  addLog(choice.logText, turn.week);

  if (state.currentTurn >= turns.length - 1) {
    renderEnding();
    return;
  }

  state.currentTurn += 1;
  renderTurn();
}

function createChoiceButton(choice, choiceIndex) {
  const button = document.createElement("button");
  button.className = "choice-button";
  button.type = "button";
  button.dataset.action = "choice";
  button.dataset.choiceIndex = String(choiceIndex);
  button.innerHTML = `
    <span class="choice-button__title">${choice.label}</span>
  `;

  return button;
}

function renderTurn() {
  const turn = turns[state.currentTurn];
  elements.turnPill.textContent = `${turn.week} / ${turns.length}`;
  elements.scenarioTag.textContent = `Turn ${state.currentTurn + 1} of ${turns.length}`;
  elements.eventKicker.textContent = turn.kicker;
  elements.eventTitle.textContent = turn.title;
  elements.eventDescription.innerHTML = turn.description;
  elements.choiceList.innerHTML = "";

  turn.choices.forEach((choice, choiceIndex) => {
    elements.choiceList.appendChild(createChoiceButton(choice, choiceIndex));
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
  elements.eventDescription.innerHTML =
    "The semester ends with one question: <strong>what happened when support became socially costly?</strong>";
  elements.choiceList.innerHTML = `
    ${buildResultMarkup()}
    <button class="choice-button choice-button--primary" data-action="restart" type="button">
      Play Again
    </button>
  `;

  addLog(
    `Final scores recorded. Moral Integrity: ${state.allyship}. Social Standing: ${state.social}.`,
    "Final",
  );
  submitResults();
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
  elements.eventDescription.innerHTML =
    "You play as an HKU student. Over one semester, your closeness to Sam turns <strong>abstract acceptance</strong> into <strong>public social risk</strong>. The question is not what you believe in theory. It is what you do when other people are watching.";
  elements.choiceList.innerHTML = `
    <button class="choice-button choice-button--primary" data-action="start" type="button">
      Start Semester
    </button>
  `;
}

function startGame() {
  state.currentTurn = 0;
  addLog(
    "Semester begins. Both of your bars start balanced, but upcoming decisions will pull them apart.",
    "Week 0",
  );
  renderTurn();
}

elements.choiceList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const { action } = button.dataset;

  if (action === "start") {
    startGame();
    return;
  }

  if (action === "restart") {
    resetGame();
    return;
  }

  if (action === "choice") {
    const turn = turns[state.currentTurn];
    const choice = turn?.choices[Number(button.dataset.choiceIndex)];

    if (choice && turn) {
      advanceFromChoice(choice, turn);
    }
  }
});

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
