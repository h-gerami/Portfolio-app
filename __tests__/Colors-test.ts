import { Colors } from "@/constants/Colors";

describe("Colors", () => {
  test("light theme colors are defined", () => {
    expect(Colors.light.text).toBe("#11181C");
    // expect(Colors.light.background).toBe('#fff');
    // expect(Colors.light.tint).toBe('#0a7ea4');
    // expect(Colors.light.icon).toBe('#687076');
    // expect(Colors.light.tabIconDefault).toBe('#687076');
    // expect(Colors.light.tabIconSelected).toBe('#0a7ea4');
  });

  // test('dark theme colors are defined', () => {
  //   expect(Colors.dark.text).toBe('#ECEDEE');
  //   expect(Colors.dark.background).toBe('#151718');
  //   expect(Colors.dark.tint).toBe('#fff');
  //   expect(Colors.dark.icon).toBe('#9BA1A6');
  //   expect(Colors.dark.tabIconDefault).toBe('#9BA1A6');
  //   expect(Colors.dark.tabIconSelected).toBe('#fff');
  // });

  // test('both themes have same color keys', () => {
  //   const lightKeys = Object.keys(Colors.light);
  //   const darkKeys = Object.keys(Colors.dark);

  //   expect(lightKeys).toEqual(darkKeys);
  // });
});
