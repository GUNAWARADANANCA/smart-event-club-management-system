const GENERATED_PROPOSALS_KEY = 'generatedBudgetProposals';
const SENT_PROPOSALS_KEY = 'sentBudgetProposals';

const readList = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeList = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const toSentenceCase = (value) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim();

const formatCurrency = (value) => Number(value || 0);

const deriveEventTitle = (request) => {
  const customTitle = request.eventTitle || request.title;
  if (customTitle) return toSentenceCase(customTitle);

  const fromDescription = String(request.description || '')
    .match(/organize an? (.+?)(?: in | at | for |\.|,|$)/i)?.[1];

  if (fromDescription) return toSentenceCase(fromDescription);

  return `${toSentenceCase(request.fullName)} Event Proposal`;
};

const buildBudgetBreakdown = (request) => {
  const academicYear = Number(String(request.academicYear || '').replace(/\D/g, '')) || 1;
  const participantCount = Number(String(request.description || '').match(/(\d+)\s+participants/i)?.[1]) || 100;
  const equipmentCost = formatCurrency(50000 + participantCount * 250);
  const laborCost = formatCurrency(35000 + academicYear * 15000);
  const materialsCost = formatCurrency(40000 + participantCount * 180);
  const miscellaneousCost = formatCurrency(Math.round((equipmentCost + laborCost + materialsCost) * 0.18));

  return {
    equipmentCost,
    laborCost,
    materialsCost,
    miscellaneousCost,
    amount: equipmentCost + laborCost + materialsCost + miscellaneousCost,
  };
};

export const getGeneratedBudgetProposals = () => readList(GENERATED_PROPOSALS_KEY);

export const getSentBudgetProposals = () => readList(SENT_PROPOSALS_KEY);

export const createBudgetProposalFromRequest = (request) => {
  const existing = getGeneratedBudgetProposals().find((proposal) => proposal.id === request.id);
  if (existing) {
    return existing;
  }

  const eventTitle = deriveEventTitle(request);
  const budget = buildBudgetBreakdown(request);
  const proposal = {
    id: request.id,
    requestId: request.id,
    event: eventTitle,
    name: `Budget Proposal - ${eventTitle}`,
    type: 'Event',
    submittedDate: request.submittedDate,
    status: 'Approved',
    description: request.description,
    introduction: `This proposal was auto-generated after ${request.fullName}'s event request was approved by Event Management.`,
    objectives: `Conduct ${eventTitle} successfully with proper venue, logistics, technical support, and student participation arrangements.`,
    justification: `This budget is required to organize ${eventTitle} smoothly and cover essential operational, material, and contingency expenses.`,
    remarks: '',
    source: 'ManageRequests',
    generatedAt: new Date().toLocaleString(),
    requestedBy: request.fullName,
    requesterEmail: request.email,
    ...budget,
  };

  const proposals = [...getGeneratedBudgetProposals(), proposal];
  writeList(GENERATED_PROPOSALS_KEY, proposals);
  return proposal;
};

export const sendProposalToFinance = (proposal) => {
  const existing = getSentBudgetProposals().find((item) => item.id === proposal.id);
  if (existing) {
    return existing;
  }

  const sentProposal = {
    ...proposal,
    sentAt: new Date().toLocaleString(),
    financeStatus: 'Pending',
  };
  const proposals = [...getSentBudgetProposals(), sentProposal];
  writeList(SENT_PROPOSALS_KEY, proposals);
  return sentProposal;
};
