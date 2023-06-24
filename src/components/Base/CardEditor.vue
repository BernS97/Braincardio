<template>
    <ion-card class="card-editor">
        <ion-card-header>
            <ion-card-title>{{ title }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <quill-editor v-model:content="myValue" :modules="modules" :toolbar="toolbarOptions" content-type="html"
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
const props = defineProps(["modelValue", "placeholder", "title"]);
const emit = defineEmits(["update:modelValue"]);

const myValue = computed({
    get() {
        return props.modelValue;
    },
    set(nextValue) {
        emit("update:modelValue", nextValue);
    },
});

const resizeImage = async (base64Str, size) => {

    var img = new Image();
    img.src = base64Str;
    var canvas = document.createElement('canvas');
    var MAX_WIDTH = 400;
    var MAX_HEIGHT = 350;
    var width = img.width;
    var height = img.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }
    canvas.width = width;
    canvas.height = height;
    return new Promise((resolve) => {
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const quality = (1000000 / size) * 100;
        ctx.canvas.toBlob((blob) => {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                resolve(reader.result);
            }
        }, "image/png", quality <= 0 || quality > 100 ? 100 : quality);
    }).then((base64) => {
        return base64;
    })
}

const toolbarOptions = [[{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['image']];
const modules = {
    name: 'imageUploader',
    module: ImageUploader,
    options: {
        upload: file => {
            return new Promise(async (resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const base64 = await resizeImage(reader.result, file.size);
                    resolve(base64);
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