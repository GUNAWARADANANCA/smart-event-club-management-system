// Simple in-memory store for proposals sent to finance
export const sentProposals = [];

export const sendProposalToFinance = (proposal) => {
  const exists = sentProposals.find(p => p.id === proposal.id);
  if (!exists) sentProposals.push({ ...proposal, sentAt: new Date().toLocaleDateString() });
};
