// store.js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    priceNum: { value: null, date: null },
    quantityNum: { value: null, date: null },
    sumNum: { value: null, date: null },
  },
  mutations: {
    updateFieldValue(state, payload) {
      // Ex: payload: { field: 'priceNum', value: newValue }
      state[payload.field].value = payload.value;
      state[payload.field].date = new Date().getTime();
    },

    // Mutations to track the date when some field was changed
    updatePriceNum(state, newValue) {
      state.priceNum.value = newValue;
      state.priceNum.date = new Date();
    },
    updateQuantityNum(state, newValue) {
      state.quantityNum.value = newValue;
      state.quantityNum.date = new Date();
    },
    updateSumNum(state, newValue) {
      state.sumNum.value = newValue;
      state.sumNum.date = new Date();
    },

    // Mutation to update field date
    updateFieldDate(state, { fieldName }) {
      state[fieldName].date = new Date();
    },

    // Mutation to perform recalculation
    recalculate(state, { objName }) {
      const roundToTwoDecimal = (num) => {
        const rounded = Math.round(num * 100) / 100;
        return Number.isInteger(rounded)
          ? rounded.toFixed(0)
          : rounded.toFixed(2);
      };

      if (objName === "priceNum" && state.quantityNum.value !== null) {
        state.sumNum.value = roundToTwoDecimal(
          state.priceNum.value * (state.quantityNum.value || 0)
        );
      }

      if (objName === "quantityNum" && state.priceNum.value !== null) {
        state.sumNum.value = roundToTwoDecimal(
          (state.priceNum.value || 0) * state.quantityNum.value
        );
      }

      if (
        objName === "sumNum" &&
        state.priceNum.value !== null &&
        state.quantityNum.value !== null
      ) {
        if (
          state.priceNum.date > state.quantityNum.date &&
          state.priceNum !== 0
        ) {
          state.quantityNum.value = roundToTwoDecimal(
            (state.sumNum.value || 0) / (state.priceNum.value || 1)
          );
        } else if (
          state.priceNum.date <= state.quantityNum.date &&
          state.quantityNum !== 0
        ) {
          state.priceNum.value = roundToTwoDecimal(
            (state.sumNum.value || 0) / (state.quantityNum.value || 1)
          );
          if (isNaN(state.priceNum.value)) {
            state.priceNum.value = 0;
          }
        }
      }
    },
  },
  actions: {
    updateFieldValue({ commit }, payload) {
      commit("updateFieldValue", payload);
    },

    // Action to update field date
    updateFieldDate({ commit }, { fieldName }) {
      commit("updateFieldDate", { fieldName });
    },

    // Action to perform recalculation
    recalculate({ commit }, { objName }) {
      commit("recalculate", { objName });
    },
  },
  getters: {
    // Your getters go here
  },
});
