/**
 * Architecture-diagram data — the single source of truth for the agent graphs
 * rendered by the ArchDiagram island. Shared so the AI Showcase section and the
 * project case studies stay in sync (ULTRAPLAN Phase 5: "reused in case studies").
 */
import type { DiagramNode, DiagramEdge } from '../components/islands/ArchDiagram';

/** Kynetix's LangGraph supervisor routing to specialized agents. */
export const orchestrationNodes: DiagramNode[] = [
  { id: 'user', x: 0, y: 138, label: 'User', sub: 'chat', kind: 'io' },
  { id: 'supervisor', x: 205, y: 138, label: 'Supervisor', sub: 'routes intent', kind: 'agent' },
  { id: 'general', x: 420, y: 20, label: 'General', sub: 'chat', kind: 'agent' },
  { id: 'analysis', x: 420, y: 100, label: 'Analysis', sub: 'live session', kind: 'agent' },
  { id: 'training', x: 420, y: 180, label: 'Training', sub: 'plan · week', kind: 'agent' },
  { id: 'nutrition', x: 420, y: 260, label: 'Nutrition', sub: 'HITL log', kind: 'agent' },
  { id: 'rag', x: 630, y: 70, label: 'RAG', sub: 'pgvector · HNSW', kind: 'store' },
  { id: 'services', x: 630, y: 210, label: 'Services', sub: '1RM · TDEE', kind: 'tool' },
];
export const orchestrationEdges: DiagramEdge[] = [
  { from: 'user', to: 'supervisor' },
  { from: 'supervisor', to: 'general' },
  { from: 'supervisor', to: 'analysis' },
  { from: 'supervisor', to: 'training' },
  { from: 'supervisor', to: 'nutrition' },
  { from: 'general', to: 'rag' },
  { from: 'analysis', to: 'services' },
  { from: 'training', to: 'services' },
  { from: 'nutrition', to: 'rag' },
];

/**
 * Compact agent graph for the Hero — a hero-scale subset of the orchestration
 * diagram (drops the training branch) so it reads cleanly beside the headline.
 */
export const heroNodes: DiagramNode[] = [
  { id: 'user', x: 0, y: 128, label: 'User', sub: 'chat', kind: 'io' },
  { id: 'supervisor', x: 205, y: 128, label: 'Supervisor', sub: 'routes intent', kind: 'agent' },
  { id: 'general', x: 420, y: 18, label: 'General', sub: 'chat', kind: 'agent' },
  { id: 'analysis', x: 420, y: 128, label: 'Analysis', sub: 'live session', kind: 'agent' },
  { id: 'nutrition', x: 420, y: 238, label: 'Nutrition', sub: 'HITL log', kind: 'agent' },
  { id: 'rag', x: 630, y: 40, label: 'RAG', sub: 'pgvector', kind: 'store' },
  { id: 'services', x: 630, y: 200, label: 'Services', sub: '1RM · TDEE', kind: 'tool' },
];
export const heroEdges: DiagramEdge[] = [
  { from: 'user', to: 'supervisor' },
  { from: 'supervisor', to: 'general' },
  { from: 'supervisor', to: 'analysis' },
  { from: 'supervisor', to: 'nutrition' },
  { from: 'general', to: 'rag' },
  { from: 'analysis', to: 'services' },
  { from: 'nutrition', to: 'rag' },
];

/** The RAG retrieval pipeline: embed → match → retrieve → ground. */
export const ragNodes: DiagramNode[] = [
  { id: 'query', x: 0, y: 48, label: 'Query', kind: 'io' },
  { id: 'embed', x: 180, y: 48, label: 'Embed', sub: 'OpenAI', kind: 'tool' },
  { id: 'store', x: 360, y: 48, label: 'pgvector', sub: 'HNSW cosine', kind: 'store' },
  { id: 'retrieve', x: 540, y: 48, label: 'Retrieve', sub: 'top-k', kind: 'tool' },
  { id: 'answer', x: 720, y: 48, label: 'Answer', sub: 'grounded', kind: 'agent' },
];
export const ragEdges: DiagramEdge[] = [
  { from: 'query', to: 'embed' },
  { from: 'embed', to: 'store' },
  { from: 'store', to: 'retrieve' },
  { from: 'retrieve', to: 'answer' },
];
