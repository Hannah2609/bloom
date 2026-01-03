export type QuestionAnalytics = {
  questionId: string;
  title: string;
  description: string | null;
  answerType: "SATISFACTION" | "AGREEMENT" | "SCALE";
  order: number;
  responseCount: number;
  average: number;
  distribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
};

export type ChartType = "bar" | "pie" | "radial";

export type SurveyAnalytics = {
  surveyId: string;
  title: string;
  description: string | null;
  status: string;
  isGlobal: boolean;
  totalResponses: number;
  questions: QuestionAnalytics[];
};

export type WeeklyHappinessData = {
  weekStart: string;
  companyAverage: number;
  teamAverages: {
    teamId: string;
    teamName: string;
    average: number;
    responseCount: number;
  }[];
  totalResponses: number;
};
