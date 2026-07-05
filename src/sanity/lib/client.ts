import { createClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

export { isSanityConfigured };

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
