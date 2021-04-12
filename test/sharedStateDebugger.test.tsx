import React from 'react';
import 'jest';

import { SharedStateDebugger } from '../src';
import { render } from '@testing-library/react';

function renderSharedStateDebugger() {
    return render(<SharedStateDebugger />);
}

describe('<SharedStateDebugger />', () => {
    test('Should check that the component SharedStateDebugger is rendered', async () => {
        const { findByTestId } = renderSharedStateDebugger();

        const sharedStateDebugger = await findByTestId('shared-state-debugger');
        expect(sharedStateDebugger);
    });
});
