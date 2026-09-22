export type Json =
  null | boolean | number | string | Json[] | { [key: string]: Json };
export type Content = string | Json[] | { [key: string]: Json };

export type Question =
  | {
      type: "noul";
      instructions: Content;
      criteria?: { true: Content; false: Content };
    }
  | {
      type: "choice";
      instructions: Content;
      criteria: Record<string, Content | null>;
    }
  | { type: "score"; instructions: Content; criteria: Content[] };

export type Answer =
  | { type: "noul"; noul: number }
  | {
      type: "choice";
      choice: string;
      probabilities: Record<string, number>;
      confidence: number;
    }
  | {
      type: "score";
      score: number;
      legend: Record<string, string>;
      probabilities: Record<string, number>;
      confidence: number;
    };

export interface EvaluationRequest {
  model: string;
  state: Content;
  questions: Record<string, Question>;
}

export interface EvaluationResponse {
  model: string;
  answers: Record<string, Answer>;
  usage: { input_tokens: number; output_tokens: number };
}

export const DEFAULT_MODEL = "jev-1.13.0";
