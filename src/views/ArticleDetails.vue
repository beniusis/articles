<template>
  <div class="article-details">
    <div class="tile is-ancestor">
      <div class="tile is-parent m-6">
        <article class="tile is-child box">
          <p class="title">{{ title }}</p>
          <p class="subtitle">{{ this.authorsName }}</p>
          <div class="content">
            <p>{{ body }}</p>
          </div>
          <footer>{{ convertedDate }}</footer>
          <button
            class="button is-warning is-small is-uppercase mr-2 mt-2"
            @click="openEditModal"
          >
            Edit
          </button>
          <button
            class="button is-danger is-small is-uppercase mt-2"
            @click="handleOnRemoveClick"
          >
            Remove
          </button>
        </article>
      </div>
    </div>
    <InformationMessage
      v-if="this.showInfo"
      :information-type="this.infoType"
      :message="this.message"
      @onCloseAlert="handleOnCloseAlert"
    ></InformationMessage>
    <EditArticleModal
      v-if="this.showEditModal"
      :id="this.id"
      @onModalClose="closeEditModal"
      @afterEdit="handleAfterEdit"
    ></EditArticleModal>
    <div v-if="this.showConfirmationAlert" class="modal-background">
      <div class="action-confirmation is-flex is-justify-content-center mt-4">
        <div class="notification is-danger is-light">
          <p>Are you sure you want to <strong>remove</strong> this article?</p>
          <div class="buttons is-flex is-justify-content-center">
            <button
              class="button is-success is-small is-uppercase mt-2"
              @click="removeArticle(id)"
            >
              Yes
            </button>
            <button
              class="button is-danger is-small is-uppercase mt-2"
              @click="closeConfirmationWindow"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditArticleModal from "../components/EditArticleModal.vue";
import InformationMessage from "../components/InformationMessage.vue";
import { modalsMixin } from "../mixins/modalsMixin.js";

export default {
  name: "ArticleDetails",
  mixins: [modalsMixin],
  components: {
    EditArticleModal,
    InformationMessage
  },

  data() {
    return {
      id: this.$route.params.id,
      title: "",
      body: "",
      authorsId: Number,
      authorsName: String,
      createdDate: Date,
      updatedDate: Date,
      authorsList: []
    };
  },

  computed: {
    convertedDate() {
      let created = new Date(this.createdDate);
      let updated = new Date(this.updatedDate);

      if (created.getTime() > updated.getTime()) {
        return created.toLocaleString("lt-LT");
      } else {
        return updated.toLocaleString("lt-LT");
      }
    }
  },

  methods: {
    async getArticleData() {
      const articleData = await this.$requests.getArticle(this.id);
      this.title = articleData.title;
      this.body = articleData.body;
      this.authorsId = articleData.author;
      this.createdDate = articleData.created_at;
      this.updatedDate = articleData.updated_at;
      this.getAuthorsList();
    },

    async getAuthorsList() {
      this.authorsList = await this.$requests.getAuthors();

      for (let i = 0; i < this.authorsList.length; i++) {
        if (this.authorsList[i].id == this.authorsId) {
          this.authorsName = this.authorsList[i].name;
        }
      }
    },

    handleOnRemoveClick() {
      this.showConfirmationAlert = true;
    },

    handleOnCloseAlert() {
      this.showInfo = false;
      this.$router.push({ name: "home" });
    }
  },

  created() {
    this.getArticleData();
  }
};
</script>
