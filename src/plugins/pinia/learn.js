import { db } from "@/plugins/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { cloneDeep } from "lodash-es";
import { defineStore } from "pinia";

export const useLearnObjStore = defineStore({
  id: "learnObj",
  state: () => ({
    learnObj: [],
    statisticId: null,
  }),
  getters: {
    getLearnObj: (state) => {
      return state.learnObj;
    },
    getStatisticId: (state) => {
      return state.statisticId;
    },
  },
  actions: {
    async createLearnObj(params) {
      this.setStatisticId(null);
      const learnObj = {
        deck: doc(db, "decks", params.id),
        date: new Date().toDateString(),
        user: params.email,
        cards: [],
      };
      params?.deckCards?.forEach((deckCard) => {
        const card = cloneDeep(deckCard);
        const testCard = params.statisticsCards?.find((search) => {
          return search.refId == card.id;
        });
        card.status = testCard?.status ?? 0;
        learnObj.cards.push(card);
      });
      this.setLearnObj(learnObj);
      return learnObj;
    },
    async handleCardAccepted(current) {
      const card = this.learnObj.cards[current];
      if (card?.status < 5) card.status++;
      await this.handleUpdate({ card: card, result: 1 });
    },
    async handleCardRejected(current) {
      const card = this.learnObj.cards[current];
      card.status = 0;
      await this.handleUpdate({ card: card, result: 0 });
    },
    async handleUpdate(params) {
      params.card.result = params.result;
      if (!this.statisticId) {
        const statisticId = await (
          await addDoc(collection(db, "statistics"), this.learnObj)
        ).id;
        this.setStatisticId(statisticId);
      }

      updateDoc(doc(db, "statistics", this.statisticId), this.learnObj);
    },
    setLearnObj(learnObj) {
      this.learnObj = learnObj;
    },
    setStatisticId(statisticId) {
      this.statisticId = statisticId;
    },
  },
});
