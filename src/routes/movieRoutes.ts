import { Router, Request, Response } from 'express';
import Movie, { IMovie } from '../models/movie';

const router = Router();

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
 *       400:
 *         description: Bad Request
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const newMovie: IMovie = new Movie(req.body);
    const movie = await newMovie.save();
    res.status(201).json(movie);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
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
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
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
 *       404:
 *         description: Movie not found
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
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
 *       404:
 *         description: Movie not found
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedMovie) {
      res.status(200).json(updatedMovie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
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
 *       200:
 *         description: OK
 *       404:
 *         description: Movie not found
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedMovie = await Movie.findByIdAndRemove(req.params.id);
    if (deletedMovie) {
      res.status(200).json(deletedMovie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
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
 *       404:
 *         description: No movies found for this genre
 */
router.get('/genre/:genreName', async (req: Request, res: Response) => {
    try {
      const genreName = req.params.genreName;
      const movies = await Movie.find({ genre: genreName });
      if (movies.length > 0) {
        res.status(200).json(movies);
      } else {
        res.status(404).json({ error: "No movies found for this genre" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  });

export default router;
