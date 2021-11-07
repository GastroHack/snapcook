export default async function recipeByIdsDetailsAPI(req, res) {
  console.log("req.query.arrayOfIds", req.query.recipeId);
  const result = await fetch(
    `https://api.spoonacular.com/recipes/informationBulk?ids=${req.query.arrayOfIds}&apiKey=${process.env.SPOONACULAR_API_KEY}`
  );
  res.status(200).send(result.body);
}
