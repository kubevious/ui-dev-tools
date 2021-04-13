import React from 'react';
import 'jest';

import { RestTool } from '../src';
import { render, RenderResult } from '@testing-library/react';

const renderComponent = (): RenderResult => render(<RestTool />)

describe('RestTool', () => {
    test('should check that the component RestTool is rendered', async () => {
        const { findByTestId } = renderComponent();

        const restTool = await findByTestId('rest-tool');
        expect(restTool).toBeTruthy();
    });
});
