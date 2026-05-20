<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-mark">BB</span>
        <span>Evidence Policy Navigator</span>
      </div>

      <p>
        A prototype decision-support tool for exploring policy options,
        assessments, evidence, and sources.
      </p>

      <div class="footer-links">
        <RouterLink to="/">Assessment</RouterLink>
        <RouterLink to="/data">Evidence</RouterLink>
        <RouterLink to="/graph">Graph</RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 22px 0;
  color: #64748b;
  font-size: 0.92rem;
}

.footer-brand {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  color: #0f172a;
  font-weight: 800;
}

.footer-mark {
  display: inline-grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 10px;
  background: #2563eb;
  color: #ffffff;
  font-size: 0.78rem;
}

.footer-inner p {
  margin: 0;
  max-width: 520px;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  gap: 14px;
}

.footer-links a {
  color: #475569;
  font-weight: 700;
  text-decoration: none;
}

.footer-links a:hover,
.footer-links a.router-link-active {
  color: #2563eb;
}

@media (max-width: 760px) {
  .footer-inner {
    align-items: flex-start;
    flex-direction: column;
  }

  .footer-links {
    flex-wrap: wrap;
  }
}
</style>