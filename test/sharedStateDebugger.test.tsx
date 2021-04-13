import React from 'react';
import 'jest';

import { SharedStateDebugger } from '../src';
import { render, RenderResult } from '@testing-library/react';

const renderComponent = (): RenderResult => render(<SharedStateDebugger />);

describe('SharedStateDebugger', () => {
    test('should check that the component SharedStateDebugger is rendered', async () => {
        const { findByTestId } = renderComponent();

        const sharedStateDebugger = await findByTestId('shared-state-debugger');
        expect(sharedStateDebugger).toBeTruthy();
    });
});
