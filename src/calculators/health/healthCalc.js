function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calculateBMI({ heightCm, weightKg }) {
  const h = Number(heightCm) / 100;
  const w = Number(weightKg);
  if (!(h > 0)) throw new Error("Please enter a valid height.");
  if (!(w > 0)) throw new Error("Please enter a valid weight.");

  const bmi = w / (h * h);
  let category;
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Healthy weight";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  const healthyMin = round2(18.5 * h * h);
  const healthyMax = round2(24.9 * h * h);

  return { bmi: round2(bmi), category, healthyMin, healthyMax };
}

export function calculateBMR({ gender, weightKg, heightCm, age }) {
  const w = Number(weightKg);
  const h = Number(heightCm);
  const a = Number(age);
  if (!(w > 0) || !(h > 0) || !(a > 0)) throw new Error("Please enter valid values for weight, height and age.");

  // Mifflin-St Jeor equation
  const base = 10 * w + 6.25 * h - 5 * a;
  const bmr = gender === "female" ? base - 161 : base + 5;
  return { bmr: round2(bmr) };
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export function calculateCalories({ gender, weightKg, heightCm, age, activity = "moderate" }) {
  const { bmr } = calculateBMR({ gender, weightKg, heightCm, age });
  const multiplier = ACTIVITY_MULTIPLIERS[activity] ?? 1.55;
  const maintenance = bmr * multiplier;
  return {
    bmr: round2(bmr),
    maintenance: round2(maintenance),
    mildLoss: round2(maintenance - 250),
    weightLoss: round2(maintenance - 500),
    weightGain: round2(maintenance + 500),
  };
}

export function calculateIdealWeight({ gender, heightCm }) {
  const h = Number(heightCm);
  if (!(h > 0)) throw new Error("Please enter a valid height.");
  const heightInInches = h / 2.54;
  const inchesOver5Feet = Math.max(0, heightInInches - 60);

  // Devine formula
  const base = gender === "female" ? 45.5 : 50;
  const ideal = base + 2.3 * inchesOver5Feet;
  return {
    idealWeightKg: round2(ideal),
    rangeMinKg: round2(ideal * 0.9),
    rangeMaxKg: round2(ideal * 1.1),
  };
}

export function calculateBodyFat({ gender, heightCm, waistCm, neckCm, hipCm }) {
  const h = Number(heightCm);
  const waist = Number(waistCm);
  const neck = Number(neckCm);
  const hip = Number(hipCm) || 0;

  if (!(h > 0) || !(waist > 0) || !(neck > 0)) {
    throw new Error("Please enter valid height, waist and neck measurements.");
  }
  if (gender === "female" && !(hip > 0)) {
    throw new Error("Please enter a valid hip measurement.");
  }

  let bodyFat;
  if (gender === "female") {
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(h)) - 450;
  } else {
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450;
  }

  if (!isFinite(bodyFat) || bodyFat < 0) throw new Error("Please check your measurements and try again.");

  let category;
  if (gender === "female") {
    category = bodyFat < 21 ? "Athletic/Essential" : bodyFat < 25 ? "Fitness" : bodyFat < 32 ? "Average" : "Above average";
  } else {
    category = bodyFat < 14 ? "Athletic/Essential" : bodyFat < 18 ? "Fitness" : bodyFat < 25 ? "Average" : "Above average";
  }

  return { bodyFatPercent: round2(bodyFat), category };
}
