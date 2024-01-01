const { MENU_ITEMS } = require("@/constant");
const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
    activeMenuItem: MENU_ITEMS.PENCIL, //pencil,eraser
    actionMenuItem: null                //undo,redo,save
}

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        activeItemClick: (state, action) => {
            state.activeMenuItem = action.payload
        },
        actionItemClick: (state, action) => {
            state.actionMenuItem = action.payload
        }
    }
})

export const { actionItemClick, activeItemClick } = menuSlice.actions

export default menuSlice.reducer