const data = {
  outputs: {
    1: {
      type: "fastled",
      chip: "ws2812B",
      correction: 0xFFA0F0,
      temperature: 0xFFFFFF,
      ledCount: 244
    }
  },

  fixtures: {
    1: {
      type: "strip",
      pixels: [
        { output: "1", start: 10, count: 10 },
        { output: "1", start: 30, count: 10 },
      ],
      uiConfig: {
        ledsPerMeter: 60,
        sections: [
          { ledCount: 10, startPos: {x: 252, y: 192}, angle: 0.628},
          { ledCount: 10, startPos: {x: 644, y: 555}, angle: 0.328}
        ]
      }
    }
  },

  visualizations: {
    1: {
      type: "timeline",
      startMs: 0,
      durationMs: 10000,
      fixtures: [
        "1"
      ],
      function: [

      ]
    }
  }
}
