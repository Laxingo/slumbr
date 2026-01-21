<template>
    <div class="quests">
        <h1>Quests</h1>

        <table class="questTable">
            <thead>
                <tr>
                    <th>Quest</th>
                    <th>Progression</th>
                    <th>Xp</th>
                    <th class="col_actions">Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="quest in userQuests" :key="quest.id">
                    <td>{{ questDetails.find(q => q.id == quest.questId)?.description }}</td>
                    <td>{{ quest.progress }}</td>
                    <td>{{ quest.xpReward }}</td>
                    <td class="col_actions">
                        <button class="btnMini">Claim</button>
                    </td>
                </tr>
            </tbody>
        </table>
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
    methods: {
        // buscar as quests e o progresso do utilizador
        async fetchUserQuests() {
            const response = await fetch(
                `http://localhost:3000/userQuests?userId=${this.userId}`
            )
            this.userQuests = await response.json()
            console.log(this.userQuests)
        },
        async fetchQuestDetails() {
            const response = await fetch(`http://localhost:3000/quests`)
            this.questDetails = await response.json()
        }
    },
    mounted() {
        this.fetchUserQuests()
        this.fetchQuestDetails()
    },
    computed: {
        userId() {
            const auth = useAuthStore()
            return auth.userId
        }
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
  overflow: hidden;
  border-radius: 14px;
}

thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  padding: 10px 10px;
  text-align: left;
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}

tbody td {
  padding: 10px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
  color: var(--text);
}

tbody tr:hover td {
  background: rgba(255, 255, 255, 0.03);
}

.col_actions {
  text-align: right;
  white-space: nowrap;
}

.btnMini {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  border-radius: 10px;
  padding: 7px 10px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 8px;
}

.btnMini:hover {
  border-color: rgba(212, 177, 106, 0.35);
  background: rgba(212, 177, 106, 0.08);
}

.btnMini_danger:hover {
  border-color: rgba(248, 113, 113, 0.35);
  background: rgba(248, 113, 113, 0.08);
}

.empty {
  color: var(--muted);
  text-align: center;
  padding: 16px 10px;
}
</style>
