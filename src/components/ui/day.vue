<!-- isto vai ser um componente que em clicar num dia vai aparecer informação sobre esse dia neste componente -->
<template>
   <div>
      <p>Sunrise: {{ sunrise }}</p>
      <p>Sunset: {{ sunset }}</p>
   </div>
</template>

<script>


export default {
   data() {
      return {
         sunrise,
         sunset,
      }
   }, methods: {
      async fetchSunriseSunset(date, latitude, longitude) {
         const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${date}`);
         const data = await response.json();
         this.sunrise = data.results.sunrise;
         this.sunset = data.results.sunset;
      }
   }

}
</script>

<style lang="scss" scoped></style>