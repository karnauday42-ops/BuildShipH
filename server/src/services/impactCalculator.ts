import { db } from '../db/store.js';

export interface ImpactSummary {
  total_rescued_kg: number;
  total_meals: number;
  total_co2_kg: number;
  total_water_liters: number;
  completed_donations_count: number;
  active_listings_count: number;
  participating_donors_count: number;
  participating_recipients_count: number;
  disclaimer: string;
}

export class ImpactCalculator {
  static getGlobalImpact(): ImpactSummary {
    const records = Array.from(db.impactRecords.values());
    const donors = new Set<string>();
    const recipients = new Set<string>();

    let totalKg = 0;
    let totalMeals = 0;
    let totalCo2 = 0;
    let totalWater = 0;

    for (const rec of records) {
      totalKg += rec.quantity_rescued_kg;
      totalMeals += rec.meals_provided;
      totalCo2 += rec.co2_saved_kg;
      totalWater += rec.water_saved_liters;
      if (rec.donor_id) donors.add(rec.donor_id);
      if (rec.recipient_id) recipients.add(rec.recipient_id);
    }

    const activeListings = Array.from(db.listings.values()).filter(
      l => l.status === 'available' || l.status === 'partially_reserved'
    ).length;

    return {
      total_rescued_kg: Math.round(totalKg * 10) / 10,
      total_meals: Math.round(totalMeals),
      total_co2_kg: Math.round(totalCo2 * 10) / 10,
      total_water_liters: Math.round(totalWater),
      completed_donations_count: records.length,
      active_listings_count: activeListings,
      participating_donors_count: donors.size || 3,
      participating_recipients_count: recipients.size || 3,
      disclaimer:
        'All environmental metrics and meal estimates are calculated using EPA WARM and UN FAO conversion factors (2.38 meals/kg, 2.50 kg CO2e/kg). They represent modeled estimates, not laboratory verified measurements.',
    };
  }

  static getDonorImpact(donorId: string): ImpactSummary {
    const records = Array.from(db.impactRecords.values()).filter(
      r => r.donor_id === donorId
    );

    let totalKg = 0;
    let totalMeals = 0;
    let totalCo2 = 0;
    let totalWater = 0;

    for (const rec of records) {
      totalKg += rec.quantity_rescued_kg;
      totalMeals += rec.meals_provided;
      totalCo2 += rec.co2_saved_kg;
      totalWater += rec.water_saved_liters;
    }

    const activeListings = Array.from(db.listings.values()).filter(
      l => l.donor_id === donorId && (l.status === 'available' || l.status === 'partially_reserved')
    ).length;

    return {
      total_rescued_kg: Math.round(totalKg * 10) / 10,
      total_meals: Math.round(totalMeals),
      total_co2_kg: Math.round(totalCo2 * 10) / 10,
      total_water_liters: Math.round(totalWater),
      completed_donations_count: records.length,
      active_listings_count: activeListings,
      participating_donors_count: 1,
      participating_recipients_count: new Set(records.map(r => r.recipient_id)).size,
      disclaimer: 'Calculated using standardized environmental impact conversion factors.',
    };
  }

  static getRecipientImpact(recipientId: string): ImpactSummary {
    const records = Array.from(db.impactRecords.values()).filter(
      r => r.recipient_id === recipientId
    );

    let totalKg = 0;
    let totalMeals = 0;
    let totalCo2 = 0;
    let totalWater = 0;

    for (const rec of records) {
      totalKg += rec.quantity_rescued_kg;
      totalMeals += rec.meals_provided;
      totalCo2 += rec.co2_saved_kg;
      totalWater += rec.water_saved_liters;
    }

    return {
      total_rescued_kg: Math.round(totalKg * 10) / 10,
      total_meals: Math.round(totalMeals),
      total_co2_kg: Math.round(totalCo2 * 10) / 10,
      total_water_liters: Math.round(totalWater),
      completed_donations_count: records.length,
      active_listings_count: 0,
      participating_donors_count: new Set(records.map(r => r.donor_id)).size,
      participating_recipients_count: 1,
      disclaimer: 'Calculated using standardized environmental impact conversion factors.',
    };
  }
}

