import { WebSocketService } from './websocket-service';
import { app, HttpMethod } from '@kubevious/ui-framework';
import { UserEndpointInfo } from '../../src';
import { DeveloperService }from './developer-service';

export function setupMock() {

    const sharedState = app.sharedState;

    const ENDPOINTS : UserEndpointInfo[] = [
        '/',
        '/api/test',
        '/api/v1/bar',
        {
            name: '/api/v1/foo',
            method: HttpMethod.GET,
            params: ['rule-name'],
        },
        {
            name: '/api/v1/foo/do-something',
            method: HttpMethod.POST,
            params: ['rule-name'],
            sample: {
                body: {
                    foo: 'bar',
                    'value': 1234
                }
            }
        },
        {
            name: '/api/v1/foo/do-something-else',
            method: HttpMethod.POST,
            params: ['rule-name', 'marker-name'],
            sample: {
                body: {
                    foo: 'bar',
                    'value': 6789
                }
            }
        },
    ]

    sharedState.set('endpoints', ENDPOINTS);

    app.registerService({ kind: 'socket' }, () => {
        return new WebSocketService();
    });

    app.registerService({ kind: 'developer' }, () => {
        return new DeveloperService();
    });
}
