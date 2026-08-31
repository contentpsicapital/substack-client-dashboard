export type DateRangeOption = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'All-Time';
export type TopicOption = 'All' | 'Macro' | 'Oil' | 'Geopolitics' | 'Hard Assets' | 'AI' | 'Markets';
export type CtaTypeOption = 'All' | 'Subscribe' | 'Read Post' | 'Reply' | 'Comment' | 'Restack';
export type NoteFormatOption = 'All' | 'Chart' | 'Quote' | 'Text' | 'Image';
export type DiagnosticTypeOption = 'All' | 'Low Conversion' | 'High Conversion' | 'Low Engagement' | 'High Engagement' | 'CTA Opportunity';
export type ArticleTypeOption = 'All' | 'Essay' | 'Scorecard' | 'Guide' | 'Update';
export type TrafficCategory = 'Substack Internal' | 'Organic Search' | 'Social Media' | 'Direct / Unattributed' | 'Other External';
export type QualityClassification = 'High' | 'Medium' | 'Low';

export interface Article {
  id: string;
  title: string;
  publishDate: string;
  views: number;
  subscribersGained: number;
  conversionRate: number;
  topic: TopicOption;
  CTAtype: CtaTypeOption;
  format: ArticleTypeOption;
  thesis: string;
  baselinePerformance: string;
  smmAdvice: string;
  frictionPoint?: string;
  futureAction?: string;
  ctaStrategy?: string;
  likes: number;
  comments: number;
}

export interface SubstackNote {
  id: string;
  hook: string;
  publishDate: string;
  impressions: number;
  likes: number;
  restacks: number;
  replies: number;
  profileClicks: number;
  subscribersGained: number;
  format: NoteFormatOption;
  linkedArticleId?: string;
  topic?: TopicOption;
  hookAnalysis?: string;
  futureNoteAction?: string;
}

export interface TrafficSourceItem {
  id: string;
  source: string;
  category: TrafficCategory;
  uniqueVisitors: number;
  newSubscribers: number;
  conversionRate: number;
  qualityClassification: QualityClassification;
  description?: string;
}

export interface SMMDiagnostic {
  id: string;
  contentTitle: string;
  contentType: 'Article' | 'Note';
  diagnosticType: DiagnosticTypeOption;
  articleType?: ArticleTypeOption;
  noteType?: NoteFormatOption;
  topic?: TopicOption;
  theWhy: string;
  frictionPoint?: string;
  futureAction: string;
  metricHighlight: string;
}

export interface FilterState {
  dateRange: DateRangeOption;
  topic: TopicOption;
  ctaType: CtaTypeOption;
  noteFormat: NoteFormatOption;
  diagnosticType: DiagnosticTypeOption;
  articleType: ArticleTypeOption;
  noteType: NoteFormatOption;
  selectedArticleId: string;
}

export interface TimeSeriesPoint {
  date: string;
  subscribers: number;
  organicSubscribers: number;
  referralSubscribers: number;
}
