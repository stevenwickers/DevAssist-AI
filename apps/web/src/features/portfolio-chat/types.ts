export type ChatRole = 'user' | 'assistant';

export type SourceReference = {
  id: string;
  label: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  sources?: SourceReference[];
};

export type PortfolioChatRequest = {
  message: string;
  history: ChatMessage[];
};

export type PortfolioChatResponse = {
  reply: string;
  sources: SourceReference[];
};
