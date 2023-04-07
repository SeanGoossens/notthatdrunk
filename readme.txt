Ideas for UI:

Links to other tools (Bar at the top?)
> https://www.warcraftlogs.com/guild/id/566479
> https://raider.io/guilds/us/emerald-dream/Not%20That%20Drunk
> https://subcreation.net/
> https://docs.google.com/spreadsheets/d/15kwSNS6_cpc4i789g7VmPhNQ-fAwswOUu9CFWpRejxk/edit#gid=241918221


M+ Snapshot 
> Pull key information from https://wowaudit.com/us/emerald-dream/not-that-drunk/not-that-drunk/api

Raid Snapshot
> High level statistics, bosses killed, average parses per role 

Raid Live Log 
> Statistics
> Drinking game



To disable caching of your EJS files, you need to set the cache option to false when calling the res.render() method in your app.get() function. It seems like you're already doing this, but the issue may be that you're not specifying the cache option in the right place.

You can try moving the cache option to the options object that you're passing to the app.set() method, like this:

c

app.set("view engine", "ejs");
app.set("view cache", false);

This should disable view caching for all EJS files rendered by your app.

Another thing to consider is that you're using the setInterval() method to periodically call the updateData() function, which in turn generates routes and renders EJS files. While this may work for your current needs, it may not be the most efficient way to handle this.

Instead, you could consider using a caching mechanism that stores the data retrieved from the database and serves it to the EJS files upon request. This way, you don't need to generate new routes and render the EJS files every time new data is available.

One popular caching mechanism for Node.js is Redis, which is an in-memory data store that can be used to cache data and reduce database queries. You can check out the official Redis documentation to learn more about how to implement it in your Node.js app.