import React, { useRef, useState } from 'react'
import './ImageGenerator.css'
import default_image from '../Assets/default_image.png'
import { useNavigate } from 'react-router-dom';

import AWS from 'aws-sdk';


//const lambda = new AWS.Lambda();

export const ImageGenerator = () => {
	
	const [image_url, setImage_url] = useState("/");
	const [useImageCount, setUseImageCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const MAX_NUMBER_OF_USES = 2;
	const navigate = useNavigate();
	let inputRef = useRef(null);

	const imageGenerator = async () => {
		if (inputRef.current.value === '' || useImageCount >= 2) {
			return 0
		}
		
		setLoading(true);
		
		try {

			const responseFromS3 = await fetch(
				"https://jjav8ageyg.execute-api.us-east-2.amazonaws.com/default/uploadImage",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"User-Agent": "Chrome",
					},
					body: JSON.stringify({
						prompt: `${inputRef.current.value}`,
					}),
				}
			);

			if (!responseFromS3.ok)
			{
				throw new Error("Something went wrong, Art couldn't be stored in Gallery.");
			}

			let dataFromS3 = await responseFromS3.json();
			console.log(dataFromS3);
			let dataResponseBody = JSON.parse(dataFromS3.body);
			console.log(dataResponseBody);
			
			setImage_url(dataResponseBody.imageUrl);
			setUseImageCount(useImageCount + 1);

			// if Failed try again

			//let data = await responseFromS3.json();

		} catch (error) {
			setError(error.message);
		}

	}

	const handleImageLoad = () => {
		setLoading(false);
	};

	const goToGallery = () => {
		navigate("/gallery");
	};
 
  return (
	<div className='ai-image-generator'>
		<div className="header">Ai image <span>Generator</span></div>
		<div className="img-loading">
			<div className="image"><img src={image_url === '/' ? default_image : image_url} alt="" onLoad={handleImageLoad} /></div>
			<div className="loading">
				<div className={ loading ? "loading-bar-full" : "loading-bar" }></div>
				<div className={ loading ? "loading-text" : "display-none" }>Loading.....</div>
			</div>

		</div>
		<div className="search-box">
			<input type="text" ref={inputRef} className="search-input" placeholder='Describe What you want to See' disabled={useImageCount >= MAX_NUMBER_OF_USES || loading}/>
			<div className="generate-btn" onClick={() => {imageGenerator()}} disabled={useImageCount >= MAX_NUMBER_OF_USES || loading}>Generate</div>
		</div>
			{error && <p className="mt-2 text-red-500">{error}</p>}
		<div>
			<button className='generate-btn' onClick={goToGallery}>Go to gallery</button>
		</div>
	</div>
  )
}