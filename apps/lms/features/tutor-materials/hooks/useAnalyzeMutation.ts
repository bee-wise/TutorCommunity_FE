import { useMutation } from '@tanstack/react-query';
import { aiAnalyze } from '../api/analyze.api';
import { AIAnalyzeRequest, AIAnalyzeResponse } from '../types';

export const useAIAnalyzeMutation = () => {
  return useMutation<AIAnalyzeResponse, Error, AIAnalyzeRequest>({
    mutationFn: (data: AIAnalyzeRequest) => aiAnalyze(data),
  });
};
