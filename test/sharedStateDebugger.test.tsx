import React from 'react';
import 'jest';

import { SharedStateDebugger } from '../src';
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

const renderComponent = (): RenderResult => render(<SharedStateDebugger />);

describe('SharedStateDebugger', () => {
    test('should check that the component SharedStateDebugger is rendered', async () => {
        const { findByTestId } = renderComponent();

        const sharedStateDebugger = await findByTestId('shared-state-debugger');
        expect(sharedStateDebugger).toBeTruthy();
    });
});
