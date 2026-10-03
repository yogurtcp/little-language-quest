// Original vector art: shared drawing primitives, distinct silhouettes for every word.
const ink = "#28324b";
const path = (d, fill = "none", width = 3) =>
  `<path d="${d}" fill="${fill}" stroke="${ink}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
const ellipse = (x, y, rx, ry, fill) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${ink}" stroke-width="3"/>`;
const circle = (x, y, r, fill) => ellipse(x, y, r, r, fill);
const rect = (x, y, w, h, fill, r = 4) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${ink}" stroke-width="3"/>`;
const eyes = (y = 48, x = 39, gap = 22) =>
  circle(x, y, 2, ink) + circle(x + gap, y, 2, ink);
const smile = (y = 65) => path(`M43 ${y}q7 7 14 0`);
const wheels = () => circle(28, 77, 9, ink) + circle(73, 77, 9, ink);
const wings = (fill) =>
  ellipse(29, 38, 19, 24, fill) +
  ellipse(71, 38, 19, 24, fill) +
  ellipse(29, 70, 15, 16, fill) +
  ellipse(71, 70, 15, 16, fill);
export const extraDrawings = {
  rabbit:
    ellipse(36, 27, 9, 23, "#ede1d9") +
    ellipse(64, 27, 9, 23, "#ede1d9") +
    ellipse(36, 26, 3, 14, "#f6a9b6") +
    ellipse(64, 26, 3, 14, "#f6a9b6") +
    ellipse(50, 62, 29, 25, "#ede1d9") +
    eyes(57) +
    path("m46 66 4 4 4-4z", "#e88b9f") +
    rect(45, 71, 10, 9, "white", 1),
  bear:
    circle(26, 29, 12, "#ad7853") +
    circle(74, 29, 12, "#ad7853") +
    circle(50, 54, 32, "#ad7853") +
    eyes() +
    ellipse(50, 66, 15, 12, "#ead0ac") +
    ellipse(50, 61, 5, 3, ink) +
    smile(69),
  lion:
    path(
      "M50 8 62 16 78 16 81 31 94 44 85 57 86 75 69 81 50 94 33 81 15 75 16 57 6 44 19 31 22 16 38 16Z",
      "#b8754a",
    ) +
    circle(50, 51, 28, "#f7c869") +
    eyes() +
    path("m45 58 5 6 5-6z", ink) +
    smile(67),
  elephant:
    ellipse(22, 48, 17, 27, "#a7bbc9") +
    ellipse(78, 48, 17, 27, "#a7bbc9") +
    ellipse(50, 43, 26, 28, "#a7bbc9") +
    path("M43 57v24q0 15 20 8l6-11-9-4-4 8V57", "#a7bbc9") +
    eyes(42),
  giraffe:
    path("M33 90V52h34v38", "#f8ce73") +
    ellipse(50, 43, 21, 25, "#f8ce73") +
    path("M38 23V12m24 11V12") +
    circle(38, 10, 4, "#a87950") +
    circle(62, 10, 4, "#a87950") +
    path("m30 32-14-6 6 16m48-10 14-6-6 16", "#f8ce73") +
    eyes(41, 41, 18) +
    ellipse(50, 58, 13, 8, "#f6e2ba") +
    circle(43, 76, 5, "#b78551") +
    circle(61, 87, 5, "#b78551"),
  monkey:
    circle(21, 49, 13, "#a27558") +
    circle(79, 49, 13, "#a27558") +
    circle(50, 49, 32, "#a27558") +
    path("M50 40q-24-21-25 10-3 29 25 31 28-2 25-31-1-31-25-10", "#eed2b0") +
    eyes(49) +
    smile(65),
  horse:
    path(
      "M34 26 31 10 44 24 59 23 72 12 67 35 77 58 63 86 31 82 25 58Z",
      "#bb835b",
    ) +
    path("M32 28q17-24 28-8L48 48 42 27", "#765147") +
    eyes(48, 37, 25) +
    ellipse(49, 72, 19, 11, "#e3b790") +
    circle(41, 70, 2, ink) +
    circle(57, 70, 2, ink),
  sheep:
    [
      [27, 36],
      [43, 25],
      [61, 27],
      [76, 39],
      [76, 59],
      [62, 74],
      [41, 74],
      [24, 60],
    ]
      .map(([x, y]) => circle(x, y, 14, "#fff9ed"))
      .join("") +
    ellipse(50, 52, 20, 25, "#bda998") +
    eyes(48, 42, 16) +
    smile(60),
  pig:
    path("m24 41-5-22 24 14m14 0 24-14-5 22", "#efa4b5") +
    circle(50, 54, 31, "#efa4b5") +
    eyes(46) +
    ellipse(50, 64, 18, 12, "#ef829d") +
    ellipse(43, 64, 2, 4, ink) +
    ellipse(57, 64, 2, 4, ink),
  mouse:
    circle(25, 28, 19, "#b7b2c8") +
    circle(75, 28, 19, "#b7b2c8") +
    circle(25, 28, 11, "#ecc0cd") +
    circle(75, 28, 11, "#ecc0cd") +
    path("M27 41q23-21 46 0l-7 28-16 17-16-17z", "#b7b2c8") +
    eyes(49) +
    circle(50, 76, 5, "#e58eab") +
    path("M36 64 15 60m22 10-23 4m50-10 21-4M63 70l23 4"),
  frog:
    ellipse(50, 64, 33, 23, "#8ecb86") +
    circle(31, 37, 16, "#8ecb86") +
    circle(69, 37, 16, "#8ecb86") +
    circle(31, 37, 8, "white") +
    circle(69, 37, 8, "white") +
    eyes(37, 31, 38) +
    path("M28 64q22 22 44 0"),
  turtle:
    ellipse(47, 58, 29, 21, "#8fc888") +
    circle(84, 52, 11, "#a8d797") +
    path("m24 70-8 11h13l8-7m23-2 7 10h12l-8-15", "#a8d797") +
    path("M21 59h52M36 40l11 19-7 18m7-18 13-18") +
    circle(86, 49, 2, ink),
  butterfly:
    wings("#c7a0de") +
    ellipse(50, 52, 6, 29, "#8064a3") +
    path("m47 24-9-12m15 12 9-12") +
    circle(28, 36, 7, "#ffcd78") +
    circle(72, 36, 7, "#ffcd78"),
  bee:
    ellipse(38, 30, 13, 19, "#d0ecf0") +
    ellipse(62, 30, 13, 19, "#d0ecf0") +
    ellipse(50, 58, 30, 21, "#ffd16b") +
    path("M39 39v37m16-38v40", "none", 7) +
    circle(70, 53, 2, ink) +
    path("M23 55 12 61"),
  snail:
    path("M14 72h65q15 0 11-20l-4-13-4 19H24z", "#efbd7b") +
    circle(45, 51, 25, "#bb93ca") +
    path("M44 64q-20-12-4-26 17-5 17 11 0 10-11 8") +
    path("m82 46-5-17m11 16 6-16") +
    circle(77, 28, 3, ink) +
    circle(94, 28, 3, ink),
  bird:
    ellipse(47, 55, 27, 24, "#79bfd6") +
    circle(65, 34, 17, "#79bfd6") +
    path("m78 32 15 7-15 7", "#f5bb63") +
    path("M22 54 9 43l5 27 14-4", "#79bfd6") +
    path("M35 51q2 25 24 10M41 78v9m15-10v10") +
    circle(69, 31, 2, ink),
  rooster:
    path("M50 27q-13-16 0-18 3 1 5 8 9-16 14-6l-2 13", "#e97772") +
    ellipse(46, 60, 27, 23, "#fff2cc") +
    circle(61, 33, 16, "#fff2cc") +
    path("m74 32 15 7-16 6", "#eeb551") +
    path("M23 54 10 28q-11 22 8 44", "#72b6a0") +
    path("M40 82v9m16-9v9") +
    circle(64, 31, 2, ink),
  penguin:
    ellipse(50, 53, 28, 36, "#405269") +
    ellipse(50, 62, 18, 24, "#fff7e9") +
    circle(41, 35, 7, "white") +
    circle(59, 35, 7, "white") +
    eyes(35, 41, 18) +
    path("m44 44 6 8 6-8z", "#edb357") +
    path("m35 84-10 7h22m18-7 10 7H53", "#edb357"),
  pear:
    path(
      "M44 28q-8 0-10 20-24 25-7 37 22 13 45-1 17-15-8-37-3-20-12-19Z",
      "#b8d777",
    ) +
    path("M48 30q-2-14 8-19") +
    path("M53 22q15-18 24-5-7 13-24 5", "#74b58c"),
  orange:
    circle(50, 57, 31, "#f6a14f") +
    path("M48 28V17") +
    path("M49 23q15-19 29-4-13 13-29 4", "#79bd85") +
    path("M30 50q3-9 9-11", "none", 4),
  lemon:
    path(
      "M12 54q7-2 10-13 19-29 48-11l14 15q17 5 4 13-2 13-21 21-28 12-46-10-3-13-9-15Z",
      "#f6d85e",
    ) + path("M31 46q8-13 24-10"),
  strawberry:
    path("M20 34q30-18 60 0-4 38-30 53Q24 72 20 34Z", "#ef7980") +
    path("m25 30 18-3 7-15 7 15 18 3-17 8-8-8-8 8Z", "#75bd8d") +
    [
      [36, 45],
      [59, 44],
      [49, 57],
      [65, 61],
      [37, 64],
      [51, 75],
    ]
      .map(([x, y]) => ellipse(x, y, 1, 3, "#fff4c6"))
      .join(""),
  grapes:
    [
      [35, 37],
      [58, 34],
      [74, 48],
      [24, 52],
      [48, 51],
      [36, 68],
      [61, 67],
      [49, 82],
    ]
      .map(([x, y]) => circle(x, y, 12, "#af8ed1"))
      .join("") +
    path("M49 28q-3-15 7-20") +
    path("M53 21q9-19 29-10-7 16-29 10", "#81bb8d"),
  watermelon:
    path("M10 40h80q-7 47-40 47T10 40Z", "#89c690") +
    path("M18 41h64q-6 37-32 37T18 41Z", "#ef8187") +
    [
      [30, 48],
      [49, 62],
      [70, 48],
    ]
      .map(([x, y]) => ellipse(x, y, 2, 4, ink))
      .join(""),
  carrot:
    path("M25 32q24-15 39 4L35 89Z", "#f4a052") +
    path("m41 29-5-20 12 15 8-18 1 21 18-9-12 19", "#87be86") +
    path("m31 46 13-4m-10 22 8-3"),
  tomato:
    circle(50, 57, 31, "#ed736b") +
    path("m25 30 18-1 7-18 7 18 18 1-15 10-10-7-10 7Z", "#7dbb83"),
  cucumber:
    path(
      "M23 79q-15-8-4-22L60 19q19-15 26 4 3 12-7 22L39 81q-8 8-16-2Z",
      "#83bb79",
    ) + path("m29 68 42-39m-37 24 4 3m16-20 3 4m-5 16 4 3"),
  bread:
    path(
      "M24 84V44q-15-17 1-27 10-7 25-2 15-5 25 2 16 10 1 27v40Z",
      "#d49b65",
    ) +
    path("M32 75V40q-12-13 0-16 10-5 18 1 8-6 18-1 12 3 0 16v35Z", "#f6dba3"),
  cheese:
    path("m15 42 46-22 25 26v34H15Z", "#f5cd60") +
    path("M15 42h71") +
    circle(35, 60, 7, "#dfac44") +
    circle(66, 67, 5, "#dfac44") +
    circle(56, 33, 3, "#dfac44"),
  egg:
    path(
      "M50 12C31 12 20 47 20 61c0 35 60 35 60 0 0-14-11-49-30-49Z",
      "#fff4d9",
    ) + path("M33 45q1-11 9-16", "none", 3),
  icecream:
    path("m27 48 23 43 23-43Z", "#dab07a") +
    path("m34 55 22 23m10-23-22 23") +
    circle(35, 40, 17, "#eaa5bd") +
    circle(65, 40, 17, "#eaa5bd") +
    circle(50, 24, 17, "#f9deb2"),
  pizza:
    path("m15 22 72 10-43 61Z", "#f5cc75") +
    path("M15 22q34-9 72 10l-6 10-63-9Z", "#d9945e") +
    circle(37, 46, 7, "#e47870") +
    circle(63, 46, 6, "#e47870") +
    circle(43, 72, 5, "#e47870"),
  bus:
    rect(10, 24, 80, 50, "#f4c763", 7) +
    [17, 37, 57].map((x) => rect(x, 32, 15, 20, "#b0dce4", 2)).join("") +
    rect(76, 32, 8, 31, "#b0dce4", 1) +
    wheels(),
  train:
    rect(12, 48, 68, 28, "#86bfb2") +
    rect(45, 22, 31, 32, "#86bfb2") +
    rect(51, 29, 17, 16, "#d0e9f0") +
    rect(23, 30, 10, 20, "#9b7bc2") +
    path("M17 30h22") +
    circle(24, 81, 8, ink) +
    circle(49, 81, 8, ink) +
    circle(73, 81, 8, ink) +
    circle(26, 16, 6, "#d8d9df"),
  plane: path(
    "M45 13q5-9 10 0l4 28 31 18v10L57 59v18l11 10H32l11-10V59L10 69V59l31-18Z",
    "#92cde1",
  ),
  boat:
    path("M12 65h77L76 85H28Z", "#b486cf") +
    path("M49 14v51M44 20 16 57h28Z", "#fff2c5") +
    path("m55 28 27 28H55Z", "#ee9b89") +
    path("M11 92q10-7 20 0 10 7 20 0 10-7 20 0 10 7 20 0"),
  bicycle:
    circle(24, 68, 18, "#e0ecf2") +
    circle(77, 68, 18, "#e0ecf2") +
    path("m24 68 17-30 15 30H24l39-27 14 27M35 34h15m13 7 4-13h11", "none", 4),
  rocket:
    path("M35 61 19 81V58l16-15m30 18 16 20V58L65 43", "#8cc2d4") +
    path("M36 65Q22 31 50 7q28 24 14 58Z", "#f5ede0") +
    circle(50, 36, 10, "#8cc2d4") +
    path("M38 72 44 94l6-10 6 10 6-22", "#f0b250"),
  umbrella:
    path(
      "M12 48q4-37 38-37 34 0 38 37-12-10-25 0-13-10-25 0-13-10-26 0Z",
      "#b198d9",
    ) + path("M50 48v31q0 20-16 8m16-76q-15 10-12 37m12-37q15 10 13 37"),
  key:
    circle(32, 32, 20, "#f3cc6d") +
    circle(32, 32, 7, "#fff5db") +
    path("m44 48 35 35 11-11-8-8-7 7-7-7 7-7-19-19", "#f3cc6d"),
  chair:
    rect(27, 15, 46, 39, "#b296ce") +
    rect(21, 54, 58, 12, "#b296ce") +
    path("M27 66v24m46-24v24M30 23v23m40-23v23"),
  bed:
    rect(12, 40, 76, 31, "#95c7d7") +
    rect(15, 35, 25, 19, "#fff2db") +
    path("M10 25v61m80-34v34M11 70h79") +
    path("M43 42v25"),
  cup:
    path("M72 34q29-7 19 21-6 10-21 5") +
    path("M20 30h54v34q0 20-27 20T20 64Z", "#a992ce") +
    path("M32 20q-7-7 0-14m17 14q-7-7 0-14"),
  spoon:
    ellipse(50, 28, 16, 22, "#b4d0df") +
    path("M45 49h10l3 36q-8 11-16 0Z", "#b4d0df"),
  brush:
    rect(32, 39, 13, 53, "#89c8b3") +
    rect(32, 11, 32, 28, "#89c8b3") +
    path("M45 15h24m-24 7h24m-24 7h24m-24 7h24", "none", 4),
  pencil:
    path("m19 72 48-58 17 14-48 58-23 7Z", "#f2c769") +
    path("m19 72 17 14-23 7Z", "#e4c4a0") +
    path("m67 14 7-7 17 14-7 7Z", "#e59eb0") +
    path("m30 71 43-51m-60 73 3-9 6 5Z", ink),
  scissors:
    circle(27, 75, 13, "#aa8dce") +
    circle(70, 75, 13, "#aa8dce") +
    path("m35 65 36-50-6 34-20 21m17-5L26 15l6 34 20 21", "#b6cbd8") +
    circle(49, 52, 3, ink),
  hat:
    path("M23 64V48q0-28 27-28t27 28v16Z", "#bba1db") +
    rect(17, 62, 66, 17, "#bba1db") +
    circle(50, 14, 9, "#eec98a") +
    path("M34 34v25m16-30v30m16-25v25"),
  shirt:
    path(
      "m34 18-24 18 13 18 10-8v41h34V46l10 8 13-18-24-18q-16 16-32 0Z",
      "#86c3b0",
    ) +
    path("M50 32v48") +
    circle(55, 46, 1, ink) +
    circle(55, 59, 1, ink) +
    circle(55, 72, 1, ink),
  sock:
    path(
      "M43 12h31v46q0 17-14 23L31 91q-20 1-17-15 1-8 14-13l15-6Z",
      "#eca3b9",
    ) + path("M43 24h31M18 70q13 2 14 19m28-34q0 15 13 16"),
  mitten:
    path(
      "M32 81V60L18 43q-8-16 4-19 7-1 15 14V21q2-17 15-11 7-6 14 1 16-4 15 16v31L69 81Z",
      "#f1c66f",
    ) + rect(30, 78, 41, 15, "#99c8c1"),
  drum:
    ellipse(50, 64, 32, 18, "#b392d3") +
    rect(18, 35, 64, 30, "#b392d3", 0) +
    ellipse(50, 35, 32, 15, "#f9e4b9") +
    path("m20 48 12 16 12-16 12 16 12-16 12 16M21 8l28 23m31-21L56 31"),
  guitar:
    path(
      "M48 40q-19-10-23 5 8 14-7 18-8 23 14 28 26 4 29-20-14-8-6-17Z",
      "#deb07b",
    ) +
    path("m48 52 17-39 9 4-17 39Z", "#ad835f") +
    circle(44, 66, 8, "#82634d") +
    path("m29 82 14-32m3 1L36 83m28-65 15 6"),
  kite:
    path("m50 8 32 36-32 34-32-34Z", "#f0b966") +
    path("M50 8v70M18 44h64m-14 7L50 78V44Z", "#a795d1") +
    path("M50 78q-16 5-4 15") +
    path("m45 85-9-2 4 8Z", "#ec9c9d"),
  moon:
    path("M65 12C7 8 3 85 58 90q20 0 30-19C48 85 31 29 65 12Z", "#f5d484") +
    circle(27, 55, 3, "#d1b66f"),
  cloud: path(
    "M23 77C0 74 3 43 24 42 20 16 56 9 66 34c29-5 40 39 12 43Z",
    "#bfdce7",
  ),
  rainbow:
    path("M9 80a41 57 0 0 1 82 0", "none", 12) +
    path("M9 80a41 57 0 0 1 82 0", "none", 9).replace(ink, "#e89695") +
    path("M20 80a30 44 0 0 1 60 0", "none", 10).replace(ink, "#efc46f") +
    path("M30 80a20 31 0 0 1 40 0", "none", 10).replace(ink, "#90c4a1") +
    path("M40 80a10 18 0 0 1 20 0", "none", 9).replace(ink, "#a3b7d7"),
  snowman:
    circle(50, 68, 24, "#edf6f5") +
    circle(50, 33, 17, "#edf6f5") +
    rect(35, 7, 30, 17, "#aa90c9") +
    path("M27 24h46M25 62 9 49m66 13 16-14") +
    eyes(31, 44, 12) +
    path("m50 37 13 3-13 3Z", "#f1b266") +
    circle(50, 62, 2, ink) +
    circle(50, 74, 2, ink) +
    path("M35 48h31l-7 13-8-13", "#e8a2aa"),
  leaf:
    path("M19 80Q1 22 84 12 88 88 19 80Z", "#8fc381") +
    path("M12 90 69 30M27 73l-5-26m21 10-4-26m5 26 25 3"),
  mushroom:
    path("M40 44h20l10 42H30Z", "#f3e4bc") +
    path("M11 49q4-39 39-39t39 39Z", "#dca187") +
    circle(34, 31, 6, "#fff3d5") +
    circle(61, 25, 5, "#fff3d5") +
    circle(73, 42, 5, "#fff3d5"),
  shell:
    path(
      "M50 85 16 57q-14-29 6-33 1-17 18-12 10-12 21 0 17-4 19 13 20 4 5 32L50 85Z",
      "#e7b7c5",
    ) + path("M50 85 23 26m27 59L41 16m9 69 10-69M50 85l29-57"),
};
