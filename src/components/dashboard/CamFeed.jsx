import { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { pipeline, env } from '@xenova/transformers';
import { clsx } from 'clsx';
import { logThreat } from '../../db/db';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

// Configure Transformers.js to not use local models if strict offline is needed, but we rely on caching.
// For true offline first run, the user needs to visit once online.
env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_NAME = 'Xenova/yolos-tiny';
const DETECTION_THRESHOLD = 0.50;
const DETECTION_INTERVAL = 800; // ms

// Phase 3: Tactical Threat Definitions
const THREAT_MAP = {
    "person": { label: "INFANTRY PRESENCE", color: "#ff0000" }, // Red
    "cell phone": { label: "DEVICE SIGNATURE", color: "#ffff00" },   // Yellow
    "backpack": { label: "SUSPICIOUS KIT", color: "#ffa500" },     // Orange
    "car": { label: "LIGHT VEHICLE", color: "#ff0000" },      // Red
    "laptop": { label: "CYBER TERMINAL", color: "#00ffff" }      // Cyan
};

export default function CamFeed() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [model, setModel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const lastLoggedRef = useRef({});
    const isOnline = useNetworkStatus();

    // 1. Initialize Model
    useEffect(() => {
        const loadModel = async () => {
            try {
                const detector = await pipeline('object-detection', MODEL_NAME);
                setModel(() => detector);
                setIsLoading(false);
                console.log("[AEGIS_AI] Model Loaded:", MODEL_NAME);
            } catch (err) {
                console.error("[AEGIS_AI] Model Failed:", err);
                setIsLoading(false); // Fail gracefully
            }
        };
        loadModel();
    }, []);

    // 2. Detection Loop
    // 3. Render & Log Logic
    const renderPredictions = useCallback((predictions, ctx, width, height, imageSrc) => {
        ctx.clearRect(0, 0, width, height);
        ctx.font = '12px monospace';
        ctx.lineWidth = 2; // Sharp lines

        const now = Date.now();

        predictions.forEach(prediction => {
            const { label, score, box } = prediction;

            // 1. Signal Discipline: Filter Noise
            const threatDef = THREAT_MAP[label];
            if (!threatDef) return; // Ignore unmapped objects (Plants, furniture, etc.)

            const { xmax, xmin, ymax, ymin } = box;
            const tacticalLabel = threatDef.label;
            const color = threatDef.color;

            // Draw Box (Sharp edges for tactical look)
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin);

            // Draw Label Background
            ctx.fillStyle = color;
            const text = `${tacticalLabel} ${(score * 100).toFixed(0)}%`;
            const textWidth = ctx.measureText(text).width;
            ctx.fillRect(xmin, ymin - 16, textWidth + 8, 16);

            // Draw Text
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 12px monospace';
            ctx.fillText(text, xmin + 4, ymin - 4);

            // Logging Logic (Debounced via Ref)
            // Use tactical label for persistence
            const lastTime = lastLoggedRef.current[tacticalLabel] || 0;
            if (now - lastTime > 5000) { // 5 seconds debounce
                // Capture Snapshot for Azure Vision (Phase 4)
                // We reuse the imageSrc we already grabbed for inference if possible, but webcamRef might have moved.
                // Best to grab specific frame if we can, or just use current buffer.
                // For simplicity and to match request '2.1 Snapshot Capture', we call getScreenshot again or reuse if suitable.
                // Since 'imageSrc' (Base64) was captured moments ago for inference, it is perfect.

                logThreat(tacticalLabel, score, imageSrc);
                lastLoggedRef.current[tacticalLabel] = now;
            }
        });
        // No state update needed
    }, []);

    useEffect(() => {
        let timeoutId;
        if (!model || isLoading) return;

        const loop = async () => {
            // 1. Checks
            if (!webcamRef.current || !webcamRef.current.video || !canvasRef.current) {
                timeoutId = setTimeout(loop, 1000);
                return;
            }
            const video = webcamRef.current.video;
            if (video.readyState !== 4) {
                timeoutId = setTimeout(loop, 1000);
                return;
            }

            // 2. Dimensions
            const { videoWidth, videoHeight } = video;
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // 3. Inference
            try {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    const output = await model(imageSrc, { threshold: DETECTION_THRESHOLD, percentage: true });
                    renderPredictions(output, canvasRef.current.getContext('2d'), videoWidth, videoHeight, imageSrc);
                }
            } catch (e) {
                console.error(e);
            }

            // 4. Schedule
            timeoutId = setTimeout(loop, 1500);
        };

        loop();

        return () => clearTimeout(timeoutId);
    }, [model, isLoading, renderPredictions]);





    return (
        <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden border border-cyber-gray group">
            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-cyber-black/90">
                    <div className="text-neon-green font-mono tracking-widest animate-pulse">
                        /// LOADING AI MODEL...
                    </div>
                </div>
            )}

            {/* Scanning Overlay Effect */}
            <div className={clsx(
                "absolute inset-0 z-20 pointer-events-none border-[2px]",
                isOnline ? "border-neon-green/30" : "border-alert-red/30"
            )}>
                {/* Corner flairs */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-green"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-green"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-green"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-green"></div>
            </div>

            {/* Webcam (Raw) */}
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "environment"
                }}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            />

            {/* Canvas Overlay */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover z-10"
            />
        </div>
    );
}
