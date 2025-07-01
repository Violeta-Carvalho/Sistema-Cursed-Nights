/* global foundry */

// Preparation functions
import { prepareDescriptionContext, prepareMacroContext, prepareModifiersContext, prepareItemSettingsContext } from '../scripts/prepare-partials.js'
import { Features } from '../../api/def/features.js'
// Base item sheet to extend from
import { WoDItem } from '../wod-item-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDItem document
 * @extends {WoDItem}
 */
export class FeatureItemSheet extends HandlebarsApplicationMixin(WoDItem) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {}
  }

  static PARTS = {
    header: {
      template: 'systems/vtm5e/display/shared/items/feature-sheet.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/vtm5e/display/shared/items/parts/description.hbs'
    },
    macro: {
      template: 'systems/vtm5e/display/shared/items/parts/macro.hbs'
    },
    modifiers: {
      template: 'systems/vtm5e/display/shared/items/parts/modifiers.hbs'
    },
    settings: {
      template: 'systems/vtm5e/display/shared/items/parts/feature-settings.hbs'
    }
  }

  tabs = {
    description: {
      id: 'description',
      group: 'primary',
      label: 'WOD5E.Tabs.Description'
    },
    macro: {
      id: 'macro',
      group: 'primary',
      label: 'WOD5E.ItemsList.Macro'
    },
    modifiers: {
      id: 'modifiers',
      group: 'primary',
      label: 'WOD5E.ItemsList.Modifiers'
    },
    settings: {
      id: 'settings',
      group: 'primary',
      label: 'WOD5E.ItemsList.ItemSettings'
    }
  }

  async _prepareContext () {
    // Top-level variables
    const data = await super._prepareContext()
    const item = this.item
    const itemData = item.system

    data.points = itemData.points
    data.uses = itemData.uses

    data.featureTypeOptions = Features.getList({})
    data.featureTypeSelected = itemData.featuretype

    return data
  }

  async _preparePartContext (partId, context, options) {
    // Inherit any preparation from the extended class
    context = { ...(await super._preparePartContext(partId, context, options)) }

    // Top-level variables
    const item = this.item

    // Prepare each page context
    switch (partId) {
      // Stats
      case 'description':
        return prepareDescriptionContext(context, item)
      case 'macro':
        return prepareMacroContext(context, item)
      case 'modifiers':
        return prepareModifiersContext(context, item)
      case 'settings':
        return prepareItemSettingsContext(context, item)
    }

    return context
  }
}
