import type {
  CodeExplainRequest,
  CodeExplainResponse,
} from './types.ts'

export async function explainCodeMock(
  request: CodeExplainRequest
): Promise<CodeExplainResponse> {
  const { code, language } = request

  await new Promise((resolve) => setTimeout(resolve, 1200))

  const preview = code.length > 180 ? `${code.slice(0, 180)}...` : code

  return {
    overview: `This ${language} snippet appears to define logic that processes input, applies business rules, and returns a result. It is structured in a readable way and likely supports a feature or reusable workflow. Preview: ${preview}`,
    stepByStep: [
      'The code receives input values or parameters.',
      'It applies conditional or transformation logic to those values.',
      'It prepares a result that can be returned or rendered elsewhere.',
      'It may rely on framework or language-specific patterns to keep the code organized.',
    ],
    importantConcepts: [
      'Function and component structure',
      'Conditional logic',
      'State or data transformation',
      'Separation of concerns',
    ],
    possibleImprovements: [
      'Add stronger type safety or validation where appropriate.',
      'Extract repeated logic into a helper function if reused elsewhere.',
      'Add comments only where intent is not immediately obvious.',
      'Consider edge cases and error handling for unexpected input.',
    ],
  }
}
