<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
    <component :is="currentComponent" @navigate="handleNavigation" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Home from './components/Home.vue';
import Sign from './components/Sign.vue';

export default defineComponent({
  name: 'App',
  components: {
    Home,
    Sign
  },
  setup() {
    const currentComponent = ref('Home');
    const selectedGame = ref('');

    const handleNavigation = (data: { component: string; game?: string }) => {
      currentComponent.value = data.component;
      if (data.game) {
        selectedGame.value = data.game;
      }
    };

    return {
      currentComponent,
      selectedGame,
      handleNavigation
    };
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  overflow-x: hidden;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
