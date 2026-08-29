import StaticPage from "./StaticPage.jsx";

export default function Disclaimer() {
  return (
    <StaticPage title="Disclaimer" description="Important disclaimers about IruCalc's calculators." path="/disclaimer">
      <p>
        The calculators on IruCalc are intended for general informational and educational purposes only.
      </p>
      <p>
        <strong>Financial calculators</strong> (EMI, SIP, FD, tax, etc.) use standard formulas and illustrative
        assumptions. Actual bank rates, tax rules, and investment returns vary and can change; always confirm with
        your bank, financial advisor, or the latest official tax notification before making decisions.
      </p>
      <p>
        <strong>Health calculators</strong> (BMI, BMR, calories, body fat, etc.) provide estimates based on
        established formulas and are not medical advice. Consult a doctor or qualified healthcare provider for
        guidance specific to your health.
      </p>
      <p>
        <strong>Education calculators</strong> use commonly-used conversion scales that may differ from your
        specific institution's official grading policy — always confirm with your institution.
      </p>
    </StaticPage>
  );
}
