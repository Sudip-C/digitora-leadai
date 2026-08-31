import assert from "node:assert/strict";
import test from "node:test";

import { API_VERSION, APP_NAME, DEFAULT_TIMEZONE, FOUNDATION_STATUS } from "../src/index.js";

test("shared configuration exposes project defaults", () => {
  assert.equal(APP_NAME, "Digitora LeadAI");
  assert.equal(API_VERSION, "v1");
  assert.equal(DEFAULT_TIMEZONE, "Asia/Kolkata");
  assert.equal(FOUNDATION_STATUS, "foundation-ready");
});
