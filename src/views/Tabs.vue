<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar slot="bottom">
        <!-- CREATE CAR -->
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon
            aria-hidden="true"
            :icon="addCircleOutline"
          />
          <ion-label>Create Car</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/vue';

import {
  addCircleOutline,
  carSportOutline,
  searchOutline,
} from 'ionicons/icons';
</script>

<style scoped>
ion-tab-bar {
  --background: #050505;
  --border: 1px solid rgba(212, 175, 55, 0.35);
  height: 68px;
  padding: 6px 10px;
}

ion-tab-button {
  --color: #888888;
  --color-selected: #d4af37;
  --ripple-color: rgba(212, 175, 55, 0.2);
  font-weight: 600;
}

ion-tab-button ion-icon {
  font-size: 24px;
  margin-bottom: 3px;
}
</style>