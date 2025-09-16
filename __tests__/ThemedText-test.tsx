import { render } from "@testing-library/react-native";

import { ThemedText } from "@/components/ThemedText";
import React from "react";

describe("<ThemedText />", () => {
  test("renders text correctly", () => {
    const { getByText } = render(<ThemedText>Hello World</ThemedText>);

    expect(getByText("Hello World")).toBeTruthy();
  });

  // test('renders with different text types', () => {
  //   const { getByText } = render(<ThemedText type="title">Title Text</ThemedText>);

  //   expect(getByText('Title Text')).toBeTruthy();
  // });

  // test('renders with custom colors', () => {
  //   const { getByText } = render(
  //     <ThemedText lightColor="#FF0000" darkColor="#00FF00">
  //       Colored Text
  //     </ThemedText>
  //   );

  //   expect(getByText('Colored Text')).toBeTruthy();
  // });
});
