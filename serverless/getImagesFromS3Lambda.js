const AWS = require("aws-sdk");
const { json } = require("stream/consumers");
const s3 = new AWS.S3();


exports.handler = async (event) => {
	const bucketName = 'imagebucketdalle';
	const pageSize = parseInt(event.pageSize, 10) || 50;
	const continuationToken = event. continuationToken || null;


	const params = {
		Bucket: bucketName,
		MaxKeys: pageSize
	};
	
	if (continuationToken) {
		params.ContinuationToken = continuationToken;
	}
	
	try {
		const data = await s3.listObjectsV2(params).promise();

		const response = {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*", // Required for CORS support to work
				"Acces-Control-Allow-Methods": "OPTIONS,GET,POST",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
			body: JSON.stringify({
				keys: data.Contents.map((item) => item.Key),
				nextContinuationToken: data.NextContinuationToken,
				isTruncated: data.IsTruncated,
			})
		}

		return response;
	} catch(error) {
		console.error("Error Fetching objects from S3:", error);

		return {
			statusCode: 500,
			body: JSON.stringify({ message: "Failed to fetch images from S3"}),
			headers: {
				"Access-Control-Allow-Origin": "*", // Required for CORS support to work
				"Acces-Control-Allow-Methods": "OPTIONS,GET,POST",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		};
	}
};