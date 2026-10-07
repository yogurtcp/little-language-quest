// Each generated atlas has a fixed four-column layout shared by every language.
export const pixelSheets = {
  animals: ["dog", "cat", "cow", "duck", "rabbit", "bear", "lion", "elephant", "giraffe", "monkey", "horse", "sheep", "pig", "mouse", "frog", "turtle"],
  nature: ["fish", "butterfly", "bee", "snail", "bird", "rooster", "penguin", "sun", "tree", "flower", "star", "moon", "cloud", "rainbow", "snowman", "leaf"],
  food: ["juice", "sausage", "banana", "milk", "chocolate", "candy", "cake", "apple", "pear", "orange", "lemon", "strawberry", "grapes", "watermelon", "carrot", "tomato"],
  home: ["cucumber", "bread", "cheese", "egg", "icecream", "pizza", "house", "window", "clock", "book", "umbrella", "key", "chair", "bed", "cup", "spoon"],
  objects: ["car", "bus", "train", "plane", "boat", "bicycle", "rocket", "balloon", "ball", "shoe", "brush", "pencil", "scissors", "hat", "shirt", "sock"],
  extras: ["mitten", "drum", "guitar", "kite", "mushroom", "shell"],
};
export const pixelArtwork = Object.fromEntries(
  Object.entries(pixelSheets).flatMap(([sheet, ids]) =>
    ids.map((id, index) => [id, { sheet, column: index % 4, row: Math.floor(index / 4) }]),
  ),
);
