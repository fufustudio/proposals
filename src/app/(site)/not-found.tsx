import { NotFoundContent } from "@/components/site/not-found-content";

export default function SiteNotFound() {
  return (
    <NotFoundContent
      eyebrow="Page unavailable"
      message="The requested content may be missing or temporarily unavailable. Please try again soon, or return home."
    />
  );
}
