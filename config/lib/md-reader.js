const marked = require('marked');
const yaml = require('js-yaml');

/**
 * base package: marked
 */
exports.marked = {
    /**
     * Markdown => HTML
     */
    "markup": (md) => {
        return {
            "content": marked.parse(md.substring(md.match(/^---[\s\S]*?---/)[0].length)),
            "meta": yaml.load(md.match(/^---[\s\S]*?---/)[0].substring(3, md.match(/^---[\s\S]*?---/)[0].length - 3))
        }
    },"markdown": (html) => {
        return undefined;
    },
}