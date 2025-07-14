// import { EditorView } from 'prosemirror-view'

// export function handleFiles(files: FileList | File[], view: EditorView) {
//   const fileArray = Array.from(files)

//   const imageNodeType = view.state.schema.nodes.image
//   if (!imageNodeType) {
//     console.warn('Image node is not defined in the schema.')
//     return
//   }

//   fileArray.forEach((file) => {
//     if (!file.type.startsWith('image/')) {
//       console.warn('Skipped non-image file:', file.name)
//       return
//     }

//     const reader = new FileReader()

//     reader.onload = () => {
//       const base64 = reader.result as string

//       const node = imageNodeType.create({
//         src: base64,
//         alt: file.name
//       })

//       const transaction = view.state.tr.replaceSelectionWith(node)
//       view.dispatch(transaction)
//     }

//     reader.readAsDataURL(file)
//   })
// }

import { EditorView } from 'prosemirror-view'

export function handleFiles(files: FileList | File[], view: EditorView) {
  const fileArray = Array.from(files)

  fileArray.forEach((file) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string

      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')

      if (isImage) {
        view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.image.create({ src: base64 })))
      }

      if (isVideo && view.state.schema.nodes.video) {
        view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.video.create({ src: base64 })))
      }
    }

    reader.readAsDataURL(file)
  })
}
