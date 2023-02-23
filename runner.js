try {
    const path = require('path');
    const fs = require('fs');
    const { marked } = require("./config/lib/md-reader.js");

    const config = JSON.parse(fs.readFileSync("./config/config.json", {encoding: 'utf-8'}));

    const template = fs.readFileSync(config.design.template, {encoding: 'utf-8'});

    fs.mkdirSync("public");

    fs.readdirSync("./pages", {withFileTypes: true})
        .filter(dirent => dirent.isFile()).map(({name}) => name)
        .filter(file => file.toLowerCase().endsWith(".md"))
        .forEach(page => {
            const name = page.split("/")[page.split("/").length - 1].substring(0, page.split("/")[page.split("/").length - 1].length - 3);
            if (name == "articles") throw new Error("You must not use name: Articles");
            const data = marked.markup(fs.readFileSync(page, {encoding: 'utf-8'}));

            let cache = template;

            [
                ["title", `${data.meta.title} | ${config.title}`],
                ["lang", config.lang],
                ["description", data.meta.description],
                ["content", data.content]
            ].forEach(q => {
                cache = cache.replace(`%${q[2]}%`, q[1]);
            })

            fs.mkdirSync(`public/${name}`);
            // get file name exclude: extension name
            fs.writeFileSync(`public/${name}/index.html`, cache);
        })

} catch(e) {
    console.error(e);
}