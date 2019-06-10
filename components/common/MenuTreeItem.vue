<template>
    <div v-if="menu.children && menu.children.length > 0">      
      <v-list-group
        :prepend-icon="menu.icon"
        append-icon="fa-chevron-down small-icon"
      >
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <MenuTreeItem 
          v-for="(child, childIdx) in menu.children" 
          :key="`${menuIdx}${childIdx}`"
          :menu="child"
          :menuIdx="childIdx"
        ></MenuTreeItem>
      </v-list-group>
    </div>
    <div v-else>
      <v-list-tile
        class="my-2"
        :to="menu.to"
        router 
        exact
      >
        <v-list-tile-action>
          <v-icon small>{{ menu.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="font-weight-bold">
            {{ menu.title }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </div>
</template>

<script>
export default {
  name: "MenuTreeItem",
  props: {
    menu: Object,
    menuIdx: Number,
  }
}
</script>

<style>
  .small-icon {
    font-size: 13px !important;
  }
</style>
