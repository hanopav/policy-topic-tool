<template>
  <main class="data-page">
    <AppNav />

    <section class="page-shell data-section">
      <header class="data-header">
        <p class="eyebrow">Evidence base</p>
        <h1>Explore assessments, evidence, and sources</h1>
        <p>
          This interface shows how policy recommendations are built from
          structured assessments, supporting evidence, and source material.
        </p>
      </header>

      <div class="stats-grid">
        <article class="stat-card">
          <span>{{ policyStore.questions.length }}</span>
          <p>Decision points</p>
        </article>

        <article class="stat-card">
          <span>{{ assessments.length }}</span>
          <p>Assessments</p>
        </article>

        <article class="stat-card">
          <span>{{ evidenceItems.length }}</span>
          <p>Evidence items</p>
        </article>

        <article class="stat-card">
          <span>{{ sources.length }}</span>
          <p>Sources</p>
        </article>
      </div>

      <div class="toolbar">
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <label class="search">
          <span>Search</span>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search text, IDs, topics..."
          />
        </label>
      </div>

      <section v-if="activeTab === 'assessments'" class="table-card">
        <header class="table-card__header">
          <h2>Assessments</h2>
          <p>
            Assessments are claims or judgements that support or challenge a
            policy option.
          </p>
        </header>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Direction</th>
                <th>Decision point</th>
                <th>Assessment</th>
                <th>Evidence</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="assessment in filteredAssessments"
                :key="assessment.id"
              >
                <td>
                  <strong>{{ assessment.id }}</strong>
                </td>
                <td>
                  <span
                    class="pill"
                    :class="assessment.direction === 'yes'
                      ? 'pill--support'
                      : 'pill--against'"
                  >
                    {{ assessment.direction === 'yes' ? 'For' : 'Against' }}
                  </span>
                </td>
                <td>{{ assessment.topic }}</td>
                <td>{{ assessment.text }}</td>
                <td>{{ assessment.evidenceCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-else-if="activeTab === 'evidence'" class="table-card">
        <header class="table-card__header">
          <h2>Evidence</h2>
          <p>
            Evidence items provide factual support, reasoning, data, or examples
            linked to one or more assessments.
          </p>
        </header>

        <div class="evidence-grid">
          <article
            v-for="item in filteredEvidenceItems"
            :key="item.id"
            class="evidence-card"
          >
            <div class="evidence-card__top">
              <strong>{{ item.id }}</strong>
              <span>{{ item.sourceCount }} sources</span>
            </div>

            <p>{{ item.text }}</p>

            <small>
              Linked assessment:
              <strong>{{ item.assessmentId }}</strong>
            </small>
          </article>
        </div>
      </section>

      <section v-else-if="activeTab === 'sources'" class="table-card">
        <header class="table-card__header">
          <h2>Sources</h2>
          <p>
            Source records are extracted from the evidence objects currently
            available in the local data model.
          </p>
        </header>

        <div v-if="filteredSources.length" class="source-list">
          <article
            v-for="source in filteredSources"
            :key="source.id"
            class="source-card"
          >
            <div>
              <strong>{{ source.label }}</strong>
              <p>{{ source.evidenceId }}</p>
            </div>

            <a
              v-if="source.url"
              :href="source.url"
              target="_blank"
              rel="noreferrer"
            >
              Open source
            </a>
          </article>
        </div>

        <p v-else class="empty-note">
          No source records are available in the current local dataset.
        </p>
      </section>

      <section v-else class="table-card">
        <header class="table-card__header">
          <h2>Raw data</h2>
          <p>
            Temporary raw JSON view. Later this can be replaced with a proper
            schema inspector.
          </p>
        </header>

        <pre>{{ JSON.stringify(policyStore.questions, null, 2) }}</pre>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppNav from './AppNav.vue'

import { usePolicyStore } from '../stores/policyStore'
import { policyQuestions } from '../data/policyQuestions'

const policyStore = usePolicyStore()

const activeTab = ref('assessments')
const searchQuery = ref('')

const tabs = [
  { id: 'assessments', label: 'Assessments' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'sources', label: 'Sources' },
  { id: 'raw', label: 'Raw JSON' },
]

onMounted(() => {
  if (!policyStore.questions.length) {
    policyStore.setQuestions(policyQuestions)
  }
})

const assessments = computed(() => {
  return policyStore.questions.flatMap((question) => {
    const groupedAssessments = question.assessments || {}

    return Object.entries(groupedAssessments).flatMap(([direction, items]) => {
      return (items || []).map((assessment) => ({
        id: assessment.A_id,
        direction,
        topic: question.topic,
        questionId: question.id,
        text: assessment.assessment,
        evidence: assessment.evidence || [],
        evidenceCount: assessment.evidence?.length || 0,
      }))
    })
  })
})

const evidenceItems = computed(() => {
  return assessments.value.flatMap((assessment) => {
    return assessment.evidence.map((item) => ({
      id: item.E_id,
      text: item.evidenceText,
      sources: item.sources || [],
      sourceCount: item.sources?.length || 0,
      assessmentId: assessment.id,
      assessmentText: assessment.text,
      topic: assessment.topic,
    }))
  })
})

const sources = computed(() => {
  return evidenceItems.value.flatMap((evidence) => {
    return evidence.sources.map((source, index) => ({
      id: `${evidence.id}-${index}`,
      label: source.source || source.title || `Source ${index + 1}`,
      url: source.sourceUrl || source.url || '',
      evidenceId: evidence.id,
      evidenceText: evidence.text,
    }))
  })
})

const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase())

const filteredAssessments = computed(() => {
  if (!normalizedSearch.value) return assessments.value

  return assessments.value.filter((item) =>
    [
      item.id,
      item.direction,
      item.topic,
      item.text,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch.value)
  )
})

const filteredEvidenceItems = computed(() => {
  if (!normalizedSearch.value) return evidenceItems.value

  return evidenceItems.value.filter((item) =>
    [
      item.id,
      item.text,
      item.assessmentId,
      item.assessmentText,
      item.topic,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch.value)
  )
})

const filteredSources = computed(() => {
  if (!normalizedSearch.value) return sources.value

  return sources.value.filter((item) =>
    [
      item.label,
      item.url,
      item.evidenceId,
      item.evidenceText,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch.value)
  )
})
</script>

<style scoped>
.data-page {
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

.data-section {
  padding: 48px 0 64px;
}

.data-header {
  max-width: 840px;
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

.data-header p {
  margin: 18px 0 0;
  color: #475569;
  font-size: 1.04rem;
  line-height: 1.7;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  background: #ffffff;
  padding: 22px;
  box-shadow: 0 16px 45px rgba(15, 23, 42, 0.06);
}

.stat-card span {
  color: #0f172a;
  font-size: 2rem;
  font-weight: 900;
}

.stat-card p {
  margin: 4px 0 0;
  color: #64748b;
  font-weight: 700;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-end;
  margin-bottom: 18px;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tabs button {
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #ffffff;
  color: #334155;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
}

.tabs button.active {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.search {
  display: grid;
  gap: 6px;
  min-width: 260px;
  color: #475569;
  font-size: 0.82rem;
  font-weight: 800;
}

.search input {
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #ffffff;
  padding: 10px 14px;
  color: #0f172a;
}

.table-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.table-card__header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.table-card__header h2 {
  margin: 0;
  color: #0f172a;
}

.table-card__header p {
  margin: 8px 0 0;
  color: #64748b;
  line-height: 1.6;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8fafc;
  color: #475569;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-align: left;
  text-transform: uppercase;
}

th,
td {
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
}

td {
  color: #334155;
  line-height: 1.55;
}

.pill {
  display: inline-flex;
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 0.75rem;
  font-weight: 800;
}

.pill--support {
  background: #eff6ff;
  color: #2563eb;
}

.pill--against {
  background: #fff7ed;
  color: #c2410c;
}

.evidence-grid {
  display: grid;
  gap: 14px;
  padding: 24px;
}

.evidence-card {
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #f8fafc;
  padding: 16px;
}

.evidence-card__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.evidence-card__top strong {
  color: #2563eb;
}

.evidence-card__top span {
  color: #64748b;
  font-size: 0.86rem;
  font-weight: 800;
}

.evidence-card p {
  margin: 0 0 12px;
  color: #334155;
  line-height: 1.65;
}

.evidence-card small {
  color: #64748b;
}

.source-list {
  display: grid;
  gap: 12px;
  padding: 24px;
}

.source-card {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 16px;
}

.source-card p {
  margin: 4px 0 0;
  color: #64748b;
}

.source-card a {
  color: #2563eb;
  font-weight: 800;
}

.empty-note {
  margin: 0;
  padding: 24px;
  color: #64748b;
}

pre {
  overflow-x: auto;
  margin: 0;
  padding: 24px;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 0.86rem;
  line-height: 1.6;
}

@media (max-width: 860px) {
  .topbar,
  .toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .search {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 560px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>