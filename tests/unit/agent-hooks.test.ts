import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import lintStagedConfig from "../../lint-staged.config.mjs";
import {
  clearAgentEditState,
  filesFromHookInput,
  filesFromPatch,
  readAgentEditState,
  recordAgentEdit,
  shouldRunQuickVerification,
} from "../../scripts/agent-hook-utils.mjs";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

function temporaryStateDirectory() {
  const directory = mkdtempSync(join(tmpdir(), "fufu-proposal-hooks-"));
  temporaryDirectories.push(directory);
  return directory;
}

describe("agent edit hook input", () => {
  it("extracts added, updated, deleted, and moved files", () => {
    expect(
      filesFromPatch(`*** Begin Patch
*** Update File: src/example.ts
*** Move to: src/moved-example.ts
*** Add File: src/new-example.ts
*** Delete File: src/old-example.ts
*** End Patch`),
    ).toEqual([
      "src/example.ts",
      "src/moved-example.ts",
      "src/new-example.ts",
      "src/old-example.ts",
    ]);
  });

  it("accepts the file fields used by supported edit tools", () => {
    expect(
      filesFromHookInput({
        tool_input: {
          file_path: "src/single.ts",
          files: ["src/first.ts", "src/second.ts"],
        },
      }),
    ).toEqual(["src/single.ts", "src/first.ts", "src/second.ts"]);
  });
});

describe("agent edit state", () => {
  it("accumulates files per session and clears only that session", () => {
    const stateDirectory = temporaryStateDirectory();

    recordAgentEdit("session-a", ["src/first.ts"], stateDirectory);
    recordAgentEdit("session-a", ["src/second.ts"], stateDirectory);
    recordAgentEdit("session-b", ["README.MD"], stateDirectory);

    expect(readAgentEditState("session-a", stateDirectory)?.files).toEqual([
      "src/first.ts",
      "src/second.ts",
    ]);
    expect(readAgentEditState("session-b", stateDirectory)?.files).toEqual([
      "README.MD",
    ]);

    clearAgentEditState("session-a", stateDirectory);
    expect(readAgentEditState("session-a", stateDirectory)).toBeNull();
    expect(readAgentEditState("session-b", stateDirectory)).not.toBeNull();
  });
});

describe("agent Stop verification routing", () => {
  it("runs quick verification for code and configuration but not prose", () => {
    expect(shouldRunQuickVerification(["src/example.tsx"])).toBe(true);
    expect(shouldRunQuickVerification(["package.json"])).toBe(true);
    expect(shouldRunQuickVerification(["docs/example.md"])).toBe(false);
  });
});

describe("shared workflow configuration", () => {
  it("runs ESLint before Prettier and generates CSS types portably", () => {
    const config = lintStagedConfig as Record<string, unknown>;
    expect(config["*.{js,jsx,ts,tsx,mjs,cjs}"]).toEqual([
      expect.stringMatching(/^eslint /),
      expect.stringMatching(/^prettier /),
    ]);

    const cssTypes = config["src/**/*.module.css"];
    expect(typeof cssTypes).toBe("function");
    if (typeof cssTypes !== "function") throw new Error("Expected a function");
    expect(cssTypes([])).toBe("npm run css-types");
  });

  it("installs edit and Stop hooks for Codex and Claude", () => {
    for (const file of [".codex/hooks.json", ".claude/settings.json"]) {
      const configuration = JSON.parse(
        readFileSync(join(process.cwd(), file), "utf8"),
      );

      expect(configuration.hooks.PostToolUse).toHaveLength(1);
      expect(configuration.hooks.Stop).toHaveLength(1);
      expect(configuration.hooks.Stop[0].hooks[0].command).toContain(
        "verify-agent-stop.mjs",
      );
    }
  });

  it("keeps lint-staged configuration out of package.json", () => {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf8"),
    );
    expect(packageJson["lint-staged"]).toBeUndefined();
  });
});
