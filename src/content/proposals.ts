import "server-only";

import proposalsJson from "./proposals.json";
import { assertProposals } from "@/page-modules/proposals/validation";

export const proposals = assertProposals(proposalsJson);
