import axios from 'axios';
import { AzureOpenAI } from 'openai';
import { generateCoT } from '../utils/cotSerializer';

/**
 * PHASE 4: REAL DUAL-AI PIPELINE
 * 
 * Service 1: Azure AI Vision (Deep Perception)
 * Service 2: Azure OpenAI (Tactical Synthesis)
 */

// Configuration
const CONFIG = {
    AOAI_ENDPOINT: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
    AOAI_KEY: import.meta.env.VITE_AZURE_OPENAI_KEY,
    AOAI_DEPLOYMENT: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
    VISION_ENDPOINT: import.meta.env.VITE_AZURE_VISION_ENDPOINT,
    VISION_KEY: import.meta.env.VITE_AZURE_VISION_KEY
};

// Graceful Fallback Check
const isConfigured = () => {
    return CONFIG.AOAI_ENDPOINT && CONFIG.AOAI_KEY && CONFIG.VISION_ENDPOINT && CONFIG.VISION_KEY;
};

// --- SERVICE 1: AZURE AI VISION ---

/**
 * Analyzes a threat snapshot using Azure Computer Vision 3.2
 * @param {string} base64Image - Base64 encoded image string
 * @returns {Promise<string>} - Visual description
 */
async function analyzeThreatImage(base64Image) {
    if (!base64Image) return "No visual data available.";

    try {
        // Convert Base64 to Blob
        const fetchResponse = await fetch(base64Image);
        const blob = await fetchResponse.blob();

        const endpoint = `${CONFIG.VISION_ENDPOINT}vision/v3.2/analyze?visualFeatures=Description,Tags`;

        const response = await axios.post(endpoint, blob, {
            headers: {
                'Ocp-Apim-Subscription-Key': CONFIG.VISION_KEY,
                'Content-Type': 'application/octet-stream'
            }
        });

        const caption = response.data.description.captions[0]?.text || "Unidentified visual signature";
        const tags = response.data.tags.map(t => t.name).slice(0, 5).join(", ");

        return `Visual Analysis: ${caption}. Key elements: ${tags}.`;

    } catch (error) {
        console.error("[AZURE_VISION] Analysis Failed:", error);
        return "Visual analysis failed (Link degraded).";
    }
}

// --- SERVICE 2: AZURE OPENAI ---

/**
 * Generates a tactical SITREP using Azure OpenAI (GPT-4o)
 * @param {Array} logs - Recent threat logs
 * @param {Array} insights - Visual insights from Azure Vision
 * @returns {Promise<string>} - Tactical SITREP
 */
async function generateTacticalReport(logs, insights) {
    try {
        const client = new AzureOpenAI({
            endpoint: CONFIG.AOAI_ENDPOINT,
            apiKey: CONFIG.AOAI_KEY,
            deployment: CONFIG.AOAI_DEPLOYMENT,
            dangerouslyAllowBrowser: true // Client-side demo only
        });

        const dataPayload = JSON.stringify({
            threat_logs: logs.map(l => ({
                label: l.label,
                confidence: l.confidence,
                timestamp: l.timestamp,
                payload_raw: l.payload_raw // INTEROP: CoT XML
            })),
            visual_insights: insights
        }, null, 2);

        const prompt = `
            INPUT DATA (JSON):
            ${dataPayload}

            TASK:
            Generate a 3-sentence Tactical SITREP.
            Focus on situational awareness, pattern recognition, and defensive recommendations.
            Tone: Professional, Analytical, Defensive.
        `;

        const completion = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are an intelligence analysis assistant. Summarize observations defensively for situational awareness only. Do not suggest violence or targeting." },
                { role: "user", content: prompt }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        return `HQ ANALYSIS: ${completion.choices[0].message.content}`;

    } catch (error) {
        console.error("[AZURE_OPENAI] Generation Failed:", error);
        return "HQ ANALYSIS: Uplink unstable. Automated synthesis unavailable.";
    }
}

// --- MAIN PIPELINE ---

export const azureService = {
    /**
     * Orchestrates the Dual-AI Pipeline
     */
    async uploadThreats(logs) {
        // 1. Fallback if no keys (Demo Safety)
        if (!isConfigured()) {
            console.warn("[AZURE] Keys missing. Falling back to Mock Link.");
            return new Promise(resolve => {
                setTimeout(() => resolve({
                    status: 'success',
                    timestamp: new Date().toISOString(),
                    hq_analysis: "HQ ANALYSIS (MOCK): System running in OFFLINE DEMO MODE. Add Azure Keys to enable real-time AI analysis."
                }), 1500);
            });
        }

        console.log(`[AZURE_UPLINK] Processing ${logs.length} packets...`);

        // 2. Run Vision Analysis (Parallel)
        // Only analyze logs that have snapshots
        const visionPromises = logs
            .filter(l => l.snapshot_data)
            .map(l => analyzeThreatImage(l.snapshot_data));

        // 3. Generate CoT Payloads (Interoperability Layer)
        logs.forEach(log => {
            log.payload_raw = generateCoT(log, "Aegis-Unit-1");
        });

        const visionResults = await Promise.all(visionPromises);

        // 3. Run Tactical Synthesis
        const witrep = await generateTacticalReport(logs, visionResults);

        return {
            status: 'success',
            timestamp: new Date().toISOString(),
            hq_analysis: witrep
        };
    }
};
