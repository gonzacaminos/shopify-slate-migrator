const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../../');
const config = {
    path: {
        root: root,
        shopify: path.join(root, './shopify'),
        scripts: path.join(root, './src/scripts')
    },
    layouts_dir: path.join(root, './src/scripts/layout'),
    templates_dir: path.join(root, './src/scripts/templates'),
    customer_templates_dir:  path.join(root, './src/scripts/templates/customers')
}

const getFilesInDir = (dir, suffix = "template.", replace = "") => fs.readdirSync(dir).filter((file) => { return file.indexOf(".js") >-1 } ).reduce((acc, v) => ({ ...acc, [suffix + v.replace(replace, "")]: path.resolve(__dirname, `${dir}/${v}`) }), {});

module.exports = {
    config: {
        ...config,
        entry: {
            ...getFilesInDir(config.layouts_dir, "layout.", ".js"),
            ...getFilesInDir(config.templates_dir, "template.", ".js"),
            ...getFilesInDir(config.customer_templates_dir, "template.", ".js"),
        },
    },
    getFilesInDir: getFilesInDir,
    htmlPlugin: {
        excludeChunks: ['static'],
        inject: false,
        isDevServer: true,
        liquidTemplates: { ...getFilesInDir(config.templates_dir, "template.", ".js"), ...getFilesInDir(config.customer_templates_dir, "template.", ".js") },
        liquidLayouts:  getFilesInDir(config.layouts_dir, "layout.", ".js")
      }
}
