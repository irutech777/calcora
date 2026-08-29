function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function cgpaToPercentage({ cgpa, multiplier = 9.5 }) {
  const c = Number(cgpa);
  const m = Number(multiplier);
  if (!(c >= 0 && c <= 10)) throw new Error("CGPA must be between 0 and 10.");
  return { percentage: round2(c * m) };
}

export function percentageToCgpa({ percentage, divisor = 9.5 }) {
  const p = Number(percentage);
  const d = Number(divisor);
  if (!(p >= 0 && p <= 100)) throw new Error("Percentage must be between 0 and 100.");
  return { cgpa: round2(p / d) };
}

export function calculateGPA({ courses }) {
  // courses: array of { grade: number (0-10 or 0-4), credits: number }
  if (!Array.isArray(courses) || courses.length === 0) {
    throw new Error("Please add at least one course.");
  }
  let totalCredits = 0;
  let totalPoints = 0;
  for (const c of courses) {
    const grade = Number(c.grade);
    const credits = Number(c.credits);
    if (!(grade >= 0) || !(credits > 0)) {
      throw new Error("Please enter valid grade points and credits for every course.");
    }
    totalCredits += credits;
    totalPoints += grade * credits;
  }
  return { gpa: round2(totalPoints / totalCredits), totalCredits };
}

export function marksPercentage({ obtained, total }) {
  const o = Number(obtained);
  const t = Number(total);
  if (!(t > 0)) throw new Error("Total marks must be greater than zero.");
  if (!(o >= 0)) throw new Error("Please enter valid marks obtained.");
  if (o > t) throw new Error("Marks obtained cannot exceed total marks.");
  return { percentage: round2((o / t) * 100) };
}

const GRADE_SCALE = [
  { min: 90, grade: "A+" },
  { min: 80, grade: "A" },
  { min: 70, grade: "B+" },
  { min: 60, grade: "B" },
  { min: 50, grade: "C" },
  { min: 40, grade: "D" },
  { min: 0, grade: "F" },
];

export function gradeFromPercentage({ percentage }) {
  const p = Number(percentage);
  if (!(p >= 0 && p <= 100)) throw new Error("Percentage must be between 0 and 100.");
  const found = GRADE_SCALE.find((g) => p >= g.min);
  return { grade: found.grade, percentage: p };
}

export function attendanceCalculator({ attended, total, targetPercent = 75 }) {
  const a = Number(attended);
  const t = Number(total);
  const target = Number(targetPercent);

  if (!(t > 0)) throw new Error("Total classes must be greater than zero.");
  if (!(a >= 0)) throw new Error("Please enter a valid number of classes attended.");
  if (a > t) throw new Error("Classes attended cannot exceed total classes.");
  if (!(target > 0 && target <= 100)) throw new Error("Target attendance must be between 1 and 100%.");

  const current = (a / t) * 100;

  // Classes needed to reach target: (a + x) / (t + x) >= target/100
  let classesNeeded = 0;
  if (current < target) {
    classesNeeded = Math.ceil((target * t - 100 * a) / (100 - target));
  }

  // Max classes that can be missed while staying at/above target:
  // (a) / (t + y) >= target/100  =>  y <= (100a - target*t) / target
  let maxMissable = 0;
  if (current >= target) {
    maxMissable = Math.floor((100 * a - target * t) / target);
  }

  return {
    currentPercent: round2(current),
    classesNeeded: Math.max(0, classesNeeded),
    maxMissable: Math.max(0, maxMissable),
    meetsTarget: current >= target,
  };
}
