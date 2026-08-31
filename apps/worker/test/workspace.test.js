import assert from "node:assert/strict";
import test from "node:test";

import { workspaceInfo } from "../src/workspace.js";

test("worker workspace exposes its foundation status", () => {
  assert.deepEqual(workspaceInfo, {
    application: "Digitora LeadAI",
    workspace: "worker",
    status: "foundation-ready",
  });
});
