import React, { useEffect, useState, useRef } from 'react'
import loadingIMG from '../Assets/loading.webp'

export const LazyLoadImage = ({ src, alt }) => {
	const [loaded, setLoaded] = useState(false);
	const s3BucketPrefix = "https://imagebucketdalle.s3.us-east-2.amazonaws.com/";
	const imgRef = useRef();

	useEffect(() => {
		const observer = new IntersectionObserver( entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					setLoaded(true);
					//observer.unobserve(entry.target);
					observer.disconnect();
				}
			});
		});

		observer.observe(imgRef.current);

		return () => {
			observer.disconnect();
		};
	}, []);

	/*
				{image.map((url, index) => (
					<div key={index} className="max-w-sm rounded overflow-hidden shadow-lg m-auto transform transition-transform duration-500 hover:scale-110">
						<a href={url} target="_blank" rel="noopener noreferrer">
							<img className="w-full" src={url} alt={`Image ${index + 1}`} />
						</a>
					</div>
	*/


	return (
		<img
			ref={imgRef}
			src={loaded ? `${s3BucketPrefix}${src}` : loadingIMG }
			alt={alt}
			className='w-full'
		/>
	);
};
