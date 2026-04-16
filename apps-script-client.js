import { appsScriptConfig, hasAppsScriptConfig } from "./apps-script-config.js";

export const appsScriptReady = hasAppsScriptConfig();

function buildUrl(params) {
  const url = new URL(appsScriptConfig.webAppUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

export function recordPlaythrough(payload) {
  if (!appsScriptReady) {
    return false;
  }

  const image = new Image();
  image.src = buildUrl({
    action: "record",
    persona: payload.persona,
    allyship: payload.allyship,
    social: payload.social,
    turns: payload.turns,
    timestamp: payload.timestamp,
  });

  return true;
}

export function fetchSummaryJsonp(onData, onError) {
  if (!appsScriptReady) {
    onError?.(new Error("Apps Script is not configured."));
    return () => {};
  }

  const callbackName = `appsScriptSummary_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const script = document.createElement("script");

  window[callbackName] = (data) => {
    onData(data || {});
    cleanup();
  };

  function cleanup() {
    delete window[callbackName];
    script.remove();
  }

  script.onerror = () => {
    cleanup();
    onError?.(new Error("Apps Script summary request failed."));
  };

  script.src = buildUrl({
    action: "summary",
    prefix: callbackName,
    _: Date.now(),
  });

  document.body.appendChild(script);

  return cleanup;
}
