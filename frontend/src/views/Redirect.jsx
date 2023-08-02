import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import styles from './Redirect.module.scss'

export default function Redirect() {

    const { shortUrl } = useParams()
    const [error, setError] = useState("");
    const [fullUrl, setFullUrl] = useState("")
    const [countdown, setCountdown] = useState(0);
    const [isCounting, setIsCounting] = useState(false);

    function startCounting() {
        setCountdown(0);
        setIsCounting(true)
    }

    useEffect(() => {
        if (isCounting) {
            if (countdown > 4) {
                setIsCounting(false)
                window.location.replace(fullUrl);
                return 
            }

            const timer = setInterval(() => {
                console.log(countdown);
                setCountdown(countdown + 1);
            }, 1000)
            
            return () => clearInterval(timer);
        }

    }, [countdown, isCounting])

    useEffect(() => {
        setError("");
        setFullUrl("");
        if (shortUrl) {
            fetch(`/api/url/${shortUrl}`)
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error(res.status, res.statusText);
                    }

                })
                .then(data => {
                    console.log(data);
                    setFullUrl(data.url);
                    startCounting()
                })
                .catch(err => setError("Error invalid link" + err))
        }

    }, [shortUrl])

    if (error) {
        return (
            <div className={styles.mainContainer}>
                <h2>Error</h2>
                <p>{ error }</p>
                <Link to={"/"}>Return home</Link>
            </div>
        )
    }
    
    return (
        <div className={styles.mainContainer}>
            <label>Redirecting you to {fullUrl} in {5 - countdown}... </label>
            <div>
                <label>Click </label>
                <Link to={ fullUrl }>here</Link>
                <label> to navigate manually</label>
            </div>
            <Link to={ "/" }>Return to safety</Link>
        </div>
    )
}
