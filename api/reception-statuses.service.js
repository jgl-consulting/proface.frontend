import { RECEPTION_STATUSES_ENDPOINT } from '@/util/endpoints';
export default class ReceptionStatusesService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  listReceptionStatuses() {
    return this.$axios.$get(`${RECEPTION_STATUSES_ENDPOINT}/unpaged`);
  }

}