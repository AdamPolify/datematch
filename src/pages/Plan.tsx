import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import TopBar from '../components/TopBar'
import { Card, SectionTitle, SecondaryButton } from '../components/ui'
import CardArt from '../components/CardArt'

function prepSteps(cookAtHome: boolean): string[] {
  const steps = ['Set up snacks and drinks on the coffee table']
  if (cookAtHome) {
    steps.unshift('Prep and cook the food together')
  } else {
    steps.unshift('Place your food order or head out for pickup')
  }
  steps.push('Queue up the movie or show')
  steps.push('Dim the lights and settle in')
  return steps
}

export default function Plan() {
  const { planId } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { plans, shoppingList, updatePlan } = useApp()

  const plan = plans.find((p) => p.id === planId)

  if (!plan) {
    return (
      <div className="flex min-h-svh flex-col">
        <TopBar title="Plan not found" onBack={() => navigate('/home')} />
        <div className="p-5 text-center text-sm text-[var(--color-muted)]">
          This date night plan doesn't exist anymore.
        </div>
      </div>
    )
  }

  const { bundle } = plan
  const items = shoppingList.filter((i) => plan.shoppingListIds.includes(i.id))
  const hours = Math.floor(bundle.estimatedTimeMinutes / 60)
  const mins = bundle.estimatedTimeMinutes % 60

  return (
    <div className="flex min-h-svh flex-col pb-10">
      <TopBar title="Date night, decided." onBack={() => navigate('/home')} />

      <div className="px-5 pt-5">
        <Card className="mb-6 text-center">
          <div className="mb-2 text-5xl">{bundle.image}</div>
          <h1 className="text-xl font-bold text-[var(--color-ink)]">
            {bundle.title}
          </h1>
          <p className="mt-1 text-xs italic text-[var(--color-muted)]">
            "{bundle.reason}"
          </p>
        </Card>

        <SectionTitle>The lineup</SectionTitle>
        <div className="mb-6 grid grid-cols-2 gap-3">
          <Card className="flex items-center gap-2">
            <CardArt
              image={bundle.movie.image}
              alt={bundle.movie.title}
              imgClassName="h-12 w-9 shrink-0 rounded object-cover"
              emojiClassName="shrink-0 text-2xl"
            />
            <div className="min-w-0">
              <p className="text-[10px] uppercase text-[var(--color-muted)]">Watch</p>
              <p className="truncate text-sm font-medium">{bundle.movie.title}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-2">
            <span className="text-2xl">{bundle.food.image}</span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase text-[var(--color-muted)]">Eat</p>
              <p className="truncate text-sm font-medium">{bundle.food.title}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-2">
            <span className="text-2xl">{bundle.snack.image}</span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase text-[var(--color-muted)]">Snack</p>
              <p className="truncate text-sm font-medium">{bundle.snack.title}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-2">
            <span className="text-2xl">{bundle.drink.image}</span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase text-[var(--color-muted)]">Drink</p>
              <p className="truncate text-sm font-medium">{bundle.drink.title}</p>
            </div>
          </Card>
        </div>

        <SectionTitle>Details</SectionTitle>
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Card className="text-center">
            <p className="text-[10px] uppercase text-[var(--color-muted)]">Start</p>
            <input
              value={plan.startTime}
              onChange={(e) => updatePlan(plan.id, { startTime: e.target.value })}
              className="mt-1 w-full bg-transparent text-center text-sm font-semibold text-[var(--color-ink)] focus:outline-none"
            />
          </Card>
          <Card className="text-center">
            <p className="text-[10px] uppercase text-[var(--color-muted)]">Time</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
              {hours}h {mins}m
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-[10px] uppercase text-[var(--color-muted)]">Cost</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
              {bundle.estimatedCost}
            </p>
          </Card>
        </div>

        <SectionTitle>Prep steps</SectionTitle>
        <Card className="mb-6">
          <ol className="space-y-2 text-left text-sm text-[var(--color-ink)]">
            {prepSteps(bundle.food.method === 'cook at home').map((step, i) => (
              <li key={step} className="flex gap-2">
                <span className="font-bold text-[var(--color-hot-pink)]">
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>

        <SectionTitle>Shopping list</SectionTitle>
        <Card className="mb-6">
          {items.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">
              Nothing added yet.
            </p>
          ) : (
            <ul className="mb-3 space-y-1 text-left text-sm text-[var(--color-ink)]">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-2">
                  <span>{item.checked ? '✅' : '⬜️'}</span>
                  {item.label}
                </li>
              ))}
            </ul>
          )}
          <SecondaryButton onClick={() => navigate('/shopping')}>
            Open shopping list
          </SecondaryButton>
        </Card>

        <SectionTitle>Mood playlist</SectionTitle>
        <Card className="mb-6 flex items-center justify-between">
          <span className="text-sm text-[var(--color-muted)]">
            🎵 A {bundle.mood[0] ?? 'cozy'} playlist, coming soon
          </span>
          <span className="text-lg">▶️</span>
        </Card>

        <SectionTitle>Notes</SectionTitle>
        <textarea
          value={plan.notes}
          onChange={(e) => updatePlan(plan.id, { notes: e.target.value })}
          placeholder="Anything else to remember..."
          rows={3}
          className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-hot-pink)]"
        />
      </div>
    </div>
  )
}
