# Shopify Slate Migrator

Migrate your Shopify theme away from Slate.

## Requirements

1. Node v.18+

2. [Yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) or [npm](https://www.npmjs.com/get-npm) 5+

3. [Shopify CLI](https://shopify.dev/docs/themes/tools/cli/install)

## Setup

### Install requirements

1. Install Node.js v18+, use [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
        

2. Install Yarn 

    `npm i -g yarn`


3. Install [Shopify CLI](https://shopify.dev/docs/themes/tools/cli/install) 


## Project structure

This theme was a legacy Slate starter-theme that I migrated into newer standards using Shopify CLI and Online Store 2.0.

### 📁 .config:

Webpack config, bundles scripts, styles under `shopify/assets`. Generates `script-tags.liquid` and `style-tags.liquid` containing all the  script and style tags for the site based on templates and layouts.

Webpack will scan the `src/scripts/templates` and  `src/scripts/layouts` only on **start**, if you add a new template you need to restart the server.


### 📁 shopify:

Contains the regular Shopify theme folders and files, the main difference with other themes are:
- `assets` gets bundled scripts and styles ending in `.dist`. Webpack removes all those files before generating new, both on `dev` and `build`.
- `snippets` gets `script-tags.liquid` and `style-tags.liquid` containing all the  script and style tags for the site based on templates and layouts.

Shopify CLI watches this directory and updates the preview accordingly. 

### 📁 src:

Contains scripts and styles for the theme.

### -- 📂 src/scripts:

Most of the scripts where being used with Slate tools so there are still present all standards like `shopify/sections` to load some scripts and functions. These will remain in place until refactored.

### ---- 📂 src/scripts/templates:

Each template will generate a `template.[name].dist.js` on assets, when adding a new template you will have to restart the server. These are automatically included on the theme via `script-tags.liquid`

### -- 📂 src/styles:

Contains styles for the theme. To split your code import your SASS stylesheet on each JS template like: 

`import '@/styles/templates/product.scss'`

**Avoid at all costs importing not global styles into theme.scss**

## Migration Process

The process will vary from project to project but follow the steps below and adjust if necessary:

### Javascript files

Assuming you're coming from a Slate project your source Javascript files should be located in `src/scripts`
- Copy your Slate scripts (`src/scripts`) into this project's `src/scripts` folder.
- Javascript files located on your `assets` folder don't need to be migrated since they're 'production-ready'

### CSS files

This project uses SASS, if you were not using it with Slate feel free to remove it from the project.
- Copy your source css files into `src/styles`, the structure of the folder is up to you but make sure your global `theme` file is imported in `src/scripts/layout.js` so the CSS file will be generated and included in `style-tags.liquid`.

### Shopify files

- Copy your **assets**, **config**, **layout**, **locales**, **sections**, **snippets** and **templates** into the `shopify` folder, empty folders were placed for reference.
- On your layouts (`theme.liquid`) include: `script-tags.liquid` and `style-tags.liquid` if they're not present, coming from Slate they'll most likely be there.

### Dependencies and package.json

- Copy your **dependencies** only into `package.json`, the **dev_dependencies** were cleaned and optimized to make this migration tool work, if you want to replace them do it at your own risk.
- Depending on how your old theme was built you might or might not need the `@shopify/*` theme packages, feel free to remove them if your theme isn't using them.
- If you need to check Slate's starter theme (https://github.com/Shopify/starter-theme) for the initial structure of a Slate project. 

## Start developing

To begin developing with Shopify CLI, copy and rename `example.shopify.theme.toml` to `shopify.theme.toml`.

You need to replace your development theme ID on the `theme` line, if you don't know it run

`shopify theme list`

Look for `[development] [yours]` next to your theme, copy and paste the ID number without the `#`.

Once you're done run: 

`yart start`

You will be prompted to login with your partners account.

#### build

Builds a production-ready version of the theme by compiling the files into the `shopify/assets` folder.

`yarn webpack:build`

You don't really need to do this first as `deploy` already does this for you.

#### deploy 

Uploads the dist folder to the Shopify store.

`yarn deploy` (choose the theme you want to deploy to) or `yarn deploy:new` if you want to create a new theme.
