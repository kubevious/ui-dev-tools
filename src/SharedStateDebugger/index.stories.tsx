import { app } from '@kubevious/ui-framework';
import React from 'react';
import { SharedStateDebugger } from '../';

export default {
    title: 'SharedStateDebugger',
    component: SharedStateDebugger
};

const sharedState = app.sharedState;

sharedState.set("foo-string", "bar-string");
sharedState.set("foo-bool", true);
sharedState.set("foo-date", new Date());
sharedState.set("foo-json", {
    "foo": "bar",
    "value": 1234
});

export const Default = () => (
    <div style={{ background: '#35373e', height: "700px", padding: "20px", color: "white" }}>
        <SharedStateDebugger />
    </div>
);
