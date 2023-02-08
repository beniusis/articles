<template>
    <div class="modal-background">
        <div class="no-article-found is-flex is-justify-content-center mt-6">
            <article class="message is-warning">
                <div class="message-header">
                    <p>Warning</p>
                    <button class="delete" aria-label="delete" @click="backToHomePage"></button>
                </div>
                <div class="message-body">
                    Sorry but this article <strong>does not exist!</strong>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
export default {
    name: "NoArticleFound",

    methods: {
        backToHomePage() {
            this.$router.push({ name: 'home' });
        }
    }
};
</script>