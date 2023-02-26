try {
    const path = require('path');
    const fs = require('fs');
    const marked = require('marked');
    const yaml = require('js-yaml');

    const config = JSON.parse(fs.readFileSync("./config/config.json", {encoding: 'utf-8'}));

    const template = fs.readFileSync(`./config/${config.design.template}`, {encoding: 'utf-8'});

    // Github Pages / [Create] Path: ./public
    fs.mkdirSync("public");

    //#region MainPages
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
                cache = cache.replace(`%${q[0]}%`, q[1]);
            })

            if (name == "index") {
                fs.writeFileSync(`public/index.html`, `${cache}`);
            } else {
                fs.mkdirSync(`public/${name}`);
                // get file name exclude: extension name
                fs.writeFileSync(`public/${name}/index.html`, `${cache}`);
            }
        })
    //#endregion MainPages

    //#region Articles
    fs.mkdirSync(`public/articles`);

    let list = fs.readdirSync("./pages/articles", {withFileTypes: true})
        .filter(dirent => dirent.isFile()).map(({name}) => name)
        .filter(file => file.toLowerCase().endsWith(".md"))
        .map(filename => {
            const md = fs.readFileSync(`./pages/articles/${filename}`, {encoding: 'utf-8'});
            const info = fs.statSync(`./pages/articles/${filename}`);
            return {
              "filename": filename,
              "timestamp": info.birthtime,
              "updated": info.ctime,
              "meta": yaml.load(md.match(/^---[\s\S]*?---/)[0].substring(3, md.match(/^---[\s\S]*?---/)[0].length - 3))
            }
        });

    list.sort((a, b) => b.timestamp - a.timestamp);

    list.forEach((q, index) => {
        const page = q.filename;
        const name = page.split("/")[page.split("/").length - 1].substring(0, page.split("/")[page.split("/").length - 1].length - 3);

        const md = fs.readFileSync(`./pages/articles/${page}`, {encoding: 'utf-8'});
        
        const data = {
            "content": q.meta,
            "meta": yaml.load(md.match(/^---[\s\S]*?---/)[0].substring(3, md.match(/^---[\s\S]*?---/)[0].length - 3))
        }

        let cache = template;

        [
            ["title", `${data.meta.title} | ${config.title}`],
            ["lang", config.lang],
            ["description", data.meta.description],
            ["content", data.content]
        ].forEach(q => {
            cache = cache.replace(`%${q[0]}%`, q[1]);
        })

        list[index].filename = name;

        fs.mkdirSync(`public/articles/${name}`);
        // get file name exclude: extension name
        fs.writeFileSync(`public/articles/${name}/index.html`, `${cache}`);
    })
    // Testing
    fs.writeFileSync(`public/articles/index.html`, `${JSON.stringify(list)}`);

    //#endregion Articles

} catch(e) {
    console.error(e);
}