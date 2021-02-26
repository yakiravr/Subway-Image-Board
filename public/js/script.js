console.log("sanity????");

new Vue({
    el: "#main",
    data: {
        //name: "Gallery",
        //seen: true,
        images: [],
    },
    mounted: function () {
        var self = this;
        axios
            .get("/images")
            .then(function (response) {
                self.images = response.data;
            })
            .catch(function (err) {
                console.log("error in axios", err);
            });
    },
    methods: {
        //handleClick: function (image) {
        //    console.log("handleClick running!!", image);
        //  this.seen = !this.seen;
        // },
    },
});
