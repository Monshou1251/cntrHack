<template>
  <div>
    <div class="nav">
      <router-link to="/" class="button-link">
        <button class="home-button">Home</button>
      </router-link>
      <router-link to="/v1" class="button-link">
        <button class="basic-button">Basic version</button>
      </router-link>
      <router-link to="/v2" class="button-link">
        <button class="vuex-button">With Vuex</button>
      </router-link>
    </div>
    <div class="container">
      <div class="grid-item">
        <div class="item-1">
          <input
            v-model="priceNum.value"
            placeholder="Price"
            @input="() => handleInputChange('priceNum')"
          />
          <div class="label">{{ priceNum.value }}</div>
        </div>
      </div>

      <div class="grid-item">
        <div class="item-2">
          <input
            v-model="quantityNum.value"
            placeholder="Quantity"
            @input="() => handleInputChange('quantityNum')"
          />
          <div class="label">{{ quantityNum.value }}</div>
        </div>
      </div>

      <div class="grid-item">
        <div class="item-3">
          <input
            v-model="sumNum.value"
            placeholder="Sum"
            @input="() => handleInputChange('sumNum')"
          />
          <div class="label">{{ sumNum.value }}</div>
        </div>
      </div>

      <div class="grid-item">
        <div class="item-4">
          <button class="save-button" @click="saveData">Save Data</button>
          <div class="local-state">{{ savedData }}</div>
        </div>
      </div>

      <div class="log-window">
        <div class="item-5">
          <div
            v-for="(message, index) in logMessages"
            :key="index"
            class="event"
          >
            {{ message.timestamp }} - {{ message.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from "lodash.debounce";
// import { mapState } from "vuex";

export default {
  computed: {
    // Get data from state
    priceNum() {
      return this.$store.state.priceNum;
    },
    quantityNum() {
      return this.$store.state.quantityNum;
    },
    sumNum() {
      return this.$store.state.sumNum;
    },
  },
  data() {
    return {
      nonce: 0,
      oldLocalData: null,
      logMessages: [],
    };
  },
  watch: {
    // Watchers that call some actions to recalculate the data in the store
    "priceNum.value": debounce(function () {
      this.updateFieldDate("priceNum"); // Call the action to update the field date
      this.recalculate("priceNum"); // Call the action to perform recalculation
    }, 300),

    "quantityNum.value": debounce(function () {
      this.updateFieldDate("quantityNum"); // Call the action to update the field date
      this.recalculate("quantityNum"); // Call the action to perform recalculation
    }, 300),

    "sumNum.value": debounce(function () {
      this.updateFieldDate("sumNum"); // Call the action to update the field date
      this.recalculate("sumNum"); // Call the action to perform recalculation
    }, 300),
  },

  methods: {
    // Method to increment the nonce counter
    incrementNonce() {
      this.nonce++;
    },

    // Method to check if a value is a valid positive number
    isValidPositiveNumber(value) {
      return !isNaN(parseFloat(value)) && isFinite(value) && value >= 0;
    },

    // Method to save data to local storage and update log messages
    saveData() {
      if (
        // Check if all numeric fields are valid positive numbers
        this.isValidPositiveNumber(this.priceNum.value) &&
        this.isValidPositiveNumber(this.quantityNum.value) &&
        this.isValidPositiveNumber(this.sumNum.value)
      ) {
        if (this.sumNum.value % 2 === 0) {
          setTimeout(() => {
            // Create a log message with old data from local storage
            const oldLogMessage = {
              timestamp: new Date().toLocaleTimeString(),
              text: `Old data from localStorage was: ${JSON.stringify(
                this.savedData
              )}`,
            };

            // Prepare data to be saved to local storage
            const dataToSave = {
              priceNum: parseInt(this.priceNum.value, 10),
              quantityNum: parseInt(this.quantityNum.value, 10),
              sumNum: parseInt(this.sumNum.value, 10),
              nonce: this.nonce,
            };

            // Save data to local storage
            localStorage.setItem("savedData", JSON.stringify(dataToSave));

            // Update component state with saved data
            this.savedData = { ...dataToSave };

            // Update log messages with old and new log entries
            this.logMessages.unshift(oldLogMessage);

            const newLogMessage = {
              timestamp: new Date().toLocaleTimeString(),
              text: `New data saved to localStorage: ${JSON.stringify(
                dataToSave
              )}`,
            };
            this.logMessages.unshift(newLogMessage);
          }, 1000);
        } else {
          // Log message for an invalid sum
          const newLogMessage = {
            timestamp: new Date().toLocaleTimeString(),
            text: `Resulting Sum is not even, data is not saved.`,
          };
          this.logMessages.unshift(newLogMessage);
        }
      } else {
        // Log message for one or more invalid fields
        const errorMessage =
          "One or more fields are not valid positive numbers.";
        const newLogMessage = {
          timestamp: new Date().toLocaleTimeString(),
          text: errorMessage,
        };
        this.logMessages.unshift(newLogMessage);
      }
    },

    // Handling (and validating) input provided by user
    handleInputChange: debounce(function (field) {
      const newValue = this[field].value;

      // Dispatch the action to update the field value in the Vuex store
      this.$store.dispatch("updateFieldValue", { field, value: newValue });

      // Log the field change in the logMessages
      const logMessage =
        field === "sumNum"
          ? "Sum"
          : field === "quantityNum"
          ? "Quantity"
          : field === "priceNum"
          ? "Price"
          : "Unknown Field";

      const newLogMessage = {
        timestamp: new Date().toLocaleTimeString(),
        text: `${logMessage} changed to ${newValue}.`,
      };
      this.logMessages.unshift(newLogMessage);
    }, 300),

    isValidNumber(value) {
      // Check if the value is a valid number
      return !isNaN(parseFloat(value)) && isFinite(value);
    },

    // Action to update field date
    updateFieldDate(field) {
      this.$store.dispatch("updateFieldDate", { fieldName: field });
    },
    // Action to perform recalculation
    recalculate(field) {
      this.$store.dispatch("recalculate", { objName: field });
    },
  },

  created() {
    // Load saved data from localStorage on component creation
    const savedData = localStorage.getItem("savedData");
    if (savedData) {
      this.savedData = JSON.parse(savedData);
    } else {
      // Set default values if no saved data is found
      this.savedData = {
        priceNum: 0,
        quantityNum: 0,
        sumNum: 0,
        nonce: 0,
      };
    }

    this.nonce = 0;

    // Periodically increment the nonce every second
    setInterval(() => {
      this.incrementNonce();
    }, 1000);
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Comfortaa:700|Prompt:300");

.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  color: #ccc;
  z-index: 1000;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
}
.nav button {
  font-family: "Prompt", sans-serif;
  border: none;
  cursor: pointer;
}
.vuex-button {
  height: 100%;
  background-color: #f95959;
  color: #fff;
}

.container {
  display: grid;
  grid-template-rows: 100px 1fr;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  grid-template-areas:
    "item-1 item-2 item-3 item-4"
    "item-5 item-5 item-5 item-5";
  grid-gap: 10px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #455d7a;
  border-radius: 10px;
  box-shadow: 0px 0px 7px 4px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 0px 0px 7px 4px rgb(255, 255, 255);
  padding: 5px;
}

.grid-item {
  padding: 5px;
  background-color: #fff4e1;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  max-width: auto;
}

.item-1 {
  grid-area: item-1;
}
.item-2 {
  grid-area: item-2;
}
.item-3 {
  grid-area: item-3;
}
.item-4 {
  grid-area: item-4;
}

input {
  padding: 10px;
  margin-bottom: 10px;
  border: 0px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  width: 100%;
  height: 35px;
  font-family: "Prompt", sans-serif;
  font-weight: 300;
  /* outline: #f95959; */
  outline-color: #455d7a;
  background-color: #455d7a;
  color: #fff;
}

input::placeholder {
  font-family: "Prompt", sans-serif;
  font-weight: 300;
  color: #fff;
}

.save-button {
  background-color: #f95959;
  color: #fff;
  cursor: pointer;
  padding: 10px;
  margin-bottom: 10px;
  border: 0px solid #ccc;
  border-radius: 5px;
  width: 100%;
  font-family: "Prompt", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
}

button:hover {
  background-color: #f95959de;
}

.label {
  font-weight: bold;
  padding-top: 10px;
  /* color: #fff; */
  color: #455d7a;
  font-family: "Comfortaa", sans-serif;
  font-weight: 800;
  font-size: 24px;
  overflow: hidden;
}

.local-state {
  /* color: #fff; */
  color: #455d7a;
  font-family: "Prompt", sans-serif;
  font-weight: 100;
  font-size: 14px;
  word-wrap: break-word;
}

.event {
  margin-bottom: 2px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.log-window {
  grid-area: item-5;
  overflow-y: auto;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 200px;
  background-color: #fff;
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  color: #2c3e50d8;
  /* font-family: "Prompt", sans-serif; */
}
</style>
