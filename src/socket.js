const { io } = require("socket.io-client");

const url = process.env.NODE_ENV === 'production' ? 'https://sketch-app-backend-dimc.onrender.com' : 'http://localhost:4000'

export const socket = io(url)