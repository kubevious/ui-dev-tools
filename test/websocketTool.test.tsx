import React from 'react';
import 'jest';

import { WebsocketTool } from '../src';
import { render, RenderResult } from '@testing-library/react';

const renderComponent = (): RenderResult => render(<WebsocketTool />);

describe('WebsocketTool', () => {
    test('should check that the component WebsocketTool is rendered', async () => {
        const { findByTestId } = renderComponent();

        const websocketTool = await findByTestId('websocket-tool');
        expect(websocketTool).toBeTruthy();
    });
});
