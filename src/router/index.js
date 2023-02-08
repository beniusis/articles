import Vue from "vue";
import VueRouter from "vue-router";

import Articles from "../views/Articles.vue";
import ArticleDetails from "../views/ArticleDetails.vue";
import PageNotFound from "../components/PageNotFound.vue";
import NoArticleFound from "../components/NoArticleFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Articles
  },
  {
    path: "/404",
    name: "404",
    component: PageNotFound
  },
  {
    path: "",
    name: "doesNotExist",
    component: NoArticleFound
  },
  {
    path: "/articles/:id",
    name: "article",
    props: true,
    component: ArticleDetails
  },
  {
    path: "*",
    redirect: "/404"
  }
];

const router = new VueRouter({
  routes
});

export default router;