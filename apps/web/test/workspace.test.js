import assert from "node:assert/strict";
import test from "node:test";

import { workspaceInfo } from "../src/workspace.js";

test("web workspace exposes its foundation status", () => {
  assert.deepEqual(workspaceInfo, {
    application: "Digitora LeadAI",
    workspace: "web",
    status: "foundation-ready",
  });
});
