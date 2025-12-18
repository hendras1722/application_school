export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'purple',
      neutral: 'zinc'
    },
    button: {
      slots:{
        base: 'flex justify-center'
      }
    },
    input: {
      slots:{
        base: 'disabled:bg-gray-200'
      }
    }
  }
})
