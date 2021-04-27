import React from 'react';
import 'jest';

import { WebsocketTool } from '../src';
import { render, RenderResult } from '@testing-library/react';

document.createRange = () => {
    const range = new Range();

    range.getBoundingClientRect = jest.fn();

    // @ts-ignore
    range.getClientRects = jest.fn(() => ({
        item: () => null,
        length: 0,
    }));

    return range;
};

const renderComponent = (): RenderResult => render(<WebsocketTool />);

describe('WebsocketTool', () => {
    test('should check that the component WebsocketTool is rendered', async () => {
        const { findByTestId } = renderComponent();

        const websocketTool = await findByTestId('websocket-tool');
        expect(websocketTool).toBeTruthy();
    });
});
