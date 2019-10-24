import { INIT_SWIPE, INIT_CATEGORY} from '../types'

const state = {
    swipe: [],
    category: [],
    sceneInfo: ''
}

const mutations = {
    [INIT_SWIPE] (state, swipe) {
      const result = swipe.data;
      const { name, tel, address, swipeData } = result
      state.swipe = swipeData;
      state.sceneInfo = {
        name,
        tel,
        address
      }
    },
    [INIT_CATEGORY] (state, category) {
        state.category = category
    }
}

export default {
    state,
    mutations
}
