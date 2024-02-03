import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "mainComp",
      component: function (resolve) {
        require(["@/components/MainComp.vue"], resolve);
      },
    },
    {
      path: "/hello",
      name: "hello",
      component: function (resolve) {
        require(["@/components/HelloWorld.vue"], resolve);
      },
    },
  ],
});

export default router;
