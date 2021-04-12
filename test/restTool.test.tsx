import React from 'react';
import 'jest'

import { RestTool } from "../src";
import { render } from "@testing-library/react";

function renderRestTool() {
  return render(<RestTool />);
}

describe("<RestTool />", () => {
  test("Should check that the component RestTool is rendered", async () => {
    const { findByTestId } = renderRestTool();

    const restTool = await findByTestId("rest-tool");
    expect(restTool)
  });
});
