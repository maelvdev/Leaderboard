import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "http://localhost:5000/controller";

const fetchScores = async () => {
    const { data } = await axios.get(API_BASE_URL);
    return Array.isArray(data) ? data : [];
};

const App = () => {
    const queryClient = useQueryClient();
    const { data: scores = [], isLoading } = useQuery({ queryKey: ["scores"], queryFn: fetchScores });

    const [pseudo, setPseudo] = useState("");
    const [score, setScore] = useState("");

    const mutation = useMutation({
        mutationFn: (newScore) => axios.post(API_BASE_URL, newScore),
        onSuccess: () => queryClient.invalidateQueries(["scores"]),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ pseudo, score: parseInt(score, 10) });
        setPseudo("");
        setScore("");
    };

    if (isLoading) return <div>Chargement...</div>;

    return (
        <div>
            <h1>Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Pseudo</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((score) => (
                        <tr key={score.id}>
                            <td>{score.pseudo}</td>
                            <td>{score.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Ajouter un Score</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
                <input type="number" placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} required />
                <button type="submit">Ajouter</button>
            </form>

            <button onClick={() => queryClient.invalidateQueries(["scores"])}>
                🔄 Recharger
            </button>
        </div>
    );
};

export default App;
