// Unit pictures for the Book tab: maps, menus and "Do you remember?" scenes. Read by scripts/book-images.mjs.
// Each entry: [file, pdfPage, x, y, w, h, width, gray]  (all line drawings, so greyscale)  (fractions of the page, origin top-left)
const S = (unit, page, boxes) => boxes.map((b, i) => [`${unit}/remember-${i + 1}`, page, ...b, 480, true]);

export const SCENES = [
  // Unit 1
  ...S('u1', 29, [[0.075, 0.177, 0.43, 0.268], [0.508, 0.368, 0.39, 0.25], [0.065, 0.588, 0.41, 0.27]]),
  // Unit 2
  ['u2/map', 40, 0.125, 0.189, 0.758, 0.719, 720, true],
  ...S('u2', 42, [[0.083, 0.189, 0.40, 0.295], [0.525, 0.407, 0.383, 0.242], [0.067, 0.596, 0.417, 0.289]]),
  // Unit 3
  ...S('u3', 56, [[0.083, 0.183, 0.392, 0.224], [0.525, 0.313, 0.392, 0.248], [0.083, 0.513, 0.392, 0.248], [0.525, 0.643, 0.392, 0.248]]),
  // Unit 4
  ['u4/menu', 68, 0.192, 0.177, 0.633, 0.584, 720, true],
  ...S('u4', 70, [[0.067, 0.183, 0.417, 0.259], [0.525, 0.318, 0.392, 0.23], [0.083, 0.519, 0.392, 0.248], [0.525, 0.625, 0.392, 0.283]]),
];
