import { 
  SET_CURRENT_TITLE, 
  SET_BREADCRUMBS_DATA, 
  SET_PARAMS
} from "@/util/mutations-types";

export const state = () => ({
  currentTitle: 'Inicio',
  breadcrumbsData: {
    constructor: () => ([]),
    params: []
  }
})

export const mutations = {
  [SET_CURRENT_TITLE](state, title){
    state.currentTitle = title;
  },
  [SET_BREADCRUMBS_DATA](state, breadcrumbsData){
    state.breadcrumbsData = breadcrumbsData;
  },
  [SET_PARAMS](state, params) {
    state.breadcrumbsData.params = params;
  }
}

export const getters = {
  displayBreadcrumbs(state){
    const { constructor, params } = state.breadcrumbsData;
    return constructor(...params);
  }
}
export const actions =  {
  loadPageInfo({ commit }, { title, constructor, params }) {
    commit(SET_CURRENT_TITLE, title);
    if(constructor) {
      commit(SET_BREADCRUMBS_DATA, { constructor, params });
    }
  },
  addParams({ commit }, params) {
    commit(SET_PARAMS, params);
  }
}
