import StaticPage from "./StaticPage.jsx";

export default function About() {
  return (
    <StaticPage title="About Us" description="Learn about Calcora's mission to make everyday calculations simple and free." path="/about">
      <p>
        Calcora was built on a simple idea: the calculations people need most — loan EMIs, GST, BMI, percentages,
        grades — shouldn't require downloading an app, creating an account, or wading through ads to get a
        straight answer.
      </p>
      <p>
        Every calculator on this site runs entirely in your browser. There's no backend processing your numbers,
        no login wall, and no data leaving your device unless you explicitly choose to share a result.
      </p>
      <p>
        We built Calcora for students checking their attendance percentage, families planning a home loan,
        developers converting number bases, and anyone in between. If there's a calculator you'd like to see
        added, reach out — see the Contact page for details.
      </p>
    </StaticPage>
  );
}
