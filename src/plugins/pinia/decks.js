import { defineStore } from 'pinia'
import { db } from '@/plugins/firebase';
import { updateDoc, doc } from 'firebase/firestore'
import { cloneDeep } from 'lodash-es';
import { useStorage } from '@vueuse/core';

export const useDeckStore = defineStore({
  id: 'deck',
  state: () => ({
    decks: useStorage('decks', []),
  }),
  getters: {
    getDecks: (state) => {
      return state.decks;
    },
  },
  actions: {
    async getDeckById(id) {
      return this.decks.find(elem => elem.refId == id);
    },
    async saveDeck(params) {
      const deck = cloneDeep(params.deck);
      const id = cloneDeep(params.deck.id);
      deck.cards = params.cards;
      await updateDoc(doc(db, "decks", id), deck)
    },
    setDecks(decks) {
      this.decks = decks.map((deck)=>{
          deck.refId = deck.id;
          return deck;
      })
    },
  },
})
