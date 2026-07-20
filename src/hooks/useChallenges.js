import { useState, useEffect } from 'react';
import api from '../api/axios';

export function useChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/challenges/')
      .then(({ data }) => setChallenges(data))
      .catch((err) => setError(err.message || 'Failed to load challenges'))
      .finally(() => setLoading(false));
  }, []);

  const updateChallenge = (id, updates) => {
    setChallenges(prev =>
      prev.map(sc => sc.id === id ? { ...sc, ...updates } : sc)
    );
  };

  return { challenges, loading, error, updateChallenge };
}
