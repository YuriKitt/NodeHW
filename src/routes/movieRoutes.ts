import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Movie, { IMovie } from '../models/movie';
import Genre from '../models/genre';

const router = Router();

async function validateGenres(genreNames: string[]) {
  const genres = await Genre.find({ name: { $in: genreNames } });
  return genres.length === genreNames.length;
}

const movieSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  releaseDate: Joi.date().required(),
  genre: Joi.array().items(Joi.string()).required()
});

const movieUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  releaseDate: Joi.date(),
  genre: Joi.array().items(Joi.string())
}).min(1);

const idSchema = Joi.string().length(24).hex().messages({
    'string.length': 'Movie ID must be 24 characters long',
    'string.hex': 'Movie ID must only contain hexadecimal characters'
  });

const genreNameSchema = Joi.string().min(3).max(50).messages({
  'string.min': 'Genre name must be at least 3 character long',
  'string.max': 'Genre name must be less than or equal to 50 characters long',
});

/**
 * @swagger
 * tags:
 *   name: Movies
 */

/**
 * @swagger
 * /api/movies:
 *   post:
 *     tags: [Movies]
 *     summary: Create a new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await movieSchema.validateAsync(req.body);
    const areGenresValid = await validateGenres(req.body.genre);
    if (!areGenresValid) {
      return res.status(400).json({ error: 'One or more genres are invalid' });
    }
    const newMovie: IMovie = new Movie(req.body);
    const movie = await newMovie.save();
    res.status(201).json(movie);
  } catch (error: unknown) {
    next(error);
  }
});

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags: [Movies]
 *     summary: Read all movies
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error: unknown) {
    next(error);
  }
});

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Read a single movie by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the movie to get
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await idSchema.validateAsync(req.params.id);
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error: unknown) {
    next(error);
  }
});

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     tags: [Movies]
 *     summary: Update a movie by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the movie to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await idSchema.validateAsync(req.params.id);
    await movieUpdateSchema.validateAsync(req.body);
    if ('genre' in req.body) {
      const areGenresValid = await validateGenres(req.body.genre);
      if (!areGenresValid) {
        return res.status(400).json({ error: 'One or more genres are invalid' });
      }
    }
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedMovie) {
      res.status(200).json(updatedMovie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error: unknown) {
    next(error);
  }
});

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     tags: [Movies]
 *     summary: Delete a movie by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the movie to delete
 *     responses:
 *       204:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await idSchema.validateAsync(req.params.id);
    const deletedMovie = await Movie.findByIdAndRemove(req.params.id);
    if (deletedMovie) {
      res.status(204).json(deletedMovie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error: unknown) {
    next(error);
  }
});

/**
 * @swagger
 * /api/movies/genre/{genreName}:
 *   get:
 *     tags: [Movies]
 *     summary: Search movies by genre
 *     parameters:
 *       - name: genreName
 *         in: path
 *         required: true
 *         description: Name of the genre to search movies by
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: No movies found for this genre
 *       500:
 *         description: Internal Server Error
 */
router.get('/genre/:genreName', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await genreNameSchema.validateAsync(req.params.genreName);
      const genreName = req.params.genreName;
      const movies = await Movie.find({ genre: genreName });
      if (movies.length > 0) {
        res.status(200).json(movies);
      } else {
        res.status(404).json({ error: "No movies found for this genre" });
      }
    } catch (error: unknown) {
      next(error);
    }
  });

export default router;