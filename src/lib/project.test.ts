import { describe, expect, it } from "vitest";

import { getProjectName, projectCapabilities } from "./project";

describe("project metadata", () => {
  it("exposes the product name", () => {
    expect(getProjectName()).toBe("Vision3D");
  });

  it("describes the MVP capabilities", () => {
    expect(projectCapabilities).toHaveLength(4);
  });
});
