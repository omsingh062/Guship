import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    // 🧩 Allow local development tools like Postman or localhost
    const ua = req.get("User-Agent") || "";
    if (ua.includes("Postman") || ua.includes("Insomnia") || ua.includes("axios")) {
      console.log("🧩 Allowing local dev request (Postman/Axios)");
      return next();
    }

    const decision = await aj.protect(req);
    console.log("🧠 Arcjet Decision:", decision?.reason?.toString());

    // 🚫 If request is denied
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Rate limit exceeded. Try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      } else {
        return res.status(403).json({ message: "Access denied by security policy." });
      }
    }

    // 🛡️ Detect spoofed bots
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    // ✅ Passed all checks
    next();
  } catch (error) {
    console.error("⚠️ Arcjet Protection Error:", error);
    next();
  }
};
