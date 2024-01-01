import { faEraser, faFileArrowDown, faPencil, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './index.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { actionItemClick, activeItemClick } from '@/slice/menuSlice'
import { MENU_ITEMS } from '@/constant'
import cx from 'classnames'

const MenuBar = () => {
    const activeMenuItem = useSelector((state) => {
        return state.menu.activeMenuItem
    })
    const dispatch = useDispatch()
    return (
        <div className={styles.menuContainer}>
            <div className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.PENCIL })}
                onClick={() => dispatch(activeItemClick(MENU_ITEMS.PENCIL))}>
                <FontAwesomeIcon icon={faPencil} className={styles.icon} />
            </div>
            <div className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.ERASER })}
                onClick={() => dispatch(activeItemClick(MENU_ITEMS.ERASER))}>
                <FontAwesomeIcon icon={faEraser} className={styles.icon} />
            </div>
            <div className={styles.iconWrapper}
                onClick={() => dispatch(actionItemClick(MENU_ITEMS.UNDO))}>
                <FontAwesomeIcon icon={faRotateLeft} className={styles.icon} />
            </div>
            <div className={styles.iconWrapper}
                onClick={() => dispatch(actionItemClick(MENU_ITEMS.REDO))}>
                <FontAwesomeIcon icon={faRotateRight} className={styles.icon} />
            </div>
            <div className={styles.iconWrapper}
                onClick={() => dispatch(actionItemClick(MENU_ITEMS.DOWNLOAD))}>
                <FontAwesomeIcon icon={faFileArrowDown} className={styles.icon} />
            </div>
        </div>)
}

export default MenuBar;