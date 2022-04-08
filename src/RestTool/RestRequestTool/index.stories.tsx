import React from 'react';
import { RestRequestTool } from './';
import { setupMock } from '../../../test/mock/mock'

export default {
    title: 'Rest Request Tool',
    component: RestRequestTool
};

setupMock();

export const Default = () => (
    <div style={{ background: '#35373e' }}>
        <RestRequestTool />
    </div>
);
