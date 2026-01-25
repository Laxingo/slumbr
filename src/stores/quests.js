import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const API_BASE = 'http://localhost:3000'
const MIN_8H_MS = 8 * 60 * 60 * 1000

export const useQuestsStore = defineStore('quests', {
  state: () => ({
    questDetails: [],
    userQuests: [],
    loading: false,
    error: ''
  }),

  getters: {
    questInfoById: (state) => (questId) =>
      state.questDetails.find(q => String(q.id) === String(questId)),

    canClaim: () => (uq) => uq?.completed === true && uq?.claimed === false
  },

  actions: {
    async init(userId) {
      if (!userId) return
      await this.fetchQuestDetails()
      await this.fetchUserQuests(userId)
    },

    async fetchQuestDetails() {
      const res = await fetch(`${API_BASE}/quests`)
      this.questDetails = await res.json()
      return this.questDetails
    },

    async fetchUserQuests(userId) {
      const res = await fetch(`${API_BASE}/userQuests?userId=${encodeURIComponent(userId)}`)
      this.userQuests = await res.json()
      return this.userQuests
    },

    async claimQuest(uq) {
      if (!uq || !this.canClaim(uq)) return null
      const quest = this.questInfoById(uq.questId)
      if (!quest) return null

      const patchRes = await fetch(`${API_BASE}/userQuests/${encodeURIComponent(uq.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimed: true })
      })
      if (!patchRes.ok) return null

      const updated = await patchRes.json()
      this.userQuests = this.userQuests.map(x => (x.id === updated.id ? updated : x))

      await useAuthStore().addXp(quest.xpReward)
      return updated
    },

    async syncAllFromSleepData(userId, sleepData) {
      if (!userId) return

      // Quest 1: first log
      const hasAtLeastOne = Array.isArray(sleepData) && sleepData.some(x => x?.userId === userId)
      await this.upsertUserQuest({
        userId, questId: 1,
        progress: hasAtLeastOne ? 1 : 0,
        completed: Boolean(hasAtLeastOne)
      })

      // Quest 2: 7 logs
      const goal2 = 7
      const count = Array.isArray(sleepData) ? sleepData.filter(x => x?.userId === userId).length : 0
      await this.upsertUserQuest({
        userId, questId: 2,
        progress: Math.min(count, goal2),
        completed: count >= goal2
      })

      // Quest 3: 5 nights >= 8h in any ISO week (best week)
      const userLogs = Array.isArray(sleepData) ? sleepData.filter(x => x?.userId === userId) : []
      const countsByWeek = new Map()

      for (const log of userLogs) {
        const dateMs = Number(log?.date || 0)
        const durMs = Number(log?.duration || 0)
        if (!dateMs || durMs < MIN_8H_MS) continue
        const wk = isoWeekKey(dateMs)
        countsByWeek.set(wk, (countsByWeek.get(wk) || 0) + 1)
      }

      let best = 0
      for (const v of countsByWeek.values()) best = Math.max(best, v)

      const goal3 = 5
      await this.upsertUserQuest({
        userId, questId: 3,
        progress: Math.min(best, goal3),
        completed: best >= goal3
      })

      await this.fetchUserQuests(userId)

      function isoWeekKey(ms) {
        const d = new Date(ms)
        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
        const day = date.getUTCDay() || 7
        date.setUTCDate(date.getUTCDate() + 4 - day)
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
        const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
        return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
      }
    },

    async upsertUserQuest({ userId, questId, progress, completed }) {
      const qRes = await fetch(
        `${API_BASE}/userQuests?userId=${encodeURIComponent(userId)}&questId=${encodeURIComponent(questId)}`
      )
      const rows = await qRes.json()

      if (!rows.length) {
        const createRes = await fetch(`${API_BASE}/userQuests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            questId,
            progress: Number(progress || 0),
            completed: Boolean(completed),
            claimed: false
          })
        })
        const created = await createRes.json()
        this.userQuests = [...this.userQuests, created]
        return created
      }

      const row = rows[0]
      const needsUpdate =
        Number(row.progress || 0) !== Number(progress || 0) ||
        Boolean(row.completed) !== Boolean(completed)

      if (!needsUpdate) return row

      const patchRes = await fetch(`${API_BASE}/userQuests/${encodeURIComponent(row.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress: Number(progress || 0),
          completed: Boolean(completed)
        })
      })
      const patched = await patchRes.json()
      this.userQuests = this.userQuests.map(x => (x.id === patched.id ? patched : x))
      return patched
    }
  }
})
