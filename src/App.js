import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { ImageGenerator } from './Components/ImageGenerator/ImageGenerator';
import { ImageGallery } from './Components/ImageGenerator/ImageGallery';
// make a gallery 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageGenerator/>}/>
        <Route path="/gallery" element={<ImageGallery/>}/>
      </Routes>
    </Router>
    /*<div>
      <ImageGenerator/>
    </div>*/
  );
}

export default App;
