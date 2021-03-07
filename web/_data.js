const api = JSON.parse(await Deno.readTextFile("./dist/api.json"));

api.lastUpdated = new Date(api.lastUpdated);

api.data.forEach((project) => {
  let lastUpdated;

  Object.values(project.channels).forEach((channel) => {
    if (channel.lastEntry?.date) {
      lastUpdated = channel.lastEntry.date;
    }
  });

  if (lastUpdated) {
    project.lastUpdated = new Date(lastUpdated);
  }
});

api.data = api.data.sort((a, b) => a.lastUpdated > b.lastUpdated ? -1 : 1);

export { api };
