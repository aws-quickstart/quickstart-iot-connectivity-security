<template>
  <v-container center>
    <v-card>
      <v-card-title>My Devices</v-card-title>
      <v-card-text>
        <searchResult
          :result="things"
          :loading="loading"
          :headers="headers"
          :next="false"
          @updateLedClicked="updateLedClicked"
          @getDataClicked="getDataClicked"
      /></v-card-text>
    </v-card>
    <div id="app" v-if="chartData">
      <LineChart :chartdata="chartData" :options="chartOptions" />
    </div>
    <div class="container">
      <line-chart v-if="false" :chartdata="chartData" :options="options" />
    </div>
  </v-container>
</template>

<script>
import Amplify, { API } from "aws-amplify";
import awsconfig from "../aws-exports";
import LineChart from "../components/Chart";
import SearchResult from "@/components/SearchResult";

Amplify.configure(awsconfig);
API.configure(awsconfig);

import { apiCall, endpoint, verb } from "../config/api.js";

export default {
  components: {
    LineChart,
    SearchResult,
  },
  async created() {
    this.list();
  },
  data: () => ({
    colors: ["#90CAF9", "#00897B", "#FF5733", "#BA68C8", "#ffffe0"],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
    chartData: null,
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: "",
      },
    },
    deviceData: null,
    grid: {
      verticalLines: true,
      verticalLinesNumber: 1,
      horizontalLines: true,
      horizontalLinesNumber: 1,
    },
    headers: [
      { text: "Serial Number", value: "serialNumber" },
      { text: "LED Reported/Desired", value: "ledDesired" },
      { text: "Telemetry", value: "getData" },
    ],
    loading: false,
    message: null,
    things: [],
  }),
  methods: {
    getShadowValue(thing, key, state) {
      try {
        return thing.shadow[state][key] || "off";
      } catch {
        return "off";
      }
    },
    async list() {
      this.loading = true;
      this.message = null;
      const url = `${endpoint.devices}`;
      const result = await apiCall({
        api: API,
        endpoint: url,
        verb: verb.get,
        param: {
          headers: {},
          response: false,
        },
      });
      this.things = result.map((thing) => {
        return {
          serialNumber: thing.serialNumber,
          led: this.getShadowValue(thing, "led", "reported"),
          ledDesired:
            this.getShadowValue(thing, "led", "desired") === "on"
              ? true
              : false,
          getData: true,
        };
      });
      this.loading = false;
      this.message = this.things;
    },
    async updateLedClicked(item) {
      this.loading = true;
      this.message = null;
      const url = `${endpoint.shadow}/${item.serialNumber}`;
      const params = {
        api: API,
        endpoint: url,
        verb: verb.post,
        param: {
          headers: {},
          response: false,
          body: {
            key: "led",
            value: item.ledDesired ? "on" : "off",
          },
        },
      };
      await apiCall(params);
      this.loading = false;
    },
    async getDataClicked(item) {
      this.chartData = null;
      this.loading = true;
      this.message = null;
      const url = `${endpoint.deviceData}/${item.serialNumber}`;
      const params = {
        api: API,
        endpoint: url,
        verb: verb.get,
        param: {
          headers: {},
          response: false,
        },
      };
      this.deviceData = await apiCall(params);
      this.chartOptions.title.text = `Device: ${item.serialNumber}`;

      this.mapChart();
      this.loading = false;
    },
    mapChart() {
      if (this.deviceData.length == 0) {
        this.chartData = {
          labels: [],
          datasets: [],
        };
        return;
      }

      const ignoreKeys = ["accountSerial", "time"];
      const keys = Object.keys(this.deviceData[0]).filter(
        (key) => ignoreKeys.indexOf(key) < 0
      );
      const labels = this.deviceData.map((dp) =>
        new Date(dp.time).toISOString()
      );
      const datasets = keys.map((key, index) => {
        return {
          label: key,
          data: this.deviceData.map((dp) => dp[key] || null),
          backgroundColor: "transparent",
          borderColor: this.colors[index] || this.colors[0],
          pointBackgroundColor: "rgba(0, 0, 0, 0)",
          spanGaps: true,
        };
      });
      this.chartData = {
        labels,
        datasets,
      };
    },
  },
};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>