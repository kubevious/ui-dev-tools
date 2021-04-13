import { IWebSocketService, WebSocketScope, WebSocketSubscription, WebSocketTarget } from '@kubevious/ui-middleware';

export class WebSocketService implements IWebSocketService
{
    subscribe(target: Record<string, any>, cb: (value: any) => any): WebSocketSubscription {
        cb({
            'foo': 'bar',
            target: target
        })

        return {
            close: () => {

            }
        }
    }
    
    scope(cb: (value: any, target: Record<string, any>) => any): WebSocketScope {
        cb({ 'foo': 'scope-1234' }, { target: 'my-target' });
        
        return new MyWebSocketScope();
    }

    updateContext(updatedContext: Record<string, any>): void {
        console.log("[WebSocketService] updateContext", updatedContext);
    }

    close(): void {
    }
    
}

export class MyWebSocketScope implements WebSocketScope
{
    close(): void {
    }

    subscribe(target: WebSocketTarget): void
    {
        console.log("[MyWebSocketScope] subscribe", target);
    }

    unsubscribe(target: WebSocketTarget): void
    {
        console.log("[MyWebSocketScope] unsubscribe", target);
    }

    replace(newTargets: WebSocketTarget[]): void
    {
        console.log("[MyWebSocketScope] replace", newTargets);
    }
}