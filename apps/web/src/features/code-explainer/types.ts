export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'csharp'
  | 'python'
  | 'sql'
  | 'java'
  | 'tsx';

export type CodeExplainRequest = {
  code: string;
  language: SupportedLanguage;
};

export type CodeExplainResponse = {
  overview: string;
  stepByStep: string[];
  importantConcepts: string[];
  possibleImprovements: string[];
};
