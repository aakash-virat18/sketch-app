import { MENU_ITEMS } from "@/constant"
import { actionItemClick } from "@/slice/menuSlice"
import { socket } from "@/socket"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

const Board = () => {
    const canvasRef = useRef(null)
    const shouldDraw = useRef(false)
    const drawHistory = useRef([])
    const historyPtr = useRef(-1)
    const dispatch = useDispatch()
    const { activeMenuItem, actionMenuItem } = useSelector((state) => {
        return state.menu
    })

    const { color, size } = useSelector((state) => {
        return state.toolbox[activeMenuItem]
    })

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
            const url = canvas.toDataURL()
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = 'sketch.jpg'
            anchor.click()
        }
        else if (actionMenuItem == MENU_ITEMS.UNDO) {
            if (historyPtr.current > 0) {
                historyPtr.current -= 1
                context.putImageData(drawHistory.current[historyPtr.current], 0, 0)
            }
        }
        else if (actionMenuItem === MENU_ITEMS.REDO) {
            if (historyPtr.current < drawHistory.current.length - 1) {
                historyPtr.current += 1
                context.putImageData(drawHistory.current[historyPtr.current], 0, 0)
            }
        }
        dispatch(actionItemClick(null))
    }, [actionMenuItem])

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        canvas.height = window.innerHeight
        canvas.width = window.innerWidth

        const beginPath = (x, y) => {
            context.beginPath()
            context.moveTo(x, y)
        }

        const handleMouseDown = (e) => {
            shouldDraw.current = true
            beginPath(e.clientX, e.clientY)
            socket.emit('beginPath', { x: e.clientX, y: e.clientY })
        }

        const movePath = (x, y) => {
            context.lineTo(x, y)
            context.stroke()
        }

        const handleMouseMove = (e) => {
            if (!shouldDraw.current) {
                return
            }
            movePath(e.clientX, e.clientY)
            socket.emit('movePath', { x: e.clientX, y: e.clientY })
        }

        const handleMouseUp = (e) => {
            shouldDraw.current = false
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            drawHistory.current.push(imageData)
            historyPtr.current = drawHistory.current.length - 1
        }

        const handleBeginPath = (path) => {
            beginPath(path.x, path.y)
        }

        const handleMovePath = (path) => {
            movePath(path.x, path.y)
        }

        socket.on('beginPath', handleBeginPath)
        socket.on('movePath', handleMovePath)

        canvas.addEventListener('mousedown', handleMouseDown)
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseup', handleMouseUp)

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown)
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('mouseup', handleMouseUp)

            socket.off('beginPath', handleBeginPath)
            socket.off('movePath', handleMovePath)
        }
    }, [])

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')

        const changeConfig = (color, size) => {
            context.strokeStyle = color
            context.lineWidth = size
        }

        const handleChangeConfig = (config) => {
            console.log("config", config)
            changeConfig(config.color, config.size)
            console.log('changing');
        }
        changeConfig(color, size)
        socket.on('changeConfig', handleChangeConfig)

        return () => {
            socket.off('changeConfig', handleChangeConfig)
        }
    }, [color, size])

    return (
        <canvas ref={canvasRef}></canvas>
    )
}

export default Board