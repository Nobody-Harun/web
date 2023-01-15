// null = default
const config = {
    "loadType": "",
    "spaceArg": [
        {
            name: "%SiteTitle%", content: ""
        },
    ],
    // 変更を加えても意味なし
    // "pathname": {
    //     "post": "posts/%parameter%",
    //     "paged": "%pagedNumber%",
    //     "page": "%parameter%"
    // },
    "maxPosts": 9
}

/**
 * main script for create website.
 * @author "github.com/Nobody-Harun"
 */

/**
 * Call Website Resources
 */
class Resource {
    /**
     * @returns {object}
     */
    constructor() {
        return {
            "posts": this.posts(),
        }
    }
    /**
     * return post data
     * @returns {object | Array}
     */
    get posts() {
        const res = fetch("/posts/data.jsonc");
        const data = res.json();
        return data;
    }
    /**
     * return Website Widget Data
     * @returns {object | Array}
     */
    get Widgets() {
        let cache = document.documentElement.innerHTML;
        config.spaceArg.forEach(data => {
            cache = cache.replaceAll(data.name, data.content);
        })
        document.documentElement.innerHTML = cache;
    }
}

/**
 * Run App(WebSite Resources). if run this, Load & Write at in Element: "#container"
 * 
 */
class App extends Resource {
    constructor() {
        // Start Setup
        this.requestView();
    }
    requestView() {
        this.InstantDB = super();
        if (this.InstantDB == (null || undefined || "")) return console.error("couldn't requestView: null of this.InstantDB");

        // post
        if (location.pathname.startsWith("post")) {
            var check = false;
            this.InstantDB.posts.forEach(data => {
                if (data.parameter == location.pathname.split("/")[1]) {
                    check = true;
                    fetch(`/posts/sources/${data.parameter}`)
                        .then(res => res.text)

                }
            })
            if (!(check)) {
                console.error("[App] 404 Error: Not Found Page");
            }
        } else if (typeof location.pathname == "number") {
            this.InstantDB.posts.slice(9)
        } else {

        }

        // Rewrite SpaceArg
        super.Widgets();
    }
}

// on Startupped(DOMContentLoaded)
window.addEventListener("DOMContentLoaded", () => {
    const app = new App(config.loadType);

    document.title = "%SiteTitle%";
    app.requestView();
})