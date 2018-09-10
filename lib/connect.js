const func = () => {}

const getStore = (context) => {
    let store

    while(!(store = (context.$parent && context.$parent.data.store))) {
        context = context.$parent
    }
    return store
}

export default (mapStateToData = func, mapDispatchToMethod = func) => {
    return (Component) => Component.implement({
        events: {
            $config() {
                let data = this.data
                const store = getStore(this)
                this.$store = store
                this.$dispatch = store.dispatch   // set alias

                const updateData = () => {
                    const state = store.getState()
                    const mappedData = mapStateToData.call(this, state);
                    Object.assign(data, mappedData || {})
                }

                updateData()

                const updateMethod = () => {
                    const state = store.getState()
                    const mappedMethod = mapDispatchToMethod.call(this, store.dispatch)
                    Object.assign(this, mappedMethod || {})
                }

                updateMethod()

                const unSubscribe = store.subscribe(() => {
                    updateData()
                    updateMethod()
                })

                this.$on('destory', unSubscribe)
            }
        }
    })
}