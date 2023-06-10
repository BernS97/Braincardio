<template>
    <ion-card class="card-editor">
        <ion-card-header>
            <ion-card-title>{{ placeholder }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <quill-editor v-model:content="myValue" :modules="modules" :toolbar="toolbarOptions" content-type="text"
                :placeholder="placeholder" />
        </ion-card-content>
    </ion-card>
</template>
<script setup>
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/vue';
import { computed } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import ImageUploader from 'quill-image-uploader';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
const props = defineProps(["modelValue", "placeholder"]);
const emit = defineEmits(["update:modelValue"]);

const myValue = computed({
    get() {
        return props.modelValue;
    },
    set(nextValue) {
        emit("update:modelValue", nextValue);
    },
});
const toolbarOptions = [[{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['image']];
const modules = {
    name: 'imageUploader',
    module: ImageUploader,
    options: {
        upload: file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    resolve(reader.result);
                };
                reader.onerror = function (error) {
                    reject();
                };
            });
        }
    }
}
</script>
<style lang="scss">
ion-card.card-editor ion-card-content.card-content-ios {
    padding-inline-start: 0;
    padding-inline-end: 0;
    padding-bottom: 0;
}

.ql-toolbar.ql-snow,
.ql-container.ql-snow {
    border: none;
}

.ql-toolbar.ql-snow {
    border-bottom: 1px solid #f6f6f6;
    margin: 8px;
    padding: 0;
    padding-bottom: 8px;

    & .ql-picker {
        color: var(--ion-card-color, var(--ion-item-color, var(--ion-color-step-600, #666666)));
    }

    & .ql-stroke {
        stroke: var(--ion-card-color, var(--ion-item-color, var(--ion-color-step-600, #666666)));
    }

    & .ql-snow .ql-fill {
        fill: var(--ion-card-color, var(--ion-item-color, var(--ion-color-step-600, #666666)));
    }
}

.ql-editor.ql-blank::before {
    color: var(--ion-card-color, var(--ion-item-color, var(--ion-color-step-600, #666666)));
}

ion-card.card-editor {
    height: 80%;
}
</style>