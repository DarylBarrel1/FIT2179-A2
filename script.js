const HOSPITAL_BEDS_2023 = "data/aihw/hospital-beds-2023.csv";
const AU_HEALTH_EXPENDITURE = "data/owid/au-health-expenditure-and-financing-per-capita.csv";
const HEALTH_EXPENDITURE = "data/owid/share-of-public-expenditure-on-healthcare-by-country.csv";
const PHYSICIANS         = "data/owid/physicians-per-1000-people.csv";
const SEA_BEDS           = "data/owid/hospital-beds-per-1000-people-latest.csv";
const LIFE_EXPECTANCY    = "data/owid/life-expectancy.csv";
const HEALTH_FIELD       = "Domestic general government health expenditure (% of current health expenditure)";

const SEA_COUNTRIES = [
  "Indonesia", "Malaysia", "Thailand", "Singapore",
  "Philippines", "Vietnam", "Australia"
];

const spec1 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 380,
  projection: { type: "mercator", scale: 500, center: [134, -27] },
  data: {
    url: "js/au-states.json",
    format: { type: "topojson", feature: "STE_2021_AUST_GDA2020" }
  },
  transform: [{
    lookup: "properties.STE_NAME21",
    from: {
      data: {
        url: HOSPITAL_BEDS_2023,
        format: { type: "csv", parse: { beds_per_1000: "number", life_exp: "number" } }
      },
      key: "state_name",
      fields: ["state", "beds_per_1000", "life_exp"]
    }
  }],
  layer: [
    {
      mark: { type: "geoshape", stroke: "#ffffff", strokeWidth: 1.5 },
      encoding: {
        color: {
          field: "beds_per_1000",
          type: "quantitative",
          scale: { scheme: "blues", domain: [2.2, 4.2] },
          legend: {
            title: "Beds per 1,000",
            orient: "bottom-right",
            titleFontSize: 14,
            labelFontSize: 14
          }
        },
        tooltip: [
          { field: "state", title: "State / Territory", type: "nominal" },
          { field: "beds_per_1000", title: "Beds per 1,000", format: ".2f", type: "quantitative" },
          { field: "life_exp", title: "Life expectancy (years)", format: ".1f", type: "quantitative" }
        ]
      }
    },
    {
      data: { values: [{}] },
      mark: { type: "text", align: "left", baseline: "top", fontSize: 14, fontStyle: "italic", color: "#333" },
      encoding: {
        x: { value: 20 },
        y: { value: 50 },
        text: { value: [
          "Northern Territory has the most hospital beds (4.1 per 1,000)",
          "yet records Australia's lowest life expectancy 75 years"
        ]}
      }
    }
  ],
  config: { view: { stroke: null } }
};

const spec2 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: {
    url: AU_HEALTH_EXPENDITURE,
    format: {
      type: "csv",
      parse: {
        Year: "number",
        "Health expenditure per capita - Total": "number"
      }
    }
  },
  width: "container",
  height: "container",
  encoding: {
    x: {
      field: "Year",
      type: "quantitative",
      title: "Year",
      axis: {
        titleFontSize: 16,
        labelFontSize: 14,
        format: "d",
        gridColor: "#e0e0dc"
      }
    },
    y: {
      field: "Health expenditure per capita - Total",
      type: "quantitative",
      title: "Health expenditure per capita ($US)",
      axis: {
        titleFontSize: 14,
        labelFontSize: 14,
        gridColor: "#e0e0dc",
        grid: true
      }
    },
    tooltip: [
      { field: "Year", title: "Year", format: "d" },
      {
        field: "Health expenditure per capita - Total",
        title: "Expenditure (USD)",
        format: ",.0f"
      }
    ]
  },
  layer: [
    {
      mark: { type: "line", point: true, color: "#185FA5" }
    },
    {
      data: { values: [{ x: 1971.5, y: 4900 }] },
      mark: {
        type: "rect",
        align: "left",
        color: "#f7f6f3",
        opacity: 0.85,
        width: 220,
        height: 85
      },
      encoding: {
        x: { field: "x", type: "quantitative" },
        y: { field: "y", type: "quantitative" }
      }
    },
    {
      data: { values: [{ x: 1972, y: 5800 }] },
      mark: {
        type: "text",
        align: "left",
        baseline: "top",
        fontSize: 14,
        fontStyle: "italic",
        color: "#555"
      },
      encoding: {
        x: { field: "x", type: "quantitative" },
        y: { field: "y", type: "quantitative" },
        text: { value: ["COVID-19 drove a sharp spike in", "health spending between 2020-21", " as governments funded vaccines", "and emergency hospitals."] }
      }
    }
  ],
  config: { view: { stroke: null }, padding: { left: 40, right: 40, top: 10, bottom: 10 } }
};

const spec3 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: {
    url: PHYSICIANS,
    format: { type: "csv", parse: { Year: "number", "Physicians (per 1,000 people)": "number" } }
  },
  width: "container",
  height: "container",
  transform: [
    { filter: "datum.Code === 'AUS'" },
    { filter: "datum.Year >= 1970" }
  ],
  layer: [
    { mark: { type: "line", point: true, color: "#1D9E75" } },
    {
      transform: [{ filter: "datum.Year === 2022" }],
      mark: {
        type: "text",
        align: "left",
        dx: -100,
        dy: -10,
        fontSize: 11,
        fontStyle: "italic",
        color: "#1D9E75"
      },
      encoding: {
        x: { field: "Year", type: "quantitative" },
        y: { field: "Physicians (per 1,000 people)", type: "quantitative" },
        text: { value: "4.1 per 1,000 (2022)" }
      }
    },
    {
      data: { values: [{}] },
      mark: {
        type: "text",
        align: "left",
        baseline: "bottom",
        fontSize: 14,
        fontStyle: "italic",
        color: "#555"
      },
      encoding: {
        x: { value: 5 },
        y: { value: 40 },
        text: { value: [
          "Australia's physician workforce has",
          "tripled since 1970, reflecting decades",
          "of investment in medical training"
        ]}
      }
    }
  ],
  encoding: {
    x: {
      field: "Year", type: "quantitative", title: "Year",
      scale: { domain: [1970, 2022] },
      axis: { titleFontSize: 16, labelFontSize: 14, format: "d", gridColor: "#e0e0dc" }
    },
    y: {
      field: "Physicians (per 1,000 people)", type: "quantitative",
      title: "Physicians per 1,000 people",
      axis: { titleFontSize: 16, labelFontSize: 14, gridColor: "#e0e0dc", grid: true }
    },
    tooltip: [
      { field: "Year", title: "Year", format: "d" },
      { field: "Physicians (per 1,000 people)", title: "Physicians per 1,000", format: ".2f" }
    ]
  },
  config: { view: { stroke: null }, padding: { left: 40, right: 40, top: 10, bottom: 10 } }
};

const spec4 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: "container",
  projection: { type: "mercator", scale: 340, center: [115, -9] },
  data: {
    url: "js/ne_10m_admin_0_countries_lakes.json",
    format: { type: "topojson", feature: "ne_10m_admin_0_countries_lakes" }
  },
  transform: [
    {
      filter: {
        field: "properties.NAME",
        oneOf: [
          "Indonesia", "Malaysia", "Thailand", "Singapore",
          "Philippines", "Vietnam", "Myanmar", "Australia",
          "Cambodia", "Laos", "Brunei", "Timor-Leste"
        ]
      }
    },
    {
      lookup: "properties.NAME",
      from: {
        data: {
          url: SEA_BEDS,
          format: { type: "csv", parse: { "Hospital beds (per 1,000 people)": "number" } }
        },
        key: "Entity",
        fields: ["Hospital beds (per 1,000 people)"]
      }
    }
  ],
  layer: [
    { mark: { type: "geoshape", fill: "#d3d3d3", stroke: "#ffffff", strokeWidth: 1 } },
    {
      transform: [{ filter: "isValid(datum['Hospital beds (per 1,000 people)'])" }],
      mark: { type: "geoshape", stroke: "#ffffff", strokeWidth: 1 },
      encoding: {
        color: {
          field: "Hospital beds (per 1,000 people)",
          type: "quantitative",
          scale: { scheme: "blues", domain: [0, 5] },
          legend: { title: "Beds per 1,000", titleFontSize: 13, labelFontSize: 12 }
        },
        tooltip: [
          { field: "properties.NAME", title: "Country", type: "nominal" },
          { field: "Hospital beds (per 1,000 people)", title: "Beds per 1,000", format: ".2f", type: "quantitative" }
        ]
      }
    },
    {
      data: { values: [{}] },
      mark: {
        type: "text",
        align: "left",
        baseline: "top",
        fontSize: 14,
        fontStyle: "italic",
        color: "#333"
      },
      encoding: {
        x: { value: 10 },
        y: { value: 220 },
        text: { value: [
          "Gray countries lack recent OWID data which",
          "may be a sign of weaker health reporting systems."
        ]}
      }
    }
  ],
  config: { view: { stroke: null } }
};

const spec5 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: {
    url: SEA_BEDS,
    format: { type: "csv", parse: { "Hospital beds (per 1,000 people)": "number" } }
  },
  width: "container",
  height: "container",
  transform: [{ filter: { field: "Entity", oneOf: SEA_COUNTRIES } }],
  layer: [
    {
      mark: { type: "bar", cornerRadiusEnd: 3 },
      encoding: {
        y: {
          field: "Hospital beds (per 1,000 people)", type: "quantitative",
          title: "Beds per 1,000 people",
          axis: { titleFontSize: 16, labelFontSize: 11, gridColor: "#e0e0dc", grid: true }
        },
        x: {
          field: "Entity", type: "nominal", title: null, sort: "-x",
          axis: { labelFontSize: 14, labelAngle: 45 }
        },
        color: {
          condition: { test: "datum.Entity === 'Australia'", value: "#185FA5" },
          value: "#1D9E75"
        },
        tooltip: [
          { field: "Entity", title: "Country" },
          { field: "Hospital beds (per 1,000 people)", title: "Beds per 1,000", format: ".2f" }
        ]
      }
    },
    {
      data: { values: [{}] },
      mark: {
        type: "text",
        align: "left",
        baseline: "bottom",
        fontSize: 14,
        fontStyle: "italic",
        color: "#555"
      },
      encoding: {
        x: { value: 30 },
        y: { value: 25 },
        text: { value: [
          "Australia has nearly double the hospital beds",
          "per person compared to its nearest SEA neighbour,",
          "reflecting decades of public investment"
        ]}
      }
    }
  ],
  config: { view: { stroke: null }, padding: { left: 40, right: 40, top: 10, bottom: 10 } }
};

const spec6 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 360,
  layer: [
    {
      data: {
        url: LIFE_EXPECTANCY,
        format: { type: "csv", parse: { Year: "number", "Life expectancy": "number" } }
      },
      transform: [
        { filter: "datum.Year === 2021" },
        { filter: { field: "Entity", oneOf: SEA_COUNTRIES } },
        {
          lookup: "Entity",
          from: {
            data: {
              url: HEALTH_EXPENDITURE,
              format: { type: "csv", parse: { Year: "number", [HEALTH_FIELD]: "number" } }
            },
            key: "Entity",
            fields: [HEALTH_FIELD]
          }
        }
      ],
      mark: { type: "point", filled: true, size: 120, opacity: 0.9 },
      encoding: {
        x: {
          field: HEALTH_FIELD, type: "quantitative",
          title: "Public health expenditure (% of total)",
          axis: { titleFontSize: 16, labelFontSize: 11, gridColor: "#e0e0dc", grid: true }
        },
        y: {
          field: "Life expectancy", type: "quantitative",
          title: "Life expectancy (years)",
          scale: { domain: [65, 86] },
          axis: { titleFontSize: 16, labelFontSize: 11, gridColor: "#e0e0dc", grid: true }
        },
        color: {
          condition: [
            { test: "datum.Entity === 'Australia'", value: "#185FA5" },
            { test: "datum.Entity === 'Thailand'", value: "#D85A30" }
          ],
          value: "#1D9E75"
        },
        tooltip: [
          { field: "Entity", title: "Country" },
          { field: "Life expectancy", title: "Life expectancy (yrs)", format: ".1f" },
          { field: HEALTH_FIELD, title: "Public expenditure (%)", format: ".1f" }
        ]
      }
    },
    {
      data: {
        url: LIFE_EXPECTANCY,
        format: { type: "csv", parse: { Year: "number", "Life expectancy": "number" } }
      },
      transform: [
        { filter: "datum.Year === 2021" },
        { filter: { field: "Entity", oneOf: SEA_COUNTRIES } },
        {
          lookup: "Entity",
          from: {
            data: {
              url: HEALTH_EXPENDITURE,
              format: { type: "csv", parse: { Year: "number", [HEALTH_FIELD]: "number" } }
            },
            key: "Entity",
            fields: [HEALTH_FIELD]
          }
        }
      ],
      mark: { type: "text", dy: -12, fontSize: 10 },
      encoding: {
        x: { field: HEALTH_FIELD, type: "quantitative" },
        y: { field: "Life expectancy", type: "quantitative" },
        text: { field: "Entity" },
        color: {
          condition: [
            { test: "datum.Entity === 'Australia'", value: "#185FA5" },
            { test: "datum.Entity === 'Thailand'", value: "#D85A30" }
          ],
          value: "#333"
        }
      }
    },
    {
      data: {
        url: LIFE_EXPECTANCY,
        format: { type: "csv", parse: { Year: "number", "Life expectancy": "number" } }
      },
      transform: [
        { filter: "datum.Year === 2021" },
        { filter: "datum.Entity === 'Thailand'" },
        {
          lookup: "Entity",
          from: {
            data: {
              url: HEALTH_EXPENDITURE,
              format: { type: "csv", parse: { Year: "number", [HEALTH_FIELD]: "number" } }
            },
            key: "Entity",
            fields: [HEALTH_FIELD]
          }
        }
      ],
      mark: {
        type: "text",
        align: "left",
        dx: -372,
        dy: -30,
        fontSize: 14,
        fontStyle: "italic",
        color: "#D85A30"
      },
      encoding: {
        x: { field: HEALTH_FIELD, type: "quantitative" },
        y: { field: "Life expectancy", type: "quantitative" },
        text: { value: [
          "Thailand spends the most publicly among SEA nations,",
          "yet life expectancy lags behind Singapore and Australia,",
          "suggesting spending alone cannot overcome gaps",
          "in healthcare quality and system efficiency."
        ]}
      }
    }
  ],
  config: { view: { stroke: null }, padding: { left: 40, right: 40, top: 10, bottom: 10 } }
};

const spec7 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: {
    url: PHYSICIANS,
    format: { type: "csv", parse: { Year: "number", "Physicians (per 1,000 people)": "number" } }
  },
  width: "container",
  height: "container",
  transform: [
    { filter: "datum.Year === 2021" },
    { filter: { field: "Entity", oneOf: SEA_COUNTRIES } }
  ],
  layer: [
    {
      mark: { type: "bar", cornerRadiusEnd: 3 },
      encoding: {
        y: {
          field: "Physicians (per 1,000 people)", type: "quantitative",
          title: "Physicians per 1,000 people",
          axis: { titleFontSize: 16, labelFontSize: 14, gridColor: "#e0e0dc", grid: true }
        },
        x: {
          field: "Entity", type: "nominal", title: null, sort: "-y",
          axis: { labelFontSize: 14, labelAngle: 45 }
        },
        color: {
          condition: { test: "datum.Entity === 'Australia'", value: "#185FA5" },
          value: "#1D9E75"
        },
        tooltip: [
          { field: "Entity", title: "Country" },
          { field: "Physicians (per 1,000 people)", title: "Physicians per 1,000", format: ".2f" }
        ]
      }
    },
    {
      data: { values: [{}] },
      mark: {
        type: "text",
        align: "left",
        baseline: "bottom",
        fontSize: 14,
        fontStyle: "italic",
        color: "#555"
      },
      encoding: {
        x: { value: 180 },
        y: { value: 20 },
        color: { value: "#555" },
        text: { value: [
          "Most SEA nations have fewer than 2 doctors per 1,000",
          "people, falling well below the WHO recommended threshold.",
          "Australia's workforce is more than double that of its",
          "nearest SEA neighbour."
        ]}
      }
    }
  ],
  config: { view: { stroke: null }, padding: { left: 40, right: 40, top: 10, bottom: 10 } }
};

const spec8 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: {
    url: LIFE_EXPECTANCY,
    format: { type: "csv", parse: { Year: "number", "Life expectancy": "number" } }
  },
  width: "container",
  height: "container",
  transform: [
    { filter: "isValid(datum.Year) && datum.Year >= 1970" },
    { filter: { field: "Entity", oneOf: SEA_COUNTRIES } }
  ],
  encoding: {
    x: {
      field: "Year", type: "quantitative",
      title: "Year",
      scale: { domain: [1970, 2024] },
      axis: { titleFontSize: 16, labelFontSize: 11, format: "d", gridColor: "#e0e0dc" }
    },
    y: {
      field: "Life expectancy", type: "quantitative",
      title: "Life expectancy (years)",
      scale: { domain: [40, 86] },
      axis: { titleFontSize: 16, labelFontSize: 11, gridColor: "#e0e0dc", grid: true }
    },
    color: {
      field: "Entity", type: "nominal",
      legend: { title: "Country", titleFontSize: 14, labelFontSize: 14, rowPadding: 10 }
    },
    tooltip: [
      { field: "Entity", title: "Country" },
      { field: "Year", title: "Year", format: "d" },
      { field: "Life expectancy", title: "Life expectancy (yrs)", format: ".1f" }
    ]
  },
  layer: [
    { mark: { type: "line" } },
    {
      data: { values: [{}] },
      mark: {
        type: "text",
        align: "right",
        baseline: "bottom",
        fontSize: 14,
        fontStyle: "italic",
        color: "#555"
      },
      encoding: {
        x: { value: 1050 },
        y: { value: 200 },
        color: { value: "#555" },
        text: { value: [
          "The COVID-19 pandemic caused a measurable",
          "decline in life expectancy across several",
          "SEA nations in 2020 - 2021, creating",
          "fluctuations and destabilisation."
        ]}
      }
    }
  ],
  config: { view: { stroke: null }, padding: { left: 50, right: 50, top: 10, bottom: 10 } }
};

const spec9 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 350,
  data: {
    url: LIFE_EXPECTANCY,
    format: { type: "csv", parse: { Year: "number", "Life expectancy": "number" } }
  },
  transform: [
    { filter: "datum.Year === 2021" },
    { filter: { field: "Entity", oneOf: SEA_COUNTRIES } },
    {
      lookup: "Entity",
      from: {
        data: {
          url: HEALTH_EXPENDITURE,
          format: { type: "csv", parse: { Year: "number", [HEALTH_FIELD]: "number" } }
        },
        key: "Entity",
        fields: [HEALTH_FIELD]
      }
    },
    {
      lookup: "Entity",
      from: {
        data: {
          url: PHYSICIANS,
          format: { type: "csv", parse: { Year: "number", "Physicians (per 1,000 people)": "number" } }
        },
        key: "Entity",
        fields: ["Physicians (per 1,000 people)"]
      }
    }
  ],
  layer: [
    {
      mark: { type: "point", filled: true, opacity: 0.85 },
      encoding: {
        x: {
          field: HEALTH_FIELD, type: "quantitative",
          title: "Public health expenditure (% of total)",
          axis: { titleFontSize: 16, labelFontSize: 11, gridColor: "#e0e0dc", grid: true }
        },
        y: {
          field: "Life expectancy", type: "quantitative",
          title: "Life expectancy (years)",
          scale: { domain: [65, 86] },
          axis: { titleFontSize: 16, labelFontSize: 11, gridColor: "#e0e0dc", grid: true }
        },
        size: {
          field: "Physicians (per 1,000 people)", type: "quantitative",
          scale: { range: [100, 1500] },
          legend: {
            title: "Physicians per 1,000",
            titleFontSize: 11,
            labelFontSize: 10,
            format: ".1f"
          }
        },
        color: {
          condition: { test: "datum.Entity === 'Australia'", value: "#185FA5" },
          value: "#1D9E75"
        },
        tooltip: [
          { field: "Entity", title: "Country" },
          { field: "Life expectancy", title: "Life expectancy (yrs)", format: ".1f" },
          { field: HEALTH_FIELD, title: "Public expenditure (%)", format: ".1f" },
          { field: "Physicians (per 1,000 people)", title: "Physicians per 1,000", format: ".2f" }
        ]
      }
    },
    {
      mark: { type: "text", dy: -25, fontSize: 10, fontWeight: 500 },
      encoding: {
        x: { field: HEALTH_FIELD, type: "quantitative" },
        y: { field: "Life expectancy", type: "quantitative" },
        text: { field: "Entity" },
        color: {
          condition: { test: "datum.Entity === 'Australia'", value: "#185FA5" },
          value: "#333"
        }
      }
    },
    {
      data: { values: [{}] },
      mark: { type: "text", align: "left", baseline: "bottom", fontSize: 14, fontStyle: "italic", color: "#555" },
      encoding: {
        x: { value: 20 },
        y: { value: 30 },
        text: { value: [
          "Larger bubbles indicates more doctors",
          "are available for each person. Countries",
          "with more physicians tend to live longer",
          "but spending alone does not guarantee",
          "better outcomes."
        ]}
      }
    }
  ],
  config: { view: { stroke: null }, padding: { left: 40, right: 40, top: 10, bottom: 10 } }
};

const spec10 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 350,
  data: {
    url: LIFE_EXPECTANCY,
    format: { type: "csv", parse: { Year: "number", "Life expectancy": "number" } }
  },
  transform: [
    { filter: "datum.Year === 2022" },
    { filter: { field: "Entity", oneOf: SEA_COUNTRIES } }
  ],
  layer: [
    {
      mark: { type: "point", filled: true, size: 120, opacity: 0.9 },
      encoding: {
        x: {
          field: "Life expectancy", type: "quantitative",
          title: "Life expectancy (years)",
          scale: { domain: [65, 86] },
          axis: { titleFontSize: 16, labelFontSize: 11, gridColor: "#e0e0dc", grid: true }
        },
        y: {
          field: "Entity", type: "nominal", title: null,
          sort: { field: "Life expectancy", order: "descending" },
          axis: { titleFontSize: 16, labelFontSize: 12 }
        },
        color: {
          condition: { test: "datum.Entity === 'Australia'", value: "#185FA5" },
          value: "#1D9E75"
        },
        tooltip: [
          { field: "Entity", title: "Country" },
          { field: "Life expectancy", title: "Life expectancy (yrs)", format: ".1f" }
        ]
      }
    },
    {
      mark: { type: "text", align: "left", dx: 8, fontSize: 10 },
      encoding: {
        x: { field: "Life expectancy", type: "quantitative" },
        y: {
          field: "Entity", type: "nominal",
          sort: { field: "Life expectancy", order: "descending" }
        },
        text: { field: "Life expectancy", format: ".1f" },
        color: {
          condition: { test: "datum.Entity === 'Australia'", value: "#185FA5" },
          value: "#555"
        }
      }
    },
    // Annotation
    {
      data: { values: [{}] },
      mark: { type: "text", align: "left", baseline: "bottom", fontSize: 14, fontStyle: "italic", color: "#555" },
      encoding: {
        x: { value: 20 },
        y: { value: 20 },
        text: { value: [
          "Singapore is narrowly above Australia as the highest life-expectency",
          "nation in the region, while the Philippines trails far behind reflecting",
          "decades of underinvestment in healthcare infrastructure and workforce."
        ]}
      }
    }
  ],
  config: { view: { stroke: null }, padding: { left: 40, right: 40, top: 10, bottom: 10 } }
};
 
const spec11 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 350,
  data: {
    url: LIFE_EXPECTANCY,
    format: { type: "csv", parse: { Year: "number", "Life expectancy": "number" } }
  },
  transform: [
    { filter: { field: "Entity", oneOf: SEA_COUNTRIES } },
    { filter: "datum.Year === 2000 || datum.Year === 2023" }
  ],
  layer: [
    {
      mark: { type: "line", strokeWidth: 1.5, opacity: 0.6 },
      encoding: {
        x: {
          field: "Year", type: "ordinal",
          title: null,
          axis: { labelFontSize: 13, labelFontWeight: "bold", gridColor: "#e0e0dc" }
        },
        y: {
          field: "Life expectancy", type: "quantitative",
          title: "Life expectancy (years)",
          scale: { domain: [64, 85] },
          axis: { titleFontSize: 16, labelFontSize: 11, gridColor: "#e0e0dc", grid: true }
        },
        color: {
          field: "Entity", type: "nominal",
          legend: null
        },
        detail: { field: "Entity", type: "nominal" }
      }
    },
    {
      mark: { type: "point", filled: true, size: 80, opacity: 0.9 },
      encoding: {
        x: { field: "Year", type: "ordinal" },
        y: { field: "Life expectancy", type: "quantitative" },
        color: {
          field: "Entity", type: "nominal",
          legend: null
        },
        tooltip: [
          { field: "Entity", title: "Country" },
          { field: "Year", title: "Year" },
          { field: "Life expectancy", title: "Life expectancy (yrs)", format: ".1f" }
        ]
      }
    },
    {
      transform: [{ filter: "datum.Year === 2000" }],
      mark: { type: "text", align: "right", dx: -10, fontSize: 10 },
      encoding: {
        x: { field: "Year", type: "ordinal" },
        y: { field: "Life expectancy", type: "quantitative" },
        text: { field: "Entity" },
        color: { field: "Entity", type: "nominal", legend: null }
      }
    },
    {
      transform: [{ filter: "datum.Year === 2023" }],
      mark: { type: "text", align: "left", dx: 8, fontSize: 10 },
      encoding: {
        x: { field: "Year", type: "ordinal" },
        y: { field: "Life expectancy", type: "quantitative" },
        text: { field: "Life expectancy", format: ".1f" },
        color: { field: "Entity", type: "nominal", legend: null }
      }
    },
    {
      data: { values: [{}] },
      mark: { type: "text", align: "left", baseline: "bottom", fontSize: 14, fontStyle: "italic", color: "#555" },
      encoding: {
        x: { value: 20 },
        y: { value: 20 },
        text: { value: [
          "Singapore gained the most (+5.1 yrs) since 2000.",
          "Philippines improved the least (+1.7 yrs).",
          "Hence, the widening gap reflects",
          "persistent inequality."
        ]}
      }
    }
  ],
  config: { view: { stroke: null }, padding: { left: 40, right: 40, top: 10, bottom: 10 } }
};

const spec12 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: "container",
  data: {
    url: LIFE_EXPECTANCY,
    format: { type: "csv", parse: { Year: "number", "Life expectancy": "number" } }
  },
  transform: [
    { filter: "datum.Year === 2022" },
    { filter: { field: "Entity", oneOf: SEA_COUNTRIES } },
    {
      lookup: "Entity",
      from: {
        data: {
          url: SEA_BEDS,
          format: { type: "csv", parse: { "Hospital beds (per 1,000 people)": "number" } }
        },
        key: "Entity",
        fields: ["Hospital beds (per 1,000 people)"]
      }
    }
  ],
  layer: [
    {
      mark: { type: "point", filled: true, size: 120, opacity: 0.9 },
      encoding: {
        x: {
          field: "Hospital beds (per 1,000 people)", type: "quantitative",
          title: "Hospital beds per 1,000 people",
          axis: { titleFontSize: 16, labelFontSize: 11, gridColor: "#e0e0dc", grid: true }
        },
        y: {
          field: "Life expectancy", type: "quantitative",
          title: "Life expectancy (years)",
          scale: { domain: [65, 86] },
          axis: { titleFontSize: 16, labelFontSize: 11, gridColor: "#e0e0dc", grid: true }
        },
        color: {
          condition: { test: "datum.Entity === 'Australia'", value: "#185FA5" },
          value: "#1D9E75"
        },
        tooltip: [
          { field: "Entity", title: "Country" },
          { field: "Hospital beds (per 1,000 people)", title: "Beds per 1,000", format: ".2f" },
          { field: "Life expectancy", title: "Life expectancy (yrs)", format: ".1f" }
        ]
      }
    },
    {
      mark: { type: "text", dy: -12, fontSize: 10 },
      encoding: {
        x: { field: "Hospital beds (per 1,000 people)", type: "quantitative" },
        y: { field: "Life expectancy", type: "quantitative" },
        text: { field: "Entity" },
        color: {
          condition: { test: "datum.Entity === 'Australia'", value: "#185FA5" },
          value: "#333"
        }
      }
    },
    {
      data: { values: [{}] },
      mark: { type: "text", align: "left", baseline: "bottom", fontSize: 14, fontStyle: "italic", color: "#555" },
      encoding: {
        x: { value: 20 },
        y: { value: 20 },
        text: { value: [
          "Unlike within Australia, more hospital beds across SEA",
          "does correlate with longer life expectancy, suggesting",
          "infrastructure matters at lower resource levels."
        ]}
      }
    }
  ],
  config: { view: { stroke: null }, padding: { left: 40, right: 40, top: 10, bottom: 10 } }
};

// ── RENDER ──
window.addEventListener("load", () => {
  setTimeout(() => {
    vegaEmbed("#chart1", spec1, { actions: false, renderer: "svg" });
    vegaEmbed("#chart2", spec2, { actions: false, renderer: "svg" });
    vegaEmbed("#chart3", spec3, { actions: false, renderer: "svg" });
    vegaEmbed("#chart4", spec4, { actions: false, renderer: "svg" });
    vegaEmbed("#chart5", spec5, { actions: false, renderer: "svg" });
    vegaEmbed("#chart6", spec8, { actions: false, renderer: "svg" });
    vegaEmbed("#chart7", spec7, { actions: false, renderer: "svg" });
    vegaEmbed("#chart8", spec6, { actions: false, renderer: "svg" });
    vegaEmbed("#chart9", spec9, { actions: false, renderer: "svg" });
    vegaEmbed("#chart10", spec10, { actions: false, renderer: "svg" });
    vegaEmbed("#chart11", spec11, { actions: false, renderer: "svg" });
    vegaEmbed("#chart12", spec12, { actions: false, renderer: "svg" });
  }, 100);
});