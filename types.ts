
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ClauseAnalysis {
  clauseTitle: string;
  originalText: string;
  simplifiedExplanation: string;
  riskLevel: RiskLevel;
  riskDescription: string;
  suggestedAlternative?: string;
}

export interface ContractAnalysisResult {
  contractType: string;
  parties: {
    name: string;
    role: string;
  }[];
  summary: string;
  overallRiskScore: number; // 0-100
  keyDates: {
    label: string;
    date: string;
  }[];
  clauses: ClauseAnalysis[];
  unfavorableTerms: string[];
  complianceCheck: {
    statute: string;
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'AMBIGUOUS';
    notes: string;
  }[];
  mitigationStrategies: string[];
}

export interface ContractAudit {
  id: string;
  fileName: string;
  timestamp: string;
  contractType: string;
  riskScore: number;
}
