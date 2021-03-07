import lume from "https://deno.land/x/lume@v0.15.3/mod.js";
import date from "https://deno.land/x/lume@v0.15.3/plugins/date.js";

const site = lume();

site.use(date());

export default site;
