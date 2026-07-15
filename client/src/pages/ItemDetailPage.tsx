import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { StatusMessage } from "../components/StatusMessage";
import type { InterestSnapshot, Item } from "../types";

export function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [snapshot, setSnapshot] = useState<InterestSnapshot | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

 useEffect(() => {
  let cancelled = false;

  async function loadItem() {
    setError("");
    setSnapshot(null);

    try {
      const data = await api<{ item: Item; isOwner: boolean }>(`/items/${id}`);

      if (cancelled) return;

      setItem(data.item);
      setIsOwner(data.isOwner);

      if (data.isOwner) {
        try {
          const history = await api<{ snapshots: InterestSnapshot[] }>(
            `/interest/items/${id}/history`
          );

          if (!cancelled) {
            setSnapshot(history.snapshots[0] ?? null);
          }
        } catch (caught) {
          if (!cancelled) {
            setError(
              caught instanceof Error
                ? caught.message
                : "Could not load saved interest history"
            );
          }
        }
      }
    } catch (caught) {
      if (!cancelled) {
        setError(caught instanceof Error ? caught.message : "Could not load item");
      }
    }
  }

  void loadItem();

  return () => {
    cancelled = true;
  };
}, [id]);

  async function checkInterest() {
    setChecking(true);
    setError("");
    try {
      const data = await api<{ snapshot: InterestSnapshot }>(`/interest/items/${id}/check`, {
        method: "POST",
        body: JSON.stringify({})
      });
      setSnapshot(data.snapshot);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Interest check failed");
    } finally {
      setChecking(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this item?")) return;
    await api<void>(`/items/${id}`, { method: "DELETE" });
    navigate("/inventory");
  }

  if (error && !item) return <StatusMessage error={error} />;
  if (!item) return <p>Loading…</p>;

  return (
    <section>
      <div className="page-heading">
        <div><p className="eyebrow">{item.category}</p><h1>{item.title}</h1></div>
        {isOwner && (
          <div className="actions">
            <Link className="button secondary" to={`/items/${id}/edit`}>Edit</Link>
            <button className="danger" onClick={() => void remove()}>Delete</button>
          </div>
        )}
      </div>
      <div className="detail-layout">
        <article className="card">
          {item.imageUrl && <img className="detail-image" src={item.imageUrl} alt="" />}
          <p>{item.description || "No description."}</p>
          <dl>
            <dt>Condition</dt><dd>{item.condition}</dd>
            <dt>Status</dt><dd>{item.status}</dd>
            <dt>Visibility</dt><dd>{item.visibility}</dd>
            <dt>Location</dt><dd>{item.locationLabel || "Not specified"}</dd>
          </dl>
          {item.owner && (
            <div>
              <h3>Owner</h3>
              <p>{item.owner.firstName} {item.owner.lastName}</p>
              {item.owner.email && <p><a href={`mailto:${item.owner.email}`}>{item.owner.email}</a></p>}
              {item.owner.phone && <p><a href={`tel:${item.owner.phone}`}>{item.owner.phone}</a></p>}
              {!item.owner.email && !item.owner.phone && <p>Contact information is private.</p>}
            </div>
          )}
        </article>
        <aside className="card">
          <h2>Reuse interest check</h2>
          <p>Combines eBay active listings, YouTube attention, and ReuseHub internal metrics.</p>
          {isOwner && <button onClick={() => void checkInterest()} disabled={checking}>{checking ? "Checking…" : "Run interest check"}</button>}
          {!isOwner && <p className="muted">Only the owner can run and store a valuation snapshot.</p>}
          <StatusMessage error={error} />
          {snapshot && (
            <div className="metrics">
              <div className="score">{snapshot.reuseScore}<small>/100</small></div>
              <p>{snapshot.recommendation}</p>
              <p>Internal matches: {snapshot.internal.matchingItemCount}</p>
              {snapshot.ebay && <p>eBay average: ${snapshot.ebay.averagePrice?.toFixed(2) ?? "N/A"} ({snapshot.ebay.totalListings ?? 0} active listings)</p>}
              {snapshot.youtube && <p>YouTube sampled views: {snapshot.youtube.totalViews?.toLocaleString() ?? 0}</p>}
              {snapshot.ebay?.results?.length ? (
                <>
                  <h3>Marketplace examples</h3>
                  <ul>
                    {snapshot.ebay.results.slice(0, 5).map((result) => (
                      <li key={result.itemUrl}><a target="_blank" rel="noreferrer" href={result.itemUrl}>{result.title}</a> — ${result.price}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
