import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health check
 */

/**
 * @swagger
 * /health-check:
 *   get:
 *     tags: [Health check]
 *     summary: Check the health of the server
 *     name: Health check
 *     description: Check if the server is up and running
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

export default router;
