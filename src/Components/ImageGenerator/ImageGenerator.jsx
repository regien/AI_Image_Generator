import React, { useRef, useState } from 'react'
import './ImageGenerator.css'
import default_image from '../Assets/default_image.png'


export const ImageGenerator = () => {
	
	const [image_url, setImage_url] = useState("/");
	let inputRef = useRef(null);

	const [loading, setLoading] = useState(false);


	const imageGenerator = async () => {
		if (inputRef.current.value === '') {
			return 0
		}
		
		setLoading(true);
		
		// todo gemalpar = add an env variable for heroku
		const response = await fetch(
			"https://api.openai.com/v1/images/generations",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization:
					"Bearer sk-proj-I7LRWxgVNgyjU0Op2XnjT3BlbkFJawXg7Ut018u1MTWz9ZKu",
					"User-Agent": "Chrome",
				},
				body: JSON.stringify({
					"model": "dall-e-2",
					prompt: `${inputRef.current.value}`,
					n: 1,
					size: "512x512",
				}),
			}
		);
		// do some type of error checking
		// like limit breaking or invalid size

		let data = await response.json();
		console.log(data);
		let data_array = data.data;
		setImage_url(data_array[0].url);
		setLoading(false);

		// store the image in the local storage
	}
 
  return (
	<div className='ai-image-generator'>
		<div className="header">Ai image <span>Generator</span></div>
		<div className="img-loading">
			<div className="image"><img src={image_url === '/' ? default_image : image_url} alt="" /></div>
			<div className="loading">
				<div className={ loading ? "loading-bar-full" : "loading-bar" }></div>
				<div className={ loading ? "loading-text" : "display-none" }>Loading.....</div>
			</div>

		</div>
		<div className="search-box">
			<input type="text" ref={inputRef} className="search-input" placeholder='Describe What you want to See'/>
			<div className="generate-btn" onClick={() => {imageGenerator()}}>Generate</div>
		</div>
	</div>
  )
}