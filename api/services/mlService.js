/**
 * MlService.js
 * 
 * Service to run the machine learning prediction Python script.
 * 
 * This service exposes a static method getPrediction that accepts an input data object
 * representing property features, serializes it to JSON, and passes it as an argument
 * to the Python prediction script via a child process.
 * 
 * It handles escaping of quotes in the JSON string to safely pass it via the command line.
 * The Python script is expected to output a JSON string containing the predicted price
 * and pricing status (underpriced, fairly priced, overpriced).
 * 
 * The service captures the stdout output, parses it to a JavaScript object, and resolves
 * the promise with the result.
 * 
 * If any error occurs during execution or parsing, the promise is rejected with an error message.
 * 
 * Usage:
 * Call MlService.getPrediction(inputData) where inputData is an object with necessary property features.
 * The method returns a promise that resolves with the prediction result.
 * 
 * Example:
 * MlService.getPrediction({ city: "Beirut", price: 200000, bedrooms: 3, ... })
 *   .then(result => console.log(result))
 *   .catch(err => console.error(err));
 */
const { exec } = require('child_process');

class MlService {
    static async getPrediction(inputData) {
        return new Promise((resolve, reject) => {
            const dataString = JSON.stringify(inputData);

            // Escape the data string to prevent issues with quotes
            const escapedDataString = dataString.replace(/"/g, '\\"');

            exec(`python ./machineLearning/predict.py "${escapedDataString}"`, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error executing Python script: ${error.message}`);
                }
                if (stderr) {
                    reject(`stderr: ${stderr}`);
                }

                try {
                    const result = JSON.parse(stdout);
                    resolve(result);  // Return both predicted price and status
                } catch (parseError) {
                    reject(`Error parsing Python script output: ${parseError.message}`);
                }
            });
        });
    }
}

module.exports = MlService;
