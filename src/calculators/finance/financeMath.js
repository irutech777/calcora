// Pure, unit-tested-in-spirit calculation functions for every finance
// calculator. Nothing here touches the DOM or React — inputs in, numbers out.

export function calculateEMI({ principal, annualRate, years, months = 0 }) {
  const P = Number(principal);
  const annualPct = Number(annualRate);
  const n = Math.round(Number(years) * 12 + Number(months || 0));

  if (!(P > 0)) throw new Error("Please enter a valid loan amount.");
  if (!(annualPct >= 0)) throw new Error("Please enter a valid interest rate.");
  if (!(n > 0)) throw new Error("Please enter a valid loan tenure.");

  const r = annualPct / 12 / 100;
  let emi;
  if (r === 0) {
    emi = P / n;
  } else {
    const factor = Math.pow(1 + r, n);
    emi = (P * r * factor) / (factor - 1);
  }
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  // Build a simple year-wise amortization summary for the chart.
  let balance = P;
  const schedule = [];
  for (let m = 1; m <= n; m++) {
    const interestPortion = balance * r;
    const principalPortion = emi - interestPortion;
    balance = Math.max(0, balance - principalPortion);
    if (m % 12 === 0 || m === n) {
      schedule.push({ label: `Yr ${Math.ceil(m / 12)}`, balance: round2(balance) });
    }
  }

  return {
    emi: round2(emi),
    totalInterest: round2(totalInterest),
    totalPayment: round2(totalPayment),
    principal: round2(P),
    schedule,
  };
}

export function calculateSIP({ monthlyInvestment, annualReturn, years }) {
  const P = Number(monthlyInvestment);
  const annualPct = Number(annualReturn);
  const n = Math.round(Number(years) * 12);

  if (!(P > 0)) throw new Error("Please enter a valid monthly investment.");
  if (!(annualPct >= 0)) throw new Error("Please enter a valid expected return.");
  if (!(n > 0)) throw new Error("Please enter a valid investment period.");

  const r = annualPct / 12 / 100;
  const futureValue =
    r === 0 ? P * n : P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = P * n;
  const returns = futureValue - invested;

  const chart = [];
  for (let y = 1; y <= Math.ceil(n / 12); y++) {
    const m = Math.min(y * 12, n);
    const fv = r === 0 ? P * m : P * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
    chart.push({ label: `Yr ${y}`, value: round2(fv) });
  }

  return {
    invested: round2(invested),
    returns: round2(returns),
    total: round2(futureValue),
    chart,
  };
}

export function calculateLumpSum({ investment, annualReturn, years }) {
  const P = Number(investment);
  const rate = Number(annualReturn);
  const t = Number(years);

  if (!(P > 0)) throw new Error("Please enter a valid investment amount.");
  if (!(rate >= 0)) throw new Error("Please enter a valid expected return.");
  if (!(t > 0)) throw new Error("Please enter a valid time period.");

  const total = P * Math.pow(1 + rate / 100, t);
  return {
    invested: round2(P),
    returns: round2(total - P),
    total: round2(total),
  };
}

export function calculateFD({ principal, annualRate, years, compounding = 4 }) {
  const P = Number(principal);
  const rate = Number(annualRate);
  const t = Number(years);
  const n = Number(compounding); // times compounded per year

  if (!(P > 0)) throw new Error("Please enter a valid deposit amount.");
  if (!(rate >= 0)) throw new Error("Please enter a valid interest rate.");
  if (!(t > 0)) throw new Error("Please enter a valid tenure.");

  const maturity = P * Math.pow(1 + rate / 100 / n, n * t);
  return {
    principal: round2(P),
    interestEarned: round2(maturity - P),
    maturityAmount: round2(maturity),
  };
}

export function calculateRD({ monthlyDeposit, annualRate, months }) {
  const P = Number(monthlyDeposit);
  const rate = Number(annualRate);
  const n = Number(months);

  if (!(P > 0)) throw new Error("Please enter a valid monthly deposit.");
  if (!(rate >= 0)) throw new Error("Please enter a valid interest rate.");
  if (!(n > 0)) throw new Error("Please enter a valid tenure in months.");

  const r = rate / 400; // quarterly compounding approximation per deposit, i/4/100
  let maturity = 0;
  for (let i = 1; i <= n; i++) {
    const monthsRemaining = n - i + 1;
    const quarters = monthsRemaining / 3;
    maturity += P * Math.pow(1 + r, quarters);
  }
  const invested = P * n;
  return {
    invested: round2(invested),
    interestEarned: round2(maturity - invested),
    maturityAmount: round2(maturity),
  };
}

export function calculateSimpleInterest({ principal, annualRate, years }) {
  const P = Number(principal);
  const rate = Number(annualRate);
  const t = Number(years);

  if (!(P > 0)) throw new Error("Please enter a valid principal amount.");
  if (!(rate >= 0)) throw new Error("Please enter a valid interest rate.");
  if (!(t > 0)) throw new Error("Please enter a valid time period.");

  const interest = (P * rate * t) / 100;
  return {
    principal: round2(P),
    interest: round2(interest),
    total: round2(P + interest),
  };
}

export function calculateCompoundInterest({ principal, annualRate, years, compounding = 1 }) {
  const P = Number(principal);
  const rate = Number(annualRate);
  const t = Number(years);
  const n = Number(compounding);

  if (!(P > 0)) throw new Error("Please enter a valid principal amount.");
  if (!(rate >= 0)) throw new Error("Please enter a valid interest rate.");
  if (!(t > 0)) throw new Error("Please enter a valid time period.");

  const total = P * Math.pow(1 + rate / 100 / n, n * t);
  return {
    principal: round2(P),
    interest: round2(total - P),
    total: round2(total),
  };
}

export function calculateGST({ amount, rate, type = "exclusive" }) {
  const A = Number(amount);
  const gstRate = Number(rate);

  if (!(A > 0)) throw new Error("Please enter a valid amount.");
  if (!(gstRate >= 0)) throw new Error("Please enter a valid GST rate.");

  let baseAmount, gstAmount, finalAmount;
  if (type === "inclusive") {
    baseAmount = A / (1 + gstRate / 100);
    gstAmount = A - baseAmount;
    finalAmount = A;
  } else {
    baseAmount = A;
    gstAmount = (A * gstRate) / 100;
    finalAmount = A + gstAmount;
  }

  return {
    baseAmount: round2(baseAmount),
    gstAmount: round2(gstAmount),
    cgst: round2(gstAmount / 2),
    sgst: round2(gstAmount / 2),
    igst: round2(gstAmount),
    finalAmount: round2(finalAmount),
  };
}

export function calculateSalary({ basic, hra = 0, allowances = 0, deductions = 0 }) {
  const b = Number(basic);
  const h = Number(hra) || 0;
  const a = Number(allowances) || 0;
  const d = Number(deductions) || 0;

  if (!(b > 0)) throw new Error("Please enter a valid basic salary.");
  if (d < 0) throw new Error("Deductions cannot be negative.");

  const gross = b + h + a;
  const net = gross - d;
  if (net < 0) throw new Error("Deductions cannot exceed gross salary.");

  return {
    gross: round2(gross),
    totalDeductions: round2(d),
    net: round2(net),
  };
}

export function calculatePPF({ yearlyInvestment, years = 15, rate = 7.1 }) {
  const P = Number(yearlyInvestment);
  const t = Number(years);
  const r = Number(rate) / 100;

  if (!(P > 0)) throw new Error("Please enter a valid yearly investment.");
  if (P > 150000) throw new Error("PPF investment cannot exceed ₹1,50,000 per year.");
  if (!(t > 0)) throw new Error("Please enter a valid number of years.");

  let balance = 0;
  for (let y = 1; y <= t; y++) {
    balance = (balance + P) * (1 + r);
  }
  const invested = P * t;
  return {
    invested: round2(invested),
    interestEarned: round2(balance - invested),
    maturityAmount: round2(balance),
  };
}

export function calculateNPS({ monthlyContribution, currentAge, retirementAge = 60, annualReturn = 10 }) {
  const P = Number(monthlyContribution);
  const age = Number(currentAge);
  const retireAge = Number(retirementAge);
  const rate = Number(annualReturn);

  if (!(P > 0)) throw new Error("Please enter a valid monthly contribution.");
  if (!(age > 0 && age < retireAge)) throw new Error("Please enter a valid current age.");

  const n = (retireAge - age) * 12;
  const r = rate / 12 / 100;
  const corpus = r === 0 ? P * n : P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = P * n;

  return {
    invested: round2(invested),
    wealthGained: round2(corpus - invested),
    totalCorpus: round2(corpus),
    yearsToRetirement: retireAge - age,
  };
}

// Simplified, easily-updatable Indian new-regime style slabs for FY 2025-26.
// Kept as data so rates can change without touching calculation logic or UI.
export const INCOME_TAX_SLABS_NEW_REGIME = [
  { upto: 400000, rate: 0 },
  { upto: 800000, rate: 5 },
  { upto: 1200000, rate: 10 },
  { upto: 1600000, rate: 15 },
  { upto: 2000000, rate: 20 },
  { upto: 2400000, rate: 25 },
  { upto: Infinity, rate: 30 },
];

export function calculateIncomeTax({ annualIncome, slabs = INCOME_TAX_SLABS_NEW_REGIME, standardDeduction = 75000 }) {
  const income = Number(annualIncome);
  if (!(income >= 0)) throw new Error("Please enter a valid annual income.");

  const taxable = Math.max(0, income - Number(standardDeduction));
  let tax = 0;
  let lower = 0;
  const breakdown = [];
  for (const slab of slabs) {
    if (taxable > lower) {
      const upper = Math.min(taxable, slab.upto);
      const slabAmount = Math.max(0, upper - lower);
      const slabTax = (slabAmount * slab.rate) / 100;
      if (slabAmount > 0) {
        breakdown.push({ range: `${format(lower)} – ${slab.upto === Infinity ? "above" : format(slab.upto)}`, rate: slab.rate, tax: round2(slabTax) });
      }
      tax += slabTax;
      lower = slab.upto;
    }
  }
  const cess = tax * 0.04;
  return {
    taxableIncome: round2(taxable),
    taxBeforeCess: round2(tax),
    cess: round2(cess),
    totalTax: round2(tax + cess),
    netIncome: round2(income - (tax + cess)),
    breakdown,
  };

  function format(n) {
    return new Intl.NumberFormat("en-IN").format(n);
  }
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
