/**
 * Calculates the time remaining until the next Friday at 6:00 PM.
 * Uses the device's local time per user preference.
 */
export function getTimeUntilNextDrop(): string {
    const now = new Date()

    // Target: Friday (5) at 18:00 (6 PM)
    const targetDay = 5
    const targetHour = 18

    const currentDay = now.getDay()
    const currentHour = now.getHours()

    let daysUntil = targetDay - currentDay

    // If it's already Friday and past 6pm, or Saturday(6), wait for next week
    if (daysUntil < 0 || (daysUntil === 0 && currentHour >= targetHour)) {
        daysUntil += 7
    }

    const nextDrop = new Date(now)
    nextDrop.setDate(now.getDate() + daysUntil)
    nextDrop.setHours(targetHour, 0, 0, 0)

    const diffMs = nextDrop.getTime() - now.getTime()

    // Convert to D H M
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    let parts: string[] = []
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    // Always show minutes to avoid empty string if < 1 hour
    parts.push(`${minutes}m`)

    return parts.join(' ')
}
