import React from 'react';
import { DevToolsPage } from '../';
import { setupMock } from '../../test/mock/mock'

export default {
    title: 'DevToolsPage',
    component: DevToolsPage
};

setupMock();

export const Default = () => (
    <div style={{ background: '#35373e' }}>
        <DevToolsPage />
    </div>
);
