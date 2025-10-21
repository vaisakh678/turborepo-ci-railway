import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST as string,
	port: Number(process.env.SMTP_PORT),
	secure: false,
	auth: {
		user: process.env.SMTP_USER as string,
		pass: process.env.SMTP_PASS as string,
	},
} as SMTPTransport.Options);
