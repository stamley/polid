<template>
  <Circles :polid = this.polid />
  <Controls/>
</template>

<script>
import Polid from './Polid';
import Circles from './components/Circles.vue'
import Controls from './components/Controls.vue'

export default {
  name: 'App',
  components: {
    Circles,
    Controls,
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
html{
  background-color: black;
}
.Circles {
  width: 100%;
  height: 100%;
} 
</style>
