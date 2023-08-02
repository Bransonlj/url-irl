import { useState } from 'react'
import styles from './App.module.scss'
import { isValidShortUrl, isValidUrl, parseUrl } from './utils/urls';

function App() {

  const [fullUrl, setFullUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [errorServer, setErrorServer] = useState("");
  const [errorLongUrl, setErrorLongUrl] = useState(false)
  const [errorShortUrl, setErrorShortUrl] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false);

  function resetPage() {
    setFullUrl("");
    setShortUrl("");
    setErrorServer("");
    setErrorLongUrl(false)
    setErrorShortUrl(false)
    setIsSubmitted(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const parsedUrl = parseUrl(fullUrl);
    setErrorServer("");
    setErrorLongUrl(false)
    setErrorShortUrl(false)
    const body = {
      url: parsedUrl,
      shortURL: shortUrl,
    }

    if (!isValidUrl(parsedUrl)) {
      setErrorLongUrl(true)
      return 
    }

    if (!isValidShortUrl(shortUrl)) {
      setErrorShortUrl(true)
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
        const result = await response.json()
        throw new Error(result)
      }
    } catch (error) {
      setErrorServer(error.message);
    }
    
  }
  
  if (isSubmitted) {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <h2>Shortened Successfully!</h2>

            <label>Full URL:</label>
            <div className={styles.row}>
              <input readOnly={true} value={fullUrl} />
              <button onClick={() => navigator.clipboard.writeText(fullUrl)}>Copy</button>
            </div>

            <label>Custom Link:</label>
            <div className={styles.row}>
              <input readOnly={true} value={shortUrl} />
              <button onClick={() => navigator.clipboard.writeText(shortUrl)}>Copy</button>
            </div>

          <button type='button' onClick={() => resetPage()}>Shorten Another</button>
        </div>
      </div>
    )
  }


  return (
    <div className={styles.mainContainer}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>

        <label>Full URL:</label>
        <input placeholder='Enter full url here' value={fullUrl} onChange={(e) => setFullUrl(e.target.value)}/>
        {errorLongUrl && <label className={styles.error}>Invalid URL</label>}
        <label>Custom Link:</label>

        <div className={styles.shortUrl}>
          <input readOnly={true} value={window.location.href.split("?")[0]} className={styles.baseUrl}></input>
          <input placeholder='Enter link' value={shortUrl} onChange={(e) => setShortUrl(e.target.value)}/>
        </div>
        {errorShortUrl && <label className={styles.error}>Invalid Link</label>}
        <div className={styles.row}>
          <button type='submit'>shorten!</button>
          {errorServer && <label className={styles.error}>{ errorServer }</label>}
        </div>
      </form>
    </div>
  )
}

export default App
