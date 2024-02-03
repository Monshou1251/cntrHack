<template>
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
        <button @click="saveData">Button 4</button>
        <div class="local-state">{{ savedData }}</div>
      </div>
    </div>

    <div class="log-window">
      <div class="item-5">
        <div v-for="(message, index) in logMessages" :key="index" class="event">
          {{ message.timestamp }} - {{ message.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from "lodash.debounce";

export default {
  data() {
    return {
      priceNum: { value: null, date: null },
      quantityNum: { value: null, date: null },
      sumNum: { value: null, date: null },
      nonce: 0,
      oldLocalData: null,
      logMessages: [],
    };
  },
  watch: {
    "priceNum.value": debounce(function () {
      this.priceNum.date = new Date();
      this.recalculate(this.priceNum, "priceNum");
    }, 300),

    "quantityNum.value": debounce(function () {
      this.quantityNum.date = new Date();
      this.recalculate(this.quantityNum, "quantityNum");
    }, 300),

    "sumNum.value": debounce(function () {
      this.sumNum.date = new Date();
      this.recalculate(this.sumNum, "sumNum");
    }, 300),
  },

  computed: {},
  methods: {
    incrementNonce() {
      this.nonce++;
    },
    isValidPositiveNumber(value) {
      return !isNaN(parseFloat(value)) && isFinite(value) && value >= 0;
    },
    saveData() {
      if (
        this.isValidPositiveNumber(this.priceNum.value) &&
        this.isValidPositiveNumber(this.quantityNum.value) &&
        this.isValidPositiveNumber(this.sumNum.value)
      ) {
        if (this.sumNum.value % 2 === 0) {
          setTimeout(() => {
            const oldLogMessage = {
              timestamp: new Date().toLocaleTimeString(),
              text: `Old data from localStorage was: ${JSON.stringify(
                this.savedData
              )}`,
            };

            const dataToSave = {
              priceNum: parseInt(this.priceNum.value, 10),
              quantityNum: parseInt(this.quantityNum.value, 10),
              sumNum: parseInt(this.sumNum.value, 10),
              nonce: this.nonce,
            };

            localStorage.setItem("savedData", JSON.stringify(dataToSave));

            this.savedData = { ...dataToSave };

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
          const newLogMessage = {
            timestamp: new Date().toLocaleTimeString(),
            text: `Resulting Sum is not even, data is not saved.`,
          };
          this.logMessages.unshift(newLogMessage);
        }
      } else {
        const errorMessage =
          "One or more fields are not valid positive numbers.";
        const newLogMessage = {
          timestamp: new Date().toLocaleTimeString(),
          text: errorMessage,
        };
        this.logMessages.unshift(newLogMessage);
      }
    },

    handleInputChange: debounce(function (field) {
      this[field] = {
        value: this[field].value,
        date: new Date().getTime(),
      };

      const logMessage =
        field === "sumNum"
          ? "Sum"
          : field === "quantityNum"
          ? "Quantity"
          : field === "priceNum"
          ? "Price"
          : "Unknown Field";
      const newValue = this[field].value;
      const newLogMessage = {
        timestamp: new Date().toLocaleTimeString(),
        text: `${logMessage} changed to ${newValue}.`,
      };
      this.logMessages.unshift(newLogMessage);
    }, 300),
    isValidNumber(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    },
    recalculate(arg, objName) {
      console.log(`${objName}: ${arg.value}; date: ${arg.date}`);

      const roundToTwoDecimal = (num) => {
        const rounded = Math.round(num * 100) / 100;
        return Number.isInteger(rounded)
          ? rounded.toFixed(0)
          : rounded.toFixed(2);
      };

      if (objName == "priceNum") {
        console.log("im here priceNum");
        if (this.quantityNum.value) {
          console.log("im here");
          this.sumNum.value = roundToTwoDecimal(
            this.priceNum.value * this.quantityNum.value
          );
        }
      }
      if (objName == "quantityNum") {
        console.log("im here quantityNum");
        if (this.priceNum.value) {
          console.log("im here");
          this.sumNum.value = roundToTwoDecimal(
            this.priceNum.value * this.quantityNum.value
          );
        }
      }
      if (objName == "sumNum") {
        if (this.priceNum.value && this.quantityNum.value) {
          if (this.priceNum.date > this.quantityNum.date) {
            this.quantityNum.value = roundToTwoDecimal(
              this.sumNum.value / this.priceNum.value
            );
          } else if (this.priceNum.date <= this.quantityNum.date) {
            this.priceNum.value = roundToTwoDecimal(
              this.sumNum.value / this.quantityNum.value
            );
          }
        }
      }
    },
  },

  created() {
    const savedData = localStorage.getItem("savedData");
    if (savedData) {
      this.savedData = JSON.parse(savedData);
    } else {
      this.savedData = {
        priceNum: 0,
        quantityNum: 0,
        sumNum: 0,
        nonce: 0,
      };
    }

    this.nonce = 0;

    setInterval(() => {
      this.incrementNonce();
    }, 1000);
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Comfortaa:700|Prompt:300");
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
  background-color: #fff4e1;
  border-radius: 10px;
  box-shadow: 0px 0px 7px 4px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 0px 0px 7px 4px rgb(255, 255, 255);
  padding: 5px;
}

.grid-item {
  padding: 5px;
  background-color: #455d7a;
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
}

input::placeholder {
  font-family: "Prompt", sans-serif;
  font-weight: 300;
}

button {
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
  color: #fff;
  font-family: "Comfortaa", sans-serif;
  font-weight: 800;
  font-size: 24px;
  overflow: hidden;
}

.local-state {
  color: #fff;
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
