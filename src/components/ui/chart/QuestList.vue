<template>
    <div>
        <h1>Quests</h1>

        <table class="logs_table">
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
                    <td>{{ questDetails.find(q => q.id === quest.questId)?.description }}</td>
                    <td>{{ quest.progress }}</td>
                    <td>{{ quest.xpReward }}</td>
                    <td class="col_actions">
                        <button>Claim</button>
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
        async fetchUserQuests() {
            const response = await fetch(
                `http://localhost:3000/userQuests?userId=${this.userId}`
            )
            this.userQuests = await response.json()
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
