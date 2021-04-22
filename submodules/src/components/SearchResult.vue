<template>
  <v-container>
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <v-card>
        <v-card-title>Select Attributes</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px">
          <v-flex v-for="(item, index) in headers" :key="index">
            <v-row>
              <v-switch
                v-model="visible_headers"
                light
                :label="item.text"
                :value="item"
              >
              </v-switch>
            </v-row>
          </v-flex>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      dense
      multi-sort
      :search="search"
      :headers="visible_headers"
      :items="result"
      :items-per-page="10"
      class="elevation-1"
      @item-selected="handleClick($event)"
      loading-text="Loading... Please wait"
      :loading="loading"
      :show-select="select"
      single-select
      item-key="name"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card v-if="selectedItem">
              <v-card-title class="headline"
                >Stop job: {{ selectedItem.name }}?</v-card-title
              >
              <v-col cols="12">
                <v-row justify="space-around">
                  <v-radio-group v-model="radioCancelDelete" class="pl-4">
                    <v-radio label="Cancel Job" value="cancel"></v-radio>
                    <v-radio label="Delete Job" value="delete"></v-radio>
                  </v-radio-group>
                  <v-switch
                    v-model="forceStop"
                    label="Force"
                    color="red"
                    value="force"
                    hide-details
                  ></v-switch>
                </v-row>
              </v-col>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDelete = false"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.ledDesired`]="{ item }">
        <v-row>
          <v-chip
            v-if="item.led === 'on'"
            class="ma-2 mt-4"
            color="green"
            text-color="white"
            >On</v-chip
          >
          <v-chip v-if="item.led === 'off'" class="ma-2 mt-4" text-color="white"
            >Off</v-chip
          >
          <v-switch
            v-model="item.ledDesired"
            @change="updateShadow(item)"
          ></v-switch>
        </v-row>

        <!-- <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
      </template>
      <template v-slot:[`item.getData`]="{ item }">
        <v-btn @click="getData(item)">Get Data</v-btn>
      </template>
      <!-- <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template> -->
    </v-data-table>
    <v-divider></v-divider>
    <v-col cols="12">
      <v-row justify="space-between">
        <v-btn color="primary" dark :right="true" @click="dialog = true">
          Select Attributes
        </v-btn>
        <v-col cols="4">
          <v-row justify="end">
            <v-btn v-if="next" @click="nextClicked">Next</v-btn>
            <!-- <download-csv
              :data="result"
              name="data.csv"
              :fields="visible_headers.map((a) => a.value)"
              v-on:export-finished="exported"
            >
              <v-btn class="button">Export</v-btn>
            </download-csv> -->
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
export default {
  props: {
    result: Array,
    loading: Boolean,
    headers: Array,
    next: Boolean,
    select: Boolean,
  },
  data() {
    return {
      search: "",
      dialog: false,
      visible_headers: this.headers,
      selectedName: 1,
      dialogDelete: false,
      selectedItem: null,
      radioCancelDelete: "cancel",
      forceStop: "noForce",
      value: null,
    };
  },
  methods: {
    handleClick(a) {
      console.log(a);
      if (event.target.classList.contains("btn__content")) return;
      if (a.value) {
        this.$emit("clicked", a.item);
      }
      this.$emit("cleared", a.item);
    },
    nextClicked(a) {
      if (event.target.classList.contains("btn__content")) return;
      this.$emit("nextClicked", a);
    },
    exported(event) {
      console.log(event);
      this.isExported = true;
      setTimeout(() => {
        this.isExported = false;
      }, 3 * 1000);
    },
    updateShadow(item) {
      this.$emit("updateLedClicked", item);
    },
    getData(item) {
      this.$emit("getDataClicked", item);
    },
  },
};
</script>