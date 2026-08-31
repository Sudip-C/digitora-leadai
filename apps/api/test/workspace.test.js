import assert from "node:assert/strict";
import test from "node:test";

import { workspaceInfo } from "../src/workspace.js";

test("API workspace exposes its foundation status", () => {
  assert.deepEqual(workspaceInfo, {
    application: "Digitora LeadAI",
    workspace: "api",
    status: "foundation-ready",
  });
});
