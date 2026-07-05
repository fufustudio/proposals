module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      url: ["http://127.0.0.1:3000/"],
      numberOfRuns: 3,
      settings: {
        preset: "mobile",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["warn", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
