<template>
  <ion-page>
    <ion-tabs>

      <!-- ROUTER -->
      <ion-router-outlet></ion-router-outlet>


      <!-- BOTTOM TAB BAR -->
      <ion-tab-bar slot="bottom">

        <!-- TAB 1: CREATE CAR -->
        <ion-tab-button
          tab="tab1"
          href="/tabs/tab1"
        >
          <ion-icon
            aria-hidden="true"
            :icon="addCircleOutline"
          />

          <ion-label>
            Create Car
          </ion-label>
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