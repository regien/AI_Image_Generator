import React, { useEffect, useState, useRef } from 'react'
// testing files
import { Link, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from './LazyLoadImage'

export const ImageGallery = () => {
	const [images, setImages] = useState([]);

	const [allImagesLoaded, setAllImagesLoaded] = useState(false);

	const [continuationToken, setContinuationToken] = useState(null);
	const pageSize = 50;

	const navigate = useNavigate();
	const fetchImages = async () => {
		try {

			const body = {
				pageSize
			}

			if (continuationToken) {
				body.continuationToken = continuationToken;
			}
			console.log(continuationToken);
			
			const response = await fetch(
				"https://4sen4bpej9.execute-api.us-east-2.amazonaws.com/default/getImagesFromS3",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"User-Agent": "Chrome",
					},
					body: JSON.stringify(body),
				}
			);
			const data = await response.json();
			console.log(data);
			const parsedBody = JSON.parse(data.body);
			console.log(parsedBody);
			setImages(prevImages => [...prevImages, ...parsedBody.keys]);

			if (parsedBody.isTruncated) {
				setContinuationToken(parsedBody.nextContinuationToken);
			}
			else {
				setContinuationToken(null);
			}
		} catch (error) {
			console.error("Failed to fetch images:", error);
		}
	};

	useEffect(() => {
		if (images.length === 0 && continuationToken === null)
		{
			fetchImages();
		}
	}, [images, continuationToken]);




	const goToImageGenerator = () => {
		navigate('/');
	};
	

	const loadMoreImages = () => {
		if (continuationToken !== null)
		{
			fetchImages();
		} else {
			setAllImagesLoaded(true);
		}
	}
	

	return (
		<div>
			<h1 className="font-bold my-8 text-7xl text-center">
				This is the cool art being done with <span className="text-pink-500">AI</span> so far <span className="text-pink-500">At the Expo</span>
			</h1>
			<div className="text-center my-4">
				<button className="bg-pink-400 hover:bg-pink-700 text-white font-bold text-2xl py-2 px-8 rounded-full" onClick={goToImageGenerator}>
					Start Creating Now
				</button>
			</div>
			<div className="grid grid-cols-3 gap-4 p-4 items-center justify-center">
				{images.map((url, index) => (
					<div key={index} className="max-w-sm rounded overflow-hidden shadow-lg m-auto transform transition-transform duration-500 hover:scale-110">
						<LazyLoadImage src={url} alt={`Image ${index + 1}`} />
					</div>
				))}
			</div>
			{allImagesLoaded && <p className="text-center text-2xl m-6">All images loaded <Link to="/" className="text-pink-500 hover:underline">Keep creating here</Link></p>}
			<button onClick={loadMoreImages} className="bg-pink-400 hover:bg-pink-700 text-white font-bold text-2xl py-2 px-8 rounded-full m-auto block mb-8 mt-6">
				Load More
			</button>
		</div>
  	);
  
}
