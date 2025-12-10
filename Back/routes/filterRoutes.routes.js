import { filterRestaurants, searchInBar } from '../controllers/filterController.controllers.js';
import express from 'express';
const FilterRouter = express.Router();

FilterRouter.route('/').get(filterRestaurants);
FilterRouter.route('/search').get(searchInBar);
export default FilterRouter;