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

	return (
		<a href={`${s3BucketPrefix}${src}`} target="_blank" rel="noopener noreferrer">
			<img
				ref={imgRef}
				src={loaded ? `${s3BucketPrefix}${src}` : loadingIMG }
				alt={alt}
				className='w-full'
			/>
		</a>
	);
};
