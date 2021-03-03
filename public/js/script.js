(function () {
    Vue.component("modal-image", {
        template: "#modal-image-template",
        data: function () {
            return {
                url: "",
                title: "",
                description: "",
                username: "",
                file: null,
            };
        },
        props: ["imageId"],
        mounted: function () {
            var self = this;
            axios
                .get("/closeImage/" + this.imageId)
                .then(function (response) {
                    self.title = response.data.image.title;
                    self.description = response.data.image.description;
                    self.username = response.data.image.username;
                    self.url = response.data.image.url;
                    self.created_at = response.data.image.created_at;
                })
                .catch(function (err) {
                    console.log("error in axios", err);
                });
        },
        watch: {
            imageId: function () {
                console.log("watch id");
                var self = this;
                axios
                    .get("/closeImage/" + this.imageId)
                    .then(function (response) {
                        self.title = response.data.image.title;
                        self.description = response.data.image.description;
                        self.username = response.data.image.username;
                        self.url = response.data.image.url;
                        self.created_at = response.data.image.created_at;
                    })
                    .catch(function (err) {
                        console.log("error in axios watch", err);
                        self.$emit("close_model");
                    });
            },
        },
        methods: {
            notifyParentToDoSth: function () {
                this.$emit("close_model");
            },
        },
    });

    Vue.component("modal-comments", {
        template: "#modal-comments-template",
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
            };
        },
        props: ["imageId"],
        mounted: function () {
            console.log("this.imageId mounted:", this.imageId);

            var self = this;
            axios
                .get("/get-comments/" + this.imageId)
                .then(function (response) {
                    self.comments = response.data.sort((a, b) => {
                        return new Date(b.created_at) - new Date(a.created_at);
                    });
                })
                .catch(function (err) {
                    console.log("error in get comments:", err);
                });
        },

        watch: {
            imageId: function () {
                console.log("watch id");
                var self = this;
                axios
                    .get("/get-comments/" + self.imageId)
                    .then(function (response) {
                        self.comments = response.data.sort((a, b) => {
                            return (
                                new Date(b.created_at) - new Date(a.created_at)
                            );
                        });
                    })
                    .catch(function (err) {
                        console.log("error in get comments watch:", err);
                    });
            },
        },
        methods: {
            addComment: function () {
                console.log("imageId in comment:", this.imageId);
                var self = this;
                var commentObj = {
                    username: this.username,
                    comment: this.comment,
                    image_id: this.imageId,
                };
                axios
                    .post("/post-comments/", commentObj)
                    .then(function (response) {
                        self.username = response.username;
                        self.comment = response.comment;
                        self.comments.unshift(response.data);
                    })
                    .catch(function (err) {
                        console.log("error in post comments:", err.message);
                    });
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            openimg: location.hash.slice(1),
            lastImg: null,
        },
        mounted: function () {
            var self = this;
            window.addEventListener("hashchange", function () {
                self.imageId = location.hash.slice(1);
                self.openimg = self.imageId;
            });
            axios
                .get("/images")
                .then(function (response) {
                    self.images = response.data.sort((a, b) => {
                        return new Date(b.created_at) - new Date(a.created_at);
                    });
                })
                .catch(function (err) {
                    console.log("error in axios", err);
                });
        },
        methods: {
            clickOnImage: function (image_id) {
                this.openimg = image_id;
            },
            closeComponent: function () {
                this.openimg = null;
                history.pushState({}, "#", "/");
                //window.history.pushState({}, "", url);
            },

            handleChange: function (e) {
                this.file = e.target.files[0];
            },
            handleClick: function () {
                var self = this;
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                axios
                    .post("/upload", formData)

                    .then(function (response) {
                        console.log(" err in response.data", response.data);

                        self.images.unshift(response.data.image);
                    })
                    .catch((err) => {
                        console.log("error in post req", err);
                    });
            },
            getMoreImages: function () {
                const lastId = this.images[this.images.length - 1].id;
                var self = this;
                axios.get("/more/" + lastId).then((response) => {
                    self.images.push(...response.data);

                    console.log(self.images);
                    if (
                        self.images[self.images.length - 1].id ==
                        response.data[0].lastId
                    ) {
                        self.lastImg = true;
                    }
                });
            },
        },
    });
})();
