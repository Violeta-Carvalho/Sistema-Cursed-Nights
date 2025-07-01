/* global FilePicker */

export const _onEditImage = async function (event) {
  event.preventDefault()

  // Top-level variables
  const item = this.item

  new FilePicker({
    type: 'image',
    current: item.img,
    callback: async (path) => {
      await item.update({
        img: path
      })
    },
    top: this.position.top + 40,
    left: this.position.left + 10
  }).browse()
}
