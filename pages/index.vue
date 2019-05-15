<template>
  <v-layout row wrap>
    <v-flex 
      v-for="(menu, idx) in menus" 
      :key="idx"
      pa-2
      md4
    >
      <module-card :menu="menu"></module-card>
    </v-flex>
  </v-layout>
</template>

<script>
import menus from '@/util/menus';
import ModuleCard from '@/components/common/ModuleCard';
export default {
  components: {
    ModuleCard
  },
  meta: {
    breadcrumbs: [
      { name: 'Módulos', link: '' }
    ]
  },
  computed: {
    menus: () => menus
  }
}
</script>
