import { app, HttpMethod } from '@kubevious/ui-framework/dist';
import React from 'react';
import { DevToolsPage } from '../DevToolsPage';

export default {
    title: 'DevToolsPage',
};

const sharedState = app.sharedState;

sharedState.set('endpoints', [
    '/usage/total/deployments',
    '/usage/total/deployments_simple',
    '/usage/total/version_history',
    {
        name: '/usage/deployment/version_history',
        method: HttpMethod.GET,
        params: ['deployment'],
    },
]);

export const Default = () => (
    <div style={{ background: '#35373e' }}>
        <DevToolsPage />
    </div>
);
