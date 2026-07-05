import type { Proposal } from "@/features/proposals";

const placeholderLine =
  "Placeholder content will be replaced once the actual proposal copy and design direction are supplied.";

export const proposals = [
  {
    slug: "sample-proposal",
    title: "Sample Proposal",
    clientLabel: "Demo Client",
    status: "draft",
    preparedAt: "2026-07-04",
    updatedAt: "2026-07-04",
    summary:
      "A fake proposal fixture used to test scrolling presentation structure, access control, section navigation, progress, and generic blocks.",
    sections: [
      {
        id: "cover",
        label: "Cover",
        eyebrow: "Fufu Proposal",
        heading: "Sample Proposal",
        intro:
          "This is a structural test page. The real proposal copy is intentionally not here yet.",
        tone: "feature",
        blocks: [{ type: "media", label: "Cover visual placeholder" }],
        nextLabel: "What we understand",
      },
      {
        id: "understand",
        label: "What we understand",
        eyebrow: "Context",
        heading: "What we understand",
        blocks: [{ type: "text", body: [placeholderLine] }],
        nextLabel: "What we noticed",
      },
      {
        id: "noticed",
        label: "What we noticed",
        eyebrow: "Observations",
        heading: "What we noticed",
        blocks: [
          {
            type: "cards",
            items: [
              { title: "Observation A", body: placeholderLine },
              { title: "Observation B", body: placeholderLine },
              { title: "Observation C", body: placeholderLine },
            ],
          },
        ],
        nextLabel: "The opportunity",
      },
      {
        id: "opportunity",
        label: "The opportunity",
        eyebrow: "Opportunity",
        heading: "The opportunity",
        blocks: [{ type: "text", body: [placeholderLine] }],
        nextLabel: "Recommended engagement",
      },
      {
        id: "engagement",
        label: "Recommended engagement",
        eyebrow: "Recommendation",
        heading: "Recommended engagement",
        tone: "feature",
        blocks: [
          {
            type: "summary",
            items: [
              {
                label: "Engagement",
                value: "TBD",
                detail:
                  "Placeholder until the proposal structure is finalized.",
              },
              {
                label: "Focus",
                value: "TBD",
                detail:
                  "Placeholder until the proposal structure is finalized.",
              },
            ],
          },
        ],
        nextLabel: "Likely direction",
      },
      {
        id: "direction",
        label: "Likely direction",
        eyebrow: "Direction",
        heading: "Likely direction",
        blocks: [{ type: "media", label: "Direction preview placeholder" }],
        nextLabel: "What's included",
      },
      {
        id: "included",
        label: "What's included",
        eyebrow: "Scope",
        heading: "What's included",
        blocks: [
          {
            type: "details",
            items: [
              { label: "Included item A", detail: placeholderLine },
              { label: "Included item B", detail: placeholderLine },
              { label: "Included item C", detail: placeholderLine },
            ],
          },
        ],
        nextLabel: "Process & timeline",
      },
      {
        id: "timeline",
        label: "Process & timeline",
        eyebrow: "Process",
        heading: "Process & timeline",
        blocks: [
          {
            type: "timeline",
            items: [
              { label: "Kickoff", detail: placeholderLine },
              { label: "Strategy", detail: placeholderLine },
              { label: "Design", detail: placeholderLine },
              { label: "Build", detail: placeholderLine },
              { label: "Launch", detail: placeholderLine },
            ],
          },
        ],
        nextLabel: "Investment",
      },
      {
        id: "investment",
        label: "Investment",
        eyebrow: "Investment",
        heading: "Investment",
        blocks: [
          {
            type: "summary",
            items: [
              {
                label: "Project investment",
                value: "TBD",
                detail: "No real pricing is included in this fixture.",
              },
            ],
          },
        ],
        nextLabel: "Optional add-ons",
      },
      {
        id: "addons",
        label: "Optional add-ons",
        eyebrow: "Options",
        heading: "Optional add-ons",
        blocks: [
          {
            type: "details",
            items: [
              { label: "Add-on A", detail: placeholderLine },
              { label: "Add-on B", detail: placeholderLine },
            ],
          },
        ],
        nextLabel: "Next steps",
      },
      {
        id: "next-steps",
        label: "Next steps",
        eyebrow: "Next",
        heading: "Next steps",
        blocks: [
          {
            type: "timeline",
            items: [
              { label: "Review", detail: placeholderLine },
              { label: "Discuss", detail: placeholderLine },
              { label: "Decide", detail: placeholderLine },
            ],
          },
        ],
      },
    ],
  },
] as const satisfies readonly Proposal[];
