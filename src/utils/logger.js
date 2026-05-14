const levels = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = levels[process.env.LOG_LEVEL || "info"];

function log(level, msg) {
  if (levels[level] < currentLevel) return;
  const ts = new Date().toISOString();
  const prefix = { debug: "🔍", info: "ℹ️ ", warn: "⚠️ ", error: "❌" }[level];
  console.log(`[${ts}] ${prefix} ${msg}`);
}

export const logger = {
  debug: (msg) => log("debug", msg),
  info: (msg) => log("info", msg),
  warn: (msg) => log("warn", msg),
  error: (msg) => log("error", msg),
};
