import React, { useEffect, useState } from 'react'
// testing files
import vivaldi1 from '../Assets/vivaldi1.webp'
import vivaldi2 from '../Assets/vivaldi2.webp'
import vivaldi3 from '../Assets/vivaldi3.webp'
import { useNavigate } from 'react-router-dom'
import { LazyLoadImage } from './LazyLoadImage'

export const ImageGallery = () => {
	// testing, later use a get request from S3 for latest art.
	const [image, setImages] = useState([vivaldi1, vivaldi2, vivaldi3]);

	const [page, setPage]  = useState(1);
	const pageSize = 50;

	const navigate = useNavigate();

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await fetch(`get_lambda_function?page=${page}&pageSize=${pageSize}`);
				const data = await response.json();
				setImages(prevImages => [...prevImages, ...data]);
			} catch (error) {
				console.error("Failed to fetch images:", error);
			}
		};

		fetchImages();

	}, [page]);




	const goToImageGenerator = () => {
		navigate('/');
	};
	

	const loadMoreImages = () => {
		setPage(prevPage => prevPage + 1);
	}
	

	return (
		<div>
			<h1 className="font-bold my-8 text-7xl text-center">
				This is the cool art being done with <span className="text-pink-500">AI</span> so far <span className="text-pink-500">At the Expo</span> Today
			</h1>
			<div className="text-center my-4">
				<button className="bg-pink-400 hover:bg-pink-700 text-white font-bold text-2xl py-2 px-8 rounded-full" onClick={goToImageGenerator}>
					Start Creating Now
				</button>
			</div>
			<div className="grid grid-cols-3 gap-4 p-4 items-center justify-center">
				{image.map((url, index) => (
					<div key={index} className="max-w-sm rounded overflow-hidden shadow-lg m-auto transform transition-transform duration-500 hover:scale-110">
						<a href={url} target="_blank" rel="noopener noreferrer">
							{/* <img className="w-full" src={url} alt={`Image ${index + 1}`} /> */}
							<LazyLoadImage src={url} alt={`Image ${index + 1}`} />
						</a>
					</div>
				))}
			</div>
			<button onClick={loadMoreImages} className="bg-pink-400 hover:bg-pink-700 text-white font-bold text-2xl py-2 px-8 rounded-full m-auto block">
				Load More
			</button>
		</div>
  	);
  
}
