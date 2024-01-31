const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

type Data = { [key: string]: number };

// sorting data for bar and line charts
export const sortByMonth = (chartData: Data) => {
  const sortedData = Object.entries(chartData).sort((a, b) => {
    return months.indexOf(a[0]) - months.indexOf(b[0]);
  });

  const labels = sortedData.map((value) => capitalize(value[0]));
  const data = sortedData.map((value) => value[1]);

  return { labels, data };
};

// sorting data for pie and polar charts
export const sortByValue = (chartData: Data) => {
  const sortedData = Object.entries(chartData)
    .filter((workplace) => workplace[1] != 0)
    .sort((a, b) => {
      return b[1] - a[1];
    });

  const labels = sortedData.map((value) => capitalize(value[0])).slice(0, 5);
  const data = sortedData.map((value) => value[1]).slice(0, 5);

  if (Array.isArray(data) && data.length === 0) {
    return { labels: ['Not set'], data: [0] };
  }
  return { labels, data };
};

function capitalize(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1, label.length);
}

export const getBestMonth = (chartData: Data) => {
  const sortedData = Object.entries(chartData)
    .filter((workplace) => workplace[1] != 0)
    .sort((a, b) => {
      return b[1] - a[1];
    });

  const labels = sortedData.map((value) => capitalize(value[0])).slice(0, 5);
  const data = sortedData.map((value) => value[1]).slice(0, 5);

  return { labels, data };
};

export const getBestJob = (chartData: Data) => {
  const sortedData = Object.entries(chartData)
    .filter((workplace) => workplace[1] != 0)
    .sort((a, b) => {
      return b[1] - a[1];
    });

  const labels = sortedData.map((value) => capitalize(value[0])).slice(0, 5);
  const data = sortedData.map((value) => value[1]).slice(0, 5);

  return { labels, data };
};
