import React, { useCallback, useState } from "react";
import { object, string } from "superstruct";
import { database } from "$lib/react";
import { crr, primary } from "$lib";

const items = object({ text: string() });
primary(items, "text");
crr(items);

const schema = object({ items });

const { useStore } = database(schema, { name: "react.db" });

export const Component: React.FC = () => {
  const [filter, setFilter] = useState("");
  const items = useStore(
    (db, filter) =>
      db
        .selectFrom("items")
        .where("text", "like", filter + "%")
        .selectAll(),
    {
      create(db, text: string) {
        return db.insertInto("items").values({ text }).execute();
      },
    },
    [filter],
  );

  const handleCreate = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code !== "Enter") return;
      items.create(e.currentTarget?.value);
    },
    [],
  );

  return (
    <React.StrictMode>
      <ol>
        {items.map((x) => (
          <li key={x.text}>{x.text}</li>
        ))}
      </ol>
      <input type="text" placeholder="Create" onKeyDown={handleCreate} />
      <input
        type="text"
        value={filter}
        placeholder="Filter"
        onInput={(e) => setFilter(e.currentTarget.value)}
      />
    </React.StrictMode>
  );
};
