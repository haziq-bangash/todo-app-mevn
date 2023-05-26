import { createStore } from 'vuex'

const store = createStore({
    state: {
        user: null,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        clearUser(state) {
            state.user = null;
        }
    },
    actions: {

    },
    getters: {
        user: state => state.user,
    }
});

export default store;