<!-- Api sobre a posição do sol de cada dia apartir da latiude e longitude  -->
<template>
    <div>
        <button v-if="!this.location.latitude" @click="getLocation">Get location</button>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
export default {
    data() {
        return {
            location: {
                latitude: null,
                longitude: null
            },
            userData: {}
        }
    },
    computed: {
        userId() {
            const auth = useAuthStore()
            return auth.userId
        }
    },
    methods: {
        // buscar a localização do utilizador na base de dados com verficação se ja existe ou não
        async fetchLocation() {
            const response = await fetch(`http://localhost:3000/users?id=${this.userId}`)
            this.userData = await response.json()
            if (this.userData[0].location.latitude == null && this.userData[0].location.longitude == null) {
                console.log("No location set")
                return
            }
            this.location = this.userData[0].location
            console.log(this.location)
        },
        // Quando n existe ao clicar no botão para obter a localização busca e da update da localização na base de dados
        async getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.location.latitude = position.coords.latitude
                    this.location.longitude = position.coords.longitude
                    console.log(this.location)
                    // Update user location in the database
                    fetch(`http://localhost:3000/users/${this.userId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            location: this.location
                        })
                    })
                })
            } else {
                console.error("Geolocation is not supported by this browser.")
            }
        },
        // com isto da para buscar a posição do sol no lugar e com o atributo de data da para saber a posição do sol em dias diferentes
        async fetchSunPosition(date) {
            const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${this.location.latitude}&lng=${this.location.longitude}&date=${date}&formatted=0`)
            const data = await response.json()
            return data.results
        }
    }, mounted() {
        this.fetchLocation()
    }
}
</script>
<style lang="scss" scoped></style>