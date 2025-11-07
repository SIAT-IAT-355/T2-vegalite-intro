// Create and render the bar chart
// async function to load data from datasets/videogames_long.csv using d3.csv and then make visualizations
async function render() {
  // Load data
  const data = await d3.csv("../datasets/videogames_wide.csv");
  console.log(data);
  // Define the selection with point selection and bind it to a click event
  // Create the bar chart specification

  const vlSpectWithText = {
    data: { values: data },
    width: "container",
    height: 400,
    layer: [
      {
        // Bar layer
        mark: "bar",
        params: [
          {
            name: "brush",
            select: { type: "interval", encodings: ["y"] },
          },
        ],
        encoding: {
          // move the bar encodings here so the rule layer doesn't inherit them
          y: { field: "Platform", type: "nominal", sort: "-x" },
          x: { field: "Global_Sales", type: "quantitative", aggregate: "mean" },
          opacity: {
            condition: {
              param: "brush",
              value: 1,
              empty: false,
            },
            value: 0.5, // Default color when no bar is selected
          },
        },
      },
      {
        // Aggregate the filtered (brushed) data into a single mean value
        transform: [
          { filter: { param: "brush" } },
          {
            aggregate: [
              { op: "mean", field: "Global_Sales", as: "mean_sales" },
            ],
          },
        ],
        mark: { type: "rule", orient: "vertical" },
        encoding: {
          // use the aggregated mean_sales value (single value) for x
          x: { field: "mean_sales", type: "quantitative" },
          color: {
            condition: {
              param: "brush",
              value: "grey",
            },
            value: "red",
          },
          size: { value: 2 },
        },
      },
    ],
  };

  // Render the chart using Vega-Embed
  const view = await vegaEmbed("#view", vlSpectWithText).view;
}

render();
