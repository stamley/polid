<template>
  <Instruments :polid = this.polid></Instruments>
  <Circles :polid = this.polid></Circles>
  <Play :polid = this.polid></Play>
  <!--<img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
</template>

<script>
import Polid from './Polid';
import Instruments from './components/Instruments.vue';
import Circles from './components/Circles.vue'
import Play from './components/Play.vue'

export default {
  name: 'App',
  components: {
    Instruments,
    Circles,
    Play,
  },
  setup(){
    const polid = new Polid();
    
    return { polid };
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
