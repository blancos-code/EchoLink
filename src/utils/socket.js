import { io } from "socket.io-client";

class SocketClient {
  constructor() {
    this.socket = null;
    this.handlers = new Map();
  }

  connect() {
    const token = localStorage.getItem("token");

    this.socket = io("http://localhost:4000", {
      auth: {
        token: token, // Send token in auth object
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"], // Try both WebSocket and polling
    });

    // Handle connection events
    this.socket.on("connect", () => {
      console.log("Connected to socket server");
      this.initializeEventListeners();
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return this.socket;
  }

  initializeEventListeners() {
    // User status changes
    this.socket.on("user_status_change", ({ userId, status }) => {
      this.emit("userStatusChange", { userId, status });
    });

    // New conversation
    this.socket.on("new_conversation", (conversation) => {
      this.emit("newConversation", conversation);
    });

    // New message
    this.socket.on("new_message", (messageData) => {
      this.emit("newMessage", messageData);
    });

    // Typing indicators
    this.socket.on("user_typing", (data) => {
      this.emit("userTyping", data);
    });

    this.socket.on("user_stop_typing", (data) => {
      this.emit("userStopTyping", data);
    });
  }

  // Add event listener
  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event).add(handler);
  }

  // Remove event listener
  off(event, handler) {
    if (this.handlers.has(event)) {
      this.handlers.get(event).delete(handler);
    }
  }

  // Emit event to handlers
  emit(event, data) {
    if (this.handlers.has(event)) {
      this.handlers.get(event).forEach((handler) => handler(data));
    }
  }

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.handlers.clear();
  }
}

export default new SocketClient();
