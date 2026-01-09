import aj from '../lib/arcjet.js';
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if (decision.isDenied) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Rate limit exceeded, Please try again later" });
            }
            else if (decision.reason.isBot()) {
                // ✅ Allow bots everywhere (log for monitoring)
                console.log('Bot detected but allowing:', {
                    env: process.env.NODE_ENV,
                    path: req.path,
                    userAgent: req.headers['user-agent'],
                    ip: req.ip
                });
                return next(); // Allow instead of blocking
            } else {
                return res.status(403).json({ message: "Access denied by security policy" });
            }
        }
        
        // ✅ Allow spoofed bots but log them
        if (decision.results.some(isSpoofedBot)) {
            console.log('Spoofed bot detected but allowing');
            return next();
        }
        
        next();
    } catch (error) {
        console.log("Arcjet Protection error:", error);
        next();
    }
}