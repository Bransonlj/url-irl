import { useState } from 'react'
import './App.css'
import { isValidShortUrl, isValidUrl, parseUrl } from './utils/urls';

function App() {

  const [fullUrl, setFullUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function resetPage() {
    setFullUrl("");
    setShortUrl("");
    setError("");
    setIsSubmitted(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const parsedUrl = parseUrl(fullUrl);
    setError("");
    const body = {
      url: parsedUrl,
      shortURL: shortUrl,
    }

    if (!isValidUrl(parsedUrl)) {
      setError("Invalid Url");
      return 
    }

    if (!isValidShortUrl(shortUrl)) {
      setError("Invalid ShortUrl");
      return 
    }

    try {
      const response = await fetch(`/api/url/`,  { 
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": 'application/json'
        }
      })

      if (response.ok) {
        setFullUrl(parsedUrl)
        setShortUrl(window.location.href.split("?")[0] + shortUrl)
        setIsSubmitted(true);

      } else {
        throw new Error("unsuccessful")
      }
    } catch (error) {
      setError(error.message);
    }
    
  }
  
  if (isSubmitted) {
    return (
      <div>
        <label>full url</label>
        <input readOnly={true} value={fullUrl} />
        <label>short url</label>
        <input readOnly={true} value={shortUrl} />
        <button type='button' onClick={() => resetPage()}>Shorten Another</button>
      </div>
    )
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>full url</label>
        <input value={fullUrl} onChange={(e) => setFullUrl(e.target.value)}/>
        <label>short url</label>
        <input value={shortUrl} onChange={(e) => setShortUrl(e.target.value)}/>
        <button type='submit'>shorten!</button>
        {error && <label>{ error }</label>}
      </form>
    </div>
  )
}

export default App
