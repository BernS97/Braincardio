import { db } from "@/plugins/firebase";
import { useStatisticsStore } from "@/plugins/pinia/statistics";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ref } from "vue";
const statistics = ref();

export function getStatsPerDay(date) {
  const stats = statistics.value.statistics.filter((elem) => elem.date == date);
  let rightCount = 0;
  let wrongCount = 0;
  stats?.forEach((stat) => {
    wrongCount += stat.cards.filter((card) => card.result == 0).length;
    rightCount += stat.cards.filter((card) => card.result == 1).length;
  });
  return (rightCount / (rightCount + wrongCount)) * 100;
}

export async function loadStatisticData(deckId) {
  const statisticsStore = useStatisticsStore();
  const deckRef = doc(db, "decks", deckId);
  //statistics.value = await useCollection(collection(db, 'statistics')).value;
  const coll = await collection(db, "statistics");
  const q = await query(
    coll,
    orderBy("date", "desc"),
    where("deck", "==", deckRef)
  );
  const docs = await getDocs(q);
  statisticsStore.addStatistics({
    deckId: deckId,
    statistics: docs.docs.map((doc) => doc.data()),
  });
}

// by convention, composable function names start with "use"
export async function useLearnStatistics(deckId) {
  const statisticsStore = useStatisticsStore();
  const deckRef = doc(db, "decks", deckId);
  //statistics.value = await useCollection(collection(db, 'statistics')).value;
  const coll = await collection(db, "statistics");
  const q = await query(
    coll,
    orderBy("date", "desc"),
    where("deck", "==", deckRef)
  );
  const docs = await getDocs(q);
  statisticsStore.addStatistics({
    deckId: deckId,
    statistics: docs.docs.map((doc) => doc.data()),
  });
  statistics.value = await statisticsStore.getStatisticsById(deckId);
  // expose managed state as return value
  return statistics;
}
