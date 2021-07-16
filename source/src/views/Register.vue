<template>
  <v-container center>
    <v-card>
      <v-card-title>Register Device</v-card-title>
      <v-card-subtitle>Enter Serial Number from Device Sticker</v-card-subtitle>
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          label="Serial Number"
          solo
          clearable
          v-model="serial"
        ></v-text-field>
        <v-btn @click="register()">Register Device</v-btn>
        <v-btn @click="list()" v-if="false">List Devices</v-btn>
      </v-col>

      <v-card-title v-if="message">{{ message }}</v-card-title>
      <v-progress-linear
        v-if="loading"
        color="deep-purple accent-4"
        indeterminate
        :active="loading"
        rounded
        height="6"
      ></v-progress-linear>
    </v-card>
  </v-container>
</template>

<script>
import Amplify, { API } from "aws-amplify";
import awsconfig from "../aws-exports";
Amplify.configure(awsconfig);
API.configure(awsconfig);

import { apiCall, endpoint, verb } from "../config/api.js";

export default {
  async created() {
    console.log("create");
    this.message = null;
    this.loading = false;
  },
  data: () => ({
    loading: false,
    message: null,
    serial: null,
  }),
  methods: {
    async register() {
      this.loading = true;
      this.message = null;
      const url = `${endpoint.register}/${this.serial}`;
      console.log(url);
      const result = await apiCall({
        api: API,
        endpoint: url,
        verb: verb.get,
        param: {
          headers: {},
          response: false,
        },
      });
      this.loading = false;
      console.log(result);
      this.message = result;
    },
    async list() {
      this.loading = true;
      this.message = null;
      const url = `${endpoint.devices}`;
      console.log(url);
      const result = await apiCall({
        api: API,
        endpoint: url,
        verb: verb.get,
        param: {
          headers: {},
          response: false,
        },
      });
      this.loading = false;
      console.log(result);
      this.message = result;
    },
  },
};
</script>
