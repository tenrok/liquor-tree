import TreeRoot from '@/components/TreeRoot.vue';

const install = (Vue) => {
  Vue.component(TreeRoot.name, TreeRoot);
};

TreeRoot.install = install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(TreeRoot);
}

export default TreeRoot;
