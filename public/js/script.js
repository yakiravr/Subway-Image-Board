console.log("my script file not class one");

new Vue({
    el: "#main",
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
    },
    mounted: function () {
        var self = this;
        axios
            .get("/images")
            .then(function (response) {
                self.images = response.data;
            })
            .catch(function (err) {
                console.log("Error in fetching images:", err);
            });
    },
    methods: {
        handleClick: function () {
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("file", this.file);
            console.log("title is:", this.title);
            console.log("username is:", this.username);
            axios
                .post("/upload", formData)
                .then((response) => {
                    this.images.unshift(response.data.addImage);
                })
                .catch((err) => {
                    console.log("error from POST req is: ", err);
                });
        },
        handleChange: function (e) {
            console.log("handle change is runnign");
            this.file = e.target.files[0];
        },
    },
});
