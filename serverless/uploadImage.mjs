// Import necessary AWS SDK and other libraries
import AWS from 'aws-sdk';
import fetch from 'node-fetch';
import { Readable } from 'stream';

// Initialize the S4 client
const s3 = new AWS.S3();

// Function to convert a Buffer into a Readable Stream
const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // indicates the end of the stream
  return stream;
};



// Lambda handler function
export const handler = async (event) => {
  const imageUrl = event.url; // URL is passed in the event object
  //const bucketName = 'imagebucketdalle'; // Specify your bucket name
  const bucketName = 'arn:aws:s3:::imagebucketdalle';
  const key = `images/${Date.now()}.jpg`; // Generate a unique key for the S3 object

  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const buffer = await response.buffer();

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
      body: JSON.stringify({
        message: 'Image uploaded successfully!',
        uploadResult
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to process image',
        error: error.message
      })
    };
  }
};