import { classifyEvent } from "./classifier.js";
import { analyzeWallet } from "./walletAnalyzer.js";
import { scoreRisk } from "./riskScorer.js";
import { generateAlert } from "./alertGenerator.js";
import { logger } from "../utils/logger.js";

/**
 * Main 4-step agent reasoning pipeline
 * Step 1: Classify event type
 * Step 2: Analyze wallet history
 * Step 3: Score risk/opportunity
 * Step 4: Generate actionable alert
 */
export async function processEvent(rawEvent) {
  // Step 1 — Classify
  logger.debug("Step 1/4: Classifying event...");
  const classification = await classifyEvent(rawEvent);
  if (!classification.relevant) {
    return { actionable: false, reason: "Event not relevant" };
  }

  // Step 2 — Wallet Analysis
  logger.debug("Step 2/4: Analyzing wallet behavior...");
  const walletProfile = await analyzeWallet({
    address: classification.primaryWallet,
    eventType: classification.type,
    rawEvent,
  });

  // Step 3 — Risk Scoring
  logger.debug("Step 3/4: Scoring risk...");
  const riskAssessment = await scoreRisk({
    classification,
    walletProfile,
  });

  // Step 4 — Alert Generation
  logger.debug("Step 4/4: Generating alert...");
  const alert = await generateAlert({
    classification,
    walletProfile,
    riskAssessment,
    rawEvent,
  });

  return {
    actionable: riskAssessment.score >= 70,
    risk: riskAssessment.level,
    score: riskAssessment.score,
    summary: alert.summary,
    detail: alert.detail,
    recommendedAction: alert.recommendedAction,
    metadata: {
      wallet: classification.primaryWallet,
      eventType: classification.type,
      processedAt: new Date().toISOString(),
    },
  };
}
