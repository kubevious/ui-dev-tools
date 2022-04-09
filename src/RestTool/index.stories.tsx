import React from 'react';
import { RestTool } from '../';
import { setupMock } from '../../test/mock/mock'

export default {
    title: 'RestTool',
    component: RestTool
};

setupMock();

export const Default = () => (
    <div style={{ background: '#35373e', padding: "20px" }}>
        <RestTool />
    </div>
);
