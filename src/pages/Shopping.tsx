import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { Card, SectionTitle, SecondaryButton } from '../components/ui'
import clsx from 'clsx'

export default function Shopping() {
  const { shoppingList, addShoppingItem, toggleShoppingItem, removeShoppingItem } =
    useApp()
  const [input, setInput] = useState('')

  const pending = shoppingList.filter((i) => !i.checked)
  const done = shoppingList.filter((i) => i.checked)

  function submit() {
    if (input.trim()) {
      addShoppingItem(input.trim())
      setInput('')
    }
  }

  return (
    <div className="px-5 pb-8 pt-6">
      <h1 className="mb-1 text-2xl font-bold text-[var(--color-ink)]">
        Shopping list
      </h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Everything you need for date night.
      </p>

      <div className="mb-6 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Add an item"
          className="flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-hot-pink)]"
        />
        <SecondaryButton className="w-auto px-4" onClick={submit}>
          Add
        </SecondaryButton>
      </div>

      <SectionTitle>To get ({pending.length})</SectionTitle>
      {pending.length === 0 ? (
        <Card className="mb-6 text-center text-sm text-[var(--color-muted)]">
          Nothing on your list yet.
        </Card>
      ) : (
        <div className="mb-6 space-y-2">
          {pending.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
            >
              <button
                onClick={() => toggleShoppingItem(item.id)}
                className="h-5 w-5 shrink-0 rounded-md border-2 border-[var(--color-hot-pink)]"
                aria-label="Check off"
              />
              <span className="flex-1 text-sm text-[var(--color-ink)]">
                {item.label}
              </span>
              {item.source === 'auto' && (
                <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] text-[var(--color-muted)]">
                  from plan
                </span>
              )}
              <button
                onClick={() => removeShoppingItem(item.id)}
                className="text-[var(--color-muted)]"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <>
          <SectionTitle>Checked off ({done.length})</SectionTitle>
          <div className="space-y-2">
            {done.map((item) => (
              <div
                key={item.id}
                className={clsx(
                  'flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 px-4 py-3',
                )}
              >
                <button
                  onClick={() => toggleShoppingItem(item.id)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--color-hot-pink)] text-xs text-white"
                  aria-label="Uncheck"
                >
                  ✓
                </button>
                <span className="flex-1 text-sm text-[var(--color-muted)] line-through">
                  {item.label}
                </span>
                <button
                  onClick={() => removeShoppingItem(item.id)}
                  className="text-[var(--color-muted)]"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
