import { defineStore } from 'pinia';

export const useStatisticsStore = defineStore({
  id: 'statistics',
  state: () => ({
    statistics: [],
  }),
  getters: {
    getStatistics: (state) => state.statistics,
  },
  actions: {
    async getStatisticsById(id) {
      return this.statistics.find((elem) => elem.deckId === id);
    },
    addStatistics(statistics) {
      let stat = this.statistics.filter(
        (elem) => elem.deckId === statistics.deckId
      );
      if (stat.length > 0) {
        stat = statistics;
      } else {
        this.statistics.push(statistics);
      }
    },
  },
});

export default useStatisticsStore;
