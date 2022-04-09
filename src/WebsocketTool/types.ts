export interface WebSocketEndpointInfo {
    name: string,
    query: Record<string, any>,
    context?: Record<string, any>,
    target: Record<string, any>,
}
