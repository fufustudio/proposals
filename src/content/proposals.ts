import proposalsJson from "./proposals.json";
import { assertProposals } from "@/features/proposals/validation";

export const proposals = assertProposals(proposalsJson);
