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
