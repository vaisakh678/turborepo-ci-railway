import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/db";
import { admin, emailOTP, jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { transporter } from "./mailer";

export const auth = betterAuth({
	advanced: {
		database: {
			generateId: false,
		},
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
	plugins: [
		nextCookies(),
		admin({}),
		emailOTP({
			async sendVerificationOTP(data, request) {
				console.log("Verification OTP:", data);
				const res = await transporter.sendMail({
					from: '"Weteller" <noreply@weteller.com>',
					to: data.email,
					subject: "Your Verification OTP",
					text: `Your OTP is: ${data.otp}`,
				});
				console.log("mailer resp: ", res);
			},
		}),
	],
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
});
