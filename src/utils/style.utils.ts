// Constants
const randomColors = ['lime', 'cyan', 'yellow', 'magenta'];

// Export style utils
export const getRandomGradientColors = () => {
  const randomColor1 = randomColors[Math.floor(Math.random() * randomColors.length)];
  let randomColor2 = randomColors[Math.floor(Math.random() * randomColors.length)];

  while (randomColor1 === randomColor2) {
    randomColor2 = randomColors[Math.floor(Math.random() * randomColors.length)];
  }

  return [randomColor1, randomColor2];
};

export const getRandomGradientClass = () => {
  const randomColors = getRandomGradientColors();

  return `${randomColors[0]}-${randomColors[1]}`;
};
