try {
    const path = require('path');
    const fs = require('fs');
    const marked = require('marked');
    const yaml = require('js-yaml');

    const config = JSON.parse(fs.readFileSync("./config/config.json", {encoding: 'utf-8'}));

    const template = fs.readFileSync(`./config/${config.design.template}`, {encoding: 'utf-8'});

    fs.mkdirSync("public");

    fs.readdirSync("./pages", {withFileTypes: true})
        .filter(dirent => dirent.isFile()).map(({name}) => name)
        .filter(file => file.toLowerCase().endsWith(".md"))
        .forEach(page => {
            console.log(page);
            const name = page.split("/")[page.split("/").length - 1].substring(0, page.split("/")[page.split("/").length - 1].length - 3);
            if (name == "articles") throw new Error("You must not use name: Articles");

            const md = fs.readFileSync(`./pages/${page}`, {encoding: 'utf-8'});

            const data = {
                "content": marked.parse(md.substring(md.match(/^---[\s\S]*?---/)[0].length)),
                "meta": yaml.load(md.match(/^---[\s\S]*?---/)[0].substring(3, md.match(/^---[\s\S]*?---/)[0].length - 3))
            }

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
            console.log(cache);
            fs.writeFileSync(`public/${name}/index.html`, cache);
        })

} catch(e) {
    console.error(e);
}