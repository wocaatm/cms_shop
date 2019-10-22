import { INIT_SWIPE, INIT_CATEGORY} from '../types'

const state = {
    swipe: [],
    category: []
}

const mutations = {
    [INIT_SWIPE] (state, swipe) {
        if (swipe.hasSwipe) {
            state.swipe = swipe.swipeData
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