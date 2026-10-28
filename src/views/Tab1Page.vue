
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>DRIVE — My Garage arjay</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>My Garage ako ay hahhahhagsdfg sfvcsbgujrdgfvejb</h1>
      <p>Manage your car collection.</p>

      <ion-text v-if="errorMessage" color="danger">
        <p>{{ errorMessage }}</p>
      </ion-text>

      <ion-text v-if="loading">
        <p>Loading cars...</p>
      </ion-text>

      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{ editingId ? 'Update Car' : 'Add New Car' }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form @submit.prevent="saveCar">
            <ion-input
              v-model="form.brand"
              label="Brand"
              label-placement="stacked"
              placeholder="e.g. Toyota"
              required
            />

            <ion-input
              v-model="form.model"
              label="Model"
              label-placement="stacked"
              placeholder="e.g. Vios"
              required
            />

            <ion-input
              v-model.number="form.year"
              type="number"
              label="Year"
              label-placement="stacked"
              placeholder="e.g. 2025"
              required
            />

            <ion-input
              v-model="form.color"
              label="Color"
              label-placement="stacked"
              placeholder="e.g. Black"
              required
            />

            <ion-input
              v-model="form.type"
              label="Type"
              label-placement="stacked"
              placeholder="e.g. Sedan, SUV"
              required
            />

            <ion-textarea
              v-model="form.notes"
              label="Notes"
              label-placement="stacked"
              placeholder="Additional details"
              :auto-grow="true"
            />

            <ion-button
              type="submit"
              expand="block"
              :disabled="saving || !isFirebaseConfigured"
            >
              {{ saving ? 'Saving...' : editingId ? 'Update Car' : 'Add Car' }}
            </ion-button>

            <ion-button
              v-if="editingId"
              type="button"
              expand="block"
              fill="outline"
              color="medium"
              @click="resetForm"
            >
              Cancel Edit
            </ion-button>
          </form>
        </ion-card-content>
      </ion-card>

      <h2>Saved Cars ({{ cars.length }})</h2>

      <ion-card v-for="car in cars" :key="car.id">
        <ion-card-header>
          <ion-card-title>
            {{ car.brand }} {{ car.model }}
          </ion-card-title>
          <ion-card-subtitle>
            {{ car.year }} · {{ car.color }} · {{ car.type }}
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <p v-if="car.notes">{{ car.notes }}</p>

          <ion-button
            size="small"
            @click="editCar(car)"
          >
            Edit
          </ion-button>

          <ion-button
            size="small"
            color="danger"
            :disabled="deletingId === car.id"
            @click="deleteCar(car)"
          >
            {{ deletingId === car.id ? 'Deleting...' : 'Delete' }}
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-text v-if="!loading && cars.length === 0">
        <p>No cars found. Add your first car above.</p>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';

import {
  createCar,
  updateCar as updateCarInFirebase,
  removeCar,
  subscribeToCars,
  isFirebaseConfigured,
  type Car,
} from '@/firebase';

const cars = ref<Car[]>([]);
const loading = ref(true);
const saving = ref(false);
const deletingId = ref('');
const editingId = ref('');
const errorMessage = ref('');

let unsubscribe: (() => void) | undefined;

const emptyForm = () => ({
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  color: '',
  type: '',
  notes: '',
});

const form = reactive(emptyForm());

function resetForm() {
  Object.assign(form, emptyForm());
  editingId.value = '';
}

function editCar(car: Car) {
  if (!car.id) return;

  errorMessage.value = '';
  editingId.value = car.id;

  Object.assign(form, {
    brand: car.brand,
    model: car.model,
    year: car.year,
    color: car.color,
    type: car.type,
    notes: car.notes ?? '',
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function saveCar() {
  errorMessage.value = '';

  if (!isFirebaseConfigured) {
    errorMessage.value = 'Firebase is not configured. Check your .env file.';
    return;
  }

  if (
    !form.brand.trim() ||
    !form.model.trim() ||
    !form.color.trim() ||
    !form.type.trim() ||
    !Number.isFinite(Number(form.year)) ||
    Number(form.year) < 1886
  ) {
    errorMessage.value = 'Please enter valid car details.';
    return;
  }

  saving.value = true;

  const carData = {
    brand: form.brand.trim(),
    model: form.model.trim(),
    year: Number(form.year),
    color: form.color.trim(),
    type: form.type.trim(),
    notes: form.notes.trim(),
  };

  try {
    if (editingId.value) {
      await updateCarInFirebase(editingId.value, carData);
    } else {
      await createCar(carData);
    }

    resetForm();
  } catch (error) {
    console.error('Save car error:', error);
    errorMessage.value =
      error instanceof Error ? error.message : 'Could not save car.';
  } finally {
    saving.value = false;
  }
}

async function deleteCar(car: Car) {
  if (!car.id) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete ${car.brand} ${car.model}?`
  );

  if (!confirmed) return;

  errorMessage.value = '';
  deletingId.value = car.id;

  try {
    await removeCar(car.id);

    if (editingId.value === car.id) {
      resetForm();
    }
  } catch (error) {
    console.error('Delete car error:', error);
    errorMessage.value =
      error instanceof Error ? error.message : 'Could not delete car.';
  } finally {
    deletingId.value = '';
  }
}

onMounted(() => {
  if (!isFirebaseConfigured) {
    errorMessage.value = 'Firebase is not configured. Check your .env file.';
    loading.value = false;
    return;
  }

  unsubscribe = subscribeToCars(
    (data) => {
      cars.value = data;
      loading.value = false;
    },
    (error) => {
      errorMessage.value =
        error.message || 'Could not load cars from Firebase.';
      loading.value = false;
    }
  );
});

onUnmounted(() => {
  unsubscribe?.();
});
</script>
