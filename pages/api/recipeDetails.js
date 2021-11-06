export default async function recipeDetailsAPI(req, res) {
  const result = await fetch(
    `https://api.spoonacular.com/recipes/${req.query.id}/information&apiKey=${process.env.SPOONACULAR_API_KEY}`
  );
  res.status(200).send(result.body);
}
