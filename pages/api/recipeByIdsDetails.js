export default async function recipeByIdsDetailsAPI(req, res) {
  const result = await fetch(
    `https://api.spoonacular.com/recipes/informationBulk?ids=${req.query.arrayOfIds[0]}&apiKey=${process.env.SPOONACULAR_API_KEY}`
  );
  res.status(200).send(result.body);
}
