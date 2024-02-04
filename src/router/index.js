import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "mainPage",
      component: function (resolve) {
        require(["@/components/mainPage.vue"], resolve);
      },
    },
    {
      path: "/v1",
      name: "baseComp",
      component: function (resolve) {
        require(["@/components/baseComp.vue"], resolve);
      },
    },
    {
      path: "/v2",
      name: "vuexComp",
      component: function (resolve) {
        require(["@/components/vuexComp.vue"], resolve);
      },
    },
  ],
});

export default router;
