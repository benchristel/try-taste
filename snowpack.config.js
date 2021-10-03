// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  plugins: [
    ["@snowpack/plugin-webpack"],
  ],
  buildOptions: {
    out: "docs",
    baseUrl: "/try-taste",
  },
  mount: {
    public: {
      url: "/",
      static: true,
      dot: true, // include files whose names start with .
    },
    "": {
      url: "/",
    }
  },
};
