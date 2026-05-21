// ── DATA ──
// Source: AIHW Hospital Resources 2023-24, Table 4.6
// Life expectancy: replace with real AIHW values when available
const stateData = [
  { state: "NSW",  state_id: 0, beds: 2.54, life_exp: 83.2 },
  { state: "VIC",  state_id: 1, beds: 2.33, life_exp: 83.5 },
  { state: "QLD",  state_id: 2, beds: 2.57, life_exp: 82.8 },
  { state: "WA",   state_id: 3, beds: 2.38, life_exp: 83.0 },
  { state: "SA",   state_id: 4, beds: 2.79, life_exp: 82.4 },
  { state: "TAS",  state_id: 5, beds: 2.98, life_exp: 81.9 },
  { state: "ACT",  state_id: 6, beds: 2.85, life_exp: 84.1 },
  { state: "NT",   state_id: 7, beds: 4.10, life_exp: 75.0 },
];

const TOPO_URL = "https://raw.githubusercontent.com/alwaysblazing/Australia-State-TopoJson-MapChart/master/au-states-topo.json";

// ── GRAPH 1: Choropleth map ──
const spec1 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 380,
  projection: {
    type: "mercator",
    scale: 500,
    center: [134, -27]
  },
  data: {
    url: TOPO_URL,
    format: { type: "topojson", feature: "austates" }
  },
  transform: [{
    lookup: "id",
    from: {
      data: { values: stateData },
      key: "state_id",
      fields: ["state", "beds", "life_exp"]
    }
  }],
  mark: { type: "geoshape", stroke: "#ffffff", strokeWidth: 1.5 },
  encoding: {
    color: {
      field: "beds",
      type: "quantitative",
      scale: { scheme: "blues", domain: [2.2, 4.2] },
      legend: {
        title: "Beds per 1,000",
        orient: "bottom-right",
        titleFontSize: 11,
        labelFontSize: 10
      }
    },
    tooltip: [
      { field: "state", title: "State / Territory" },
      { field: "beds", title: "Beds per 1,000", format: ".2f" },
      { field: "life_exp", title: "Life expectancy (yrs)", format: ".1f" }
    ]
  },
  config: { view: { stroke: null } }
};

const spec2 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { values: stateData },
  width: 300,
  height: 230,
  mark: { type: "bar", cornerRadiusEnd: 3 },
  encoding: {
    x: {
      field: "life_exp",
      type: "quantitative",
      title: "Life expectancy (years)",
      scale: { domain: [0, 90] },
      axis: { titleFontSize: 11, labelFontSize: 11, gridColor: "#e0e0dc", grid: true, tickCount: 4 }
    },
    y: {
      field: "state",
      type: "nominal",
      title: null,
      sort: "-x",
      axis: { labelFontSize: 11 }
    },
    color: {
      condition: { test: "datum.state === 'NT'", value: "#D85A30" },
      value: "#1D9E75"
    },
    tooltip: [
      { field: "state", title: "State" },
      { field: "life_exp", title: "Life expectancy (yrs)", format: ".1f" }
    ]
  },
  config: { view: { stroke: null } }
};

// ── GRAPH 3: Scatter plot with regression line ──
const spec3 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { values: stateData },
  width: 300,
  height: 230,
  layer: [
    {
      transform: [
        { filter: "datum.state !== 'NT'" },
        { regression: "life_exp", on: "beds" }
      ],
      mark: {
        type: "line",
        color: "#1D9E75",
        strokeDash: [5, 3],
        strokeWidth: 1.5,
        opacity: 0.7
      },
      encoding: {
        x: { field: "beds", type: "quantitative" },
        y: { field: "life_exp", type: "quantitative" }
      }
    },

    {
      mark: { type: "point", filled: true, size: 90, opacity: 0.9 },
      encoding: {
        x: {
          field: "beds",
          type: "quantitative",
          title: "Hospital beds per 1,000 people",
          scale: { domain: [2.0, 4.5] },
          axis: { titleFontSize: 11, labelFontSize: 11, gridColor: "#e0e0dc", grid: true }
        },
        y: {
          field: "life_exp",
          type: "quantitative",
          title: "Life expectancy (years)",
          scale: { domain: [73, 86] },
          axis: { titleFontSize: 11, labelFontSize: 11, gridColor: "#e0e0dc", grid: true }
        },
        color: {
          condition: { test: "datum.state === 'NT'", value: "#D85A30" },
          value: "#185FA5"
        },
        tooltip: [
          { field: "state", title: "State / Territory" },
          { field: "beds", title: "Beds per 1,000", format: ".2f" },
          { field: "life_exp", title: "Life expectancy", format: ".1f" }
        ]
      }
    },
    // State labels
    {
      mark: { type: "text", dy: -12, fontSize: 10, fontWeight: 500 },
      encoding: {
        x: { field: "beds", type: "quantitative" },
        y: { field: "life_exp", type: "quantitative" },
        text: { field: "state" },
        color: {
          condition: { test: "datum.state === 'NT'", value: "#D85A30" },
          value: "#333"
        }
      }
    },
    // NT annotation
    {
      transform: [{ filter: "datum.state === 'NT'" }],
      mark: {
        type: "text",
        align: "left",
        dx: 10,
        dy: 0,
        fontSize: 10,
        fontStyle: "italic",
        color: "#D85A30"
      },
      encoding: {
        x: { field: "beds", type: "quantitative" },
        y: { field: "life_exp", type: "quantitative" },
      }
    }
  ],
  config: { view: { stroke: null } }
};

window.addEventListener("load", () => {
  setTimeout(() => {
    vegaEmbed("#chart1", spec1, { actions: false, renderer: "svg" });
    vegaEmbed("#chart2", spec2, { actions: false, renderer: "svg" });
    vegaEmbed("#chart3", spec3, { actions: false, renderer: "svg" });
  }, 100);
});