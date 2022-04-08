import React from 'react';
import { WebsocketTool } from '../';
import { setupMock } from '../../test/mock/mock'

export default {
    title: 'WebsocketTool',
    component: WebsocketTool
};

setupMock();

export const Default = () => (
    <div style={{ background: '#35373e' }}>
        <WebsocketTool />
    </div>
);
