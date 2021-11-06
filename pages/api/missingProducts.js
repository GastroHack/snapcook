export default async function missingProductsAPI(req, res) {
  const result = await fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${req.query.ingredients}&apiKey=${process.env.SPOONACULAR_API_KEY}`
  );
  res.status(200).send(result.body);
}
