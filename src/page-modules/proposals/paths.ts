export function proposalPath(slug: string) {
  return `/proposals/${encodeURIComponent(slug)}`;
}

export function proposalAccessPath(slug: string) {
  return `${proposalPath(slug)}/access`;
}

export function slugFromProposalPath(pathname: string) {
  const match = pathname.match(/^\/proposals\/([^/]+)(?:\/.*)?$/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
