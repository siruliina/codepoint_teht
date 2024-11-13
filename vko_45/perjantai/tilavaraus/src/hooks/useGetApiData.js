import axios from "axios";
import { useState, useEffect } from "react";

function useGetApiData(url) {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchData = () => {
        setLoading(true)
        setError("")

        axios.get(url, { withCredentials: true })
        .then((response) => {
            console.log("Tiedot haettiin onnistuneesti.");
            setData(response.data)
            setLoading(false)
        })
        .catch((error) => {
            console.error("Tietojen haussa esiintyi virhe: ", error.message);
            setLoading(false)
            setError(error)
        });
    }

    useEffect(() => {
        fetchData();
    }, [url])

    const refetch = () => {
        fetchData();
    }
   
    return {data, loading, error, refetch};

}

export default useGetApiData;