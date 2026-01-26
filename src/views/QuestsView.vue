<template>
  <div class="home">
    <AppHeader />

    <main class="container quests_page">
      <div class="page_top">
        <div>
          <h1 class="page_title">Quests</h1>
          <p class="page_subtitle">Complete objectives and claim XP.</p>
        </div>
      </div>

      <div class="page_card">
        <QuestList />
      </div>
    </main>
  </div>
</template>

<script>
import AppHeader from '@/components/ui/Header.vue'
import QuestList from '@/components/ui/QuestList.vue'

export default {
  name: 'QuestsView',
  components: { AppHeader, QuestList }
}
</script>

<style scoped>
.quests_page {
  padding: 26px 0 60px;
  color: var(--text);
}

.page_top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.page_title {
  margin: 0;
  font-size: 26px;
  letter-spacing: -0.3px;
}

.page_subtitle {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.page_card {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-lg);
  padding: 14px;
}
</style>
