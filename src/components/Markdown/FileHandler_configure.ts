export default {
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],

    onDrop: (currentEditor: any, files: any, pos: any) => {
      files.forEach(file => {
        const fileReader = new FileReader()

        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
          currentEditor
            .chain()
            .insertContentAt(pos, {
              type: 'image',
              attrs: {
                src: fileReader.result,
              },
            })
            .focus()
            .run()
        }
      })
    },

    onPaste: (currentEditor: any, files: any) => {
        files.forEach(file => {
          const fileReader = new FileReader()

        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
          currentEditor
            .chain()
            .insertContentAt(currentEditor.state.selection.anchor, {
              type: 'image',
              attrs: {
                src: fileReader.result,
              },
            })
            .focus()
            .run()
        }
      })
    }

}