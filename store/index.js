import { 
  SET_CURRENT_TITLE, 
  SET_BREADCRUMBS,
} from "@/util/mutations-types";

export const state = () => ({
  currentTitle: 'Inicio',
  breadcrumbs: []
})

export const mutations = {
  [SET_CURRENT_TITLE](state, title){
    state.currentTitle = title;
  },  
  [SET_BREADCRUMBS](state, breadcrumbs){
    state.breadcrumbs = breadcrumbs;
  }
}
export const actions =  {
  loadPageInfo({ commit }, { title, breadcrumbs }) {
    console.log({ title, breadcrumbs });
    commit(SET_CURRENT_TITLE, title);
    commit(SET_BREADCRUMBS, breadcrumbs);
  },
}
