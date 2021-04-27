import React from 'react';
import 'jest';

import { RestTool } from '../src';
import { render, RenderResult } from '@testing-library/react';
import { setupMock } from './mock/mock';

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

const renderComponent = (): RenderResult => render(<RestTool />);

beforeAll(() => {
    setupMock();
});

describe('RestTool', () => {
    test('should check that the component RestTool is rendered', async () => {
        const { findByTestId } = renderComponent();

        const restTool = await findByTestId('rest-tool');
        expect(restTool).toBeTruthy();
    });
});
