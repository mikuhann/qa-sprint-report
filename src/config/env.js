"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
function getRequiredEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required`);
    }
    return value;
}
exports.env = {
    jiraDomain: getRequiredEnv("JIRA_DOMAIN"),
    jiraEmail: getRequiredEnv("JIRA_EMAIL"),
    jiraApiToken: getRequiredEnv("JIRA_API_TOKEN"),
    jiraBoardId: Number(getRequiredEnv("JIRA_BOARD_ID")),
    jiraProjectKey: getRequiredEnv("JIRA_PROJECT_KEY"),
    reportTimeZone: process.env.REPORT_TIME_ZONE ?? "Europe/Minsk",
};
