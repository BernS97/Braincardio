<template>
  <ion-card>
    <ion-card-header @click="flip" v-if="!flipped">
      <ion-card-title>
        <div v-html="card?.question"></div>
      </ion-card-title>
    </ion-card-header>

    <ion-card-content @click="flip">
      <div v-if="flipped && !recognisedText" v-html="card.answer"></div>
      <div v-if="!flipped && recognisedText" v-html="card?.question"></div>
      <div v-if="!flipped && recognisedText">{{ recognisedText }}</div>
      <div class="comparison-container" v-if="flipped && recognisedText">
        <div class="comparison" v-html="card.answer"></div>
        <div class="comparison">{{ recognisedText }}</div>
      </div>
    </ion-card-content>
    <div class="card-buttons" v-if="!(flipped && recognisedText)">
      <ion-button v-if="!speaking" color="primary" fill="clear" @click="speak(flipped ? card.answer : card.question)">
        {{ $t('speak') }}
      </ion-button>
      <ion-button v-if="speaking" color="danger" fill="clear" @click="stopSpeak">
        {{ $t('stopSpeak') }}
      </ion-button>
      <ion-button v-if="!listening" color="primary" fill="clear" @click="listen">
        {{ $t('listen') }}
      </ion-button>
      <ion-button v-if="listening" color="danger" fill="clear" @click="stopListen">
        {{ $t('stopListen') }}
      </ion-button>
    </div>
  </ion-card>
  <div class="button-bar">
    <ion-button fill="clear" v-if="currentCard !== 0" @click="previous">
      {{ $t('prev') }}
    </ion-button>
    <ion-button color="danger" @click="setWrong">
      {{ $t('wrong') }}
    </ion-button>
    <ion-button color="success" @click="setCorrect">
      {{ $t('correct') }}
    </ion-button>
    <ion-button fill="clear" v-if="currentCard + 1 < cards.length" @click="next">
      {{ $t('next') }}
    </ion-button>
  </div>
</template>

<script setup>
import { IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCardContent } from '@ionic/vue';
import { ref } from 'vue';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { useUserStore } from '@/plugins/pinia/users';
const props = defineProps(["cards", "total", "language"]);
const emits = defineEmits(["cardRejected", "cardAccepted", "cardSkipped", "previous"]);
const userStore = useUserStore();
const card = ref(props.cards[0]);
const flipped = ref(false);
const listening = ref(false);
const speaking = ref(false);
const currentCard = ref(0);
const recognisedText = ref(null);
const language = userStore.getLanguage;

SpeechRecognition.requestPermission().then(() => console.log('Granted'));

const flip = function () {
  flipped.value = !flipped.value;
};
const previous = function () {
  flipped.value = false;
  currentCard.value--;
  card.value = props.cards[currentCard.value];
  recognisedText.value = null;
  emits('previous', currentCard.value);
};
const forward = function () {
  flipped.value = false;
  currentCard.value++;
  card.value = props.cards[currentCard.value];
  recognisedText.value = null;
};
const next = function () {
  emits('cardSkipped', currentCard.value);
  forward();
};
const setCorrect = function () {
  emits('cardAccepted', currentCard.value);
  forward();
};
const setWrong = function () {
  emits('cardRejected', currentCard.value);
  forward();
};


// Start the recognition process
const listen = () => {
  listening.value = true;
  // Check feature available
  SpeechRecognition.available().then((available) => {
    if (available) {
      SpeechRecognition.start({
        language: language,
        partialResults: true
      })
      // listen to partial results
      SpeechRecognition.addListener("partialResults", (data) => {
        console.log("partialResults was fired", data.matches);
        if (data.matches && data.matches.length > 0) {
          recognisedText.value = data.matches[0];
        }
      });
    }
  });
}

// Stop the recognition process (iOS only)
const stopListen = async () => {
  listening.value = false;
  await SpeechRecognition.stop();
};

// Check permission
const permission = () => {
  SpeechRecognition.hasPermission()
    .then((hasPermission) => console.log(hasPermission))
}

const speak = async (text) => {
  speaking.value = true;
  const cleanedText = text.replace(/(<([^>]+)>)/ig, '').replace('\n', '');
  await TextToSpeech.speak({
    text: cleanedText,
    lang: 'en-US',
  });
  speaking.value = false;
}
const stopSpeak = async () => {
  speaking.value = false;
  await TextToSpeech.stop();
}

</script>

<style scoped>
ion-card {
  height: calc(100% - 150px)
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}

.card-buttons,
.button-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)));
}

ion-card-content {
  margin-bottom: 55px;
  overflow: scroll;
  overflow-y: auto;
  height: 100%;
}

.comparison {
  overflow: scroll;
  overflow-y: auto;
  height: 45%;
  border: 1px solid;
  margin-bottom: 5px;
}

.comparison-container {
  height: 100%;
}

.button-bar {
  bottom: 0;
  position: absolute;
  width: 90%;
  transform: translate(-50%, -50%);
  left: 50%;
  border-radius: 30px;
  padding-bottom: 0;
  border: 1px solid rgba(2, 52, 54, 0.08);
  height: 60px;
  overflow: hidden;
  box-shadow: 0 -5px 10px rgba(3, 181, 170, 0.08);
  display: table;
}

.button-bar ion-button {
  display: table-cell;
  height: 100%;
  margin: 0;
  --border-radius: 0px;
}
</style>