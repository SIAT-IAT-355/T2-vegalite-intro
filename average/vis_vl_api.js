// Vega-Lite API version of the average visualization
// This file builds the same layered spec programmatically using the vega-lite-api (vl)
async function renderVL() {
  const data = await d3.csv("../datasets/videogames_wide.csv");

  // Define a brush parameter that selects an interval along the y encoding
  const brushParam = vl.selectInterval("brush").encodings("y");

  // Bar layer: includes the encodings and the brush parameter
  const bar = vl
    .markBar()
    .params(brushParam)
    .encode({
      y: { field: "Platform", type: "nominal", sort: "-x" },
      x: { field: "Global_Sales", type: "quantitative", aggregate: "mean" },
      opacity: {
        condition: { param: "brush", value: 1, empty: false },
        value: 0.5,
      },
    });

  // Rule layer: filter by the brush, aggregate the mean, and draw a single vertical rule
  const rule = vl
    .markRule({ orient: "vertical" })
    .transform([
      { filter: { param: "brush" } },
      { aggregate: [{ op: "mean", field: "Global_Sales", as: "mean_sales" }] },
    ])
    .encode({
      x: { field: "mean_sales", type: "quantitative" },
      color: { condition: { param: "brush", value: "grey" }, value: "red" },
      size: { value: 2 },
    });

  // Combine layers, attach the data and sizing, then render
  const spec = vl
    .layer(bar, rule)
    .data({ values: data })
    .width("container")
    .height(400)
    .toSpec();

  await vegaEmbed("#view", spec);
}

renderVL();
