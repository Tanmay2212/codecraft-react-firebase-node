import { useState } from "react";
import Fuse from "fuse.js";
import concepts from "../data/concepts.json";

export default function SearchBox({ onSelect }) {
  const [query, setQuery] = useState("");

  const fuse = new Fuse(concepts, {
    keys: ["title", "description"],
    threshold: 0.3, // how fuzzy match is
  });

  const results = query ? fuse.search(query).map((r) => r.item) : [];

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        type="text"
        className="border px-4 py-2 w-full"
        placeholder="Search concept like useState, map, etc"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="mt-2 border rounded bg-white">
          {results.map((item) => (
            <li
              key={item.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(item)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
