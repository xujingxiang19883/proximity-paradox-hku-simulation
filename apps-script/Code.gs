function doGet(e) {
  const action = (e.parameter.action || "").trim();

  if (action === "record") {
    return handleRecord_(e);
  }

  return handleSummary_(e);
}

function doPost(e) {
  return handleRecord_(e);
}

function handleRecord_(e) {
  const sheet = getSheet_();
  const persona = String(e.parameter.persona || "");
  const allyship = Number(e.parameter.allyship || 0);
  const social = Number(e.parameter.social || 0);
  const turns = Number(e.parameter.turns || 0);
  const timestamp = String(e.parameter.timestamp || new Date().toISOString());

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["timestamp", "persona", "allyship", "social", "turns"]);
  }

  sheet.appendRow([timestamp, persona, allyship, social, turns]);

  return respondJson_(e, { ok: true });
}

function handleSummary_(e) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const summary = {
    totalRuns: 0,
    personas: {},
  };

  for (var i = 1; i < values.length; i += 1) {
    const row = values[i];
    const persona = String(row[1] || "");

    if (!persona) {
      continue;
    }

    summary.totalRuns += 1;
    summary.personas[persona] = Number(summary.personas[persona] || 0) + 1;
  }

  return respondJson_(e, summary);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = "results";
  const existing = spreadsheet.getSheetByName(sheetName);
  return existing || spreadsheet.insertSheet(sheetName);
}

function respondJson_(e, payload) {
  const prefix = String(e.parameter.prefix || "");
  const body = JSON.stringify(payload);

  if (prefix) {
    return ContentService.createTextOutput(prefix + "(" + body + ")").setMimeType(
      ContentService.MimeType.JAVASCRIPT,
    );
  }

  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}
