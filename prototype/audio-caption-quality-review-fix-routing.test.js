"use strict";

// Guards caption-quality fix-routing hand-off links (#583 / #584): all five
// caption flag types route to the screen that owns the underlying fix.
// Run with: `node prototype/audio-caption-quality-review-fix-routing.test.js`

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(__dirname, "audio-caption-quality-review.html"), "utf8");
const shell = fs.readFileSync(path.join(root, "preview", "index.html"), "utf8");
const nav = fs.readFileSync(path.join(root, "preview", "episode-flow-nav.js"), "utf8");

// Guard 1: screen is registered in the preview shell and episode flow
assert.ok(
  shell.includes("../prototype/audio-caption-quality-review.html"),
  "audio-caption-quality-review is reachable from the preview shell",
);
assert.ok(
  nav.includes('"audio-caption-quality-review.html"'),
  "audio-caption-quality-review is registered in episode-flow-nav.js",
);

// Guard 2: all five fixScreen/fixLabel pairs declared in source
assert.ok(
  html.includes('fixScreen: "transcript-glossary.html"'),
  "low-confidence flags route to transcript glossary",
);
assert.ok(
  html.includes('fixLabel: "transcript glossary"'),
  "low-confidence flags name the fix screen in creator-facing copy",
);

assert.ok(
  html.includes('fixScreen: "pause-crosstalk-cleanup.html"'),
  "crosstalk flags route to pause & cross-talk cleanup",
);
assert.ok(
  html.includes('fixLabel: "pause & cross-talk cleanup"'),
  "crosstalk flags name the fix screen in creator-facing copy",
);

assert.ok(
  html.includes('fixScreen: "layout-safe-areas.html"'),
  "collision and long-line flags route to layout safe areas",
);
assert.ok(
  html.includes('fixLabel: "layout safe areas"'),
  "collision and long-line flags name the fix screen in creator-facing copy",
);

assert.ok(
  html.includes('fixScreen: "speaker-attribution-review.html"'),
  "speaker-mismatch flags route to speaker attribution review",
);
assert.ok(
  html.includes('fixLabel: "speaker attribution review"'),
  "speaker-mismatch flags name the fix screen in creator-facing copy",
);

// Guard 3: all four target files exist and are linked from the shell
const targets = [
  "transcript-glossary.html",
  "pause-crosstalk-cleanup.html",
  "layout-safe-areas.html",
  "speaker-attribution-review.html",
];
for (const file of targets) {
  assert.ok(fs.existsSync(path.join(__dirname, file)), `fix target exists: ${file}`);
  assert.ok(shell.includes(`../prototype/${file}`), `${file} is reachable from the preview shell`);
}

// Guard 4: routing passes fixScreen onto the issue and the link renderer uses it
assert.ok(
  html.includes("issue.fixScreen = flag.fixScreen"),
  "routing passes fixScreen from check to issue",
);
assert.ok(
  html.includes("openLink.href = issue.fixScreen"),
  "open link routes to the owning fix screen",
);
assert.ok(
  html.includes('openLink.className = "fix-link"'),
  "fix links carry shared fix-link class",
);

console.log("audio-caption-quality-review: all five caption flag types route to their owning fix screen");
