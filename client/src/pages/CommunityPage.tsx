import { useState } from "react";
import { api } from "../api/client";
import { ItemCard } from "../components/ItemCard";
import { StatusMessage } from "../components/StatusMessage";
import type { Item } from "../types";

export function CommunityPage() {
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState("community");
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSearched(true);
    try {
      const params = new URLSearchParams({ search, scope });
      const data = await api<{ items: Item[] }>(`/community/items?${params}`);
      setItems(data.items);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Search failed");
    }
  }

  return (
    <section>
      <p className="eyebrow">Reuse before replacement</p>
      <h1>Community inventory</h1>
      <form onSubmit={submit} className="search-bar card">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search books, tools, apparel…" />
        <select value={scope} onChange={(event) => setScope(event.target.value)}>
          <option value="community">My school + public</option>
          <option value="public">Public only</option>
        </select>
        <button>Search</button>
      </form>
      <StatusMessage error={error} />
      {searched && !items.length && !error && <div className="empty">No matching community items.</div>}
      <div className="grid">{items.map((item) => <ItemCard key={item.id} item={item} />)}</div>
    </section>
  );
}
