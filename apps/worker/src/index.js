import { workspaceInfo } from "./workspace.js";

console.log(`[worker] ${workspaceInfo.application} workspace is ready for queue integrations.`);

setInterval(() => {}, 2_147_483_647);
