<template>
  <div class="container">
    <div class="item-1">
      <router-link to="/v1" class="button-link">
        <button class="basic-version">Basic Version</button>
      </router-link>
    </div>
    <div class="item-2">
      <router-link to="/v2" class="button-link">
        <button class="with-vuex">With Vuex</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-width: 50%;
  max-width: 80%;
  min-height: 30%;
  max-height: 40%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: #fff4e1;
  border-radius: 10px;
  box-shadow: 0px 0px 7px 4px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 0px 0px 7px 4px rgb(255, 255, 255);
  padding: 5px;
}

/* Styling for the "Basic Version" button */
.basic-version {
  background-color: #f95959;
}

/* Styling for the "With Vuex" button */
.with-vuex {
  background-color: #8acccc;
}

button {
  color: #fff;
  cursor: pointer;
  border: 0px solid #ccc;
  border-radius: 5px;
  font-family: "Prompt", sans-serif;
  font-size: 22px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  min-height: 100px;
  box-shadow: 0px 0px 7px 2px rgba(0, 0, 0, 0.089);
  transition: opacity 0.3s ease-in-out; /* Smooth transition on hover */
}

button:hover {
  opacity: 0.9;
}

/* Remove default link styles */
.button-link {
  text-decoration: none;
}
</style>
