const func = () => {}

const getStore = (context) {
    while(!(let store = context.$parent.data.store)) {
        context = context.$parent
    }
    return store
}

export default (mapStateToData = func, mapDispatchToMethod = func) => {
    return (Component) => {
        Component.implement({
            events: {
                $config(data) {
                    const store = getStore(this)
                    this.$dispatch = store.dispatch;   // set alias

                    const updateData = () => {
                        const state = store.getState()
                        const mappedData = mapStateToData.call(this, state);
                        Object.assign(data, mappedData || {})
                    }

                    updateData()

                    const updateMethod = () => {
                        const state = store.getState()
                        const mappedMethod = mapDispatchToMethod.bind(this, store.dispatch)
                        Object.assing(this, mappedMethod || {})
                    }

                    updateMethod()

                    store.subscribe(() => {
                        updateData()
                        updateMethod()
                    })

                    this.$on('destory', unSubscribe)
                }
            }
        })
    }
}