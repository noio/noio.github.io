module.exports = function(eleventyConfig) {
  // Aliases are in relation to the _includes folder
  eleventyConfig.addLayoutAlias('post', 'post.html');
  eleventyConfig.addLayoutAlias('default', 'default.html');
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addPassthroughCopy("assets");

  return {
    dir: {
      input: "./",
      output: "./_site"
    },
    templateFormats: [
      "md",
      "png",
      "html",
      "xml",
      "liquid"
    ],
    passthroughFileCopy: true
  };
}
