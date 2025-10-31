import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce"

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

export async function dbConnect() {
  if (connection.isConnected) {
    return
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState
    if (connection.isConnected === 1) {
      return
    }
    await mongoose.disconnect()
  }

  const db = await mongoose.connect(MONGODB_URI)
  connection.isConnected = db.connections[0].readyState
}

export async function disconnectFromDatabase() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect()
      connection.isConnected = 0
    }
  }
}