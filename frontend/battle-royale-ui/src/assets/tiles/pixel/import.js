// Dynamically import images and export them
const imageContext = require.context('.', false, /\.(png|jpe?g|svg)$/);

const images = imageContext.keys().reduce((images, path) => {
  // Extract the file name without the './' prefix and file extension
  const key = path.slice(2, -4);
  images[key] = imageContext(path);
  return images;
}, {});

export default images;
