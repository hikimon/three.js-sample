<template>
  <div>
    <search></search>
    <three-view></three-view>
  </div>
</template>

<script>
import Search from './Search.vue'
import ThreeView from './ThreeView.vue'

export default {
  name: 'top',
  components: {
    Search,
    ThreeView
  },
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
