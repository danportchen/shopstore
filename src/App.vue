<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  created () {
    const api = `${process.env.VUE_APP_APIPATH}/api/${
      process.env.VUE_APP_CUSTOMPATH
    }/products?page=:page`
    console.log(process.env.VUE_APP_APIPATH, process.env.VUE_APP_CUSTOMPATH)
    this.$http.get(api).then(response => {
      console.log(response.data)
    })
  }
}
</script>

<style lang="scss">
@import "./assets/all";
</style>
