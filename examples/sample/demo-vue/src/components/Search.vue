<template>
  <form class="form" @submit.prevent="submit">
    <table border="1" cellspacing="0" bordercolor="#ccc">
      <tr>
        <td>key ID</td>
        <td><input type='password' placeholder='access key' v-model="accessKey"></td>
        <td>フリーワード</td>
        <td><input type='text' placeholder='freeword' v-model="freeword"></td>
        <td><input type='number' placeholder='1' style="width:50px;" v-model="offset_page"></td>
        <td><input type='submit' value='検索'/></td>
        <td><input type='button' value='リセット' @click="reset"/></td>
      </tr>
    </table>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'

const UPDATE_SEARCH_OPT = 'updateSearchOpt'
const GET_GNAVI_LIST    = 'getGnaviList'
const RESET_STATE       = 'resetState'
const INIT_LOCATION     = 'initLocation'

export default {
  name: 'search',
  data () {
    return {
    }
  },
  computed: Object.assign({},
    mapGetters({
      state: 'state'
    }),
    {
      accessKey: {
        get () {
          return this.state.searchOpt.keyid
        },
        set (val) {
          this.$store.dispatch(UPDATE_SEARCH_OPT, { key: 'keyid', value: val })
        }
      },
      freeword: {
        get () {
          return this.state.searchOpt.freeword
        },
        set (val) {
          this.$store.dispatch(UPDATE_SEARCH_OPT, { key: 'freeword', value: val })
        }
      },
      offset_page: {
        get () {
          return this.state.searchOpt.offset_page
        },
        set (val) {
          this.$store.dispatch(UPDATE_SEARCH_OPT, { key: 'offset_page', value: val })
        }
      }
    }
  ),
  created () {
    this.$store.dispatch(INIT_LOCATION)
  },
  methods: {
    submit () {
      this.$store.dispatch(GET_GNAVI_LIST)
    },
    reset () {
      this.$store.dispatch(RESET_STATE)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form {
  background-color: #fef4e5;
  box-shadow: 0 0 25px 0 rgba(0,0,0,0.5);
}
.form table {
  background-color: #fff;
}
</style>
