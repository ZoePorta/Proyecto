import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vueHeadful from "vue-headful";
import dotenv from "dotenv";
import { ImageRating } from "vue-rate-it";

dotenv.config();

Vue.component("vue-headful", vueHeadful);
Vue.component("image-rating", ImageRating);

/* Add auth header */
import axios from "axios";

import { isLoggedIn, getAuthToken } from "./api/utils";

if (isLoggedIn()) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;
}

/* /Add auth header */

/* Font awesome icons */
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faShoppingCart,
  faHeart,
  faUser,
  faTrashAlt,
  faShare,
  faPencilAlt,
  faPlus,
  faQuestionCircle,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faShoppingCart,
  faHeart,
  faUser,
  faTrashAlt,
  faShare,
  faPencilAlt,
  faPlus,
  faStore,
  faQuestionCircle,
  faInstagram,
  faFacebook,
  faTwitter
);

Vue.component("font-awesome-icon", FontAwesomeIcon);
/* /Font awesome icons */

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
