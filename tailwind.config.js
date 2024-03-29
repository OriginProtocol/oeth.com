/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./sections/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      dropShadow: {
        ousd: "0px 4px 56px rgba(20, 21, 25, 0.9)",
      },
      colors: {
        "origin-bg-black": "#141519",
        "origin-bg-blackt": "#141519cc",
        "origin-bg-blackt2": "#141519ee",
        "origin-bg-dgrey": "#18191c",
        "origin-bg-dgreyt": "#18191ce6",
        "origin-bg-grey": "#1e1f25",
        "origin-bg-greyt": "#1e1f25b3",
        "origin-white": "#fafbfb",
        "gradient2-from": "#b361e6",
        "gradient2-to": "#6a36fc",
        "body-grey": "#8493a6",
        "range-border": "#3a3d4d",
        "table-title": "#828699",
        "table-data": "#ebecf2",
        "hover-bg": "#222329",
        "tooltip-border": "#252833",
        subheading: "#b5beca",
        tooltip: "#1e1f25",
        "origin-border": "#272727",
        "origin-blue": "#0074f0",
        hover: "#020203",
        "white-grey": "#d8dae5",
        "eth-grey": "#a2a3a7",
        "a-grey": "#dddddd",
        blurry: "#fafbfb",
        footer2: "#111115",
        "gradient1-from": "#fedba8",
        "gradient1-fromt": "#fedba833",
        "gradient1-to": "#cf75d5",
        "gradient1-tot": "#cf75d533",
      },
      backgroundImage: {
        gradient:
          "linear-gradient(90deg, rgba(140, 102, 252, 0.3) -28.99%, rgba(2, 116, 241, 0.3) 144.97%)",
        gradient2: "linear-gradient(90deg, #8C66FC -28.99%, #0274F1 144.97%)",
        gradient3: "linear-gradient(91.16deg, #FEDBA8 -3.29%, #CF75D5 106.42%)",
        gradient4:
          "linear-gradient(90deg, rgb(179, 97, 230) 20.29%, rgb(106, 54, 252) 79.06%)",
      },
      boxShadow: {
        tooltip: "0px 6px 12px #000000",
        sidebar: "0px 9px 20px rgba(0, 0, 0, 0.4)",
        filter:
          "0px 27px 80px rgba(0, 0, 0, 0.07), 0px 6.0308px 17.869px rgba(0, 0, 0, 0.0417275), 0px 1.79553px 5.32008px rgba(0, 0, 0, 0.0282725)",
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },

  plugins: [],
};
