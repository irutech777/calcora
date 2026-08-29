import * as fin from "../calculators/finance/financeMath.js";
import * as math from "../calculators/math/mathCalc.js";
import * as health from "../calculators/health/healthCalc.js";
import * as edu from "../calculators/education/educationCalc.js";
import * as dev from "../calculators/developer/developerCalc.js";
import { formatCurrency, formatNumber, formatPercent } from "../utils/format.js";

// ---------------------------------------------------------------------------
// Every calculator on IruCalc is one entry in this array. To add a new
// calculator: write a pure calculation function in src/calculators/<cat>/,
// then add one object below describing its fields and how to render results.
// Nothing elsewhere in the app needs to change.
// ---------------------------------------------------------------------------

const num = (overrides) => ({ type: "number", step: "any", ...overrides });

export const CALCULATORS = [
  // ---------------------------------------------------------------- FINANCE
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    category: "finance",
    icon: "Landmark",
    description: "Work out your monthly loan EMI, total interest and total payment.",
    fields: [
      num({ id: "principal", label: "Loan Amount", unit: "₹", defaultValue: 2500000 }),
      num({ id: "annualRate", label: "Interest Rate (per year)", unit: "%", defaultValue: 8.5 }),
      num({ id: "years", label: "Loan Tenure", unit: "years", defaultValue: 20 }),
    ],
    compute: (v) => {
      const r = fin.calculateEMI({ principal: v.principal, annualRate: v.annualRate, years: v.years });
      return {
        results: [
          { label: "Monthly EMI", value: formatCurrency(r.emi), highlight: true },
          { label: "Principal Amount", value: formatCurrency(r.principal) },
          { label: "Total Interest", value: formatCurrency(r.totalInterest) },
          { label: "Total Payment", value: formatCurrency(r.totalPayment) },
        ],
        chart: { type: "donut", data: [{ label: "Principal", value: r.principal }, { label: "Interest", value: r.totalInterest }] },
      };
    },
    formula: "EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1), where P = principal, r = monthly interest rate, n = number of monthly instalments.",
    whatIs: "An EMI (Equated Monthly Instalment) is the fixed amount you pay a lender every month until a loan — home, car, or personal — is fully repaid. Each instalment covers a mix of principal repayment and interest.",
    howItWorks: "Enter the loan amount, the annual interest rate your lender charges, and the tenure in years. IruCalc converts the annual rate into a monthly rate, applies the standard amortization formula, and shows your EMI along with how much of the total payment is interest versus principal.",
    example: "A ₹25,00,000 home loan at 8.5% annual interest over 20 years works out to an EMI of roughly ₹21,700 per month, with total interest of about ₹26.1 lakh over the loan's life.",
    faqs: [
      { q: "Does a longer tenure always mean lower EMI?", a: "Yes — stretching the tenure lowers the monthly instalment, but increases the total interest you pay over the life of the loan." },
      { q: "Is the interest rate here flat or reducing balance?", a: "This calculator uses the reducing-balance method, which is how banks calculate EMIs in practice — interest is charged only on the outstanding balance." },
      { q: "Can I include processing fees?", a: "This calculator focuses on principal and interest. Add one-time fees separately to your total cost of borrowing." },
    ],
    related: ["loan-calculator", "sip-calculator", "compound-interest-calculator"],
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    category: "finance",
    icon: "TrendingUp",
    description: "Estimate the future value of a monthly SIP investment.",
    fields: [
      num({ id: "monthlyInvestment", label: "Monthly Investment", unit: "₹", defaultValue: 10000 }),
      num({ id: "annualReturn", label: "Expected Annual Return", unit: "%", defaultValue: 12 }),
      num({ id: "years", label: "Investment Period", unit: "years", defaultValue: 15 }),
    ],
    compute: (v) => {
      const r = fin.calculateSIP(v);
      return {
        results: [
          { label: "Total Value", value: formatCurrency(r.total), highlight: true },
          { label: "Invested Amount", value: formatCurrency(r.invested) },
          { label: "Estimated Returns", value: formatCurrency(r.returns) },
        ],
        chart: { type: "line", data: r.chart },
      };
    },
    formula: "Future Value = P × [((1 + r)ⁿ − 1) / r] × (1 + r), where P = monthly investment, r = monthly rate of return, n = number of months.",
    whatIs: "A Systematic Investment Plan (SIP) lets you invest a fixed amount into a mutual fund every month. This calculator projects how that habit compounds into a future corpus.",
    howItWorks: "Enter your planned monthly investment, the annual return you expect the fund to deliver, and how many years you'll stay invested. The calculator compounds your contributions monthly to estimate the maturity value.",
    example: "Investing ₹10,000 every month for 15 years at an expected 12% annual return grows to roughly ₹50.3 lakh, of which about ₹18 lakh is your own contribution and the rest is growth.",
    faqs: [
      { q: "Is the return guaranteed?", a: "No. Mutual fund returns are market-linked and not guaranteed — 12% is a commonly used planning assumption, not a promise." },
      { q: "What if I increase my SIP every year?", a: "This calculator assumes a flat monthly amount. A step-up SIP will typically grow to a larger corpus than shown here." },
    ],
    related: ["lumpsum-calculator", "ppf-calculator", "compound-interest-calculator"],
  },
  {
    slug: "lumpsum-calculator",
    name: "Lump Sum Calculator",
    category: "finance",
    icon: "PiggyBank",
    description: "See how a one-time investment can grow over time.",
    fields: [
      num({ id: "investment", label: "Investment Amount", unit: "₹", defaultValue: 100000 }),
      num({ id: "annualReturn", label: "Expected Annual Return", unit: "%", defaultValue: 11 }),
      num({ id: "years", label: "Time Period", unit: "years", defaultValue: 10 }),
    ],
    compute: (v) => {
      const r = fin.calculateLumpSum(v);
      return {
        results: [
          { label: "Maturity Value", value: formatCurrency(r.total), highlight: true },
          { label: "Invested Amount", value: formatCurrency(r.invested) },
          { label: "Estimated Returns", value: formatCurrency(r.returns) },
        ],
      };
    },
    formula: "Future Value = P × (1 + r)ᵗ, where P = investment, r = annual rate of return, t = years.",
    whatIs: "A lump sum investment is a single, one-time amount invested upfront rather than in instalments, left to compound over time.",
    howItWorks: "Provide the amount you're investing today, the annual return you expect, and how many years it stays invested. The calculator compounds it annually to project the maturity value.",
    example: "₹1,00,000 invested for 10 years at an expected 11% annual return grows to approximately ₹2,84,000.",
    faqs: [{ q: "How is this different from a SIP?", a: "A SIP spreads investment across regular instalments; a lump sum is invested all at once, so market timing matters more." }],
    related: ["sip-calculator", "fd-calculator"],
  },
  {
    slug: "fd-calculator",
    name: "FD Calculator",
    category: "finance",
    icon: "Vault",
    description: "Calculate the maturity value of a fixed deposit.",
    fields: [
      num({ id: "principal", label: "Principal Amount", unit: "₹", defaultValue: 100000 }),
      num({ id: "annualRate", label: "Interest Rate (per year)", unit: "%", defaultValue: 7 }),
      num({ id: "years", label: "Tenure", unit: "years", defaultValue: 5 }),
      { id: "compounding", label: "Compounding Frequency", type: "select", defaultValue: "4", options: [
        { value: "1", label: "Yearly" }, { value: "2", label: "Half-yearly" }, { value: "4", label: "Quarterly" }, { value: "12", label: "Monthly" },
      ] },
    ],
    compute: (v) => {
      const r = fin.calculateFD({ ...v, compounding: Number(v.compounding) });
      return {
        results: [
          { label: "Maturity Amount", value: formatCurrency(r.maturityAmount), highlight: true },
          { label: "Principal", value: formatCurrency(r.principal) },
          { label: "Interest Earned", value: formatCurrency(r.interestEarned) },
        ],
      };
    },
    formula: "A = P × (1 + r/n)ⁿᵗ, where P = principal, r = annual rate, n = compounding frequency per year, t = years.",
    whatIs: "A Fixed Deposit (FD) is a savings instrument where a bank pays a fixed interest rate on a lump sum locked in for a set tenure.",
    howItWorks: "Enter the deposit amount, the interest rate your bank offers, the tenure, and how often interest compounds. The calculator returns the maturity value and interest earned.",
    example: "₹1,00,000 at 7% for 5 years, compounded quarterly, matures to approximately ₹1,41,478.",
    faqs: [{ q: "Is FD interest taxable?", a: "Yes, in most jurisdictions FD interest is added to your taxable income. Check current rules with a tax professional." }],
    related: ["rd-calculator", "simple-interest-calculator", "compound-interest-calculator"],
  },
  {
    slug: "rd-calculator",
    name: "RD Calculator",
    category: "finance",
    icon: "CalendarRange",
    description: "Estimate the maturity value of a recurring deposit.",
    fields: [
      num({ id: "monthlyDeposit", label: "Monthly Deposit", unit: "₹", defaultValue: 5000 }),
      num({ id: "annualRate", label: "Interest Rate (per year)", unit: "%", defaultValue: 6.5 }),
      num({ id: "months", label: "Tenure", unit: "months", defaultValue: 24 }),
    ],
    compute: (v) => {
      const r = fin.calculateRD(v);
      return {
        results: [
          { label: "Maturity Amount", value: formatCurrency(r.maturityAmount), highlight: true },
          { label: "Invested Amount", value: formatCurrency(r.invested) },
          { label: "Interest Earned", value: formatCurrency(r.interestEarned) },
        ],
      };
    },
    formula: "Each monthly instalment compounds quarterly for the time it remains deposited; the maturity value is the sum of all compounded instalments.",
    whatIs: "A Recurring Deposit (RD) lets you deposit a fixed amount every month for a set tenure, earning compounded interest similar to a fixed deposit.",
    howItWorks: "Enter your monthly deposit, the annual interest rate and the tenure in months. Each instalment is compounded quarterly for the remaining time it stays deposited.",
    example: "Depositing ₹5,000 a month for 24 months at 6.5% grows to approximately ₹1,28,300 at maturity.",
    faqs: [{ q: "Why quarterly compounding?", a: "Most Indian banks compound RD interest quarterly by convention; the exact method can vary by bank." }],
    related: ["fd-calculator", "sip-calculator"],
  },
  {
    slug: "simple-interest-calculator",
    name: "Simple Interest Calculator",
    category: "finance",
    icon: "Percent",
    description: "Quickly calculate simple interest on a principal amount.",
    fields: [
      num({ id: "principal", label: "Principal Amount", unit: "₹", defaultValue: 50000 }),
      num({ id: "annualRate", label: "Interest Rate (per year)", unit: "%", defaultValue: 8 }),
      num({ id: "years", label: "Time Period", unit: "years", defaultValue: 3 }),
    ],
    compute: (v) => {
      const r = fin.calculateSimpleInterest(v);
      return {
        results: [
          { label: "Total Amount", value: formatCurrency(r.total), highlight: true },
          { label: "Principal", value: formatCurrency(r.principal) },
          { label: "Interest", value: formatCurrency(r.interest) },
        ],
      };
    },
    formula: "SI = (P × R × T) / 100, where P = principal, R = annual rate, T = years.",
    whatIs: "Simple interest is calculated only on the original principal, unlike compound interest which also earns interest on accumulated interest.",
    howItWorks: "Enter the principal, annual rate and duration in years to get the interest and total repayable amount.",
    example: "₹50,000 at 8% for 3 years earns ₹12,000 in simple interest, for a total of ₹62,000.",
    faqs: [{ q: "When is simple interest used?", a: "Common for short-term loans, some bonds, and certain personal loans where interest doesn't compound." }],
    related: ["compound-interest-calculator", "fd-calculator"],
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "finance",
    icon: "LineChart",
    description: "Calculate interest that compounds over time.",
    fields: [
      num({ id: "principal", label: "Principal Amount", unit: "₹", defaultValue: 50000 }),
      num({ id: "annualRate", label: "Interest Rate (per year)", unit: "%", defaultValue: 8 }),
      num({ id: "years", label: "Time Period", unit: "years", defaultValue: 3 }),
      { id: "compounding", label: "Compounding Frequency", type: "select", defaultValue: "1", options: [
        { value: "1", label: "Yearly" }, { value: "2", label: "Half-yearly" }, { value: "4", label: "Quarterly" }, { value: "12", label: "Monthly" },
      ] },
    ],
    compute: (v) => {
      const r = fin.calculateCompoundInterest({ ...v, compounding: Number(v.compounding) });
      return {
        results: [
          { label: "Total Amount", value: formatCurrency(r.total), highlight: true },
          { label: "Principal", value: formatCurrency(r.principal) },
          { label: "Interest", value: formatCurrency(r.interest) },
        ],
      };
    },
    formula: "A = P × (1 + r/n)ⁿᵗ, where P = principal, r = annual rate, n = compounding frequency, t = years.",
    whatIs: "Compound interest is interest calculated on both the original principal and the interest accumulated so far — 'interest on interest'.",
    howItWorks: "Enter the principal, rate, duration and how often interest compounds to see the final amount and total interest earned.",
    example: "₹50,000 at 8% compounded yearly for 3 years grows to about ₹62,987 — slightly more than the simple-interest equivalent.",
    faqs: [{ q: "Why does compounding frequency matter?", a: "More frequent compounding (monthly vs yearly) leads to a slightly higher final amount for the same nominal rate." }],
    related: ["simple-interest-calculator", "fd-calculator", "sip-calculator"],
  },
  {
    slug: "gst-calculator",
    name: "GST Calculator",
    category: "finance",
    icon: "Receipt",
    description: "Add or remove GST from a price, with CGST/SGST/IGST breakup.",
    fields: [
      num({ id: "amount", label: "Amount", unit: "₹", defaultValue: 10000 }),
      { id: "rate", label: "GST Rate", type: "select", defaultValue: "18", options: [
        { value: "5", label: "5%" }, { value: "12", label: "12%" }, { value: "18", label: "18%" }, { value: "28", label: "28%" },
      ] },
      { id: "type", label: "Amount Type", type: "select", defaultValue: "exclusive", options: [
        { value: "exclusive", label: "GST Exclusive (add GST)" }, { value: "inclusive", label: "GST Inclusive (remove GST)" },
      ] },
    ],
    compute: (v) => {
      const r = fin.calculateGST({ ...v, rate: Number(v.rate) });
      return {
        results: [
          { label: "Final Amount", value: formatCurrency(r.finalAmount), highlight: true },
          { label: "Base Amount", value: formatCurrency(r.baseAmount) },
          { label: "Total GST", value: formatCurrency(r.gstAmount) },
          { label: "CGST", value: formatCurrency(r.cgst) },
          { label: "SGST", value: formatCurrency(r.sgst) },
          { label: "IGST (if interstate)", value: formatCurrency(r.igst) },
        ],
      };
    },
    formula: "GST-exclusive: Final = Amount × (1 + rate/100). GST-inclusive: Base = Amount / (1 + rate/100).",
    whatIs: "GST (Goods and Services Tax) is a consumption tax added to most goods and services. It can be split into CGST + SGST for intra-state sales, or charged as IGST for inter-state sales.",
    howItWorks: "Choose whether your amount already includes GST or not, pick the applicable rate, and the calculator shows the base price, GST amount, and its CGST/SGST/IGST split.",
    example: "₹10,000 (GST-exclusive) at 18% GST becomes ₹11,800 total, with ₹900 CGST and ₹900 SGST.",
    faqs: [{ q: "When do I use IGST instead of CGST + SGST?", a: "IGST applies to inter-state transactions; CGST + SGST apply when the buyer and seller are in the same state." }],
    related: ["salary-calculator", "income-tax-calculator"],
  },
  {
    slug: "salary-calculator",
    name: "Salary Calculator",
    category: "finance",
    icon: "Wallet",
    description: "Break down gross salary into net take-home pay.",
    fields: [
      num({ id: "basic", label: "Basic Salary", unit: "₹/month", defaultValue: 40000 }),
      num({ id: "hra", label: "HRA", unit: "₹/month", defaultValue: 16000 }),
      num({ id: "allowances", label: "Other Allowances", unit: "₹/month", defaultValue: 8000 }),
      num({ id: "deductions", label: "Deductions (PF, tax, etc.)", unit: "₹/month", defaultValue: 6000 }),
    ],
    compute: (v) => {
      const r = fin.calculateSalary(v);
      return {
        results: [
          { label: "Net Salary", value: formatCurrency(r.net), highlight: true },
          { label: "Gross Salary", value: formatCurrency(r.gross) },
          { label: "Total Deductions", value: formatCurrency(r.totalDeductions) },
        ],
      };
    },
    formula: "Gross = Basic + HRA + Allowances. Net = Gross − Deductions.",
    whatIs: "Your gross salary is your total pay before deductions; net (take-home) salary is what actually lands in your account after PF, tax and other deductions.",
    howItWorks: "Enter your basic pay, HRA, other allowances and total monthly deductions to see your gross and net salary.",
    example: "Basic ₹40,000 + HRA ₹16,000 + Allowances ₹8,000 = Gross ₹64,000. After ₹6,000 in deductions, net salary is ₹58,000.",
    faqs: [{ q: "Does this calculate income tax automatically?", a: "No — enter your known deductions (including any tax withheld). Use the Income Tax Calculator to estimate tax separately." }],
    related: ["income-tax-calculator", "gst-calculator"],
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    category: "finance",
    icon: "HandCoins",
    description: "A general-purpose loan calculator for any type of loan.",
    fields: [
      num({ id: "principal", label: "Loan Amount", unit: "₹", defaultValue: 500000 }),
      num({ id: "annualRate", label: "Interest Rate (per year)", unit: "%", defaultValue: 11 }),
      num({ id: "years", label: "Loan Tenure", unit: "years", defaultValue: 5 }),
    ],
    compute: (v) => {
      const r = fin.calculateEMI(v);
      return {
        results: [
          { label: "Monthly Instalment", value: formatCurrency(r.emi), highlight: true },
          { label: "Principal", value: formatCurrency(r.principal) },
          { label: "Total Interest", value: formatCurrency(r.totalInterest) },
          { label: "Total Payment", value: formatCurrency(r.totalPayment) },
        ],
        chart: { type: "donut", data: [{ label: "Principal", value: r.principal }, { label: "Interest", value: r.totalInterest }] },
      };
    },
    formula: "Uses the same amortization formula as EMI: EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1).",
    whatIs: "Whether it's a personal, car, education or home loan, most instalment loans are repaid the same way — a fixed monthly payment covering principal and interest.",
    howItWorks: "Enter the loan amount, annual interest rate and tenure to see your monthly instalment and total cost of the loan.",
    example: "A ₹5,00,000 loan at 11% over 5 years costs about ₹10,870 per month, or roughly ₹1.52 lakh in total interest.",
    faqs: [{ q: "How is this different from the EMI Calculator?", a: "It's the same underlying math — this page is a general entry point for any instalment loan, not just home loans." }],
    related: ["emi-calculator", "simple-interest-calculator"],
  },
  {
    slug: "ppf-calculator",
    name: "PPF Calculator",
    category: "finance",
    icon: "ShieldCheck",
    description: "Project your Public Provident Fund maturity value.",
    fields: [
      num({ id: "yearlyInvestment", label: "Yearly Investment", unit: "₹", defaultValue: 100000 }),
      num({ id: "years", label: "Duration", unit: "years", defaultValue: 15 }),
      num({ id: "rate", label: "Interest Rate (per year)", unit: "%", defaultValue: 7.1 }),
    ],
    compute: (v) => {
      const r = fin.calculatePPF(v);
      return {
        results: [
          { label: "Maturity Amount", value: formatCurrency(r.maturityAmount), highlight: true },
          { label: "Total Invested", value: formatCurrency(r.invested) },
          { label: "Interest Earned", value: formatCurrency(r.interestEarned) },
        ],
      };
    },
    formula: "Each year's deposit compounds annually for the remaining years until maturity.",
    whatIs: "PPF is a long-term, government-backed savings scheme in India with a 15-year lock-in, currently offering tax-free interest.",
    howItWorks: "Enter how much you invest each year (up to the ₹1.5 lakh annual limit), the tenure and the current interest rate to estimate your maturity corpus.",
    example: "Investing ₹1,00,000 every year for 15 years at 7.1% grows to approximately ₹27.1 lakh at maturity.",
    faqs: [{ q: "Can I invest more than ₹1.5 lakh a year?", a: "No — ₹1.5 lakh per financial year is the current maximum PPF contribution eligible for the scheme's benefits." }],
    related: ["sip-calculator", "nps-calculator"],
  },
  {
    slug: "nps-calculator",
    name: "NPS Calculator",
    category: "finance",
    icon: "Building2",
    description: "Estimate your National Pension System corpus at retirement.",
    fields: [
      num({ id: "monthlyContribution", label: "Monthly Contribution", unit: "₹", defaultValue: 5000 }),
      num({ id: "currentAge", label: "Current Age", unit: "years", defaultValue: 30 }),
      num({ id: "retirementAge", label: "Retirement Age", unit: "years", defaultValue: 60 }),
      num({ id: "annualReturn", label: "Expected Annual Return", unit: "%", defaultValue: 10 }),
    ],
    compute: (v) => {
      const r = fin.calculateNPS(v);
      return {
        results: [
          { label: "Total Corpus at Retirement", value: formatCurrency(r.totalCorpus), highlight: true },
          { label: "Total Invested", value: formatCurrency(r.invested) },
          { label: "Wealth Gained", value: formatCurrency(r.wealthGained) },
          { label: "Years to Retirement", value: `${r.yearsToRetirement} years` },
        ],
      };
    },
    formula: "Same future-value-of-annuity formula used for SIPs, run from your current age to your chosen retirement age.",
    whatIs: "The National Pension System (NPS) is a voluntary, market-linked retirement savings scheme in India.",
    howItWorks: "Enter your monthly contribution, current age, planned retirement age and expected return to estimate your retirement corpus.",
    example: "₹5,000/month from age 30 to 60 at an expected 10% return builds a corpus of roughly ₹1.14 crore.",
    faqs: [{ q: "Is the return fixed?", a: "No — NPS returns depend on the market performance of the funds you choose; 10% is an illustrative long-term assumption." }],
    related: ["ppf-calculator", "sip-calculator"],
  },
  {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    category: "finance",
    icon: "FileText",
    description: "Estimate your income tax liability under the new regime slabs.",
    fields: [num({ id: "annualIncome", label: "Annual Income", unit: "₹", defaultValue: 1200000 })],
    compute: (v) => {
      const r = fin.calculateIncomeTax(v);
      return {
        results: [
          { label: "Total Tax Payable", value: formatCurrency(r.totalTax), highlight: true },
          { label: "Taxable Income", value: formatCurrency(r.taxableIncome) },
          { label: "Tax (before cess)", value: formatCurrency(r.taxBeforeCess) },
          { label: "Health & Education Cess (4%)", value: formatCurrency(r.cess) },
          { label: "Net Income After Tax", value: formatCurrency(r.netIncome) },
        ],
      };
    },
    formula: "Tax is computed slab-by-slab (0%, 5%, 10%, 15%, 20%, 25%, 30%) after a flat standard deduction, plus a 4% cess on the tax amount.",
    whatIs: "Income tax slabs determine what percentage of your income is taxed at each income band. This calculator uses the simplified new-regime slabs, kept in one editable place so rates can be updated as governments revise them.",
    howItWorks: "Enter your gross annual income. The calculator applies the standard deduction, then taxes the remainder slab-by-slab before adding cess.",
    example: "An annual income of ₹12,00,000 results in an estimated total tax of roughly ₹71,500 under the illustrative new-regime slabs used here.",
    faqs: [
      { q: "Does this account for deductions like 80C?", a: "This calculator models the new tax regime, which offers limited deductions. Consult a tax advisor for regime-specific planning." },
      { q: "Are these slabs guaranteed to be current?", a: "Tax slabs change with each budget. Always cross-check against the latest official notification before filing." },
    ],
    related: ["salary-calculator", "gst-calculator"],
  },

  // ------------------------------------------------------------------- MATH
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "math",
    icon: "Percent",
    description: "Find X% of Y, what percentage one number is of another, or percentage change.",
    fields: [
      { id: "mode", label: "Calculation Type", type: "select", defaultValue: "of", options: [
        { value: "of", label: "What is X% of Y?" },
        { value: "what", label: "X is what % of Y?" },
        { value: "change", label: "Percentage increase/decrease" },
      ] },
      num({ id: "x", label: "X", defaultValue: 20, showIf: (v) => v.mode !== "change" }),
      num({ id: "y", label: "Y", defaultValue: 200, showIf: (v) => v.mode !== "change" }),
      num({ id: "from", label: "From value", defaultValue: 200, showIf: (v) => v.mode === "change" }),
      num({ id: "to", label: "To value", defaultValue: 250, showIf: (v) => v.mode === "change" }),
    ],
    compute: (v) => {
      if (v.mode === "of") {
        const r = math.percentOf({ percent: v.x, of: v.y });
        return { results: [{ label: `${v.x}% of ${v.y}`, value: formatNumber(r.result), highlight: true }] };
      }
      if (v.mode === "what") {
        const r = math.whatPercent({ part: v.x, whole: v.y });
        return { results: [{ label: `${v.x} as a % of ${v.y}`, value: formatPercent(r.result), highlight: true }] };
      }
      const r = math.percentChange({ from: v.from, to: v.to });
      return { results: [{ label: `Percentage ${r.direction}`, value: formatPercent(Math.abs(r.result)), highlight: true }] };
    },
    formula: "X% of Y = (X / 100) × Y.  X as % of Y = (X / Y) × 100.  Change % = ((New − Old) / Old) × 100.",
    whatIs: "A percentage expresses a number as a fraction of 100, used everywhere from discounts to exam scores to investment returns.",
    howItWorks: "Pick the type of percentage question you have, enter the numbers, and get an instant, exact answer.",
    example: "20% of 200 is 40. 40 is 20% of 200. Going from 200 to 250 is a 25% increase.",
    faqs: [{ q: "Can percentages be negative?", a: "Percentage change can be negative — that just means a decrease rather than an increase." }],
    related: ["discount-calculator", "profit-loss-calculator"],
  },
  {
    slug: "profit-loss-calculator",
    name: "Profit & Loss Calculator",
    category: "math",
    icon: "TrendingUp",
    description: "Calculate profit or loss amount and percentage from cost and selling price.",
    fields: [
      num({ id: "costPrice", label: "Cost Price", unit: "₹", defaultValue: 500 }),
      num({ id: "sellingPrice", label: "Selling Price", unit: "₹", defaultValue: 650 }),
    ],
    compute: (v) => {
      const r = math.profitLoss(v);
      return {
        results: [
          { label: r.isProfit ? "Profit" : "Loss", value: formatCurrency(r.amount), highlight: true },
          { label: `${r.isProfit ? "Profit" : "Loss"} Percentage`, value: formatPercent(r.percent) },
        ],
      };
    },
    formula: "Profit/Loss = Selling Price − Cost Price. Percentage = (Amount / Cost Price) × 100.",
    whatIs: "Profit or loss tells you how much you gained or lost compared to what an item cost you.",
    howItWorks: "Enter the cost price and selling price to see whether you made a profit or loss, and by how much.",
    example: "Buying at ₹500 and selling at ₹650 gives a profit of ₹150, or 30%.",
    faqs: [{ q: "What if selling price equals cost price?", a: "That's a break-even point — zero profit and zero loss." }],
    related: ["discount-calculator", "percentage-calculator"],
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    category: "math",
    icon: "Tag",
    description: "Find the final price and amount saved after a percentage discount.",
    fields: [
      num({ id: "mrp", label: "Original Price (MRP)", unit: "₹", defaultValue: 1999 }),
      num({ id: "discountPercent", label: "Discount", unit: "%", defaultValue: 30 }),
    ],
    compute: (v) => {
      const r = math.discount(v);
      return {
        results: [
          { label: "Final Price", value: formatCurrency(r.finalPrice), highlight: true },
          { label: "Amount Saved", value: formatCurrency(r.amountSaved) },
        ],
      };
    },
    formula: "Final Price = MRP × (1 − discount/100).",
    whatIs: "A discount reduces a listed price by a percentage — common during sales and offers.",
    howItWorks: "Enter the original price and discount percentage to see the price you'll actually pay.",
    example: "A ₹1,999 item at 30% off costs ₹1,399.30, saving you ₹599.70.",
    faqs: [{ q: "How do I stack two discounts?", a: "Apply them one after another — e.g. 20% then 10% off is not the same as 30% off." }],
    related: ["percentage-calculator", "gst-calculator"],
  },
  {
    slug: "ratio-calculator",
    name: "Ratio Calculator",
    category: "math",
    icon: "SplitSquareHorizontal",
    description: "Simplify a ratio to its lowest terms and see it as a decimal.",
    fields: [num({ id: "a", label: "First Value", defaultValue: 12 }), num({ id: "b", label: "Second Value", defaultValue: 18 })],
    compute: (v) => {
      const r = math.ratioSimplify(v);
      return { results: [{ label: "Simplified Ratio", value: r.simplified, highlight: true }, { label: "Decimal Equivalent", value: formatNumber(r.decimal) }] };
    },
    formula: "Divide both values by their greatest common divisor (GCD).",
    whatIs: "A ratio compares two quantities. Simplifying shows the same relationship in the smallest whole numbers.",
    howItWorks: "Enter the two values and the calculator finds their GCD and reduces the ratio.",
    example: "12 : 18 simplifies to 2 : 3.",
    faqs: [{ q: "Does the order matter?", a: "Yes — 2:3 and 3:2 describe different relationships between the same two numbers." }],
    related: ["fraction-calculator", "average-calculator"],
  },
  {
    slug: "average-calculator",
    name: "Average Calculator",
    category: "math",
    icon: "BarChart3",
    description: "Find the mean, median, min, max and sum of a set of numbers.",
    fields: [{ id: "numbers", label: "Numbers (comma or space separated)", type: "text", defaultValue: "12, 18, 25, 30, 15" }],
    compute: (v) => {
      const r = math.average(v);
      return {
        results: [
          { label: "Average (Mean)", value: formatNumber(r.average), highlight: true },
          { label: "Median", value: formatNumber(r.median) },
          { label: "Sum", value: formatNumber(r.sum) },
          { label: "Count", value: r.count },
          { label: "Minimum", value: formatNumber(r.min) },
          { label: "Maximum", value: formatNumber(r.max) },
        ],
      };
    },
    formula: "Average = Sum of values / Count of values.",
    whatIs: "The average (mean) summarizes a set of numbers with a single typical value.",
    howItWorks: "Type in your numbers separated by commas or spaces to get the mean, median and other summary stats instantly.",
    example: "The numbers 12, 18, 25, 30, 15 have an average of 20 and a median of 18.",
    faqs: [{ q: "When should I use median instead of average?", a: "Median is less affected by outliers, so it's often more representative for skewed data like income." }],
    related: ["ratio-calculator", "percentage-calculator"],
  },
  {
    slug: "fraction-calculator",
    name: "Fraction Calculator",
    category: "math",
    icon: "Divide",
    description: "Simplify a fraction to its lowest terms.",
    fields: [num({ id: "numerator", label: "Numerator", step: "1", defaultValue: 24 }), num({ id: "denominator", label: "Denominator", step: "1", defaultValue: 36 })],
    compute: (v) => {
      const r = math.fractionSimplify(v);
      return { results: [{ label: "Simplified Fraction", value: r.simplified, highlight: true }, { label: "Decimal Value", value: formatNumber(r.decimal) }] };
    },
    formula: "Divide numerator and denominator by their greatest common divisor.",
    whatIs: "Simplifying a fraction expresses it in the smallest possible whole numbers without changing its value.",
    howItWorks: "Enter the numerator and denominator to get the fraction in lowest terms and its decimal equivalent.",
    example: "24/36 simplifies to 2/3, or 0.67 as a decimal.",
    faqs: [{ q: "What if the denominator is negative?", a: "The calculator moves the sign to the numerator so the denominator is always shown as positive." }],
    related: ["ratio-calculator"],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "math",
    icon: "Cake",
    description: "Calculate exact age in years, months and days from a date of birth.",
    fields: [
      { id: "dob", label: "Date of Birth", type: "date", defaultValue: "" },
      { id: "asOf", label: "Calculate Age As Of", type: "date", defaultValue: "" },
    ],
    compute: (v) => {
      const r = math.ageFromDate(v);
      return {
        results: [
          { label: "Age", value: `${r.years}y ${r.months}m ${r.days}d`, highlight: true },
          { label: "Total Days Lived", value: formatNumber(r.totalDays, 0) },
        ],
      };
    },
    formula: "Age is computed by calendar subtraction, borrowing days/months as needed — the same way you'd count on a calendar by hand.",
    whatIs: "Your exact age isn't just years — it's years, months and days since your date of birth.",
    howItWorks: "Enter your date of birth (and optionally a different reference date) to get your precise age.",
    example: "Someone born on 15 June 2000 turns exactly 25 years, 2 months and 13 days old on 28 August 2026.",
    faqs: [{ q: "Can I calculate age as of a future date?", a: "Yes — leave the reference date as any date on or after the date of birth." }],
    related: ["date-difference-calculator"],
  },
  {
    slug: "date-difference-calculator",
    name: "Date Difference Calculator",
    category: "math",
    icon: "CalendarDays",
    description: "Find the number of days or weeks between two dates.",
    fields: [{ id: "start", label: "Start Date", type: "date", defaultValue: "" }, { id: "end", label: "End Date", type: "date", defaultValue: "" }],
    compute: (v) => {
      const r = math.dateDifference(v);
      return {
        results: [
          { label: "Total Days", value: formatNumber(r.totalDays, 0), highlight: true },
          { label: "Full Weeks", value: formatNumber(r.weeks, 0) },
        ],
      };
    },
    formula: "Difference in days = (End date − Start date), converted from milliseconds to days.",
    whatIs: "This calculates the number of calendar days between any two dates.",
    howItWorks: "Pick a start and end date to see how many days and weeks apart they are.",
    example: "From 1 January 2026 to 28 August 2026 is 239 days, or about 34 weeks.",
    faqs: [{ q: "Does it count the start or end date?", a: "It counts whole 24-hour days between the two dates, matching how most calendar-day calculators work." }],
    related: ["age-calculator", "time-calculator"],
  },
  {
    slug: "time-calculator",
    name: "Time Calculator",
    category: "math",
    icon: "Clock",
    description: "Find the duration between two times of day.",
    fields: [{ id: "startTime", label: "Start Time", type: "time", defaultValue: "09:00" }, { id: "endTime", label: "End Time", type: "time", defaultValue: "17:30" }],
    compute: (v) => {
      const r = math.timeDuration(v);
      return { results: [{ label: "Duration", value: `${r.hours}h ${r.minutes}m`, highlight: true }, { label: "Total Minutes", value: formatNumber(r.totalMinutes, 0) }] };
    },
    formula: "Duration = End time − Start time, in minutes (wrapping to the next day if the end time is earlier).",
    whatIs: "This finds how much time passes between two clock times, handy for shifts, workouts or schedules.",
    howItWorks: "Enter a start and end time to see the duration in hours and minutes.",
    example: "From 09:00 to 17:30 is a duration of 8 hours 30 minutes.",
    faqs: [{ q: "What if the end time is before the start time?", a: "The calculator assumes the end time falls on the next day and wraps the duration accordingly." }],
    related: ["date-difference-calculator"],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    category: "math",
    icon: "Ruler",
    description: "Convert between length, weight, temperature and volume units.",
    fields: [
      { id: "category", label: "Category", type: "select", defaultValue: "length", options: [
        { value: "length", label: "Length" }, { value: "weight", label: "Weight" }, { value: "temperature", label: "Temperature" }, { value: "volume", label: "Volume" },
      ] },
      { id: "from", label: "From Unit", type: "unitSelect", defaultValue: "" },
      { id: "to", label: "To Unit", type: "unitSelect", defaultValue: "" },
      num({ id: "value", label: "Value", defaultValue: 1 }),
    ],
    compute: (v) => {
      const r = math.convertUnit(v);
      return { results: [{ label: `${v.value} ${v.from} equals`, value: `${formatNumber(r.result)} ${v.to}`, highlight: true }] };
    },
    formula: "Converts via a common base unit (e.g. meters for length) using standard conversion factors; temperature uses its own linear formulas.",
    whatIs: "A unit converter translates a measurement from one unit system to another — metric to imperial and back.",
    howItWorks: "Choose a category and the units you're converting between, enter a value, and get the converted result instantly.",
    example: "1 mile equals approximately 1.61 kilometers.",
    faqs: [{ q: "Are conversion factors exact?", a: "Length, weight and volume factors are standard exact or near-exact conversions; results are rounded to two decimals." }],
    related: ["currency-converter"],
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    category: "math",
    icon: "Coins",
    description: "Convert between major world currencies using reference exchange rates.",
    fields: [
      num({ id: "amount", label: "Amount", defaultValue: 100 }),
      { id: "from", label: "From Currency", type: "select", defaultValue: "USD", options: Object.keys(math.CURRENCY_RATES_BASE_USD).map((c) => ({ value: c, label: c })) },
      { id: "to", label: "To Currency", type: "select", defaultValue: "INR", options: Object.keys(math.CURRENCY_RATES_BASE_USD).map((c) => ({ value: c, label: c })) },
    ],
    compute: (v) => {
      const r = math.convertCurrency(v);
      return { results: [{ label: `${v.amount} ${v.from} equals`, value: `${formatNumber(r.result)} ${v.to}`, highlight: true }, { label: "Exchange Rate", value: `1 ${v.from} = ${formatNumber(r.rate, 4)} ${v.to}` }] };
    },
    formula: "Amount is converted to USD, then from USD to the target currency, using the site's reference rate table.",
    whatIs: "A currency converter estimates how much one currency is worth in another.",
    howItWorks: "Enter an amount and pick the two currencies. IruCalc uses a static reference rate table so this works fully offline — connect it to a live rates API for real-time trading use.",
    example: "At the reference rates used here, 100 USD is approximately 8,350 INR.",
    faqs: [{ q: "Are these live exchange rates?", a: "No — these are fixed reference rates for quick estimates, not live market rates. For real transactions, check your bank or a live-rate source." }],
    related: ["unit-converter"],
  },

  // ----------------------------------------------------------------- HEALTH
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    icon: "HeartPulse",
    description: "Calculate your Body Mass Index and see your healthy weight range.",
    fields: [num({ id: "heightCm", label: "Height", unit: "cm", defaultValue: 170 }), num({ id: "weightKg", label: "Weight", unit: "kg", defaultValue: 68 })],
    compute: (v) => {
      const r = health.calculateBMI(v);
      return {
        results: [
          { label: "Your BMI", value: formatNumber(r.bmi), highlight: true },
          { label: "Category", value: r.category },
          { label: "Healthy Weight Range", value: `${formatNumber(r.healthyMin)} – ${formatNumber(r.healthyMax)} kg` },
        ],
      };
    },
    formula: "BMI = Weight (kg) / [Height (m)]²",
    whatIs: "Body Mass Index (BMI) is a simple screening measure that relates weight to height, used to broadly categorize weight status.",
    howItWorks: "Enter your height and weight to get your BMI, its category, and the weight range considered healthy for your height.",
    example: "A person 170cm tall weighing 68kg has a BMI of about 23.5 — in the 'Healthy weight' range.",
    faqs: [{ q: "Is BMI accurate for everyone?", a: "BMI doesn't distinguish muscle from fat, so it can be less accurate for athletes or very muscular people. It's a screening tool, not a diagnosis." }],
    related: ["bmr-calculator", "ideal-weight-calculator", "body-fat-calculator"],
    disclaimer: true,
  },
  {
    slug: "bmr-calculator",
    name: "BMR Calculator",
    category: "health",
    icon: "Flame",
    description: "Estimate the calories your body burns at rest (Basal Metabolic Rate).",
    fields: [
      { id: "gender", label: "Gender", type: "select", defaultValue: "male", options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
      num({ id: "weightKg", label: "Weight", unit: "kg", defaultValue: 68 }),
      num({ id: "heightCm", label: "Height", unit: "cm", defaultValue: 170 }),
      num({ id: "age", label: "Age", unit: "years", defaultValue: 28 }),
    ],
    compute: (v) => {
      const r = health.calculateBMR(v);
      return { results: [{ label: "Your BMR", value: `${formatNumber(r.bmr, 0)} kcal/day`, highlight: true }] };
    },
    formula: "Mifflin-St Jeor: Men = 10W + 6.25H − 5A + 5. Women = 10W + 6.25H − 5A − 161. (W=kg, H=cm, A=years)",
    whatIs: "BMR is the number of calories your body needs just to maintain basic functions at complete rest.",
    howItWorks: "Enter your gender, weight, height and age to estimate your BMR using the widely-used Mifflin-St Jeor equation.",
    example: "A 28-year-old man, 170cm and 68kg, has an estimated BMR of about 1,596 kcal/day.",
    faqs: [{ q: "Is BMR the same as total daily calorie needs?", a: "No — BMR is your resting rate. Use the Calorie Calculator to factor in activity level for total daily needs." }],
    related: ["calorie-calculator", "bmi-calculator"],
    disclaimer: true,
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    category: "health",
    icon: "UtensilsCrossed",
    description: "Estimate your daily calorie needs to maintain, lose or gain weight.",
    fields: [
      { id: "gender", label: "Gender", type: "select", defaultValue: "male", options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
      num({ id: "weightKg", label: "Weight", unit: "kg", defaultValue: 68 }),
      num({ id: "heightCm", label: "Height", unit: "cm", defaultValue: 170 }),
      num({ id: "age", label: "Age", unit: "years", defaultValue: 28 }),
      { id: "activity", label: "Activity Level", type: "select", defaultValue: "moderate", options: [
        { value: "sedentary", label: "Sedentary (little/no exercise)" },
        { value: "light", label: "Light (1-3 days/week)" },
        { value: "moderate", label: "Moderate (3-5 days/week)" },
        { value: "active", label: "Active (6-7 days/week)" },
        { value: "athlete", label: "Athlete (intense daily training)" },
      ] },
    ],
    compute: (v) => {
      const r = health.calculateCalories(v);
      return {
        results: [
          { label: "Maintenance Calories", value: `${formatNumber(r.maintenance, 0)} kcal/day`, highlight: true },
          { label: "For Mild Weight Loss", value: `${formatNumber(r.mildLoss, 0)} kcal/day` },
          { label: "For Weight Loss", value: `${formatNumber(r.weightLoss, 0)} kcal/day` },
          { label: "For Weight Gain", value: `${formatNumber(r.weightGain, 0)} kcal/day` },
        ],
      };
    },
    formula: "Maintenance calories = BMR × activity multiplier (1.2 to 1.9). A ~500 kcal/day deficit or surplus is used for weight change estimates.",
    whatIs: "Daily calorie needs combine your resting metabolism (BMR) with how active you are.",
    howItWorks: "Enter your details and activity level to see maintenance calories plus estimates for weight loss or gain.",
    example: "A moderately active 28-year-old man (68kg, 170cm) needs roughly 2,474 kcal/day to maintain weight.",
    faqs: [{ q: "How much of a deficit is safe?", a: "A 250–500 kcal/day deficit is a commonly recommended, gradual approach — consult a professional for personalized advice." }],
    related: ["bmr-calculator", "ideal-weight-calculator"],
    disclaimer: true,
  },
  {
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    category: "health",
    icon: "Scale",
    description: "Estimate an ideal body weight range based on your height.",
    fields: [
      { id: "gender", label: "Gender", type: "select", defaultValue: "male", options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
      num({ id: "heightCm", label: "Height", unit: "cm", defaultValue: 170 }),
    ],
    compute: (v) => {
      const r = health.calculateIdealWeight(v);
      return {
        results: [
          { label: "Ideal Weight", value: `${formatNumber(r.idealWeightKg)} kg`, highlight: true },
          { label: "Healthy Range", value: `${formatNumber(r.rangeMinKg)} – ${formatNumber(r.rangeMaxKg)} kg` },
        ],
      };
    },
    formula: "Devine formula: Men = 50 + 2.3 × (height in inches over 5 feet). Women = 45.5 + 2.3 × (height in inches over 5 feet).",
    whatIs: "Ideal weight formulas estimate a reasonable target body weight based on height and gender.",
    howItWorks: "Enter your gender and height to get an estimated ideal weight and a healthy range around it.",
    example: "A 170cm man has an estimated ideal weight of about 64.4kg.",
    faqs: [{ q: "Is this the same as a 'healthy' weight?", a: "It's one of several estimation methods — BMI-based healthy ranges (see the BMI Calculator) are another common reference." }],
    related: ["bmi-calculator", "bmr-calculator"],
    disclaimer: true,
  },
  {
    slug: "body-fat-calculator",
    name: "Body Fat Calculator",
    category: "health",
    icon: "Activity",
    description: "Estimate body fat percentage using the US Navy tape-measure method.",
    fields: [
      { id: "gender", label: "Gender", type: "select", defaultValue: "male", options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
      num({ id: "heightCm", label: "Height", unit: "cm", defaultValue: 170 }),
      num({ id: "waistCm", label: "Waist", unit: "cm", defaultValue: 85 }),
      num({ id: "neckCm", label: "Neck", unit: "cm", defaultValue: 38 }),
      num({ id: "hipCm", label: "Hip (women only)", unit: "cm", defaultValue: 95 }),
    ],
    compute: (v) => {
      const r = health.calculateBodyFat(v);
      return { results: [{ label: "Estimated Body Fat", value: formatPercent(r.bodyFatPercent), highlight: true }, { label: "Category", value: r.category }] };
    },
    formula: "US Navy method — uses log-based formulas from waist, neck, height (and hip for women).",
    whatIs: "This tape-measure method estimates body fat percentage from a few circumference measurements, without needing special equipment.",
    howItWorks: "Enter your gender, height, waist and neck (plus hip if female) measurements in centimeters for an estimate.",
    example: "A man with height 170cm, waist 85cm and neck 38cm has an estimated body fat of about 18%.",
    faqs: [{ q: "How accurate is this method?", a: "It's a reasonable estimate for most people but less precise than DEXA scans or calipers — treat it as a trend indicator, not a diagnosis." }],
    related: ["bmi-calculator", "ideal-weight-calculator"],
    disclaimer: true,
  },

  // -------------------------------------------------------------- EDUCATION
  {
    slug: "cgpa-to-percentage",
    name: "CGPA to Percentage",
    category: "education",
    icon: "GraduationCap",
    description: "Convert your CGPA (out of 10) into an equivalent percentage.",
    fields: [num({ id: "cgpa", label: "CGPA", defaultValue: 8.2 }), num({ id: "multiplier", label: "Multiplier (per your institution)", defaultValue: 9.5 })],
    compute: (v) => {
      const r = edu.cgpaToPercentage(v);
      return { results: [{ label: "Equivalent Percentage", value: formatPercent(r.percentage), highlight: true }] };
    },
    formula: "Percentage = CGPA × Multiplier (commonly 9.5, but check your institution's rule).",
    whatIs: "Many Indian universities convert CGPA to an equivalent percentage using a fixed multiplier, often 9.5.",
    howItWorks: "Enter your CGPA and the multiplier your institution uses (9.5 is the most common) to get your percentage.",
    example: "A CGPA of 8.2 with a 9.5 multiplier converts to 77.9%.",
    faqs: [{ q: "Is 9.5 the correct multiplier for every university?", a: "No — it varies by institution and board. Confirm the exact formula with your university's official guidelines." }],
    related: ["percentage-to-cgpa", "marks-percentage-calculator"],
  },
  {
    slug: "percentage-to-cgpa",
    name: "Percentage to CGPA",
    category: "education",
    icon: "GraduationCap",
    description: "Convert a percentage back into an equivalent CGPA.",
    fields: [num({ id: "percentage", label: "Percentage", defaultValue: 78 }), num({ id: "divisor", label: "Divisor (per your institution)", defaultValue: 9.5 })],
    compute: (v) => {
      const r = edu.percentageToCgpa(v);
      return { results: [{ label: "Equivalent CGPA", value: formatNumber(r.cgpa), highlight: true }] };
    },
    formula: "CGPA = Percentage / Divisor (commonly 9.5).",
    whatIs: "This reverses the common CGPA-to-percentage conversion, useful when a form asks for CGPA but you only have a percentage.",
    howItWorks: "Enter your percentage and the divisor your institution uses to get an equivalent CGPA.",
    example: "78% with a 9.5 divisor converts to a CGPA of approximately 8.21.",
    faqs: [{ q: "Will this exactly match my official transcript?", a: "It's an approximation — official conversions can vary slightly by institution and year." }],
    related: ["cgpa-to-percentage", "grade-calculator"],
  },
  {
    slug: "gpa-calculator",
    name: "GPA Calculator",
    category: "education",
    icon: "BookOpen",
    description: "Calculate your GPA from course grades and credit hours.",
    fields: [{ id: "courses", label: "Courses (grade,credits per line)", type: "textarea", defaultValue: "9,4\n8,3\n7.5,4\n9.5,3" }],
    compute: (v) => {
      const courses = v.courses
        .split("\n")
        .map((line) => line.split(",").map((s) => s.trim()))
        .filter((parts) => parts.length === 2 && parts[0] !== "")
        .map(([grade, credits]) => ({ grade, credits }));
      const r = edu.calculateGPA({ courses });
      return { results: [{ label: "Your GPA", value: formatNumber(r.gpa), highlight: true }, { label: "Total Credits", value: r.totalCredits }] };
    },
    formula: "GPA = Σ(grade point × credits) / Σ(credits)",
    whatIs: "GPA (Grade Point Average) summarizes performance across multiple courses, weighted by credit hours.",
    howItWorks: "List each course as 'grade,credits' on its own line (e.g. 9,4) to get your overall weighted GPA.",
    example: "Courses graded 9, 8, 7.5, 9.5 with credits 4, 3, 4, 3 give a GPA of about 8.46.",
    faqs: [{ q: "Can I use a 4.0 scale instead of 10?", a: "Yes — just enter grade points on whatever scale your institution uses; the formula works the same way." }],
    related: ["cgpa-to-percentage", "grade-calculator"],
  },
  {
    slug: "marks-percentage-calculator",
    name: "Marks Percentage Calculator",
    category: "education",
    icon: "ClipboardCheck",
    description: "Calculate percentage from marks obtained out of total marks.",
    fields: [num({ id: "obtained", label: "Marks Obtained", defaultValue: 462 }), num({ id: "total", label: "Total Marks", defaultValue: 500 })],
    compute: (v) => {
      const r = edu.marksPercentage(v);
      return { results: [{ label: "Percentage", value: formatPercent(r.percentage), highlight: true }] };
    },
    formula: "Percentage = (Marks Obtained / Total Marks) × 100",
    whatIs: "This converts raw exam marks into a percentage score.",
    howItWorks: "Enter the marks you obtained and the total marks possible to get your percentage.",
    example: "462 out of 500 marks is 92.4%.",
    faqs: [{ q: "Can I combine multiple subjects?", a: "Yes — add up all obtained marks and all total marks across subjects first, then enter the sums here." }],
    related: ["grade-calculator", "cgpa-to-percentage"],
  },
  {
    slug: "grade-calculator",
    name: "Grade Calculator",
    category: "education",
    icon: "Award",
    description: "Find the letter grade for a given percentage score.",
    fields: [num({ id: "percentage", label: "Percentage", defaultValue: 82 })],
    compute: (v) => {
      const r = edu.gradeFromPercentage(v);
      return { results: [{ label: "Letter Grade", value: r.grade, highlight: true }] };
    },
    formula: "A+: 90-100, A: 80-89, B+: 70-79, B: 60-69, C: 50-59, D: 40-49, F: below 40 (a common, adjustable scale).",
    whatIs: "This maps a percentage score to a conventional letter grade.",
    howItWorks: "Enter a percentage to see the corresponding letter grade on a standard scale.",
    example: "82% corresponds to an A grade on this scale.",
    faqs: [{ q: "Does every school use this exact scale?", a: "No — grading scales vary widely by institution and country. Treat this as an illustrative reference." }],
    related: ["marks-percentage-calculator", "gpa-calculator"],
  },
  {
    slug: "attendance-calculator",
    name: "Attendance Calculator",
    category: "education",
    icon: "CalendarCheck",
    description: "Check your attendance percentage and how many classes you can safely miss.",
    fields: [
      num({ id: "attended", label: "Classes Attended", defaultValue: 68 }),
      num({ id: "total", label: "Total Classes Held", defaultValue: 80 }),
      num({ id: "targetPercent", label: "Required Attendance", unit: "%", defaultValue: 75 }),
    ],
    compute: (v) => {
      const r = edu.attendanceCalculator(v);
      return {
        results: [
          { label: "Current Attendance", value: formatPercent(r.currentPercent), highlight: true },
          r.meetsTarget
            ? { label: "Classes You Can Still Miss", value: `${r.maxMissable}` }
            : { label: "Classes Needed to Reach Target", value: `${r.classesNeeded}` },
        ],
      };
    },
    formula: "Classes needed = ceil((target×total − 100×attended) / (100 − target)). Classes missable = floor((100×attended − target×total) / target).",
    whatIs: "Most courses require a minimum attendance percentage — this tells you exactly where you stand and what's ahead.",
    howItWorks: "Enter classes attended, total classes held, and the required percentage to see your current standing and next steps.",
    example: "Attending 68 of 80 classes (85%) against a 75% requirement means you can miss up to 10 more classes and stay compliant.",
    faqs: [{ q: "Does this account for future classes being added?", a: "The 'classes needed' figure assumes you attend all remaining classes; recalculate as new classes are held." }],
    related: ["marks-percentage-calculator"],
  },

  // ------------------------------------------------------------- DEVELOPER
  {
    slug: "binary-converter",
    name: "Binary Converter",
    category: "developer-tools",
    icon: "Binary",
    description: "Convert binary numbers to decimal, hex and octal.",
    fields: [{ id: "value", label: "Binary Value", type: "text", defaultValue: "1010" }],
    compute: (v) => {
      const r = dev.convertBase({ value: v.value, fromBase: "binary", toBase: "decimal" });
      return {
        results: [
          { label: "Decimal", value: r.decimalValue, highlight: true },
          { label: "Octal", value: r.octal },
          { label: "Hexadecimal", value: r.hexadecimal },
        ],
      };
    },
    formula: "Each binary digit is a power of 2; sum the powers where the digit is 1.",
    whatIs: "Binary (base-2) is the number system computers use internally, made up only of 0s and 1s.",
    howItWorks: "Enter a binary number to instantly see its decimal, octal and hexadecimal equivalents.",
    example: "Binary 1010 equals decimal 10, octal 12, and hex A.",
    faqs: [{ q: "What characters are valid input?", a: "Only 0 and 1 are valid binary digits." }],
    related: ["decimal-converter", "hexadecimal-converter", "base-converter"],
  },
  {
    slug: "decimal-converter",
    name: "Decimal Converter",
    category: "developer-tools",
    icon: "Hash",
    description: "Convert decimal numbers to binary, hex and octal.",
    fields: [{ id: "value", label: "Decimal Value", type: "text", defaultValue: "255" }],
    compute: (v) => {
      const r = dev.convertBase({ value: v.value, fromBase: "decimal", toBase: "binary" });
      return {
        results: [
          { label: "Binary", value: r.binary, highlight: true },
          { label: "Octal", value: r.octal },
          { label: "Hexadecimal", value: r.hexadecimal },
        ],
      };
    },
    formula: "Repeatedly divide by the target base and read remainders in reverse.",
    whatIs: "Decimal (base-10) is the everyday number system; this converts it into the bases computers commonly use.",
    howItWorks: "Enter a decimal number to see it converted into binary, octal and hexadecimal.",
    example: "Decimal 255 equals binary 11111111, octal 377, and hex FF.",
    faqs: [{ q: "Does it handle large numbers?", a: "It works for standard JavaScript-safe integers; extremely large numbers may lose precision." }],
    related: ["binary-converter", "hexadecimal-converter", "base-converter"],
  },
  {
    slug: "hexadecimal-converter",
    name: "Hexadecimal Converter",
    category: "developer-tools",
    icon: "Hash",
    description: "Convert hexadecimal values to decimal, binary and octal.",
    fields: [{ id: "value", label: "Hexadecimal Value", type: "text", defaultValue: "1F4" }],
    compute: (v) => {
      const r = dev.convertBase({ value: v.value, fromBase: "hexadecimal", toBase: "decimal" });
      return {
        results: [
          { label: "Decimal", value: r.decimalValue, highlight: true },
          { label: "Binary", value: r.binary },
          { label: "Octal", value: r.octal },
        ],
      };
    },
    formula: "Each hex digit represents 4 binary bits (0-F = 0-15); positions are powers of 16.",
    whatIs: "Hexadecimal (base-16) is widely used in programming for memory addresses, colors, and compact byte representation.",
    howItWorks: "Enter a hex value (digits 0-9, A-F) to convert it to decimal, binary and octal.",
    example: "Hex 1F4 equals decimal 500, binary 111110100.",
    faqs: [{ q: "Is hex case-sensitive?", a: "No — both uppercase and lowercase letters A-F are accepted." }],
    related: ["binary-converter", "decimal-converter", "base-converter"],
  },
  {
    slug: "octal-converter",
    name: "Octal Converter",
    category: "developer-tools",
    icon: "Hash",
    description: "Convert octal values to decimal, binary and hexadecimal.",
    fields: [{ id: "value", label: "Octal Value", type: "text", defaultValue: "17" }],
    compute: (v) => {
      const r = dev.convertBase({ value: v.value, fromBase: "octal", toBase: "decimal" });
      return {
        results: [
          { label: "Decimal", value: r.decimalValue, highlight: true },
          { label: "Binary", value: r.binary },
          { label: "Hexadecimal", value: r.hexadecimal },
        ],
      };
    },
    formula: "Each octal digit represents 3 binary bits (0-7); positions are powers of 8.",
    whatIs: "Octal (base-8) uses digits 0-7 and was historically common in computing for compact byte grouping.",
    howItWorks: "Enter an octal number to convert it into decimal, binary and hexadecimal.",
    example: "Octal 17 equals decimal 15, binary 1111.",
    faqs: [{ q: "What digits are valid in octal?", a: "Only digits 0 through 7." }],
    related: ["binary-converter", "decimal-converter", "base-converter"],
  },
  {
    slug: "base-converter",
    name: "Base Converter",
    category: "developer-tools",
    icon: "ArrowLeftRight",
    description: "Convert a number between any two of binary, octal, decimal and hexadecimal.",
    fields: [
      { id: "value", label: "Value", type: "text", defaultValue: "255" },
      { id: "fromBase", label: "From Base", type: "select", defaultValue: "decimal", options: [
        { value: "binary", label: "Binary (2)" }, { value: "octal", label: "Octal (8)" }, { value: "decimal", label: "Decimal (10)" }, { value: "hexadecimal", label: "Hexadecimal (16)" },
      ] },
      { id: "toBase", label: "To Base", type: "select", defaultValue: "binary", options: [
        { value: "binary", label: "Binary (2)" }, { value: "octal", label: "Octal (8)" }, { value: "decimal", label: "Decimal (10)" }, { value: "hexadecimal", label: "Hexadecimal (16)" },
      ] },
    ],
    compute: (v) => {
      const r = dev.convertBase(v);
      return { results: [{ label: "Result", value: r.result, highlight: true }] };
    },
    formula: "Parses the input in the source base, then represents the resulting integer in the target base.",
    whatIs: "A base converter is a flexible tool for translating a number between any two common numeral systems.",
    howItWorks: "Choose the base you're converting from and to, enter the value, and get the instant result.",
    example: "Decimal 255 converts to binary 11111111.",
    faqs: [{ q: "Can I convert fractional numbers?", a: "This tool handles whole numbers only." }],
    related: ["binary-converter", "hexadecimal-converter", "octal-converter"],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "developer-tools",
    icon: "Braces",
    description: "Validate and pretty-print JSON, entirely in your browser.",
    fields: [{ id: "input", label: "JSON Input", type: "textarea", defaultValue: '{"name":"IruCalc","calculators":45,"free":true}' }],
    compute: (v) => {
      const r = dev.formatJSON(v);
      return { results: [{ label: "Formatted JSON", value: r.formatted, highlight: true, mono: true }] };
    },
    formula: "Uses JSON.parse to validate, then JSON.stringify with indentation to pretty-print.",
    whatIs: "A JSON formatter checks that your JSON is valid and lays it out with readable indentation.",
    howItWorks: "Paste any JSON text to validate it and get a neatly indented version — nothing leaves your browser.",
    example: '{"name":"IruCalc"} formats to a two-line, indented block.',
    faqs: [{ q: "Is my data sent anywhere?", a: "No — parsing and formatting happen entirely on your device." }],
    related: ["base-converter"],
  },
  {
    slug: "unix-timestamp-converter",
    name: "Unix Timestamp Converter",
    category: "developer-tools",
    icon: "Timer",
    description: "Convert Unix timestamps to human-readable dates and back.",
    fields: [
      num({ id: "timestamp", label: "Unix Timestamp", defaultValue: 1735689600 }),
      { id: "unit", label: "Unit", type: "select", defaultValue: "seconds", options: [{ value: "seconds", label: "Seconds" }, { value: "milliseconds", label: "Milliseconds" }] },
    ],
    compute: (v) => {
      const r = dev.unixToDate(v);
      return { results: [{ label: "UTC Date/Time", value: r.utc, highlight: true }, { label: "ISO 8601", value: r.iso }, { label: "Your Local Time", value: r.local }] };
    },
    formula: "Milliseconds since the Unix epoch (Jan 1, 1970 UTC) are converted into a calendar date and time.",
    whatIs: "A Unix timestamp counts seconds (or milliseconds) since 1 January 1970 — the standard way computers store time.",
    howItWorks: "Enter a timestamp and its unit to see the equivalent calendar date and time.",
    example: "Timestamp 1735689600 (seconds) corresponds to 1 January 2025, 00:00:00 UTC.",
    faqs: [{ q: "Seconds or milliseconds — how do I know which I have?", a: "A 10-digit number is usually seconds; a 13-digit number is usually milliseconds." }],
    related: ["json-formatter"],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "developer-tools",
    icon: "Fingerprint",
    description: "Generate a random, RFC 4122 version 4 UUID.",
    fields: [],
    compute: () => {
      const r = dev.generateUUID();
      return { results: [{ label: "Generated UUID", value: r.uuid, highlight: true, mono: true }] };
    },
    formula: "A v4 UUID is 122 random bits formatted as 8-4-4-4-12 hex digits, with fixed version/variant bits.",
    whatIs: "A UUID (Universally Unique Identifier) is a 128-bit value used to uniquely identify records without a central authority.",
    howItWorks: "Press Calculate to generate a new cryptographically random UUID each time.",
    example: "A typical UUID looks like 3f29b6a2-6c1e-4a2b-9d3e-8f0a1c2b3d4e.",
    faqs: [{ q: "Can two generated UUIDs collide?", a: "The odds are astronomically small — v4 UUIDs are designed so collisions are practically impossible." }],
    related: ["password-generator", "json-formatter"],
  },
  {
    slug: "password-generator",
    name: "Random Password Generator",
    category: "developer-tools",
    icon: "KeyRound",
    description: "Generate a strong, random password with customizable character sets.",
    fields: [
      num({ id: "length", label: "Length", step: "1", defaultValue: 16 }),
      { id: "uppercase", label: "Include Uppercase (A-Z)", type: "checkbox", defaultValue: true },
      { id: "lowercase", label: "Include Lowercase (a-z)", type: "checkbox", defaultValue: true },
      { id: "numbers", label: "Include Numbers (0-9)", type: "checkbox", defaultValue: true },
      { id: "symbols", label: "Include Symbols (!@#...)", type: "checkbox", defaultValue: true },
    ],
    compute: (v) => {
      const r = dev.generatePassword(v);
      return { results: [{ label: "Generated Password", value: r.password, highlight: true, mono: true }, { label: "Strength", value: r.strength }] };
    },
    formula: "Uses the browser's cryptographically secure random number generator to pick characters from your selected sets.",
    whatIs: "A strong, random password is one of the simplest ways to protect an account.",
    howItWorks: "Choose a length and which character types to include, then generate a new password instantly — nothing is stored or sent anywhere.",
    example: "A 16-character password with all character types might look like: 7hK$pL2!qZ9@mR4x",
    faqs: [{ q: "Is this password stored anywhere?", a: "No — it's generated locally in your browser and never leaves your device or gets saved unless you choose to copy it." }],
    related: ["uuid-generator"],
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    category: "developer-tools",
    icon: "QrCode",
    description: "Generate a scannable QR code from any text or URL.",
    fields: [{ id: "text", label: "Text or URL", type: "text", defaultValue: "https://irucalc.com" }],
    compute: null, // handled specially via QRCodeResult component (async canvas rendering)
    formula: "Encodes text into a matrix of black/white modules following the QR code standard, then renders it as an image.",
    whatIs: "A QR code is a scannable 2D barcode that can store text, URLs, contact details and more.",
    howItWorks: "Type any text or link to generate a QR code you can scan or download — generated entirely in your browser.",
    example: "Entering a URL generates a QR code that opens that link when scanned with a phone camera.",
    faqs: [{ q: "Does this track scans?", a: "No — this generates a static QR code locally; IruCalc has no way to see if or when it's scanned." }],
    related: ["uuid-generator"],
  },
];

export function getCalculatorBySlug(slug) {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(category) {
  return CALCULATORS.filter((c) => c.category === category);
}

export function searchCalculators(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CALCULATORS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
  );
}

export const POPULAR_SLUGS = [
  "emi-calculator",
  "sip-calculator",
  "gst-calculator",
  "bmi-calculator",
  "percentage-calculator",
  "age-calculator",
];
