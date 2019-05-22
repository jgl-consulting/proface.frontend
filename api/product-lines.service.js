import { PRODUCT_LINES_ENDPOINT } from '@/util/endpoints';

export default class ProductLinesService {
    constructor({ $axios }) {
        this.$axios = $axios;
    }
    listProductLines() {
        return this.$axios.$get(`${PRODUCT_LINES_ENDPOINT}/unpaged`);
    }
}