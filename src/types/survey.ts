// Survey list item type for displaying surveys in a list of cards (lightweight)
export type SurveyListItem = {
  id: string;
  title: string;
  description: string | null;
  status: SurveyStatus;
  isGlobal: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  questionCount: number;
  responseCount: number;
  teams: {
    teamId: string;
    teamName: string;
  }[];
};

// Survey detail type for displaying full survey with questions and teams
export type SurveyDetail = {
  id: string;
  title: string;
  description: string | null;
  status: SurveyStatus;
  isGlobal: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  teams: {
    team: {
      id: string;
      name: string;
    };
  }[];
  questions: Question[];
  questionCount: number;
  responseCount: number;
};

export type Survey = {
  id: string;
  title: string;
  description: string | null;
  status: SurveyStatus;
  isGlobal: boolean;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  companyId: string;
};

export type SurveyStatus = "DRAFT" | "ACTIVE" | "CLOSED";

export type Question = {
  id: string;
  title: string;
  description: string | null;
  required: boolean;
  order: number;
  answerType: "SATISFACTION" | "AGREEMENT" | "SCALE";
  surveyId: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type SurveyResponse = {
  id: string;
  submittedAt: Date;
  surveyId: string;
  userId: string;
  teamId: string | null;
};

export type Answer = {
  id: string;
  ratingValue: number;
  questionId: string;
  responseId: string;
  createdAt: Date;
};

export type UpdateSurveyData = {
  title: string;
  description?: string;
  isGlobal: boolean;
  teamIds?: string[];
  startDate?: Date;
  endDate?: Date;
};
