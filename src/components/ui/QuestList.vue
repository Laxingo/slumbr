<template>
  <div class="quests">
    <h1>Quests</h1>

    <table v-if="userQuests.length" class="questTable">
      <thead>
        <tr>
          <th>Quest</th>
          <th>Progress</th>
          <th>XP</th>
          <th class="col_actions">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="uq in userQuests" :key="uq.id">
          <td>{{ questInfo(uq)?.description || '—' }}</td>
          <td>
            {{ uq.progress }} / {{ questInfo(uq)?.goal ?? '?' }}
          </td>
          <td>{{ questInfo(uq)?.xpReward ?? 0 }}</td>
          <td class="col_actions">
            <button
              class="btnMini"
              :disabled="!canClaim(uq)"
              @click="claimQuest(uq)"
            >
              {{ uq.claimed ? 'Claimed' : 'Claim' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">
      No quests available yet.
    </p>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'QuestList',

  data() {
    return {
      userQuests: [],
      questDetails: []
    }
  },

  computed: {
    userId() {
      const auth = useAuthStore()
      return auth.userId
    }
  },

  methods: {
    async fetchUserQuests() {
      if (!this.userId) return
      const res = await fetch(
        `http://localhost:3000/userQuests?userId=${this.userId}`
      )
      this.userQuests = await res.json()
    },

    async fetchQuestDetails() {
      const res = await fetch(`http://localhost:3000/quests`)
      this.questDetails = await res.json()
    },

    questInfo(uq) {
      return this.questDetails.find(
        q => String(q.id) === String(uq.questId)
      )
    },

    canClaim(uq) {
      return uq.completed === true && uq.claimed === false
    },

    async claimQuest(uq) {
      if (!this.canClaim(uq)) return

      const auth = useAuthStore()
      const quest = this.questInfo(uq)
      if (!quest) return

      // marcar quest como claimed
      await fetch(`http://localhost:3000/userQuests/${uq.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimed: true })
      })

      // dar XP ao utilizador
      await auth.addXp(quest.xpReward)

      uq.claimed = true
    }
  },

  mounted() {
    this.fetchQuestDetails()
    this.fetchUserQuests()
  }
}
</script>

<style scoped>
.quests {
  width: 100%;
}

.questTable {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 14px;
  overflow: hidden;
}

thead th {
  position: sticky;
  top: 0;
  background: rgba(15, 23, 42, 0.85);
  border-bottom: 1px solid var(--border);
  padding: 10px;
  font-size: 12px;
  color: var(--muted);
  text-align: left;
}

tbody td {
  padding: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-size: 13px;
}

.col_actions {
  text-align: right;
}

.btnMini {
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.03);
  color: var(--text);
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
}

.btnMini:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty {
  color: var(--muted);
  font-size: 13px;
  padding: 16px 0;
}
</style>
