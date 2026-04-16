export const appsScriptConfig = {
  webAppUrl: "...",
};

export function hasAppsScriptConfig() {
  return (
    typeof appsScriptConfig.webAppUrl === "string" &&
    appsScriptConfig.webAppUrl.trim() !== "" &&
    appsScriptConfig.webAppUrl.trim() !== "..."
  );
}
