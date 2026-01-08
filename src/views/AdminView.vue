<template>
    <div>
        <h1>Admin View</h1>
        <p>Welcome to the admin panel.</p>
        <h2>User Management</h2>
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Level</th>
                <th>Xp</th>
            </tr>
            <tbody>
                <tr v-for="user in users" >
                <td>{{ user.id }}/5</td>
                <td>{{user.userName}}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.level }}</td>
                <td>{{ user.xp }}</td>
                <td><button @click="deleteUser(user.id)">Delete</button></td>
                </tr>
             </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                users: []
            }
        },
        methods: {
            async fetchUsers() {
                try {
                    const response = await fetch('http://localhost:3000/users');
                    this.users = await response.json();
                    console.log(this.users);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            },
            async  deleteUser(userId) {
                fetch(`http://localhost:3000/users/${userId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        this.fetchUsers();
                    }
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
            }
        },
        mounted() {
            this.fetchUsers();
        }
    }
</script>

<style lang="scss" scoped>

</style>