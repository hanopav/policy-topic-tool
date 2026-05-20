<template>
  <section class="welcome">
    <div class="welcome__shell">
      <header class="welcome__hero">
        <div>
          <p class="welcome__eyebrow">Evidence-based policy support</p>
          <h1>{{ title }}</h1>
          <p class="welcome__lead">
            {{ subtitle }}
          </p>
        </div>

        <button class="welcome__skip" type="button" @click="startAssessment">
          Skip intro
        </button>
      </header>

      <article class="welcome-card">
        <div class="welcome-card__top">
          <div>
            <p class="welcome-card__step">
              Step {{ currentSlideIndex + 1 }} of {{ slides.length }}
            </p>
            <h2>{{ currentSlide.title }}</h2>
          </div>

          <div class="progress">
            <div
              class="progress__bar"
              :style="{ width: progressWidth }"
            />
          </div>
        </div>

        <div class="welcome-card__body">
          <p
            v-for="paragraph in currentSlide.paragraphs"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>

          <ul v-if="currentSlide.bullets?.length" class="bullet-list">
            <li
              v-for="bullet in currentSlide.bullets"
              :key="bullet"
            >
              {{ bullet }}
            </li>
          </ul>

          <ol v-if="currentSlide.type === 'roadmap'" class="roadmap">
            <li
              v-for="item in roadmapItems"
              :key="item"
            >
              {{ item }}
            </li>
          </ol>

          <p
            v-if="currentSlide.type === 'roadmap' && roadmapItems.length === 0"
            class="empty-note"
          >
            Decision points have not been loaded yet.
          </p>
        </div>

        <footer class="welcome-card__actions">
          <button
            class="button button--secondary"
            type="button"
            :disabled="isFirstSlide"
            @click="previousSlide"
          >
            Previous
          </button>

          <button
            v-if="!isLastSlide"
            class="button button--primary"
            type="button"
            @click="nextSlide"
          >
            Next
          </button>

          <button
            v-else
            class="button button--primary"
            type="button"
            @click="startAssessment"
          >
            Start assessment
          </button>
        </footer>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Policy Action Navigator',
  },
  subtitle: {
    type: String,
    default:
      'Use structured assessments, explicit evidence, and stakeholder context to identify the most suitable policy action.',
  },
  policyTopic: {
    type: String,
    default: 'the selected policy challenge',
  },
  decisionPoints: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['start'])

const savedSlide = Number(localStorage.getItem('welcomeSlide') ?? 0)
const currentSlideIndex = ref(Number.isFinite(savedSlide) ? savedSlide : 0)

const slides = computed(() => [
  {
    title: 'Understand the policy problem',
    paragraphs: [
      `This tool helps a stakeholder orient themselves in ${props.policyTopic}.`,
      'The goal is not to give a single universal answer, but to connect policy options with evidence, assumptions, country context, and stakeholder priorities.',
    ],
  },
  {
    title: 'Compare available actions',
    paragraphs: [
      'Policy decisions usually involve several plausible options. Each option may perform differently depending on institutional capacity, political feasibility, costs, evidence quality, and expected impact.',
    ],
    bullets: [
      'What action is available?',
      'What evidence supports it?',
      'For whom is it suitable?',
      'Under what conditions could it fail?',
    ],
  },
  {
    title: 'Make assumptions visible',
    paragraphs: [
      'Experts often disagree because they rely on different assumptions, values, time horizons, or interpretations of the same evidence.',
      'The assessment process makes these differences explicit so the user can see why one option may be preferred over another.',
    ],
  },
  {
    title: 'Use country and stakeholder context',
    paragraphs: [
      'A policy that works in one country or institutional setting may not work elsewhere.',
      'The tool should therefore account for the user’s role, country context, available capacity, implementation constraints, and policy priorities.',
    ],
  },
  {
    type: 'roadmap',
    title: 'Follow the decision roadmap',
    paragraphs: [
      'The assessment is organized around decision points. Each decision point helps narrow the choice of action and links the user to relevant assessments and evidence.',
    ],
  },
])

const currentSlide = computed(() => slides.value[currentSlideIndex.value])
const isFirstSlide = computed(() => currentSlideIndex.value === 0)
const isLastSlide = computed(
  () => currentSlideIndex.value === slides.value.length - 1
)

const progressWidth = computed(() => {
  return `${((currentSlideIndex.value + 1) / slides.value.length) * 100}%`
})

const roadmapItems = computed(() => {
  return props.decisionPoints
    .map((item) => {
      if (typeof item === 'string') return item
      return item.topic || item.title || item.question || item.label || null
    })
    .filter(Boolean)
})

function nextSlide() {
  if (!isLastSlide.value) {
    currentSlideIndex.value += 1
  }
}

function previousSlide() {
  if (!isFirstSlide.value) {
    currentSlideIndex.value -= 1
  }
}

function startAssessment() {
  localStorage.setItem('stage', 'quiz')
  localStorage.setItem('welcomeSlide', '0')
  emit('start')
}

watch(currentSlideIndex, (value) => {
  localStorage.setItem('welcomeSlide', String(value))
})
</script>

<style scoped>
.welcome {
  min-height: 100vh;
  padding: 48px 0;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 32%),
    linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
}

.welcome__shell {
  width: min(1080px, calc(100% - 32px));
  margin: 0 auto;
}

.welcome__hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 32px;
}

.welcome__eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(2.1rem, 5vw, 4.2rem);
  line-height: 1;
  letter-spacing: -0.05em;
}

.welcome__lead {
  max-width: 720px;
  margin: 18px 0 0;
  color: #475569;
  font-size: 1.12rem;
  line-height: 1.7;
}

.welcome__skip {
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #ffffff;
  color: #334155;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
}

.welcome__skip:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.welcome-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
}

.welcome-card__top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 24px;
  align-items: center;
  padding: 28px 32px;
  border-bottom: 1px solid #e2e8f0;
}

.welcome-card__step {
  margin: 0 0 6px;
  color: #64748b;
  font-size: 0.84rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h2 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  letter-spacing: -0.03em;
}

.progress {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: #e2e8f0;
}

.progress__bar {
  height: 100%;
  border-radius: inherit;
  background: #2563eb;
  transition: width 180ms ease;
}

.welcome-card__body {
  padding: 34px 32px;
  color: #334155;
  font-size: 1.04rem;
  line-height: 1.75;
}

.welcome-card__body p {
  max-width: 820px;
  margin: 0 0 18px;
}

.bullet-list,
.roadmap {
  display: grid;
  gap: 12px;
  max-width: 820px;
  margin: 22px 0 0;
  padding-left: 24px;
}

.bullet-list li,
.roadmap li {
  padding-left: 6px;
}

.empty-note {
  color: #64748b;
  font-style: italic;
}

.welcome-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 32px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.button {
  border: 0;
  border-radius: 999px;
  padding: 12px 18px;
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

.button--primary:hover {
  background: #1d4ed8;
}

.button--secondary {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
}

.button--secondary:hover:not(:disabled) {
  border-color: #94a3b8;
  background: #f1f5f9;
}

@media (max-width: 760px) {
  .welcome {
    padding: 28px 0;
  }

  .welcome__hero,
  .welcome-card__top {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .welcome-card__top,
  .welcome-card__body,
  .welcome-card__actions {
    padding-left: 20px;
    padding-right: 20px;
  }

  .welcome-card__actions {
    flex-direction: column-reverse;
  }

  .button {
    width: 100%;
  }
}
</style>