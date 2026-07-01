export interface ConversationSummary {
  totalConversations: number;
  totalTokens: number;
  today: number;
}
export interface ConversationListItem {
  id: number;
  session_id: string;
  created_at: string;
  updated_at: string;
  country: string | null;
  city: string | null;
  ip_hash: string | null;
  input_tokens: number;
  output_tokens: number;
  preview: string;
}
export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
export interface ConversationDetail extends ConversationListItem {
  messages: ConversationMessage[];
  sources: { title: string; ref: string }[];
}
export interface ConversationsResponse {
  items: ConversationListItem[];
  summary: ConversationSummary;
}
