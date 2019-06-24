<template>
  <v-list dense >
    <div v-for="(menu, menuIdx) in menus" :key="menuIdx">
      <MenuTreeItem 
        :menu="menu" 
        :menuIdx="menuIdx">
      </MenuTreeItem>
    </div>
  </v-list>
</template>

<script>
import MenuTreeItem from './MenuTreeItem';
export default {
  components: {
    MenuTreeItem
  },
  props: {
    menus: Array
  },
}
</script>

<style>

</style>
