export const logger = {
  agent: (msg: string) => console.log(`[agent] ${msg}`),
  tool: (msg: string) => console.log(`[tool] ${msg}`),
  memory: (msg: string) => console.log(`[memory] ${msg}`),
  error: (msg: string, err?: unknown) => console.error(`[error] ${msg}`, err),
};
