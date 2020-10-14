import socket_io from "socket.io"
import { Black } from "black-ts"
import { createServer } from "http"
import { Io } from "../io"

export const EnableSocketServer = (instance: Black) => {
    const http = createServer(instance.app.callback())
    instance.$server = http
    const io = socket_io(http)
    instance.io = io
    new Io(io)
}
