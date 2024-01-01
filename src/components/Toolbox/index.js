import { COLORS, MENU_ITEMS } from '@/constant'
import styles from './index.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { changeColor, changeSize } from '@/slice/toolboxSlice'
import cx from 'classnames';
import { socket } from '@/socket';

const ToolBox = () => {

    const dispatch = useDispatch()

    const activeMenuItem = useSelector((state) => {
        return state.menu.activeMenuItem
    })

    const { color, size } = useSelector((state) => {
        return state.toolbox[activeMenuItem]
    })

    const updateBrushSize = (e) => {
        dispatch(changeSize({
            item: activeMenuItem,
            size: e.target.value
        }))
        socket.emit('changeConfig', { color, size: e.target.value })
    }

    const updateColor = (newcolor) => {
        dispatch(changeColor({
            item: activeMenuItem,
            color: newcolor
        }))
        socket.emit('changeConfig', { color: newcolor, size })
    }

    return (
        <div className={styles.toolboxContainer}>
            {activeMenuItem === MENU_ITEMS.PENCIL && <div className={styles.toolItem}>
                <h4 className={styles.toolText}>Stroke Color: {color.toUpperCase()}</h4>
                <div className={styles.itemContainer}>
                    <div className={cx(styles.colorBox, { [styles.active]: color === COLORS.BLACK })} style={{ backgroundColor: COLORS.BLACK }} onClick={() => updateColor(COLORS.BLACK)} />
                    <div className={cx(styles.colorBox, { [styles.active]: color === COLORS.BLUE })} style={{ backgroundColor: COLORS.BLUE }} onClick={() => updateColor(COLORS.BLUE)} />
                    <div className={cx(styles.colorBox, { [styles.active]: color === COLORS.GREEN })} style={{ backgroundColor: COLORS.GREEN }} onClick={() => updateColor(COLORS.GREEN)} />
                    <div className={cx(styles.colorBox, { [styles.active]: color === COLORS.ORANGE })} style={{ backgroundColor: COLORS.ORANGE }} onClick={() => updateColor(COLORS.ORANGE)} />
                    <div className={cx(styles.colorBox, { [styles.active]: color === COLORS.RED })} style={{ backgroundColor: COLORS.RED }} onClick={() => updateColor(COLORS.RED)} />
                    <div className={cx(styles.colorBox, { [styles.active]: color === COLORS.YELLOW })} style={{ backgroundColor: COLORS.YELLOW }} onClick={() => updateColor(COLORS.YELLOW)} />
                </div>
            </div>}
            <div className={styles.toolItem}>
                <h4 className={styles.toolText}>Brush Size: {size}</h4>
                <div className={styles.itemContainer}>
                    <input type="range" min={1} max={20} value={Number(size)} onChange={updateBrushSize}></input>
                </div>
            </div>
        </div>
    )
}

export default ToolBox;