import StaticPage from "./StaticPage.jsx";

export default function Terms() {
  return (
    <StaticPage title="Terms & Conditions" description="Terms of use for IruCalc." path="/terms">
      <p>Last updated: January 2026</p>
      <p>By using IruCalc, you agree to the following terms.</p>
      <p>
        <strong>Free to use:</strong> IruCalc's calculators are provided free of charge for personal and
        professional use.
      </p>
      <p>
        <strong>No warranty:</strong> Calculations are provided "as is" using standard published formulas. While we
        aim for accuracy, IruCalc makes no guarantee that results are free of error and is not liable for decisions
        made based on these calculators.
      </p>
      <p>
        <strong>Not professional advice:</strong> Nothing on this site constitutes financial, medical, legal or tax
        advice. Consult a qualified professional before making significant decisions.
      </p>
      <p>
        <strong>Acceptable use:</strong> You agree not to misuse the site, including attempting to disrupt its
        operation or scrape it at a rate that degrades service for others.
      </p>
    </StaticPage>
  );
}
