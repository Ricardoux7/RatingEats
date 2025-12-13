import { filterRestaurants, searchInBar } from '../controllers/filterController.controllers.js';
import express from 'express';
import { verifyResults } from '../middlewares/SearchMiddleware.middlewares.js';
const FilterRouter = express.Router();

FilterRouter.route('/').get(filterRestaurants);
FilterRouter.route('/search').get(searchInBar, verifyResults, (req, res) => {
  return res.status(200).json(res.locals.results);
});

export default FilterRouter;