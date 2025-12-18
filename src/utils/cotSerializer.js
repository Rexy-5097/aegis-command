/**
 * Cursor on Target (CoT) Serialization Adapter
 * 
 * SAFETY DISCLAIMER:
 * This adapter is for interoperability demonstration purposes only. 
 * It enables situational awareness data exchange and does not perform 
 * autonomous targeting, engagement, or action.
 * 
 * This module converts Aegis Command threat logs into CoT v2.0 XML format,
 * simulating how this system would integrate with standard Common Operational Pictures (COPs)
 * like ATAK or WinTAK in a deployment scenario.
 */

export function generateCoT(threatLog, deviceId = "Aegis-Unit-1") {
    const { label, confidence, timestamp } = threatLog;

    // Default Interop Values
    // Type: Atom-Unknown-Ground (a-u-G). 
    // We intentionally do NOT use 'hostile' (a-h-G) to prevent automated targeting loops.
    const type = "a-u-G";

    // Unique ID: Device + Timestamp
    const uid = `${deviceId}-${new Date(timestamp).getTime()}`;

    // Time formatting (ISO 8601)
    const time = new Date(timestamp).toISOString();
    const stale = new Date(new Date(timestamp).getTime() + 10 * 60000).toISOString(); // 10 min stale

    // Mock Location (San Diego Convention Center for Demo)
    // In a real device, this would come from the GPS sensor.
    const lat = "32.7071";
    const lon = "-117.1625";
    const hae = "0";     // Height Above Ellipsoid
    const ce = "9999999"; // Circular Error (High to indicate estimate)
    const le = "9999999"; // Linear Error

    return `
<event version="2.0" uid="${uid}" type="${type}" time="${time}" start="${time}" stale="${stale}" how="m-g">
    <point lat="${lat}" lon="${lon}" hae="${hae}" ce="${ce}" le="${le}"/>
    <detail>
        <contact callsign="${deviceId}" endpoint="" phone=""/>
        <remarks>
            DETECTED: ${label.toUpperCase()}
            CONFIDENCE: ${(confidence * 100).toFixed(0)}%
            SOURCE: Edge AI (Local)
            NOTE: Situational Awareness Data Only. No Targeting.
        </remarks>
        <__group name="Aegis Sensors" role="Sensor"/>
    </detail>
</event>
    `.trim();
}
