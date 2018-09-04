const Regular = window.Regular || require('regularjs')

export default Regular.extend({
    template: '{#inc this.$body}',
    name: 'Provider',
    config(data) {
        if(!data.store) {
            throw new Error('Provider need a store')
        }
        let state, store = data.store
        store.subscribe(() => {
            let nextState = store.getState()
            if(state != nextState) {
                state = nextState
                setTimeout(() => {
                    this.$update()
                }, 0)
            }
        })
    }
})