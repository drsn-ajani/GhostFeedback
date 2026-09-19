import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

// Created lazily so a missing env var fails at send time, not at build/import time
export function getTransporter(): Transporter {
    if (transporter) return transporter;

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be set in the environment");
    }

    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
    });

    return transporter;
}

export function getMailFrom(): string {
    return `GhostFeedback <${process.env.GMAIL_USER}>`;
}
