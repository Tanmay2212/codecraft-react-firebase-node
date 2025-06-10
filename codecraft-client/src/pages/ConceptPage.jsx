import { useState } from "react";
import SearchBox from "../components/SearchBox";

export default function ConceptPage() {
  const [selectedConcept, setSelectedConcept] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-2xl font-bold mb-6">🔍 Search JS/React Concept</h1>
      <SearchBox onSelect={setSelectedConcept} />

      {selectedConcept && (
        <div className="mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">{selectedConcept.title}</h2>
          <p className="mt-2 text-gray-700">
            <strong>Description:</strong> {selectedConcept.description}
          </p>
          <p className="mt-2 text-gray-700">
            <strong>Example:</strong> <code>{selectedConcept.example}</code>
          </p>
          <p className="mt-2 text-green-700">
            <strong>Real-life:</strong> {selectedConcept.realLife}
          </p>
        </div>
      )}
    </div>
  );
}
