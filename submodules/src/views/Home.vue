<template>
  <div>
    <v-navigation-drawer app dark clipped>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">IoT Quickstart</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item
          v-for="([icon, title, link], i) in restItems"
          :key="i"
          :to="link"
        >
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-4" @click="logout">
          <v-btn block>Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar dark app clipped-left>
      <v-toolbar-title>
        <router-link to="/" class="toolbar_title">AWS</router-link>
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import { AmplifyEventBus } from "aws-amplify-vue";

export default {
  data: () => {
    return {
      restItems: [
        ["mdi-magnify", "Register", "/register"],
        ["mdi-magnify", "Devices", "/devices"],
      ],
    };
  },
  methods: {
    logout() {
      Auth.signOut().then(() => {
        return AmplifyEventBus.$emit("authState", "signedOut");
      });
    },
  },
};
</script>
<style scoped>
.toolbar_title {
  color: #c4c4c4;
  text-decoration: none;
}
</style>
