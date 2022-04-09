import React from 'react';
import { DeveloperExtras } from './';
import { setupMock } from '../../../test/mock/mock'

export default {
    title: 'DeveloperExtras',
    component: DeveloperExtras
};

setupMock();

export const Default = () => (
    <div style={{ background: '#35373e', padding: "20px" }}>
        <DeveloperExtras />
    </div>
);
