import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ContentCard from '../components/ContentCard';
import { searchContent } from '../services/tmdb';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim()) {
                setIsSearching(true);
                try {
                    const data = await searchContent(query);
                    // Filter out people, only show movie/tv
                    const filtered = data.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
                    setResults(filtered);
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
            }
        }, 500); // Debounce

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#141414' }}>
            <Navbar />
            <div style={{ paddingTop: '80px', paddingLeft: '4%', paddingRight: '4%' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', background: '#333', padding: '0.5rem', width: '100%', maxWidth: '400px', borderRadius: '4px' }}>
                    <SearchIcon color="#808080" />
                    <input
                        type="text"
                        placeholder="Genres, movies, TV shows..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'white', marginLeft: '1rem', width: '100%', fontSize: '1rem', outline: 'none' }}
                        autoFocus
                    />
                </div>

                {query && <h3 style={{ color: '#808080', marginBottom: '1rem' }}>Results for "{query}"</h3>}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {results.map(item => (
                        <div key={item.id} style={{ marginBottom: '20px' }}>
                            <ContentCard content={item} />
                        </div>
                    ))}
                    {query && !isSearching && results.length === 0 && (
                        <p style={{ color: '#fff' }}>No results found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
