<template>
  <div class="articles">
    <div class="is-flex is-justify-content-center mt-4">
      <button class="button is-success is-small is-uppercase" @click="openAddModal">New Article</button>
    </div>
    <div v-if="articlesList.length == 0">
      <div v-if="this.showNoArticlesNotification" class="columns">
        <div class="notification is-danger is-light mx-auto mt-6 mb-6">
          <button class="delete" @click="closeNotification"></button>
          Currently there are <strong>NO</strong> articles.
        </div>
      </div>
    </div>
    <div v-else class="is-flex is-justify-content-center">
      <div v-for="article in articlesList">
        <Article :key="article.id" :id="article.id" :title="article.title"
          :body="article.body" :author="article.author"
          :created_at="new Date(article.created_at)"
          :updated_at="new Date(article.updated_at)"
          @onEditClick="handleOnEditClick"
          @onRemoveClick="handleOnRemoveClick">
        </Article>
      </div>
    </div>
    <NewArticleModal v-if="this.showAddModal" @onModalClose="closeAddModal" @afterAdd="handleAfterAdd"></NewArticleModal>
    <EditArticleModal v-if="this.showEditModal" :id="this.articlesId" @onModalClose="closeEditModal" @afterEdit="handleAfterEdit"></EditArticleModal>
    <!-- searchbar -->
    <div v-if="this.showEditModal == false && this.showAddModal == false
         && this.showConfirmationAlert == false && this.showInfo == false"
         class="is-flex is-justify-content-center mt-4"
        >
      <div class="control has-icons-left">
        <input class="input" type="text" placeholder="Search..." v-model="searchInput">
        <span class="icon is-small is-left">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
        </span>
      </div>
    </div>
    <Pagination v-if="this.showEditModal == false && this.showAddModal == false
                && this.showConfirmationAlert == false"
                @onPageChange="handlePageChange" :total-pages="this.totalPages"
              ></Pagination>
    <InformationMessage v-if="this.showInfo" :information-type="this.infoType" :message="this.message" @onCloseAlert="handleOnCloseAlert"></InformationMessage>
    <div v-if="this.showConfirmationAlert" class="modal-background">
        <div class="action-confirmation is-flex is-justify-content-center mt-4">
            <div class="notification is-danger is-light">
                <p>Are you sure you want to <strong>{{ actionType }}</strong> this article?</p>
                <div class="buttons is-flex is-justify-content-center">
                    <button class="button is-success is-small is-uppercase mt-2" @click="removeArticle(articlesId)">Yes</button>
                    <button class="button is-danger is-small is-uppercase mt-2" @click="closeConfirmationWindow">No</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import Article from "../components/Article.vue";
import Pagination from "../components/Pagination.vue";
import NewArticleModal from "../components/NewArticleModal.vue";
import EditArticleModal from "../components/EditArticleModal.vue";
import InformationMessage from "../components/InformationMessage.vue";

export default {
  name: "Articles",
  components: {
    Article,
    Pagination,
    NewArticleModal,
    EditArticleModal,
    InformationMessage
  },

  data() {
    return {
      articlesList: [],
      authorsList: [],
      articlesPerPage: 3,
      totalPages: 0,
      showEditModal: false,
      showAddModal: false,
      showNoArticlesNotification: true,
      showConfirmationAlert: false,
      articlesId: 0,
      searchInput: "",
      actionType: "",

      showInfo: false,
      message: "",
      infoType: ""
    }
  },

  watch: {
    async searchInput() {
      this.getArticlesList();
    }
  },

  methods: {
    async getArticlesList(page) {
      let currentPage = page < 0 || !page ? 1 : page;
      //const response = await this.$http.get("http://localhost:3000/articles?_page=" + currentPage + "&_limit=" + this.articlesPerPage);
      const response = await this.$http.get("http://localhost:3000/articles?q=" + this.searchInput + "&_page=" + currentPage + "&_limit=" + this.articlesPerPage);
      this.totalPages = parseInt(Math.ceil(response.headers['x-total-count'] / this.articlesPerPage));
      this.articlesList = response.data;
    },

    async getAuthorsList() {
      const response = await this.$http.get("http://localhost:3000/authors");
      this.authorsList = response.data;
    },

    async removeArticle(index) {
      try {
        await this.$http.delete("http://localhost:3000/articles/" + index);
        this.showConfirmationAlert = false;
        this.showInfo = true;
        this.infoType = "Success";
        this.message = "Your action was successful!";
      } catch (error) {
        this.showConfirmationAlert = false;
        this.showInfo = true;
        this.infoType = "Failure";
        this.message = "Your action failed."
      }
    },

    handlePageChange(page) {
      this.getArticlesList(page);
    },

    handleOnEditClick(index) {
      this.showEditModal = true;
      this.articlesId = index;
    },

    handleOnRemoveClick(index) {
      this.showConfirmationAlert = true;
      this.actionType = "remove";
      this.articlesId = index;
    },

    handleOnCloseAlert() {
      this.showInfo = false;
      this.$router.go();
    },

    handleAfterAdd(value) {
      this.showInfo = true;
      this.infoType = value;
      if (value == 'Success') {
        this.message = "Your action was successful.";
      } else {
        this.message = "Your action failed.";
      }
    },

    handleAfterEdit(value) {
      this.showInfo = true;
      this.infoType = value;
      if (value == 'Success') {
        this.message = "Your action was successful.";
      } else {
        this.message = "Your action failed.";
      }
    },

    openAddModal() {
      this.showAddModal = true;
    },

    closeAddModal() {
      this.showAddModal = false;
    },

    closeEditModal() {
      this.showEditModal = false;
    },

    closeNotification() {
      this.showNoArticlesNotification = false;
    },

    closeConfirmationWindow() {
      this.showConfirmationAlert = false;
    }
  },

  created() {
    this.getArticlesList(1);
  }
};
</script>