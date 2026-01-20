<template>
  <div>
    <h2>User Management</h2>
    <button @click="handleLogout">Logout</button>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Level</th>
          <th>XP</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.userName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.level }}</td>
          <td>{{ user.xp }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  data() {
    return {
      users: []
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      const res = await fetch('http://localhost:3000/users')
      this.users = await res.json()
    },
    handleLogout() {
      const auth = useAuthStore()
      auth.logout()
      this.$router.push('/dashboard')
    }
  }
}
</script>



<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background: #000000;
  text-align: left;
}
</style>
