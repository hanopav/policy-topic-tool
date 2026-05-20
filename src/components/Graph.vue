<template>
  <main class="graph-page">
    <AppNav />

    <section class="page-shell graph-section">
      <header class="graph-header">
        <p class="eyebrow">Knowledge network</p>
        <h1>Map relationships between topics, assessments, evidence, and sources</h1>
        <p>
          This view shows how policy knowledge is structured. Decision points link
          to assessments, assessments link to evidence, and evidence links to sources.
        </p>
      </header>

      <div class="graph-layout">
        <aside class="control-panel">
          <h2>Filter nodes</h2>

          <label
            v-for="type in nodeTypes"
            :key="type.id"
            class="checkbox-row"
          >
            <input
              v-model="visibleTypes"
              type="checkbox"
              :value="type.id"
            />
            <span>{{ type.label }}</span>
          </label>

          <button class="button button--secondary" type="button" @click="resetFilters">
            Reset filters
          </button>

          <div class="selected-card">
            <h2>Selected node</h2>

            <template v-if="selectedNode">
              <p class="selected-card__id">{{ selectedNode.id }}</p>
              <p class="selected-card__type">{{ nodeTypeLabel(selectedNode.type) }}</p>
              <p>{{ selectedNode.label }}</p>
            </template>

            <p v-else class="muted">
              Select a node in the graph.
            </p>
          </div>
        </aside>

        <section class="graph-card">
          <div class="legend">
            <span
              v-for="type in nodeTypes"
              :key="type.id"
              class="legend-item"
            >
              <i :class="`node-color node-color--${type.id}`" />
              {{ type.label }}
            </span>
          </div>

          <div class="svg-wrap">
            <svg
              :viewBox="`0 0 ${width} ${height}`"
              role="img"
              aria-label="Policy evidence network graph"
            >
              <g>
                <path
                  v-for="edge in visibleEdges"
                  :key="edge.id"
                  class="edge"
                  :d="edgePath(edge)"
                />
              </g>

<g>
  <g
    v-for="node in visibleNodes"
    :key="node.id"
    class="node-group"
    tabindex="0"
    role="button"
    @click="selectedNodeId = node.id"
    @keydown.enter="selectedNodeId = node.id"
  >
    <circle
      :cx="node.x"
      :cy="node.y"
      :r="selectedNodeId === node.id ? 16 : 13"
      class="node"
      :class="[
        `node--${node.type}`,
        { 'node--active': selectedNodeId === node.id }
      ]"
    />

    <text
      :x="node.x + 22"
      :y="node.y"
      dominant-baseline="middle"
      class="node-label"
    >
      {{ shortLabel(node.label) }}
    </text>

    <title>{{ node.id }} — {{ node.label }}</title>
  </g>
</g>
            </svg>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppNav from './AppNav.vue'

import { usePolicyStore } from '../stores/policyStore'
import { policyQuestions } from '../data/policyQuestions'

const policyStore = usePolicyStore()

const width = 1200
const height = 760

const selectedNodeId = ref(null)
const visibleTypes = ref(['topic', 'assessment', 'evidence', 'source'])

const nodeTypes = [
  { id: 'topic', label: 'Decision points' },
  { id: 'assessment', label: 'Assessments' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'source', label: 'Sources' },
]

onMounted(() => {
  if (!policyStore.questions.length) {
    policyStore.setQuestions(policyQuestions)
  }
})

const graphData = computed(() => {
  const nodes = []
  const edges = []

  const columns = {
    topic: 80,
    assessment: 390,
    evidence: 720,
    source: 1010,
  }

  const topicGap = 130
  let assessmentIndex = 0
  let evidenceIndex = 0
  let sourceIndex = 0

  policyStore.questions.forEach((question, questionIndex) => {
    const topicNode = {
      id: question.id,
      type: 'topic',
      label: question.topic,
      x: columns.topic,
      y: 90 + questionIndex * topicGap,
    }

    nodes.push(topicNode)

    Object.entries(question.assessments || {}).forEach(([direction, assessments]) => {
      ;(assessments || []).forEach((assessment) => {
        const assessmentNode = {
          id: assessment.A_id,
          type: 'assessment',
          direction,
          label: assessment.assessment,
          x: columns.assessment,
          y: 70 + assessmentIndex * 92,
        }

        nodes.push(assessmentNode)

        edges.push({
          id: `${question.id}-${assessment.A_id}`,
          from: question.id,
          to: assessment.A_id,
        })

        assessmentIndex += 1

        ;(assessment.evidence || []).forEach((evidence) => {
          const evidenceNode = {
            id: evidence.E_id,
            type: 'evidence',
            label: evidence.evidenceText,
            x: columns.evidence,
            y: 70 + evidenceIndex * 92,
          }

          nodes.push(evidenceNode)

          edges.push({
            id: `${assessment.A_id}-${evidence.E_id}`,
            from: assessment.A_id,
            to: evidence.E_id,
          })

          evidenceIndex += 1

          ;(evidence.sources || []).forEach((source, index) => {
            const sourceId = `${evidence.E_id}-S${index + 1}`

            const sourceNode = {
              id: sourceId,
              type: 'source',
              label: source.source || source.title || source.sourceUrl || `Source ${index + 1}`,
              url: source.sourceUrl || source.url || '',
              x: columns.source,
              y: 70 + sourceIndex * 92,
            }

            nodes.push(sourceNode)

            edges.push({
              id: `${evidence.E_id}-${sourceId}`,
              from: evidence.E_id,
              to: sourceId,
            })

            sourceIndex += 1
          })
        })
      })
    })
  })

  return { nodes, edges }
})

const visibleNodes = computed(() => {
  return graphData.value.nodes.filter((node) =>
    visibleTypes.value.includes(node.type)
  )
})

const visibleNodeIds = computed(() => {
  return new Set(visibleNodes.value.map((node) => node.id))
})

const visibleEdges = computed(() => {
  return graphData.value.edges.filter((edge) =>
    visibleNodeIds.value.has(edge.from) && visibleNodeIds.value.has(edge.to)
  )
})

const selectedNode = computed(() => {
  return graphData.value.nodes.find((node) => node.id === selectedNodeId.value) || null
})

function edgePath(edge) {
  const from = graphData.value.nodes.find((node) => node.id === edge.from)
  const to = graphData.value.nodes.find((node) => node.id === edge.to)

  if (!from || !to) return ''

  const midX = (from.x + to.x) / 2

  return `M ${from.x + 14} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x - 14} ${to.y}`
}

function shortLabel(label) {
  if (!label) return ''
  return label.length > 46 ? `${label.slice(0, 46)}…` : label
}

function nodeTypeLabel(type) {
  return nodeTypes.find((item) => item.id === type)?.label || type
}

function resetFilters() {
  visibleTypes.value = ['topic', 'assessment', 'evidence', 'source']
}
</script>

<style scoped>
.graph-page {
  min-height: 100vh;
  background: #f8fafc;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  padding: 14px 28px;
  border-bottom: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
}

.brand {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  color: #0f172a;
  font-weight: 800;
  text-decoration: none;
}

.brand__mark {
  display: inline-grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 10px;
  background: #2563eb;
  color: #ffffff;
  font-size: 0.82rem;
}

.topbar__links {
  display: flex;
  gap: 18px;
}

.topbar__links a {
  color: #475569;
  font-weight: 700;
  text-decoration: none;
}

.topbar__links a:hover,
.topbar__links a.router-link-active {
  color: #2563eb;
}

.graph-section {
  padding: 48px 0 64px;
}

.graph-header {
  max-width: 900px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1;
  letter-spacing: -0.045em;
}

.graph-header p {
  margin: 18px 0 0;
  color: #475569;
  font-size: 1.04rem;
  line-height: 1.7;
}

.graph-layout {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.control-panel,
.graph-card {
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.control-panel {
  position: sticky;
  top: 88px;
  padding: 22px;
}

.control-panel h2 {
  margin: 0 0 14px;
  color: #0f172a;
  font-size: 1.05rem;
}

.checkbox-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 12px 0;
  color: #334155;
  font-weight: 700;
}

.button {
  width: 100%;
  margin-top: 14px;
  border: 0;
  border-radius: 999px;
  padding: 11px 17px;
  font-weight: 800;
  cursor: pointer;
}

.button--secondary {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
}

.selected-card {
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.selected-card p {
  color: #475569;
  line-height: 1.6;
}

.selected-card__id {
  margin: 0;
  color: #2563eb !important;
  font-weight: 900;
}

.selected-card__type {
  margin: 4px 0 12px;
  color: #64748b !important;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.muted {
  color: #64748b;
}

.graph-card {
  overflow: hidden;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  padding: 18px 22px;
  border-bottom: 1px solid #e2e8f0;
}

.legend-item {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  color: #475569;
  font-size: 0.86rem;
  font-weight: 800;
}

.node-color {
  width: 12px;
  height: 12px;
  border-radius: 999px;
}

.node-color--topic {
  background: #2563eb;
}

.node-color--assessment {
  background: #9333ea;
}

.node-color--evidence {
  background: #059669;
}

.node-color--source {
  background: #f97316;
}

.svg-wrap {
  overflow: auto;
  height: 680px;
  background:
    linear-gradient(#f8fafc 1px, transparent 1px),
    linear-gradient(90deg, #f8fafc 1px, transparent 1px);
  background-color: #ffffff;
  background-size: 28px 28px;
}

svg {
  min-width: 1100px;
  min-height: 680px;
}

.edge {
  fill: none;
  stroke: #94a3b8;
  stroke-width: 1.5;
  opacity: 0.65;
}

.node-group {
  cursor: pointer;
  outline: none;
}

.node-group:hover .node {
  stroke: #0f172a;
  stroke-width: 4;
}

.node {
  stroke: #0f172a;
  stroke-width: 2.5;
  transition: r 120ms ease, opacity 120ms ease;
}

.node--topic {
  fill: #2563eb;
}

.node--assessment {
  fill: #9333ea;
}

.node--evidence {
  fill: #059669;
}

.node--source {
  fill: #f97316;
}

.node--active {
  stroke: #0f172a;
  stroke-width: 4;
}

.node-label {
  fill: #334155;
  font-size: 13px;
  font-weight: 700;
  pointer-events: none;
}

@media (max-width: 980px) {
  .graph-layout {
    grid-template-columns: 1fr;
  }

  .control-panel {
    position: static;
  }
}
</style>