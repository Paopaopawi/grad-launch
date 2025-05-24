// components/TipsSection.tsx
import React from "react";

const tips = {
  landingJob: [
    "Build a strong portfolio with real projects.",
    "Network actively on LinkedIn and attend industry events.",
    "Tailor your resume and cover letter for each job application.",
    "Practice technical interviews and coding challenges regularly.",
    "Consider internships or freelance work to gain experience.",
  ],
  workEthics: [
    "Be punctual and reliable.",
    "Show eagerness to learn and adapt.",
    "Communicate clearly and respectfully with your team.",
    "Take responsibility and ownership of your tasks.",
    "Maintain a positive attitude even under pressure.",
  ],
  motivationalQuotes: [
    "“Success is not final, failure is not fatal: It is the courage to continue that counts.” – Winston Churchill",
    "“The future belongs to those who believe in the beauty of their dreams.” – Eleanor Roosevelt",
    "“Don’t watch the clock; do what it does. Keep going.” – Sam Levenson",
    "“Believe you can and you're halfway there.” – Theodore Roosevelt",
    "“Opportunities don't happen. You create them.” – Chris Grosser",
  ],
};

const TipsSection: React.FC = () => {
  return (
    <section className="mt-5 p-4 bg-white rounded shadow-sm">
      <h2 className="mb-4 text-center fw-bold">Tips for Fresh Graduates</h2>

      <div className="d-flex flex-column flex-md-row gap-4">
        {/* Landing a Job */}
        <div className="flex-fill border rounded p-3 shadow-sm">
          <h5 className="mb-3 text-primary fw-semibold">Landing a Job</h5>
          <ul className="ps-3 mb-0">
            {tips.landingJob.map((tip, i) => (
              <li key={i} className="mb-2">
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Work Ethics */}
        <div className="flex-fill border rounded p-3 shadow-sm">
          <h5 className="mb-3 text-primary fw-semibold">Work Ethics</h5>
          <ul className="ps-3 mb-0">
            {tips.workEthics.map((tip, i) => (
              <li key={i} className="mb-2">
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Motivational Quotes */}
        <div className="flex-fill border rounded p-3 shadow-sm">
          <h5 className="mb-3 text-primary fw-semibold">Motivational Quotes</h5>
          <ul className="ps-3 mb-0" style={{ listStyleType: "none" }}>
            {tips.motivationalQuotes.map((quote, i) => (
              <li key={i} className="fst-italic mb-3 text-secondary">
                {quote}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TipsSection;
