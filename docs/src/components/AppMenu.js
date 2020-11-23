import { h, defineComponent } from 'vue'

// TODO vue3 - handle QList + QItem
import {
  QExpansionItem,
  QItem,
  QItemSection,
  QIcon,
  QBadge
  // QList
} from 'quasar'

// import Menu from 'assets/menu.js'
import './AppMenu.sass'

export default defineComponent({
  name: 'AppMenu',

  watch: {
    $route (route) {
      this.showMenu(this.$refs[route.path])
    }
  },

  methods: {
    showMenu (comp) {
      if (comp !== void 0 && comp !== this) {
        this.showMenu(comp.$parent)
        comp.show !== void 0 && comp.show()
      }
    },

    getDrawerMenu (menu, path, level) {
      if (menu.children !== void 0) {
        return h(
          QExpansionItem,
          {
            class: 'non-selectable',
            ref: path,
            key: `${menu.name}-${path}`,
            label: menu.name,
            dense: level > 0,
            icon: menu.icon,
            defaultOpened: menu.opened,
            expandSeparator: true,
            switchToggleSide: level > 0,
            denseToggle: level > 0
          },
          () => menu.children.map(item => this.getDrawerMenu(
            h,
            item,
            path + (item.path !== void 0 ? '/' + item.path : ''),
            level + 1
          ))
        )
      }

      const props = {
        ref: path,
        key: path,
        class: 'app-menu-entry non-selectable',
        to: path,
        dense: level > 0,
        insetLevel: level > 1 ? 1.2 : level
      }

      menu.external === true && Object.assign(props, {
        to: void 0,
        clickable: true,
        tag: 'a',
        href: menu.path,
        target: '_blank'
      })

      return h(QItem, props, () => [
        menu.icon !== void 0
          ? h(QItemSection, {
            avatar: true
          }, () => h(QIcon, { name: menu.icon }))
          : null,

        h(QItemSection, () => menu.name),

        menu.badge !== void 0
          ? h(QItemSection, {
            side: true
          }, () => h(QBadge, { label: menu.badge }))
          : null
      ])
    }
  },

  render () {
    return h('div')
    // return h(QList, { class: 'app-menu' }, () => Menu.map(
    //   item => this.getDrawerMenu(item, '/' + item.path, 0)
    // ))
  },

  mounted () {
    this.showMenu(this.$refs[this.$route.path])
  }
})
