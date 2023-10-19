# Liquor Tree

[![Version](https://img.shields.io/npm/v/@tenrok/liquor-tree.svg)](https://www.npmjs.com/package/@tenrok/liquor-tree)
[![License](https://img.shields.io/npm/l/@tenrok/liquor-tree.svg)](https://github.com/tenrok/liquor-tree/blob/main/LICENSE)
[![Vue.js](https://img.shields.io/badge/vue-2.7.14-brightgreen.svg?logo=vue.js)](https://github.com/vuejs/vue)
[![GitHub last commit](https://img.shields.io/github/last-commit/tenrok/liquor-tree.svg)](https://github.com/tenrok/liquor-tree)
[![Downloads](https://img.shields.io/npm/dm/@tenrok/liquor-tree.svg)](https://npmcharts.com/compare/@tenrok/liquor-tree?minimal=true)

A Vue tree component that allows you to present hierarchically organized data in a nice and logical manner.

[documentation](https://amsik.github.io/liquor-tree/) | [demos](https://amsik.github.io/liquor-tree/#Examples)

## Features
* drag&drop
* mobile friendly
* events for every action
* flexible configuration
* any number of instances per page
* multi selection
* keyboard navigation
* filtering
* sorting
* integration with Vuex

## Installation
**Npm:**

```shell
$ npm install @tenrok/liquor-tree
```

**Yarn:**

```shell
$ yarn add @tenrok/liquor-tree
```

## Live Playground

To run that demo on your own computer:

* Clone this repository
* `npm install`
* `npm run build` 
* `npm run storybook` 
* Visit `http://localhost:9001/`

There are a lot of examples for you. All sources of stories are located in `liquor-tree/docs/storybook/stories`.

## Usage

```html
  <!-- Vue Component -->
  <template>
    <liquor-tree
      :data="items"
      :options="options"
      ref="tree"
    />
  </template>

  <script>
    const LiquorTree = () => import('@tenrok/liquor-tree')

    export default {
      components: {
        LiquorTree
      },

      data() {
        return {
          items: [
            {text: 'Item 1'},
            {text: 'Item 2'},
            {text: 'Item 3', children: [
              {text: 'Item 3.1'},
              {text: 'Item 3.2'}
            ]}
          ],
          options: {
            checkbox: true
          }
        }
      }
      ...
    }
  </script>
```

## Development

Check out the `package.json`s script section. There are 2 scripts:

- `npm run dev` - it will open browser and you can *play* with code
- `npm run build` - it will craete a module file in `production` mode 


## License

[MIT](https://opensource.org/licenses/MIT)
