/**
 * Architecture-diagram data — the single source of truth for the agent graphs
 * rendered by the ArchDiagram island. Shared so the AI Showcase section and the
 * project case studies stay in sync (ULTRAPLAN Phase 5: "reused in case studies").
 */
import type { DiagramNode, DiagramEdge } from '../components/islands/ArchDiagram';

/**
 * Kynetix's LangGraph supervisor routing to specialized agents (BACKEND.md §6).
 * The supervisor classifies each turn and routes to one of six specialists;
 * only the real resource dependencies are drawn (workout grounds in RAG +
 * deterministic services, profile recomputes via services, nutrition's semantic
 * path uses RAG, analysis reads the relational workout history). `week` and
 * `general` are LLM + thread-state only. Memory (checkpointer) + SSE streaming
 * wrap the whole run — carried in the caption to keep the graph legible.
 */
export const orchestrationNodes: DiagramNode[] = [
  { id: 'user', x: 0, y: 185, label: 'User', sub: 'chat', kind: 'io' },
  { id: 'supervisor', x: 210, y: 185, label: 'Supervisor', sub: 'routes intent', kind: 'agent' },

  { id: 'workout', x: 420, y: 0, label: 'Workout', sub: 'single plan', kind: 'agent' },
  { id: 'week', x: 420, y: 74, label: 'Week program', sub: 'multi-day', kind: 'agent' },
  { id: 'profile', x: 420, y: 148, label: 'Profile', sub: 'TDEE refresh', kind: 'agent' },
  { id: 'nutrition', x: 420, y: 222, label: 'Nutrition', sub: 'log · HITL', kind: 'agent' },
  { id: 'analysis', x: 420, y: 296, label: 'Analysis', sub: 'recap · coach', kind: 'agent' },
  { id: 'general', x: 420, y: 370, label: 'General', sub: 'chat', kind: 'agent' },

  { id: 'rag', x: 660, y: 73, label: 'RAG', sub: 'pgvector · HNSW', kind: 'store' },
  { id: 'services', x: 660, y: 183, label: 'Services', sub: '1RM · TDEE', kind: 'tool' },
  { id: 'history', x: 660, y: 296, label: 'History', sub: 'sessions · sets', kind: 'store' },
];
export const orchestrationEdges: DiagramEdge[] = [
  { from: 'user', to: 'supervisor' },
  { from: 'supervisor', to: 'workout' },
  { from: 'supervisor', to: 'week' },
  { from: 'supervisor', to: 'profile' },
  { from: 'supervisor', to: 'nutrition' },
  { from: 'supervisor', to: 'analysis' },
  { from: 'supervisor', to: 'general' },
  { from: 'workout', to: 'rag' },
  { from: 'workout', to: 'services' },
  { from: 'profile', to: 'services' },
  { from: 'nutrition', to: 'rag' },
  { from: 'analysis', to: 'history' },
];

/**
 * The RAG pipeline: reference knowledge is embedded and stored once (ingest);
 * at query time the question is embedded, matched against the pgvector HNSW
 * index, and the top-k chunks ground the answer.
 */
export const ragNodes: DiagramNode[] = [
  { id: 'knowledge', x: 0, y: 0, label: 'Knowledge', sub: 'kinesiology · nutrition', kind: 'io' },
  { id: 'query', x: 0, y: 96, label: 'Query', sub: 'user message', kind: 'io' },
  { id: 'embed', x: 210, y: 48, label: 'Embed', sub: 'OpenAI · 1536-d', kind: 'tool' },
  { id: 'store', x: 420, y: 48, label: 'pgvector', sub: 'HNSW cosine', kind: 'store' },
  { id: 'retrieve', x: 630, y: 48, label: 'Retrieve', sub: 'top-k', kind: 'tool' },
  { id: 'answer', x: 840, y: 48, label: 'Answer', sub: 'grounded', kind: 'agent' },
];
export const ragEdges: DiagramEdge[] = [
  { from: 'knowledge', to: 'embed' },
  { from: 'query', to: 'embed' },
  { from: 'embed', to: 'store' },
  { from: 'store', to: 'retrieve' },
  { from: 'retrieve', to: 'answer' },
];

/**
 * Agentic Job Engine — the offer side (discovery → embedding prefilter → LLM
 * rubric) and the Profile side converge on the adaptation draft, whose output
 * is keys, not prose; a pure validator rejects any key the Profile lacks.
 * Extraction is folded into the Profile node, and the human review queue and
 * PDF rendering are carried in the caption to keep the graph legible.
 */
export const jobEngineNodes: DiagramNode[] = [
  { id: 'profile', x: 0, y: 0, label: 'Profile', sub: 'CV → keyed items', kind: 'store' },
  { id: 'discovery', x: 0, y: 200, label: 'Discovery', sub: 'job boards · dedup', kind: 'io' },
  { id: 'prefilter', x: 200, y: 200, label: 'Prefilter', sub: 'embedding gate', kind: 'tool' },
  { id: 'rubric', x: 400, y: 200, label: 'Rubric', sub: 'LLM · 4 dimensions', kind: 'agent' },
  { id: 'draft', x: 600, y: 100, label: 'Draft', sub: 'LLM cites keys', kind: 'agent' },
  { id: 'validator', x: 800, y: 100, label: 'Validator', sub: 'pure · no LLM', kind: 'tool' },
];
export const jobEngineEdges: DiagramEdge[] = [
  { from: 'discovery', to: 'prefilter' },
  { from: 'profile', to: 'prefilter' },
  { from: 'prefilter', to: 'rubric' },
  { from: 'rubric', to: 'draft' },
  { from: 'profile', to: 'draft' },
  { from: 'draft', to: 'validator' },
];

/**
 * The anchored-generation guardrail at the core of Agentic Job Engine: the
 * draft is keys, not prose; a pure validator either rejects it (nothing is
 * persisted) or lets its keys resolve back to real Profile text for the PDF.
 */
export const guardrailNodes: DiagramNode[] = [
  { id: 'profile', x: 0, y: 0, label: 'Profile', sub: 'keyed items', kind: 'store' },
  { id: 'match', x: 0, y: 110, label: 'Match', sub: 'scored offer', kind: 'io' },
  { id: 'draft', x: 210, y: 55, label: 'Draft', sub: 'LLM → source_keys', kind: 'agent' },
  { id: 'validator', x: 420, y: 55, label: 'Validator', sub: 'pure · no LLM', kind: 'tool' },
  { id: 'rejected', x: 630, y: 0, label: 'Rejected', sub: 'nothing persisted', kind: 'io' },
  { id: 'resolve', x: 630, y: 110, label: 'Resolve keys', sub: 'key → Profile text', kind: 'tool' },
  { id: 'cv', x: 840, y: 110, label: 'Tailored CV', sub: 'PDF · human review', kind: 'io' },
];
export const guardrailEdges: DiagramEdge[] = [
  { from: 'profile', to: 'draft' },
  { from: 'match', to: 'draft' },
  { from: 'draft', to: 'validator' },
  { from: 'validator', to: 'rejected' },
  { from: 'validator', to: 'resolve' },
  { from: 'resolve', to: 'cv' },
];
