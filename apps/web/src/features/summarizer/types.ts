export type SummaryTone = 'professional' | 'friendly' | 'concise';

export type SummarizeRequest = {
  text: string;
  tone: SummaryTone;
};

export type SummarizeResponse = {
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
};
