import { publicEnv } from "../lib/env";

export const apiVersion = publicEnv.sanityApiVersion;

export const dataset = publicEnv.sanityDataset;

export const projectId = publicEnv.sanityProjectId ?? "your-project-id";

export const isSanityConfigured = Boolean(publicEnv.sanityProjectId);
