import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { StatusMessage } from "../components/StatusMessage";
import type { Item } from "../types";

const categories = ["Books", "Apparel", "Tools", "Electronics", "Furniture", "School Supplies", "Household Items", "Sports / Outdoor", "Non-perishable Goods", "Other"];
const conditions = ["New", "Like New", "Good", "Fair", "Needs Repair"];
const statuses = ["Keeping", "Available to lend", "Available to give away", "Available to sell", "Available to donate", "Needs repair", "Recycled / removed"];
const visibilities = ["Private", "School", "Public"];

const emptyForm = {
  title: "",
  description: "",
  category: "Books",
  condition: "Good",
  status: "Keeping",
  quantity: 1,
  locationLabel: "",
  visibility: "Private",
  keywords: "",
  imageUrl: ""
};

export function ItemFormPage() {
  const { id } = useParams();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api<{ item: Item }>(`/items/${id}`)
      .then(({ item }) => setForm({
        title: item.title,
        description: item.description,
        category: item.category,
        condition: item.condition,
        status: item.status,
        quantity: item.quantity,
        locationLabel: item.locationLabel,
        visibility: item.visibility,
        keywords: item.keywords.join(", "),
        imageUrl: item.imageUrl
      }))
      .catch((caught: Error) => setError(caught.message));
  }, [id]);

  function update(name: string, value: string | number) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const body = {
      ...form,
      keywords: form.keywords.split(",").map((value) => value.trim()).filter(Boolean)
    };

    try {
      const data = await api<{ item: Item }>(id ? `/items/${id}` : "/items", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(body)
      });
      navigate(`/items/${data.item.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Save failed");
    }
  }

  return (
    <section className="narrow">
      <h1>{id ? "Edit item" : "Add item"}</h1>
      <form onSubmit={submit} className="form card">
        <label>Title<input value={form.title} onChange={(event) => update("title", event.target.value)} required /></label>
        <label>Description<textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={4} /></label>
        <div className="two-column">
          <label>Category<select value={form.category} onChange={(event) => update("category", event.target.value)}>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Condition<select value={form.condition} onChange={(event) => update("condition", event.target.value)}>{conditions.map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
        <label>Status<select value={form.status} onChange={(event) => update("status", event.target.value)}>{statuses.map((value) => <option key={value}>{value}</option>)}</select></label>
        <div className="two-column">
          <label>Quantity<input type="number" min="1" value={form.quantity} onChange={(event) => update("quantity", Number(event.target.value))} /></label>
          <label>Visibility<select value={form.visibility} onChange={(event) => update("visibility", event.target.value)}>{visibilities.map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
        <label>Location label<input value={form.locationLabel} onChange={(event) => update("locationLabel", event.target.value)} placeholder="Dorm, garage, campus…" /></label>
        <label>Keywords<input value={form.keywords} onChange={(event) => update("keywords", event.target.value)} placeholder="calculator, school, electronics" /></label>
        <label>Image URL<input type="url" value={form.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} /></label>
        <StatusMessage error={error} />
        <button>{id ? "Save changes" : "Create item"}</button>
      </form>
    </section>
  );
}
