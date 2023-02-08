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
          <button class="button is-warning is-small is-uppercase mr-2 mt-2" @click="openEditModal">Edit</button>
          <button class="button is-danger is-small is-uppercase mt-2" @click="handleOnRemoveClick">Remove</button>
        </article>
      </div>
    </div>
    <InformationMessage v-if="this.showInfo" :information-type="this.infoType" :message="this.message" @onCloseAlert="handleOnCloseAlert"></InformationMessage>
    <EditArticleModal v-if="this.showEditModal" :id="this.id" @onModalClose="closeEditModal" @afterEdit="handleAfterEdit"></EditArticleModal>
    <div v-if="this.showConfirmationAlert" class="modal-background">
        <div class="action-confirmation is-flex is-justify-content-center mt-4">
            <div class="notification is-danger is-light">
                <p>Are you sure you want to <strong>{{ actionType }}</strong> this article?</p>
                <div class="buttons is-flex is-justify-content-center">
                    <button class="button is-success is-small is-uppercase mt-2" @click="removeArticle">Yes</button>
                    <button class="button is-danger is-small is-uppercase mt-2" @click="closeConfirmationWindow">No</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import EditArticleModal from "../components/EditArticleModal.vue";
import InformationMessage from "../components/InformationMessage.vue";

export default {
    name: "ArticleDetails",
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
            authorsList: [],

            showEditModal: false,
            showConfirmationAlert: false,
            showInfo: false,
            actionType: "",
            message: "",
            infoType: ""
        }
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
        try {
          const response = await this.$http.get("http://localhost:3000/articles/" + this.id);
          this.title = response.data.title;
          this.body = response.data.body;
          this.authorsId = response.data.author;
          this.createdDate = response.data.created_at;
          this.updatedDate = response.data.updated_at;
          this.getAuthorsList();
        } catch (error) {
          this.$router.push({ name: 'doesNotExist' });
        }
      },

      async getAuthorsList() {
        const response = await this.$http.get("http://localhost:3000/authors");
        this.authorsList = response.data;

        for (let i = 0; i < this.authorsList.length; i++) {
          if (this.authorsList[i].id == this.authorsId) {
            this.authorsName = this.authorsList[i].name;
          }
        }
      },

      async removeArticle() {
        try {
          await this.$http.delete("http://localhost:3000/articles/" + this.id);
          this.showConfirmationAlert = false;
          this.showInfo = true;
          this.infoType = "Success";
          this.message = "Your action was successful!";
        } catch (error) {
          this.showConfirmationAlert = false;
          this.showInfo = true;
          this.infoType = "Failure";
          this.message = "Your action failed.";
        }
      },

      openEditModal() {
        this.showEditModal = true;
      },

      closeEditModal() {
        this.showEditModal = false;
      },

      handleOnRemoveClick() {
        this.showConfirmationAlert = true;
        this.actionType = "remove";
      },

      handleOnCloseAlert() {
        this.showInfo = false;
        this.$router.push({ name: 'home' });
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

      closeConfirmationWindow() {
        this.showConfirmationAlert = false;
      }
  },
  
  created() {
    this.getArticleData();
  }
}
</script>