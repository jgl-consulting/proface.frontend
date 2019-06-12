<template>
  <simple-table-layout>
    <template #title>
      <v-subheader>Unidades</v-subheader>
    </template>
    <template #filters>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Búsqueda"
        single-line
        clearable
        hide-details
      ></v-text-field>
    </template>
    <template #table>
      <v-data-table
        :headers="unitHeaders"
        :items="units"
        class="elevation-1"
        :expand="expand"
        item-key="id"
        :total-items="page.totalElements"
        :pagination.sync="pagination"
        :rows-per-page-items="pageSizes"
        rows-per-page-text="Tamaño de página"
      >
        >
        <template v-slot:items="props">
          <tr @click.stop="props.expanded = !props.expanded">
            <td class="text-xs-left">{{ props.item.nativeId || "Sin identificador" }}</td>
            <td
              class="text-xs-left"
            >{{ $_.get(props.item.location, "description", "Sin ubicación") }}</td>
            <td class="text-xs-left">{{ $_.get(props.item.batch, "nativeId", "Sin empaque") }}</td>
            <td class="text-xs-left">
              <v-icon
                :color='$_.get(props.item.status, "color", "primary")'
                small
              >{{$_.get(props.item.status, "icon", "fa fa-play-circle")}}</v-icon>
              {{ $_.get(props.item.status, "description", "Sin estado") }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import { mapState, mapActions } from "vuex";
import moment from "moment";
export default {
  async fetch({ params: { productId }, route, store }) {
    await store.dispatch("products/details/fetchProduct", { productId });
  },
  components: {
    EmptyListTile
  },
  data() {
    return {
      title: "Unidades",
      unitHeaders: [
        { text: "Id Local", align: "left", value: "nativeId" },
        { text: "Ubicación", align: "left", value: "location" },
        { text: "Empaque", align: "left", value: "batch" },
        { text: "Estado", align: "left", value: "status" },
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      search: "",
      filter: "nativeId:{}*,location.description:{}*,batch.nativeId:{}*,status.description:{}*,¬",
      expand: false,
      pageSizes: [20, 30, 50, 100]
    };
  },
  watch: {
    pagination: {
      async handler() {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        const params = {
          requestPage: page - 1,
          size: rowsPerPage,
          sortBy,
          descending
        };
        await this.$store.dispatch(
          "products/details/fetchUnits",
          params
        );
      }
    },
    search: {
      async handler() {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        let searchFilter = this.search ? this.filter.replace(/{}/g, this.search) : "";
        const params = {
          requestPage: page - 1,
          size: rowsPerPage,
          sortBy,
          descending,
          filter: searchFilter
        };
        await this.$store.dispatch(
          "products/details/fetchUnits",
          params
        );
      }
    }
  },
  computed: {
    ...mapState("products/details", ["units", "page"]),
    purchases() {
      return this.units || [];
    }
  },
  methods: {
    formatDate(date) {
      if (date != undefined) return this.dateMoment(date).format("DD/MM/YYYY");
      return "";
    },
    dateMoment(date) {
      if (date != undefined) {
        const momentDate = moment(date);
        return momentDate.isValid() ? momentDate : moment.now();
      }
      return "";
    },
    optional(object) {
      return object || {};
    }
  }
};
</script>
