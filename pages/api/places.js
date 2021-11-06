// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function placesAPI(req, res) {

    const result = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.query.lat},${req.query.lot}&radius=2000&keyword=Grocery store&key=${process.env.GOOGLE_PLACE_API}`)

    res.status(200).send(result.body)
}
