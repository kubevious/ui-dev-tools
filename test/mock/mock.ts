import { WebSocketService } from './websocket-service';
import { UserService } from './user-service';
import { app } from '@kubevious/ui-framework';

export function setupMock() {
    app.registerService({ kind: 'socket' }, () => {
        return new WebSocketService();
    });

    app.registerService({ kind: 'user' }, () => {
        return new UserService();
    });
}
