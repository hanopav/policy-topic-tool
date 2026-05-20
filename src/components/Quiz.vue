<template>
  <main class="quiz-page">
    <AppNav
  :stage="policyStore.stage"
  :current-question-index="policyStore.currentQuestionIndex"
  :question-count="policyStore.questions.length"
  :show-restart="policyStore.stage !== 'welcome'"
  @restart="restart"
    />

    <Welcome
      v-if="policyStore.stage === 'welcome'"
      title="Evidence Policy Navigator"
      policy-topic="the selected policy problem"
      :decision-points="policyStore.questions"
      @start="startQuiz"
    />

    <section
      v-else-if="policyStore.stage === 'quiz' && currentQuestion"
      class="page-shell quiz-section"
    >
      <header class="question-header">
        <p class="eyebrow">Decision point</p>
        <h1>
          {{ policyStore.currentQuestionIndex + 1 }}.
          {{ currentQuestion.topic }}
        </h1>
      </header>

      <article class="question-card">
        <p class="question-instruction">
          Using the assessments below, select the answer that best fits your judgement.
        </p>

        <div class="response-preview">
          <strong>
            {{ currentQuestion.response?.[0] }}
            <span v-if="selectedAnswer === null" class="blank">
              {{ currentQuestion.response_blank || 'select an answer' }}
            </span>
            <span v-else class="selected-answer">
              {{ currentQuestion.options[selectedAnswer] }}
            </span>
            {{ currentQuestion.response?.[1] }}
          </strong>
        </div>

        <div class="options-grid">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="option"
            class="option-button"
            :class="{ 'option-button--active': selectedAnswer === index }"
            type="button"
            @click="selectedAnswer = index"
          >
            <span>{{ index + 1 }}</span>
            {{ option }}
          </button>
        </div>

        <div class="assessment-grid">
          <section
            v-for="(set, key) in currentQuestion.assessments"
            :key="key"
            class="assessment-column"
          >
            <h2>
              {{ key === 'no' ? 'Arguments against' : 'Arguments for' }}
            </h2>

            <article
              v-for="assessment in set"
              :key="assessment.A_id"
              class="assessment"
            >
              <p>
                <strong>[{{ assessment.A_id }}]</strong>
                {{ assessment.assessment }}
              </p>

              <details>
                <summary>Evidence</summary>

                <p
                  v-if="!assessment.evidence || assessment.evidence.length === 0"
                  class="muted"
                >
                  This assessment does not have supporting evidence yet.
                </p>

                <div
                  v-for="evidence in assessment.evidence"
                  :key="evidence.E_id"
                  class="evidence"
                >
                  <p>
                    <strong>[{{ evidence.E_id }}]</strong>
                    {{ evidence.evidenceText }}
                  </p>

                  <div class="sources">
                    <a
                      v-for="(source, sourceIndex) in evidence.sources || []"
                      :key="source.sourceUrl || sourceIndex"
                      :href="source.sourceUrl"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source {{ sourceIndex + 1 }}
                    </a>
                  </div>
                </div>
              </details>
            </article>
          </section>
        </div>

        <footer class="question-actions">
          <button
            class="button button--primary"
            type="button"
            :disabled="selectedAnswer === null"
            @click="submitCurrentAnswer"
          >
            {{ policyStore.isLastQuestion ? 'See results' : 'Next question' }}
          </button>
        </footer>
      </article>
    </section>

    <Results
      v-else-if="policyStore.stage === 'results'"
      @continue="openMemo"
    />

  <Memo v-else-if="policyStore.stage === 'brief'" />
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Results from './Results.vue'
import Welcome from './Welcome.vue'
import Memo from './Memo.vue'
import Footer from './Footer.vue'
import AppNav from './AppNav.vue'
import { usePolicyStore } from '../stores/policyStore'
import { policyQuestions } from '../data/policyQuestions'

const policyStore = usePolicyStore()
const selectedAnswer = ref(null)

const currentQuestion = computed(() => policyStore.currentQuestion)

onMounted(() => {
  policyStore.setQuestions(policyQuestions)

  const savedStage = localStorage.getItem('stage')
  const savedAnswers = localStorage.getItem('answers')
  const savedQuestionIndex = localStorage.getItem('currentQuestionIndex')
  const savedFinalRecommendation = localStorage.getItem('finalRecommendation')

    if (savedFinalRecommendation) {
    try {
        policyStore.setFinalRecommendation(JSON.parse(savedFinalRecommendation))
    } catch {
        policyStore.setFinalRecommendation(null)
    }
    }

  if (savedAnswers) {
    try {
      policyStore.setAnswers(JSON.parse(savedAnswers))
    } catch {
      policyStore.setAnswers([])
    }
  }

  if (savedQuestionIndex) {
    policyStore.setCurrentQuestion(Number(savedQuestionIndex))
  }

  if (savedStage) {
    policyStore.setStage(savedStage)
  }
})

function startQuiz() {
  selectedAnswer.value = null
  policyStore.setStage('quiz')
  policyStore.setCurrentQuestion(0)
}

function submitCurrentAnswer() {
  if (selectedAnswer.value === null || !currentQuestion.value) return

  const selectedLabel = currentQuestion.value.options[selectedAnswer.value]

  policyStore.updateAnswer(currentQuestion.value.id, {
    questionId: currentQuestion.value.id,
    topic: currentQuestion.value.topic,
    value: selectedAnswer.value,
    selectedLabel,
  })

  selectedAnswer.value = null

  if (policyStore.isLastQuestion) {
    policyStore.setStage('results')
  } else {
    policyStore.nextQuestion()
  }
}

function openMemo() {
  policyStore.setStage('brief')
}

function restart() {
  selectedAnswer.value = null
  localStorage.removeItem('stage')
  localStorage.removeItem('answers')
  localStorage.removeItem('currentQuestionIndex')
  policyStore.resetAssessment()
}

watch(
  () => policyStore.stage,
  (stage) => {
    localStorage.setItem('stage', stage)
  }
)

watch(
  () => policyStore.answers,
  (answers) => {
    localStorage.setItem('answers', JSON.stringify(answers))
  },
  { deep: true }
)

watch(
  () => policyStore.finalRecommendation,
  (recommendation) => {
    if (recommendation) {
      localStorage.setItem('finalRecommendation', JSON.stringify(recommendation))
    } else {
      localStorage.removeItem('finalRecommendation')
    }
  },
  { deep: true }
)

watch(
  () => policyStore.currentQuestionIndex,
  (index) => {
    localStorage.setItem('currentQuestionIndex', String(index))
  }
)
</script>

<style scoped>
.quiz-page {
  min-height: 100vh;
  background: #f8fafc;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
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

.topbar__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
}

.question-counter {
  color: #475569;
  font-size: 0.92rem;
  font-weight: 700;
}

.quiz-section,
.result-section {
  padding: 48px 0;
}

.question-header {
  margin-bottom: 24px;
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
  font-size: clamp(1.8rem, 4vw, 3rem);
  letter-spacing: -0.04em;
}

.question-card,
.result-card {
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.question-card {
  padding: 30px;
}

.question-instruction {
  margin: 0 0 18px;
  color: #475569;
  font-weight: 700;
}

.response-preview {
  margin-bottom: 24px;
  padding: 18px;
  border-radius: 18px;
  background: #f1f5f9;
  color: #1e293b;
  line-height: 1.7;
}

.blank {
  color: #64748b;
  font-style: italic;
  text-decoration: underline;
}

.selected-answer {
  color: #2563eb;
  text-decoration: underline;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 28px;
}

.option-button {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  min-height: 76px;
  border: 1px solid #cbd5e1;
  border-radius: 18px;
  background: #ffffff;
  color: #334155;
  padding: 14px;
  text-align: left;
  cursor: pointer;
}

.option-button span {
  display: inline-grid;
  min-width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 999px;
  background: #e2e8f0;
  font-size: 0.82rem;
  font-weight: 800;
}

.option-button:hover {
  border-color: #2563eb;
}

.option-button--active {
  border-color: #2563eb;
  background: #eff6ff;
}

.assessment-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.assessment-column {
  padding: 18px;
  border-radius: 20px;
  background: #f8fafc;
}

.assessment-column h2 {
  margin: 0 0 16px;
  color: #0f172a;
  font-size: 1rem;
}

.assessment {
  padding: 14px 0;
  border-top: 1px solid #e2e8f0;
}

.assessment:first-of-type {
  border-top: 0;
}

.assessment p {
  margin: 0 0 10px;
  color: #334155;
  line-height: 1.6;
}

details {
  color: #475569;
}

summary {
  cursor: pointer;
  font-weight: 800;
}

.evidence {
  margin-top: 12px;
  padding: 12px;
  border-radius: 14px;
  background: #ffffff;
}

.sources {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sources a {
  color: #2563eb;
  font-size: 0.88rem;
  font-weight: 700;
}

.muted {
  color: #64748b;
}

.question-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
}

.button {
  border: 0;
  border-radius: 999px;
  padding: 11px 17px;
  font-weight: 800;
  cursor: pointer;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.button--primary {
  background: #2563eb;
  color: #ffffff;
}

.button--secondary {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
}

.result-card {
  padding: 34px;
}

.answer-list {
  display: grid;
  gap: 10px;
  margin: 24px 0;
}

.answer-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 0;
  border-bottom: 1px solid #e2e8f0;
}

@media (max-width: 860px) {
  .topbar {
    grid-template-columns: 1fr;
  }

  .topbar__links,
  .topbar__actions {
    justify-content: flex-start;
  }

  .assessment-grid {
    grid-template-columns: 1fr;
  }
}
</style>