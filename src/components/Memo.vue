<template>
  <section class="memo-page">
    <div class="memo-toolbar no-print">
      <div>
        <p class="eyebrow">Vygenerovaný výstup</p>
        <h1>Policy memo</h1>
      </div>

      <div class="memo-toolbar__actions">
        <button class="button button--secondary" type="button" @click="goBack">
          Zpět k doporučení
        </button>

        <button class="button button--primary" type="button" @click="printMemo">
          Tisk / uložit jako PDF
        </button>
      </div>
    </div>

    <article class="memo-document">
      <header class="memo-header">
        <div>
          <p class="memo-kicker">Evidence Policy Navigator</p>
          <h2>Akční memorandum</h2>
        </div>

        <p class="memo-date">{{ currentDate }}</p>
      </header>

      <section class="memo-meta">
        <p><strong>Adresát:</strong> Vláda České republiky / relevantní rozhodovací aktér</p>
        <p><strong>Zpracoval/a:</strong> Uživatel nástroje</p>
        <p><strong>Předmět:</strong> {{ subject }}</p>
      </section>

      <section class="memo-section">
        <h3>1. Doporučení</h3>

        <p v-if="finalRecommendation">
          Na základě zvolených odpovědí a posouzení dostupných argumentů je doporučený postup:
          <strong>{{ finalRecommendation.label }}</strong>.
        </p>

        <p v-else class="muted">
          Finální doporučení zatím nebylo vybráno.
        </p>

        <p v-if="finalRecommendation?.description">
          {{ finalRecommendation.description }}
        </p>

        <p>
          Doporučení by nemělo být chápáno jako definitivní rozhodnutí, ale jako
          strukturovaný podklad pro politickou, bezpečnostní a ekonomickou debatu.
          Klíčové je dále ověřit kapacity armády, fiskální náklady, právní proveditelnost
          a společenskou přijatelnost zvolené varianty.
        </p>
      </section>

      <section class="memo-section">
        <h3>2. Shrnutí hodnocení</h3>

        <ol class="memo-list">
          <li
            v-for="question in policyStore.questions"
            :key="question.id"
          >
            <span>
              {{ question.response?.[0] }}
              <strong>{{ selectedAnswerLabel(question) }}</strong>
              {{ question.response?.[1] }}
            </span>
          </li>
        </ol>
      </section>

      <section class="memo-section">
        <h3>3. Důkazní základna</h3>

        <p>
          Hodnocení vychází ze strukturovaných rozhodovacích bodů, které propojují
          argumenty, důkazy a zdroje. Smyslem nástroje není skrýt nejistotu, ale
          ukázat, které předpoklady a důkazy vedou k určitému doporučení.
        </p>

        <div class="evidence-summary">
          <article>
            <strong>{{ policyStore.questions.length }}</strong>
            <span>rozhodovacích bodů</span>
          </article>

          <article>
            <strong>{{ assessmentCount }}</strong>
            <span>argumentů / hodnocení</span>
          </article>

          <article>
            <strong>{{ evidenceCount }}</strong>
            <span>důkazních položek</span>
          </article>
        </div>
      </section>

      <section class="memo-section">
        <h3>4. Implementační poznámky</h3>

        <ul class="memo-list">
          <li>
            Před případným zavedením povinné služby je nutné vyčíslit náklady
            na výcvik, instruktory, infrastrukturu, ubytování, vybavení,
            zdravotní posuzování a administraci.
          </li>
          <li>
            Rozhodnutí by mělo být posouzeno proti alternativám, zejména rozšíření
            aktivní zálohy, dobrovolného vojenského cvičení, dobrovolného předurčení
            a civilní krizové připravenosti.
          </li>
          <li>
            Pokud by byla služba zavedena, měla by být navázána na systém záloh,
            pravidelného přecvičování a evidence dovedností. Samotný jednorázový
            šestiměsíční výcvik nemusí stačit k reálnému posílení obranyschopnosti.
          </li>
          <li>
            U varianty pro muže i ženy je třeba řešit spravedlivé výjimky,
            civilní alternativu, dopady na studium a pracovní trh a legitimitu
            zásahu do životní dráhy mladých lidí.
          </li>
        </ul>
      </section>

      <section class="memo-section">
        <h3>5. Doporučené další kroky</h3>

        <ol class="memo-list">
          <li>
            Zpracovat cost-benefit analýzu plošné, selektivní a dobrovolné varianty.
          </li>
          <li>
            Ověřit reálnou absorpční kapacitu Armády ČR pro výcvik větší části ročníku.
          </li>
          <li>
            Připravit scénáře bezpečnostního vývoje, ve kterých by širší výcvik populace
            významně změnil schopnost státu reagovat.
          </li>
          <li>
            Otestovat pilotní model nebo rozšířený dobrovolný program před případným
            plošným zavedením.
          </li>
        </ol>
      </section>

      <footer class="memo-footer">
        <p>Vygenerováno nástrojem Evidence Policy Navigator.</p>
        <p>{{ currentDate }}</p>
      </footer>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { usePolicyStore } from '../stores/policyStore'

const policyStore = usePolicyStore()

const finalRecommendation = computed(() => policyStore.finalRecommendation)

const subject = computed(() => {
  return 'Posouzení zavedení šestiměsíční povinné vojenské služby pro mladé muže a ženy v ČR'
})

const currentDate = computed(() => {
  return new Intl.DateTimeFormat('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())
})

const assessmentCount = computed(() => {
  return policyStore.questions.reduce((total, question) => {
    const assessments = question.assessments || {}

    return total + Object.values(assessments).reduce((sum, group) => {
      return sum + (Array.isArray(group) ? group.length : 0)
    }, 0)
  }, 0)
})

const evidenceCount = computed(() => {
  return policyStore.questions.reduce((total, question) => {
    const assessments = question.assessments || {}

    return total + Object.values(assessments).reduce((sum, group) => {
      if (!Array.isArray(group)) return sum

      return sum + group.reduce((evidenceSum, assessment) => {
        return evidenceSum + (assessment.evidence?.length || 0)
      }, 0)
    }, 0)
  }, 0)
})

function findAnswer(question) {
  return policyStore.answers.find((answer) => {
    return typeof answer === 'object' && answer.questionId === question.id
  })
}

function selectedAnswerLabel(question) {
  const answer = findAnswer(question)

  if (!answer) return 'odpověď nevybrána'

  if (answer.selectedLabel) return answer.selectedLabel

  const answerValue = Number(answer.value)

  if (
    Number.isInteger(answerValue) &&
    Array.isArray(question.options) &&
    question.options[answerValue]
  ) {
    return question.options[answerValue]
  }

  return 'odpověď nevybrána'
}

function printMemo() {
  window.print()
}

function goBack() {
  policyStore.setStage('results')
}
</script>

<style scoped>
.memo-page {
  padding: 48px 0 72px;
  background: #f8fafc;
}

.memo-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-end;
  width: min(920px, calc(100% - 32px));
  margin: 0 auto 24px;
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
  letter-spacing: -0.045em;
}

.memo-toolbar__actions {
  display: flex;
  gap: 10px;
}

.button {
  border: 0;
  border-radius: 999px;
  padding: 11px 17px;
  font-weight: 800;
  cursor: pointer;
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

.memo-document {
  width: min(920px, calc(100% - 32px));
  margin: 0 auto;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  background: #ffffff;
  padding: 56px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.1);
  color: #1f2937;
  font-family: Georgia, 'Times New Roman', serif;
}

.memo-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  padding-bottom: 24px;
  border-bottom: 2px solid #0f172a;
}

.memo-kicker {
  margin: 0 0 8px;
  color: #475569;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.memo-header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 2rem;
  line-height: 1.1;
}

.memo-date {
  margin: 0;
  color: #475569;
  white-space: nowrap;
}

.memo-meta {
  display: grid;
  gap: 6px;
  margin: 28px 0;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
}

.memo-meta p {
  margin: 0;
}

.memo-section {
  margin-top: 28px;
}

.memo-section h3 {
  margin: 0 0 12px;
  color: #0f172a;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.memo-section p,
.memo-list {
  color: #374151;
  font-size: 1rem;
  line-height: 1.75;
}

.memo-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding-left: 22px;
}

.memo-list strong,
.memo-section strong {
  color: #0f172a;
}

.evidence-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 18px;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
}

.evidence-summary article {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #f8fafc;
  padding: 16px;
}

.evidence-summary strong {
  display: block;
  color: #2563eb;
  font-size: 1.6rem;
}

.evidence-summary span {
  color: #64748b;
  font-size: 0.86rem;
  font-weight: 800;
}

.memo-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 44px;
  padding-top: 18px;
  border-top: 1px solid #e5e7eb;
  color: #64748b;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 0.86rem;
}

.muted {
  color: #64748b;
  font-style: italic;
}

@media (max-width: 760px) {
  .memo-toolbar,
  .memo-header,
  .memo-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .memo-toolbar__actions {
    flex-direction: column;
    width: 100%;
  }

  .button {
    width: 100%;
  }

  .memo-document {
    padding: 28px;
  }

  .evidence-summary {
    grid-template-columns: 1fr;
  }
}

@media print {
  .no-print {
    display: none !important;
  }

  .memo-page {
    padding: 0;
    background: #ffffff;
  }

  .memo-document {
    width: 100%;
    margin: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0.35in;
  }
}
</style>