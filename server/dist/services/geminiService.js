"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const genai_1 = require("@google/genai");
const env_js_1 = require("../config/env.js");
const uuid_1 = require("uuid");
let genAI = null;
if (env_js_1.hasGeminiConfig) {
    try {
        genAI = new genai_1.GoogleGenAI({ apiKey: env_js_1.ENV.GEMINI_API_KEY });
        console.log('✅ Google GenAI SDK initialized with provided API key.');
    }
    catch (err) {
        console.warn('⚠️ Could not initialize Google GenAI SDK. Fallback heuristic active.', err);
    }
}
class GeminiService {
    /**
     * Generates a comprehensive Food Spoilage & Urgency Advisory using Gemini AI
     */
    static async generateAdvisory(input, listingId = (0, uuid_1.v4)()) {
        if (genAI && env_js_1.ENV.GEMINI_API_KEY) {
            try {
                const prompt = `
You are the FoodRescue AI Safety and Spoilage Risk Advisory Engine.
Evaluate this surplus food donation based on food microbiology, storage temperature thermodynamics, FDA Food Code guidelines, and safe redistribution protocols.

FOOD DETAILS:
- Food Name: "${input.food_name}"
- Stated Category: "${input.category}"
- Description: "${input.description || 'None provided'}"
- Quantity: ${input.quantity} ${input.quantity_unit}
- Storage Condition: "${input.storage_condition}" (Reported temperature: ${input.storage_temperature ?? 'Unspecified'}°C)
- Packaging: "${input.packaging_status || 'standard'}"
- Preparation Time: ${input.preparation_time || 'Not specified'}
- Best Before Time: ${input.best_before_time || 'Not specified'}
- Pickup Deadline: ${input.pickup_end_time || 'Not specified'}
- Declared Allergens: ${(input.allergens || []).join(', ') || 'None'}

MANDATORY SAFETY SAFEGUARDS:
1. Never guarantee that food is safe to consume based purely on text or prediction.
2. Spoilage risk MUST be one of: "LOW", "MODERATE", "HIGH", "UNKNOWN". If details are ambiguous or conflicting, use "UNKNOWN".
3. Urgency level MUST be one of: "LOW", "MEDIUM", "HIGH", "CRITICAL".
   - Cooked meals / temperature-sensitive items ready to eat: "CRITICAL" or "HIGH".
   - Bakery / Dairy nearing date: "MEDIUM" or "HIGH".
   - Packaged dry goods / whole raw produce: "LOW".
4. Recommended timeframe in hours must be a positive float.
5. Provide actionable storage and handling instructions.
6. Provide specific safety warnings including temperature danger zone (4°C - 60°C / 40°F - 140°F) and mandatory human sensory/thermometer inspection.

Respond STRICTLY with a valid JSON object matching this schema:
{
  "spoilage_risk": "LOW" | "MODERATE" | "HIGH" | "UNKNOWN",
  "urgency_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "recommended_timeframe_hours": number,
  "storage_recommendations": string,
  "handling_recommendations": string,
  "safety_warnings": string[],
  "confidence_level": "LOW" | "MEDIUM" | "HIGH",
  "explanation": string
}
`;
                const response = await genAI.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                        temperature: 0.2, // Low temperature for consistent safety analysis
                    },
                });
                const rawText = response.text;
                if (rawText) {
                    const parsed = JSON.parse(rawText);
                    return {
                        id: (0, uuid_1.v4)(),
                        listing_id: listingId,
                        spoilage_risk: parsed.spoilage_risk || 'MODERATE',
                        urgency_level: parsed.urgency_level || 'HIGH',
                        recommended_timeframe_hours: Math.max(0.5, Number(parsed.recommended_timeframe_hours) || 4),
                        storage_recommendations: parsed.storage_recommendations || 'Maintain proper storage temperatures.',
                        handling_recommendations: parsed.handling_recommendations || 'Inspect visually and verify temperature.',
                        safety_warnings: Array.isArray(parsed.safety_warnings)
                            ? parsed.safety_warnings
                            : ['Food safety verification by trained personnel required before distribution.'],
                        confidence_level: parsed.confidence_level || 'HIGH',
                        explanation: parsed.explanation || 'Evaluated against food handling standards.',
                        raw_model_response: parsed,
                        created_at: new Date().toISOString(),
                    };
                }
            }
            catch (err) {
                console.warn('Gemini API call failed or timed out. Falling back to deterministic safety heuristics.', err);
            }
        }
        // Deterministic Rule-Based Fallback Engine
        return this.generateDeterministicAdvisory(input, listingId);
    }
    /**
     * Deterministic Food Safety Heuristic Engine
     * Formulated according to USDA / FDA Food Code 2022 Temperature Danger Zone guidelines
     */
    static generateDeterministicAdvisory(input, listingId = (0, uuid_1.v4)()) {
        const category = input.category;
        const storage = input.storage_condition;
        const temp = input.storage_temperature;
        let spoilage_risk = 'LOW';
        let urgency_level = 'MEDIUM';
        let recommended_hours = 24.0;
        let storage_rec = 'Store in clean, covered containers in a sanitized area.';
        let handling_rec = 'Verify packaging seals and perform sensory inspection before serving.';
        const warnings = [
            'Advisory is AI-assisted guidance and does not replace on-site food safety verification.',
        ];
        let explanation = '';
        if (category === 'Cooked Meals') {
            spoilage_risk = 'MODERATE';
            urgency_level = 'CRITICAL';
            recommended_hours = 3.5;
            if (storage === 'hot_holding') {
                storage_rec = 'Maintain above 60°C (140°F) in insulated thermal carriers until hand-off.';
                handling_rec = 'Recipient must probe core temperature (≥60°C) upon arrival. Rapid chill or serve within 2 hours.';
                warnings.push('Cooked meals left between 4°C and 60°C for over 2 hours must be discarded.');
                explanation = 'Cooked prepared dishes are TCS (Time/Temperature Control for Safety) foods requiring immediate distribution or cold chain chilling.';
            }
            else if (storage === 'refrigerated') {
                urgency_level = 'HIGH';
                recommended_hours = 24.0;
                storage_rec = 'Store below 4°C (40°F) continuously in sealed hygienic containers.';
                handling_rec = 'Ensure temperature log verification upon pickup. Reheat thoroughly to 74°C (165°F) before consumption.';
                explanation = 'Refrigerated prepared meals retain safety if the cold chain remains strictly intact below 4°C.';
            }
            else {
                spoilage_risk = 'HIGH';
                urgency_level = 'CRITICAL';
                recommended_hours = 1.5;
                storage_rec = 'Immediately transfer to refrigeration below 4°C or hot holding above 60°C.';
                warnings.push('High risk: Ambient holding of cooked food encourages rapid bacterial growth.');
                explanation = 'Cooked food held at ambient temperatures enters the microbial danger zone rapidly.';
            }
        }
        else if (category === 'Dairy Products') {
            spoilage_risk = 'MODERATE';
            urgency_level = 'HIGH';
            recommended_hours = 12.0;
            storage_rec = 'Refrigerate at or below 3°C (38°F). Do not allow dairy to sit at room temperature during transit.';
            handling_rec = 'Check for container bloat, seal integrity, and off-odor. Prioritize recipients with commercial chillers.';
            warnings.push('Milk and dairy must maintain uninterrupted cold chain below 4°C.');
            explanation = 'Dairy nearing its sell-by date has heightened vulnerability to lactic acidification and microbial growth.';
        }
        else if (category === 'Bakery Products') {
            spoilage_risk = 'LOW';
            urgency_level = 'MEDIUM';
            recommended_hours = 24.0;
            storage_rec = 'Store in dry, pest-free area at 15°C–22°C away from humidity and direct sunlight.';
            handling_rec = 'Inspect for condensation inside wrapping and surface mold.';
            warnings.push('Label common bakery allergens: wheat gluten, egg, and tree nuts.');
            explanation = 'Baked breads and dry pastries have low water activity, extending safe shelf life up to 24–48 hours.';
        }
        else if (category === 'Fruits' || category === 'Vegetables') {
            spoilage_risk = 'LOW';
            urgency_level = 'LOW';
            recommended_hours = 72.0;
            storage_rec = 'Keep in well-ventilated crates at 10°C–14°C or cold room for leafy greens (2°C–5°C).';
            handling_rec = 'Cull damaged or bruised units to prevent ethylene propagation across adjacent produce.';
            warnings.push('Wash produce thoroughly under potable running water before food prep.');
            explanation = 'Raw intact produce possesses protective natural skins and is suitable for multi-day distribution.';
        }
        else if (category === 'Packaged Food' || category === 'Grains and Cereals') {
            spoilage_risk = 'LOW';
            urgency_level = 'LOW';
            recommended_hours = 168.0; // 7 days
            storage_rec = 'Store on pallets 6 inches off floor in dry, cool pantry storage.';
            handling_rec = 'Verify commercial factory seals, inspect for dented cans, tears, or pest entry.';
            warnings.push('Do not distribute rusted, severely dented, or unsealed cans.');
            explanation = 'Hermetically sealed or dry shelf-stable items offer maximum stability for pantry stock.';
        }
        else {
            spoilage_risk = 'UNKNOWN';
            urgency_level = 'MEDIUM';
            recommended_hours = 12.0;
            storage_rec = 'Store according to manufacturer or chef specifications.';
            handling_rec = 'Trained personnel must inspect packaging and verify safety before serving.';
            explanation = 'General category requires direct inspection by receiving organization.';
        }
        if (input.allergens && input.allergens.length > 0) {
            warnings.push(`Contains declared allergens: ${input.allergens.join(', ')}. Keep isolated from allergen-sensitive supplies.`);
        }
        return {
            id: (0, uuid_1.v4)(),
            listing_id: listingId,
            spoilage_risk,
            urgency_level,
            recommended_timeframe_hours: recommended_hours,
            storage_recommendations: storage_rec,
            handling_recommendations: handling_rec,
            safety_warnings: warnings,
            confidence_level: 'HIGH',
            explanation,
            created_at: new Date().toISOString(),
        };
    }
    /**
     * Generates intelligent matching rationale and redistribution strategy
     */
    static async generateMatchingInsights(listingName, category, quantity, unit, urgency, recipientOrgName, recipientType, distanceKm) {
        if (genAI && env_js_1.ENV.GEMINI_API_KEY) {
            try {
                const prompt = `
In 2 concise sentences, provide an AI redistribution rationale explaining why ${recipientOrgName} (${recipientType}, ${distanceKm.toFixed(1)} km away) is an optimal recipient for ${quantity} ${unit} of "${listingName}" (${category}, urgency: ${urgency}). Emphasize speed, cold chain logistics, or community beneficiary impact.
`;
                const res = await genAI.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                if (res.text)
                    return res.text.trim();
            }
            catch {
                // Fallback below
            }
        }
        if (urgency === 'CRITICAL' || urgency === 'HIGH') {
            return `${recipientOrgName} is located only ${distanceKm.toFixed(1)} km away with verified intake capabilities, allowing safe hot-holding or cold-chain transit within the critical rescue window.`;
        }
        return `${recipientOrgName} operates regular community distribution with sufficient capacity to accept ${quantity} ${unit} and prevent waste.`;
    }
}
exports.GeminiService = GeminiService;
//# sourceMappingURL=geminiService.js.map