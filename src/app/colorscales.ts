export const DARK_BLUE = '#1a3854'
export const LIGHT_GRAY = '#e8e8e8aa'
export type COLORSCALE_TYPE = (string | number)[][]

// From https://github.com/plotly/plotly.js/blob/dd8e968b64513fbf388542d25e8929d2891a30f2/src/components/colorscale/scales.js#L112
export const COLORSCALE_VIRIDIS: COLORSCALE_TYPE = [
  [0, '#440154'],
  [0.06274509803921569, '#48186a'],
  [0.12549019607843137, '#472d7b'],
  [0.18823529411764706, '#424086'],
  [0.25098039215686274, '#3b528b'],
  [0.3137254901960784, '#33638d'],
  [0.3764705882352941, '#2c728e'],
  [0.4392156862745098, '#26828e'],
  [0.5019607843137255, '#21918c'],
  [0.5647058823529412, '#1fa088'],
  [0.6274509803921569, '#28ae80'],
  [0.6901960784313725, '#3fbc73'],
  [0.7529411764705882, '#5ec962'],
  [0.8156862745098039, '#84d44b'],
  [0.8784313725490196, '#addc30'],
  [0.9411764705882353, '#d8e219'],
  [1, '#fde725']
]


export const COLORSCALE_GRAY_BLUE: COLORSCALE_TYPE = [
  [0.0, LIGHT_GRAY],
  [0.5, '#42bef4'],
  [1.0, DARK_BLUE]
]

export const COLORSCALE_GRAY_PURPLE = [
  [0.0, LIGHT_GRAY],
  [1.0, '#a665fc']
]


export const COLORSCALE_EMPTY_GRAY: COLORSCALE_TYPE = [
  [0.0, LIGHT_GRAY],
  [1.0, LIGHT_GRAY]
]
