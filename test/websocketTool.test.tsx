import React from 'react';
import 'jest'

import { WebsocketTool } from "../src";
import { render } from "@testing-library/react";

function renderWebsocketTool() {
  return render(<WebsocketTool />);
}

describe("<WebsocketTool />", () => {
  test("Should check that the component WebsocketTool is rendered", async () => {
    const { findByTestId } = renderWebsocketTool();

    const websocketTool = await findByTestId("websocket-tool");
    expect(websocketTool)
  });
});
