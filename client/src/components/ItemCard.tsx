import { Link } from "react-router-dom";
import type { Item } from "../types";

export function ItemCard({ item }: { item: Item }) {
  return (
    <article className="card item-card">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt="" />
      ) : (
        <div className="placeholder">No image</div>
      )}
      <div>
        <h3><Link to={`/items/${item.id}`}>{item.title}</Link></h3>
        <p>{item.category} · {item.condition}</p>
        <span className="badge">{item.status}</span>
        <span className="badge">{item.visibility}</span>
        {item.owner && <p className="muted">Listed by {item.owner.firstName} {item.owner.lastName}</p>}
        {item.estimatedValue?.average != null && (
          <p>Active-listing average: ${item.estimatedValue.average.toFixed(2)}</p>
        )}
      </div>
    </article>
  );
}
