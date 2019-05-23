import { PRODUCT_LINES_ENDPOINT } from '@/util/endpoints';

export default class ProductLinesService {
    constructor({ $axios }) {
        this.$axios = $axios;
    }
    async pageProductLines(page, size, sortBy, direction) {
        const productLines = await this.$axios.$get(PRODUCT_LINES_ENDPOINT, {
            params: { page, size, sort: sortBy ? `${sortBy},${direction}` : sortBy }
        });

        const extract = (productLine) => ({
            ...productLine
        });

        return {
            productLines: productLines.content.map(extract),
            page: {
                totalElements: productLines.totalElements,
                totalPages: productLines.totalPages,
                page: productLines.page,
                size: productLines.size,
                isSorted: productLines.isSorted
            }
        }
    }
    async listProductLines() {
        return await this.$axios.$get(`${PRODUCT_LINES_ENDPOINT}/unpaged`);
    }
    async createProductLine(productLine) {
        await this.$axios.$post(PRODUCT_LINES_ENDPOINT, productLine);
    }
    async updateProductLine(productLine) {
        const { id } = productLine;
        await this.$axios.$put(`${PRODUCT_LINES_ENDPOINT}/${id}`, productLine);
    }
    async deleteProductLine({ id }) {
        await this.$axios.$delete(`${PRODUCT_LINES_ENDPOINT}/${id}`);
    }
}