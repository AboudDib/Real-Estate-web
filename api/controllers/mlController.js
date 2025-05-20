/**
 * MlController.js
 *
 * This controller handles incoming HTTP requests related to machine learning predictions.
 * It receives input data from the client, logs it for verification, and forwards it to the MlService
 * for processing. The service returns a predicted price along with a price status (e.g., fair, underpriced, overpriced),
 * which is then returned to the client in JSON format.
 *
 * Methods:
 * - predict(req, res): Handles POST requests with property data, calls the MlService to get a prediction,
 *   and responds with the result or an error message.
 *
 * Dependencies:
 * - MlService: Contains the core logic for interacting with the machine learning model or script.
 *
 * Usage:
 * This controller is typically used in routes like POST /api/ml/predict.
 */
``

const MlService = require('../services/mlService');

class MlController {
    static async predict(req, res) {
        const inputData = req.body;

        // Log the received input data to verify its structure
        console.log("Received input data:", inputData);

        try {
            // Get the prediction result from the MlService
            const result = await MlService.getPrediction(inputData);

            // Send back the full result (both predicted price and price status)
            res.json(result);
        } catch (error) {
            console.error(`Prediction error: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = MlController;
