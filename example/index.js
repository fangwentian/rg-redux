import { createStore } from 'redux'
import Regular from 'regularjs'
import { Provider, connect } from '../index'

const Title = Regular.extend({
    config(data) {
        data.desc = 'regularjs binding for redux'
    },
    template: `
        <div>{title}: {desc}</div>
        <div><a href="javascript:;" on-click={this.modify()}>change to rg-redux</a></div>
        <div><a href="javascript:;" on-click={this.changeToRedux()}>change to redux</a></div>
    `,
    modify() {
        this.$dispatch({
            type: 'modify_title',
            title: 'rg-redux'
        })
    }
})

const initState = {
    title: 'default title'
}

const reducers = (state = initState, action) => {
    switch (action.type) {
        case 'modify_title':
            return Object.assign({}, state, { title: action.title })
        default:
            return state
    }
}

const mapStateToData = (state) => {
    return {
        title: state.title
    }
}

const mapDispatchToMethod = (dispatch) => {
    return {
        changeToRedux() {
            dispatch({
                type: 'modify_title',
                title: 'redux'
            })
        }
    }
}

const ConnectedTitle = connect(mapStateToData, mapDispatchToMethod)(Title)

const Main =  Regular.extend({
    template: `
    <Provider store={store}>
        <ctitle></ctitle>
    </Provider>
    `,
    config(data) {
        data.store = createStore(reducers)
    }
}).component('ctitle', ConnectedTitle);

new Main().$inject('#_main')