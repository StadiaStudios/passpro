window.renderAnniversaries = function (startDate) {
    const container = document.getElementById('anniversaryContainer');
    if (!container) return;

    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        container.innerHTML = '';
        return;
    }

    const now = new Date();
    const milestones = [];

    function addYears(base, n) {
        const d = new Date(base.getTime());
        d.setFullYear(d.getFullYear() + n);
        return d;
    }

    function addMonths(base, n) {
        const d = new Date(base.getTime());
        d.setMonth(d.getMonth() + n);
        return d;
    }

    function addDays(base, n) {
        return new Date(base.getTime() + n * 24 * 60 * 60 * 1000);
    }

    // Next up to 2 future year anniversaries (not limited to "10 years after start")
    let yearAnniversaries = 0;
    for (let i = 1; i <= 200 && yearAnniversaries < 2; i++) {
        const date = addYears(startDate, i);
        if (date > now) {
            milestones.push({ date, label: `${i} Year Anniversary`, icon: '💍' });
            yearAnniversaries++;
        }
    }

    // Next 5-month milestone (5, 10, 15… months from start) — scan far enough for long relationships
    for (let i = 5; i <= 1200; i += 5) {
        const date = addMonths(startDate, i);
        if (date > now) {
            milestones.push({ date, label: `${i} Months Together`, icon: '✨' });
            break;
        }
    }

    // Day milestones: extend targets so long relationships still get a "next" day count
    const dayTargets = [];
    for (let d = 100; d <= 1000; d += 100) dayTargets.push(d);
    for (let d = 1500; d <= 10000; d += 500) dayTargets.push(d);
    for (let d = 11000; d <= 100000; d += 1000) dayTargets.push(d);

    for (let target of dayTargets) {
        const date = addDays(startDate, target);
        if (date > now) {
            milestones.push({ date, label: `${target} Days Milestone`, icon: '🎯' });
            break;
        }
    }

    milestones.sort((a, b) => a.date - b.date);

    const upcoming = milestones.slice(0, 3);

    if (upcoming.length === 0) {
        container.innerHTML = `
        <div class="text-left mt-4">
            <h3 class="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 flex items-center">
                <span class="mr-2">Upcoming Milestones</span>
                <div class="flex-grow border-t border-pink-200"></div>
            </h3>
            <p class="text-sm text-gray-500 text-center py-4">No upcoming milestones to show yet.</p>
        </div>`;
        return;
    }

    let html = `
        <div class="text-left mt-4 animate-fade-in">
            <h3 class="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 flex items-center">
                <span class="mr-2">Upcoming Milestones</span>
                <div class="flex-grow border-t border-pink-200"></div>
            </h3>
            <div class="space-y-3">
    `;

    upcoming.forEach(ms => {
        const diffTime = Math.abs(ms.date - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const dateStr = ms.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

        html += `
            <div class="milestone-card flex items-center justify-between p-4 bg-white border border-pink-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center space-x-4">
                    <div class="text-2xl">${ms.icon}</div>
                    <div>
                        <p class="text-sm font-bold text-gray-700">${ms.label}</p>
                        <p class="text-xs text-gray-500">${dateStr}</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-xs font-bold px-2 py-1 bg-pink-50 text-pink-600 rounded-full">
                        in ${diffDays} days
                    </span>
                </div>
            </div>
        `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
};
