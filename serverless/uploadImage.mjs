const AWS = require('aws-sdk');
const { Readable } = require('stream');

let fetch;

// Dynamic import of node-fetch
const fetchPromise = import('node-fetch').then((nodeFetch) => {
	fetch = nodeFetch.default;
}).catch((error) => {
	console.error('Failed to import node-fetch', error);
});

const s3 = new AWS.S3();

// Function to convert a Buffer into a Readable Stream
const bufferToStream = (buffer) => {
	const stream = new Readable();
	stream.push(buffer);
	stream.push(null); // indicates the end of the stream
	return stream;
};

/*
Takes an Image prompt as a value and stores it in s3
*/
exports.handler = async (event) => {

	await fetchPromise;

	try {
		if (!event.prompt) {
			throw new Error("Prompt is Empty or Invalid");
		}

		const response = await fetch(
			"https://api.openai.com/v1/images/generations",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
					"User-Agent": "Chrome",
				},
				body: JSON.stringify({
					"model": "dall-e-2",
					prompt: `${event.prompt}`,
					n: 1,
					size: "512x512",
				}),
			}
		);

		if (!response.ok)
		{
			throw new Error("Something went wrong, input might be invalid or server saturated please try again later.")
		}

		let openAIPromptData = await response.json();
		console.log(openAIPromptData);
		let dataArray = openAIPromptData.data;
		let imageUrl = dataArray[0].url;
		const bucketName = 'imagebucketdalle';
		const key = `${Date.now()}.jpg`;

		// then Upload to S3;
		const s3Response = await fetch(imageUrl);

		if (!s3Response.ok) {
			throw new Error(`Failed to fetch image: ${s3Response.statusText}`);
		}

		const buffer = await s3Response.buffer();

		// Upload the image to S3
		const uploadParams = {
			Bucket: bucketName,
			Key: key,
			Body: bufferToStream(buffer),
			ContentType: 'image/jpeg' // Adjust content type based on actual image type if necessary
		};
		const uploadResult = await s3.upload(uploadParams).promise();

		// Return the result
		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Headers": "Content-Type",
				"Access-Control-Allow-Origin": "*", // Required for CORS support to work
				"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
			},
			body: JSON.stringify({
				message: 'Image uploaded successfully!',
				imageUrl: `${imageUrl}`,
				uploadResult
			})
		};


	} catch (error) {
		return {
			statusCode: 500,
			headers: {
				"Access-Control-Allow-Headers": "Content-Type",
				"Access-Control-Allow-Origin": "*", // Required for CORS support to work
				"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
			},
			body: JSON.stringify({
				message: 'Failed to process image',
				error: error.message
			})
		};
	}
};