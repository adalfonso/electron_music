import { Logger as Sut } from "../src/renderer/Logger";
import { expect } from "chai";

describe("Logger", () => {
  ["log", "info", "warn", "error"].forEach(level => {
    it(`Logs for a ${level} level`, () => {
      const results = {};
      const context = { cat: 23 };
      const sut = new Sut(getLog(results));

      sut[level]("something", context);

      expect(Object.keys(results)).to.deep.equal([level]);
      expect(results[level].message).to.equal("something");
      expect(results[level].context).to.equal(context);
    });
  });

  it(`allows context to be optionals`, () => {
    const results = {};
    const sut = new Sut(getLog(results));

    sut.log("something");
    sut.info("something");
    sut.warn("something");
    sut.error("something");

    expect(Object.keys(results)).to.deep.equal([
      "log",
      "info",
      "warn",
      "error",
    ]);

    expect(results["log"].context).to.deep.equal({});
    expect(results["info"].context).to.deep.equal({});
    expect(results["warn"].context).to.deep.equal({});
    expect(results["error"].context).to.deep.equal({});
  });
});

const getLog = (results: Record<string, unknown>) => {
  return {
    log: output => {
      results.log = output;
    },
    info: output => {
      results.info = output;
    },
    warn: output => {
      results.warn = output;
    },
    error: output => {
      results.error = output;
    },
  };
};
