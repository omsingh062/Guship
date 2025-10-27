// backend/src/lib/arcjet.js

import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { ENV } from "./env.js";

const aj = arcjet({
  key: ENV.ARCJET_KEY, // Your Arcjet API key from .env
  rules: [
    // Shield rule (general protection)
    shield({ mode: "LIVE" }),

    // Bot detection rule
    detectBot({
      mode: "LIVE", // "LIVE" = blocks bots; use "DRY_RUN" to test only
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Allow Google, Bing, etc.
        // "CATEGORY:MONITOR",
        // "CATEGORY:PREVIEW",
      ],
    }),

    // Rate limiting rule
    slidingWindow({
      mode: "LIVE", // "LIVE" = enforce; "DRY_RUN" = log only
      max: 100, // Max 100 requests
      interval: 60, // Per 60 seconds
    }),
  ],
});

export default aj;
