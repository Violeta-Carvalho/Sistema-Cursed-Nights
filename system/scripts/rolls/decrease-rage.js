/* global ChatMessage, game */

export async function _decreaseRage (actor, amount, rollMode) {
  // Reduce rage for each failure on a rage dice if this is a power that consumes it
  const currentRage = actor.system.rage.value
  const newRageAmount = Math.max(currentRage - amount, 0)

  // If no rollMode is provided, use the user's default
  if (!rollMode) rollMode = game.settings.get('core', 'rollMode')

  if (newRageAmount === 0 && currentRage > 0) {
    const chatMessage = `<p class="roll-label uppercase">${game.i18n.localize('WOD5E.WTA.LostTheWolf')}</p>
    <p class="roll-content result-rage result-possible">${game.i18n.localize('WOD5E.WTA.LostWolfWarning')}</p>`

    // Post the message to the chat
    const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: chatMessage }, rollMode)
    ChatMessage.create(message)
  }

  // Update the actor with the new amount of rage
  actor.update({ 'system.rage.value': newRageAmount })
}
