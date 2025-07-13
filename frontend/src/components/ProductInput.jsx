import { useEffect, useState, useRef } from "react";
import { fetchProducts } from "../services/productService";

const ProductInput = ({ value, onChange }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchProducts();
        const sorted = list.sort((a, b) =>
          a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
        );
        setProducts(sorted);
      } catch (err) {
        console.error("Erreur chargement produits", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (typeof value === "string") {
      setInputVal(value);
    } else if (value?.name) {
      setInputVal(value.name);
    } else {
      setInputVal("");
    }
  }, [value]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputVal(val);

    const filteredList = val.trim()
      ? products.filter((p) =>
          p.name.toLowerCase().includes(val.toLowerCase())
        )
      : products;

    setFiltered(filteredList);
    setHighlightedIndex(-1);
    setShowSuggestions(true);
  };

  const handleSelect = (product) => {
    setInputVal(product.name);
    onChange(product);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filtered.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filtered.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(filtered[highlightedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-2 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
        value={inputVal}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setFiltered(products);
          setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        placeholder="Produit"
        required
        autoComplete="off"
      />

      {showSuggestions && (
        <ul
          ref={suggestionsRef}
          className="absolute bg-white text-black border border-gray-200 rounded shadow z-10 w-full max-h-48 overflow-y-auto mt-1"
        >
          {filtered.length === 0 ? (
            <li className="p-2 text-gray-500 italic">Aucun produit trouvé</li>
          ) : (
            filtered.map((p, index) => (
              <li
                key={p._id}
                className={`p-2 cursor-pointer ${
                  highlightedIndex === index
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleSelect(p)}
              >
                {p.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ProductInput;
