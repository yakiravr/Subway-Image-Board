(function () {
    Vue.component("modal-image", {
        template: "#modal-image-template",
        data: function () {
            return {
                count: 0,
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
        methods: {
            notifyParentToDoSth: function () {
                this.$emit("close_model");
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
            openimg: null,
            id: this.openimg,
        },
        mounted: function () {
            var self = this;
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
        },
    });
})();
