import { expect, test } from "vitest";

import { workspaceInfo } from "../src/workspace.js";

test("API workspace exposes its foundation status", () => {
  expect(workspaceInfo).toEqual({
    application: "Digitora LeadAI",
    workspace: "api",
    status: "foundation-ready",
  });
});
