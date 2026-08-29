import StaticPage from "./StaticPage.jsx";

export default function Privacy() {
  return (
    <StaticPage title="Privacy Policy" description="How IruCalc handles your data." path="/privacy-policy">
      <p>Last updated: January 2026</p>
      <p>
        IruCalc does not require an account and does not collect the numbers you enter into any calculator. All
        calculations happen locally, in your browser.
      </p>
      <p>
        <strong>Local storage:</strong> Favorites, recently used calculators and calculation history are saved
        using your browser's localStorage. This data stays on your device and is never transmitted to us. You can
        clear it at any time by clearing your browser's site data.
      </p>
      <p>
        <strong>Analytics:</strong> We may use privacy-respecting analytics to understand which calculators are
        popular, in aggregate. This does not include the values you type into any calculator.
      </p>
      <p>
        <strong>Advertising:</strong> IruCalc is designed to support standard display advertising (such as Google
        AdSense) in clearly labelled areas of the page. Any third-party ad provider may use cookies subject to
        their own privacy policy.
      </p>
      <p>If you have questions about this policy, please reach out via the Contact page.</p>
    </StaticPage>
  );
}
