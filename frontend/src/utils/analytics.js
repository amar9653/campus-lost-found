
const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export function makeTrend(reports, claims, period) {
  const now = new Date();
  const today = startOfDay(now);

  let buckets = [];

  if (period === 'Last 7 Days') {
    buckets = Array.from({ length: 7 }, (_, i) => {
      const start = addDays(today, i - 6);

      return {
        start,
        end: addDays(start, 1),
        period: start.toLocaleDateString('en-US', {
          weekday: 'short'
        }),
        reports: 0,
        claims: 0
      };
    });
  } else if (period === 'Last 30 Days') {
    const firstDay = addDays(today, -29);

    buckets = Array.from({ length: 5 }, (_, i) => {
      const start = addDays(firstDay, i * 7);
      const end = i === 4
        ? addDays(today, 1)
        : addDays(start, 7);

      return {
        start,
        end,
        period: `W${i + 1}`,
        reports: 0,
        claims: 0
      };
    });
  } else {
    const isThisYear = period === 'This Year';

    const firstMonth = isThisYear
      ? 0
      : now.getMonth() - 5;

    const count = isThisYear ? 12 : 6;

    buckets = Array.from({ length: count }, (_, i) => {
      const start = isThisYear
        ? new Date(now.getFullYear(), i, 1)
        : new Date(now.getFullYear(), firstMonth + i, 1);

      const end = new Date(
        start.getFullYear(),
        start.getMonth() + 1,
        1
      );

      return {
        start,
        end,
        period: start.toLocaleDateString('en-US', {
          month: 'short'
        }),
        reports: 0,
        claims: 0
      };
    });
  }

  const addToBuckets = (items, key, dateField) => {
    items.forEach((item) => {
      if (!item[dateField]) return;

      const date = new Date(item[dateField]);

      if (Number.isNaN(date.getTime()) || date > now) {
        return;
      }

      const bucket = buckets.find(
        (b) => date >= b.start && date < b.end
      );

      if (bucket) {
        bucket[key] += 1;
      }
    });
  };

  addToBuckets(reports, 'reports', 'createdAt');
  addToBuckets(claims, 'claims', 'submissionDate');

  return buckets.map(({ period, reports, claims }) => ({
    period,
    reports,
    claims
  }));
}
