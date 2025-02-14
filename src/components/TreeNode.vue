<template>
  <li role="treeitem" class="tree-node" :data-id="node.id" :class="nodeClass" @mousedown.stop="handleMouseDown">
    <div class="tree-content" :style="[options.direction == 'ltr' ? { 'padding-left': padding } : { 'padding-right': padding }]" @click.stop="select">
      <i class="tree-arrow" :class="[{ expanded: node.states.expanded, 'has-child': node.children.length || node.isBatch }, options.direction]" @click.stop="toggleExpand" />

      <i v-if="options.checkbox" class="tree-checkbox" :class="{ checked: node.states.checked, indeterminate: node.states.indeterminate }" @click.stop="check" />

      <span ref="anchor" class="tree-anchor" tabindex="-1" @focus="onNodeFocus" @dblclick="tree.$emit('node:dblclick', node)">
        <node-content :node="node" />
      </span>
    </div>

    <transition name="tree-fade">
      <ul v-if="hasChildren() && node.states.expanded" class="tree-children">
        <node v-for="child in visibleChildren" :key="child.id" :node="child" :options="options" />
      </ul>
    </transition>
  </li>
</template>

<script>
  import NodeContent from '@/components/NodeContent.vue';

  export default {
    name: 'Node',

    components: {
      NodeContent,
    },

    inject: ['tree'],

    props: ['node', 'options'],

    data() {
      this.node.vm = this;

      return {
        loading: false,
      };
    },

    computed: {
      padding() {
        return this.node.depth * (this.options.paddingLeft ? this.options.paddingLeft : this.options.nodeIndent) + 'px';
      },

      nodeClass() {
        const state = this.node.states;
        const hasChildren = this.hasChildren();
        const classes = {
          'has-child': hasChildren,
          expanded: hasChildren && state.expanded,
          selected: state.selected,
          disabled: state.disabled,
          matched: state.matched,
          dragging: state.dragging,
          loading: this.loading,
          draggable: state.draggable,
        };

        if (this.options.checkbox) {
          classes['checked'] = state.checked;
          classes['indeterminate'] = state.indeterminate;
        }

        return classes;
      },

      visibleChildren() {
        return this.node.children.filter((child) => child && child.visible());
      },
    },

    watch: {
      node() {
        this.node.vm = this;
      },
    },

    methods: {
      onNodeFocus() {
        this.tree.activeElement = this.node;
      },

      focus() {
        this.$refs.anchor.focus();
        this.node.select();
      },

      check() {
        if (this.node.checked()) {
          this.node.uncheck();
        } else {
          this.node.check();
        }
      },

      select(evnt) {
        const { ctrlKey } = evnt;
        const opts = this.options;
        const tree = this.tree;
        const node = this.node;

        tree.$emit('node:clicked', node);

        if (opts.editing && node.isEditing) {
          return;
        }

        if (opts.editing && node.editable()) {
          return this.startEditing();
        }

        if (opts.checkbox && opts.checkOnSelect) {
          if (!opts.parentSelect && this.hasChildren()) {
            return this.toggleExpand();
          }

          return this.check(ctrlKey);
        }

        // 'parentSelect' behaviour.
        // For nodes which has a children list we have to expand/collapse
        if (!opts.parentSelect && this.hasChildren()) {
          this.toggleExpand();
        }

        if (opts.multiple) {
          if (!node.selected()) {
            node.select(ctrlKey);
          } else {
            if (ctrlKey) {
              node.unselect();
            } else {
              if (this.tree.selectedNodes.length != 1) {
                tree.unselectAll();
                node.select();
              }
            }
          }
        } else {
          if (node.selected() && ctrlKey) {
            node.unselect();
          } else {
            node.select();
          }
        }
      },

      toggleExpand() {
        if (this.hasChildren()) {
          this.node.toggleExpand();
        }
      },

      hasChildren() {
        return this.node.hasChildren();
      },

      startEditing() {
        if (this.tree._editingNode) {
          this.tree._editingNode.stopEditing();
        }

        this.node.startEditing();
      },

      stopEditing() {
        this.node.stopEditing();
      },

      handleMouseDown(event) {
        if (!this.options.dnd) {
          return;
        }

        this.tree.vm.startDragging(this.node, event);
      },
    },
  };
</script>

<style lang="scss">
  .tree-node {
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
  }

  .tree-content {
    display: flex;
    align-items: center;
    padding: 3px;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
  }

  .tree-node:not(.selected) > .tree-content:hover {
    background: #f6f8fb;
  }

  .tree-node.selected > .tree-content {
    background-color: #e7eef7;
  }

  .tree-node.disabled > .tree-content:hover {
    background: inherit;
  }

  .tree-arrow {
    flex-shrink: 0;
    height: 30px;
    cursor: pointer;
    margin-left: 30px;
    width: 0;
  }

  .tree-arrow.has-child {
    margin-left: 0;
    width: 30px;
    position: relative;
  }

  .tree-arrow.has-child::after {
    border: 1.5px solid #494646;
    position: absolute;
    border-left: 0;
    border-top: 0;
    left: 9px;
    top: 50%;
    height: 9px;
    width: 9px;
    transform: rotate(-45deg) translateY(-50%) translateX(0);
    transition: transform 0.25s;
    transform-origin: center;
  }

  .tree-arrow.has-child.rtl::after {
    border: 1.5px solid #494646;
    position: absolute;
    border-right: 0;
    border-bottom: 0;
    right: 0;
    top: 50%;
    height: 9px;
    width: 9px;
    transform: rotate(-45deg) translateY(-50%) translateX(0);
    transition: transform 0.25s;
    transform-origin: center;
  }

  .tree-arrow.expanded.has-child::after {
    transform: rotate(45deg) translateY(-50%) translateX(-5px);
  }

  .tree-checkbox {
    flex-shrink: 0;
    position: relative;
    width: 30px;
    height: 30px;
    box-sizing: border-box;
    border: 1px solid #dadada;
    border-radius: 2px;
    background: #fff;
    transition: border-color 0.25s, background-color 0.25s;
  }

  .tree-checkbox::after,
  .tree-arrow::after {
    position: absolute;
    display: block;
    content: '';
  }

  .tree-checkbox.checked,
  .tree-checkbox.indeterminate {
    background-color: #3a99fc;
    border-color: #218eff;
  }

  .tree-checkbox.checked::after {
    box-sizing: content-box;
    border: 1.5px solid #fff; /* probably width would be rounded in most cases */
    border-left: 0;
    border-top: 0;
    left: 9px;
    top: 3px;
    height: 15px;
    width: 8px;
    transform: rotate(45deg) scaleY(1);
    transition: transform 0.25s;
    transform-origin: center;
  }

  .tree-checkbox.indeterminate::after {
    background-color: #fff;
    top: 50%;
    left: 20%;
    right: 20%;
    height: 2px;
  }

  .tree-anchor {
    flex-grow: 2;
    outline: none;
    display: flex;
    text-decoration: none;
    color: #343434;
    vertical-align: top;
    margin-left: 3px;
    line-height: 24px;
    padding: 3px 6px;
    user-select: none;
  }

  .tree-node.selected > .tree-content > .tree-anchor {
    outline: none;
  }

  .tree-node.disabled > .tree-content > .tree-anchor {
    color: #989191;
    background: #fff;
    opacity: 0.6;
    cursor: default;
    outline: none;
  }

  .tree-input {
    display: block;
    width: 100%;
    height: 24px;
    line-height: 24px;
    outline: none;
    border: 1px solid #3498db;
    padding: 0 4px;
  }

  .tree-fade-enter-active,
  .tree-fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
    transform: translateX(0);
  }

  .tree-fade-enter,
  .tree-fade-leave-to {
    opacity: 0;
    transform: translateX(-2em);
  }

  .tree-small .tree-anchor {
    line-height: 19px;
  }

  .tree-small .tree-checkbox {
    width: 23px;
    height: 23px;
  }

  .tree-small .tree-arrow {
    height: 23px;
  }

  .tree-small .tree-checkbox.checked::after {
    left: 7px;
    top: 3px;
    height: 11px;
    width: 5px;
  }

  .tree-node.has-child.loading > .tree-content > .tree-arrow,
  .tree-node.has-child.loading > .tree-content > .tree-arrow::after {
    border-radius: 50%;
    width: 15px;
    height: 15px;
    border: 0;
  }

  .tree-node.has-child.loading > .tree-content > .tree-arrow {
    font-size: 3px;
    position: relative;
    border-top: 1.1em solid rgb(45 45 45 / 20%);
    border-right: 1.1em solid rgb(45 45 45 / 20%);
    border-bottom: 1.1em solid rgb(45 45 45 / 20%);
    border-left: 1.1em solid #2d2d2d;
    transform: translateZ(0);
    left: 5px;
    animation: loading 1.1s infinite linear;
    margin-right: 8px;
  }

  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>
