import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { ItemCard } from "../components/ItemCard";
import { StatusMessage } from "../components/StatusMessage";
import type { Item } from "../types";

export function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ items: Item[] }>("/items")
      .then((data) => setItems(data.items))
      .catch((caught: Error) => setError(caught.message));
  }, []);

  return (
    <section>
      <div className="page-heading">
        <div><p className="eyebrow">Personal records</p><h1>My inventory</h1></div>
        <Link className="button" to="/items/new">Add item</Link>
      </div>
      <StatusMessage error={error} />
      {!items.length && !error ? (
        <div className="empty">No items yet. Add your first reusable item.</div>
      ) : (
        <div className="grid">{items.map((item) => <ItemCard key={item.id} item={item} />)}</div>
      )}
    </section>
  );
}
