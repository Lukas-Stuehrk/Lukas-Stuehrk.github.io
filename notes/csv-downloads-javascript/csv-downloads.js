const csv = data.map(row => row.join(";")).join("\n");
const csvFile = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csv);
const link = document.createElement("a");
link.setAttribute("href", csvFile);
link.setAttribute("download", "data.csv");
document.body.appendChild(link);
link.remove();
