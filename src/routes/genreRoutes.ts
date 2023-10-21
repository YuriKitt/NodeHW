import { Router, Request, Response } from 'express';
import Genre, { IGenre } from '../models/genre';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Genres
 */

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Create a new genre
 *     tags: [Genres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Bad request
 */
router.post('/', async (req: Request, res: Response) => {
    try {
      const newGenre: IGenre = new Genre(req.body);
      const genre = await newGenre.save();
      res.status(201).json(genre);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
    }
  });

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Read all genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', async (_req: Request, res: Response) => {
    try {
      const genres = await Genre.find({});
      res.status(200).json(genres);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  });

/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     summary: Read a single genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
      const genre = await Genre.findById(req.params.id);
      if (genre) {
        res.status(200).json(genre);
      } else {
        res.status(404).json({ error: "Genre not found" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  });

/**
 * @swagger
 * /api/genres/{id}:
 *   put:
 *     summary: Update a genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Genre not found
 */
router.put('/:id', async (req: Request, res: Response) => {
    try {
      const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (updatedGenre) {
        res.status(200).json(updatedGenre);
      } else {
        res.status(404).json({ error: "Genre not found" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
    }
  });

/**
 * @swagger
 * /api/genres/{id}:
 *   delete:
 *     summary: Delete a genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
      if (deletedGenre) {
        res.status(200).json(deletedGenre);
      } else {
        res.status(404).json({ error: "Genre not found" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  });

export default router;
