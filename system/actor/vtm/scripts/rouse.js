/* global game */

import { WOD5eDice } from '../../../scripts/system-rolls.js'
import { getActiveModifiers } from '../../../scripts/rolls/situational-modifiers.js'
import { potencyToRouse } from './blood-potency.js'

export const _onRouseCheck = async function (actor, item, rollMode) {
  // Secondary variables
  const level = item.system.level
  const cost = item.system.cost > 0 ? item.system.cost : 1
  const selectors = ['rouse']

  // Apply rollMode from chat if none is set
  if (!rollMode) rollMode = game.settings.get('core', 'rollMode')

  if (item.system.discipline === 'oblivion' && cost > 0) {
    selectors.push('oblivion-rouse')
  }

  // Vampires roll rouse checks
  if (actor.type === 'vampire') {
    const potency = actor.type === 'vampire' ? actor.system.blood.potency : 0
    const rouseRerolls = await potencyToRouse(potency, level)

    // Handle getting any situational modifiers
    const activeModifiers = await getActiveModifiers({
      actor,
      selectors
    })

    // Send the roll to the system
    WOD5eDice.Roll({
      advancedDice: cost + activeModifiers.totalValue,
      title: `${game.i18n.localize('WOD5E.VTM.RousingBlood')} - ${item.name}`,
      actor,
      disableBasicDice: true,
      rerollHunger: rouseRerolls,
      increaseHunger: true,
      selectors,
      rollMode,
      quickRoll: true
    })
  } else if (actor.type === 'ghoul' && level > 1) {
    // Ghouls take aggravated damage for using powers above level 1 instead of rolling rouse checks
    const actorHealth = actor.system.health
    const actorHealthMax = actorHealth.max
    const currentAggr = actorHealth.aggravated
    let newAggr = parseInt(currentAggr) + 1

    // Make sure aggravated can't go over the max
    if (newAggr > actorHealthMax) {
      newAggr = actorHealthMax
    }

    // Update the actor with the new health
    actor.update({ 'system.health.aggravated': newAggr })
  }
}
