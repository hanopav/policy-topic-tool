<template>
  <nav class="app-nav">
    <RouterLink class="brand" to="/">
      <span class="brand__mark">BB</span>
      <span>{{ title }}</span>
    </RouterLink>

    <div class="nav-links">
      <RouterLink to="/">Assessment</RouterLink>
      <RouterLink to="/data">Evidence</RouterLink>
      <RouterLink to="/graph">Graph</RouterLink>
    </div>

    <div class="nav-actions">
      <span v-if="stage === 'quiz'" class="question-counter">
        Question {{ currentQuestionIndex + 1 }} / {{ questionCount }}
      </span>

      <button
        v-if="showRestart"
        class="button button--secondary"
        type="button"
        @click="$emit('restart')"
      >
        Restart
      </button>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Evidence Policy Navigator',
  },
  stage: {
    type: String,
    default: 'welcome',
  },
  currentQuestionIndex: {
    type: Number,
    default: 0,
  },
  questionCount: {
    type: Number,
    default: 0,
  },
  showRestart: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['restart'])
</script>

<style scoped>
.app-nav {
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

.nav-links {
  display: flex;
  gap: 18px;
}

.nav-links a {
  color: #475569;
  font-weight: 700;
  text-decoration: none;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #2563eb;
}

.nav-actions {
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

.button {
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

.button--secondary:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

@media (max-width: 860px) {
  .app-nav {
    grid-template-columns: 1fr;
  }

  .nav-links,
  .nav-actions {
    justify-content: flex-start;
  }

  .nav-links {
    flex-wrap: wrap;
  }
}
</style>