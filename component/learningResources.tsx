// components/LearningResources.tsx
import React from "react";

type Resource = {
  title: string;
  url: string;
  description?: string;
};

const resources: Record<string, Resource[]> = {
  Beginner: [
    {
      title: "freeCodeCamp - Responsive Web Design",
      url: "https://www.freecodecamp.org/learn/responsive-web-design/",
      description: "A great start for HTML & CSS basics.",
    },
    {
      title: "MDN Web Docs - JavaScript Basics",
      url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics",
      description: "Beginner-friendly JavaScript tutorial.",
    },
    {
      title: "Codecademy - Learn Python 3",
      url: "https://www.codecademy.com/learn/learn-python-3",
      description: "Interactive Python fundamentals course.",
    },
  ],
  Intermediate: [
    {
      title: "JavaScript.info - Modern JavaScript Tutorial",
      url: "https://javascript.info/",
      description: "Comprehensive guide for intermediate JavaScript.",
    },
    {
      title: "React Official Docs",
      url: "https://reactjs.org/docs/getting-started.html",
      description: "Learn React concepts and API.",
    },
    {
      title: "Node.js Official Docs",
      url: "https://nodejs.org/en/docs/",
      description: "Backend development with Node.js.",
    },
  ],
  Advanced: [
    {
      title: "Advanced React Patterns - Kent C. Dodds",
      url: "https://kentcdodds.com/blog/advanced-react-patterns",
      description: "Explore advanced React techniques.",
    },
    {
      title: "Designing Data-Intensive Applications (Book Summary)",
      url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/",
      description: "Deep dive into data systems architecture.",
    },
    {
      title: "System Design Primer",
      url: "https://github.com/donnemartin/system-design-primer",
      description: "Learn system design for interviews and production systems.",
    },
  ],
};

const LearningResources: React.FC = () => {
  return (
    <section className="mt-5 p-4 bg-white rounded shadow-sm">
      <h3 className="mb-4">Learning Resources & Tutorials</h3>
      <div className="row">
        {Object.entries(resources).map(([level, resList]) => (
          <div key={level} className="col-md-4 mb-4">
            <h5>{level}</h5>
            <ul className="list-unstyled">
              {resList.map(({ title, url, description }, idx) => (
                <li key={idx} className="mb-3">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fw-semibold text-decoration-none"
                  >
                    {title}
                  </a>
                  {description && (
                    <p className="mb-0 text-muted">{description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningResources;
