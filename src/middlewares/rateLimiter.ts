const rateLimit = require('express-rate-limit')


export const Limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 120, // Limit each IP to 120 requests per `window` (here, per 1 minute)
	message: "You're going too fast, Slow down!",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


export const AuthLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 20, // Limit each IP to 20 requests per `window` (here, per hour)
	message: "Too many attempts, try again in one hour!",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


export const SignupLimiter = rateLimit({
	// max limit of 32-bit int.
	windowMs: 2147483647, // 12 days
	max: 5, // Limit each IP to 20 requests per `window` (here, per 12 days)
	message: "You can't create more than 5 accounts!",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


export const SMSLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 5, // Limit each IP to 5 requests per `window` (here, per hour)
	message: "Too many sms requests, try again in one hour!",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});