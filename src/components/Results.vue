<template>
  <section class="results-section">
    <div class="page-shell">
      <header class="results-header">
        <p class="eyebrow">Vyhodnocení dokončeno</p>
        <h1>Zvolte finální doporučení</h1>
        <p>
          Níže vidíte shrnutí odpovědí k jednotlivým rozhodovacím bodům.
          Na jejich základě zvolte doporučení, které nejlépe odpovídá
          bezpečnostní situaci, kapacitám státu, ekonomickým nákladům
          a společenské přijatelnosti.
        </p>
      </header>

      <div class="results-layout">
        <article class="summary-card">
          <div class="card-header">
            <h2>Shrnutí hodnocení</h2>
            <p>
              Zodpovězeno {{ policyStore.answers.length }} z
              {{ policyStore.questions.length }} rozhodovacích bodů.
            </p>
          </div>

          <div class="score-panel">
            <div>
              <p class="score-panel__label">Orientační skóre podpory</p>
              <strong>{{ formattedAverageScore }}</strong>
              <span>/ 6</span>
            </div>

            <p>{{ scoreDescription }}</p>
          </div>

          <ol class="answer-list">
            <li
              v-for="question in policyStore.questions"
              :key="question.id"
              class="answer-item"
            >
              <div>
                <h3>{{ question.topic }}</h3>
                <p>
                  {{ question.response?.[0] }}
                  <strong>{{ selectedAnswerLabel(question) }}</strong>
                  {{ question.response?.[1] }}
                </p>
              </div>

              <span class="answer-score">
                {{ selectedAnswerValue(question) ?? '—' }}
              </span>
            </li>
          </ol>
        </article>

        <aside class="recommendation-card">
          <div class="card-header">
            <h2>Finální doporučení</h2>
            <p>
              Vyberte jednu variantu. Orientační doporučení je pouze pomůcka;
              uživatel ho může vědomě přepsat.
            </p>
          </div>

          <div v-if="suggestedRecommendation" class="suggestion-box">
            <p class="suggestion-box__label">Orientační doporučení podle odpovědí</p>
            <strong>{{ suggestedRecommendation.label }}</strong>
            <p>{{ suggestedRecommendation.description }}</p>

            <button
              type="button"
              class="button button--secondary"
              @click="selectRecommendation(suggestedRecommendation)"
            >
              Vybrat tuto variantu
            </button>
          </div>

          <div class="recommendation-options">
            <button
              v-for="option in actionOptions"
              :key="option.id"
              type="button"
              class="recommendation-option"
              :class="{
                'recommendation-option--active':
                  finalRecommendation?.id === option.id,
              }"
              @click="selectRecommendation(option)"
            >
              <span>{{ option.label }}</span>
              <small>{{ option.description }}</small>
            </button>
          </div>

          <div class="selected-box">
            <p class="selected-box__label">Vybraná akce</p>

            <p v-if="finalRecommendation" class="selected-box__value">
              {{ finalRecommendation.label }}
            </p>

            <p v-else class="selected-box__empty">
              Finální doporučení zatím nebylo vybráno.
            </p>
          </div>

          <button
            type="button"
            class="button button--primary"
            :disabled="!finalRecommendation"
            @click="continueToMemo"
          >
            Vytvořit policy memo
          </button>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { usePolicyStore } from '../stores/policyStore'

const policyStore = usePolicyStore()

const finalRecommendation = computed(() => policyStore.finalRecommendation)

const actionOptions = [
  {
    id: 'no-conscription',
    label: 'Nezavádět povinnou vojenskou službu',
    description:
      'Ponechat povinnou službu mimo agendu a soustředit se na profesionální armádu, krizovou připravenost a existující dobrovolné nástroje.',
    minScore: 0,
    maxScore: 1.49,
  },
  {
    id: 'voluntary-expansion',
    label: 'Rozšířit dobrovolnou brannou přípravu',
    description:
      'Posílit aktivní zálohu, dobrovolné vojenské cvičení, dobrovolné předurčení, pobídky a dostupnost výcviku bez plošné povinnosti.',
    minScore: 1.5,
    maxScore: 2.49,
  },
  {
    id: 'preparation-and-pilot',
    label: 'Připravit varianty a spustit pilot',
    description:
      'Nezavádět plošnou službu hned, ale připravit legislativní, ekonomickou a kapacitní analýzu a otestovat omezený pilot.',
    minScore: 2.5,
    maxScore: 3.49,
  },
  {
    id: 'selective-service',
    label: 'Zavést selektivní službu',
    description:
      'Povinně připravovat pouze část ročníku podle potřeb armády, kapacit státu a vhodnosti jednotlivých kandidátů.',
    minScore: 3.5,
    maxScore: 4.49,
  },
  {
    id: 'universal-service-with-civil-track',
    label: 'Zavést univerzální službu s civilní alternativou',
    description:
      'Zavést povinnost pro mladé muže i ženy, ale umožnit vojenskou i civilní větev zaměřenou na obranu, krizovou připravenost a odolnost státu.',
    minScore: 4.5,
    maxScore: 5.49,
  },
  {
    id: 'universal-military-service',
    label: 'Zavést plošnou šestiměsíční vojenskou službu',
    description:
      'Zavést plošnou vojenskou službu pro celý ročník mladých mužů i žen s navazujícím systémem záloh a pravidelného přecvičování.',
    minScore: 5.5,
    maxScore: 6,
  },
]

const numericAnswers = computed(() => {
  return policyStore.answers
    .map((answer) => {
      if (typeof answer !== 'object') return null

      const value = Number(answer.value)
      return Number.isFinite(value) ? value : null
    })
    .filter((value) => value !== null)
})

const averageScore = computed(() => {
  if (!numericAnswers.value.length) return null

  const total = numericAnswers.value.reduce((sum, value) => sum + value, 0)
  return total / numericAnswers.value.length
})

const formattedAverageScore = computed(() => {
  if (averageScore.value === null) return '—'
  return averageScore.value.toFixed(1)
})

const suggestedRecommendation = computed(() => {
  if (averageScore.value === null) return null

  return actionOptions.find((option) => {
    return (
      averageScore.value >= option.minScore &&
      averageScore.value <= option.maxScore
    )
  })
})

const scoreDescription = computed(() => {
  if (averageScore.value === null) {
    return 'Zatím není dostupné žádné skóre, protože nebyly zaznamenány odpovědi.'
  }

  if (averageScore.value < 1.5) {
    return 'Odpovědi spíše podporují zachování současného stavu bez povinné služby.'
  }

  if (averageScore.value < 2.5) {
    return 'Odpovědi spíše podporují rozvoj dobrovolných forem přípravy místo plošné povinnosti.'
  }

  if (averageScore.value < 3.5) {
    return 'Odpovědi ukazují na opatrný postup: připravit varianty, testovat pilot a lépe vyčíslit dopady.'
  }

  if (averageScore.value < 4.5) {
    return 'Odpovědi spíše podporují selektivní model než plošnou službu pro celý ročník.'
  }

  if (averageScore.value < 5.5) {
    return 'Odpovědi se blíží podpoře univerzální služby, ale s důrazem na civilní alternativu a postupné zavedení.'
  }

  return 'Odpovědi výrazně podporují plošnou šestiměsíční vojenskou službu.'
})

function findAnswer(question) {
  return policyStore.answers.find((answer) => {
    return typeof answer === 'object' && answer.questionId === question.id
  })
}

function selectedAnswerValue(question) {
  const answer = findAnswer(question)

  if (!answer) return null

  const value = Number(answer.value)
  return Number.isFinite(value) ? value : null
}

function selectedAnswerLabel(question) {
  const answer = findAnswer(question)

  if (!answer) return 'odpověď nevybrána'

  if (answer.selectedLabel) return answer.selectedLabel

  const value = Number(answer.value)

  if (
    Number.isInteger(value) &&
    Array.isArray(question.options) &&
    question.options[value]
  ) {
    return question.options[value]
  }

  return 'odpověď nevybrána'
}

function selectRecommendation(option) {
  policyStore.setFinalRecommendation(option)
}

function continueToMemo() {
  if (!finalRecommendation.value) return

  localStorage.setItem(
    'finalRecommendation',
    JSON.stringify(finalRecommendation.value)
  )

  policyStore.setStage('brief')
}
</script>

<style scoped>
.results-section {
  padding: 56px 0;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.1), transparent 34%),
    #f8fafc;
}

.results-header {
  max-width: 860px;
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

.results-header p {
  margin: 18px 0 0;
  color: #475569;
  font-size: 1.04rem;
  line-height: 1.7;
}

.results-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(340px, 0.75fr);
  gap: 24px;
  align-items: start;
}

.summary-card,
.recommendation-card {
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.summary-card {
  overflow: hidden;
}

.recommendation-card {
  position: sticky;
  top: 88px;
  padding: 24px;
}

.card-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.recommendation-card .card-header {
  padding: 0 0 20px;
}

.card-header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.25rem;
}

.card-header p {
  margin: 8px 0 0;
  color: #64748b;
  line-height: 1.6;
}

.score-panel {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  margin: 24px;
  padding: 18px;
  border-radius: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.score-panel__label {
  margin: 0 0 4px;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.score-panel strong {
  color: #2563eb;
  font-size: 2.1rem;
  font-weight: 900;
}

.score-panel span {
  color: #64748b;
  font-weight: 800;
}

.score-panel p:last-child {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.answer-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.answer-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  padding: 22px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.answer-item:last-child {
  border-bottom: 0;
}

.answer-item h3 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 1rem;
}

.answer-item p {
  margin: 0;
  color: #475569;
  line-height: 1.65;
}

.answer-item strong {
  color: #2563eb;
}

.answer-score {
  display: inline-grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 800;
}

.suggestion-box {
  display: grid;
  gap: 10px;
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  background: #eff6ff;
}

.suggestion-box__label {
  margin: 0;
  color: #2563eb;
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.suggestion-box strong {
  color: #0f172a;
}

.suggestion-box p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.recommendation-options {
  display: grid;
  gap: 12px;
  margin-top: 20px;
}

.recommendation-option {
  display: grid;
  gap: 6px;
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 18px;
  background: #ffffff;
  padding: 15px;
  text-align: left;
  cursor: pointer;
}

.recommendation-option:hover {
  border-color: #2563eb;
}

.recommendation-option--active {
  border-color: #2563eb;
  background: #eff6ff;
}

.recommendation-option span {
  color: #0f172a;
  font-weight: 800;
}

.recommendation-option small {
  color: #64748b;
  line-height: 1.5;
}

.selected-box {
  margin: 22px 0;
  padding: 16px;
  border-radius: 18px;
  background: #f8fafc;
}

.selected-box__label {
  margin: 0 0 6px;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.selected-box__value {
  margin: 0;
  color: #2563eb;
  font-weight: 900;
}

.selected-box__empty {
  margin: 0;
  color: #64748b;
  font-style: italic;
}

.button {
  width: 100%;
  border: 0;
  border-radius: 999px;
  padding: 13px 18px;
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

.button--primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.button--secondary {
  border: 1px solid #bfdbfe;
  background: #ffffff;
  color: #2563eb;
}

.button--secondary:hover {
  background: #dbeafe;
}

@media (max-width: 900px) {
  .results-layout {
    grid-template-columns: 1fr;
  }

  .recommendation-card {
    position: static;
  }

  .score-panel {
    grid-template-columns: 1fr;
  }
}
</style>