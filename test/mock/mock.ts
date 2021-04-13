import { WebSocketService } from './websocket-service'
import { app } from '@kubevious/ui-framework';

export function setupMock()
{
    app.registerService({ kind: 'socket' }, () => {
        return new WebSocketService();
    });
}