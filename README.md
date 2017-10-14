# Hera2
Hera2 is a simple swiss style tournament manager I made to help a friend run small Magic the Gathering tournaments.

It's status is somewhere between woefully feature incomplete and downright dangerous.
However it does have some features that should be noted, which is a great lead-in to the next section:

### Features
* Choose wins/loss/draw weighting for games and matches (defaults to 3-1-0)
* Generate pairings such that players never play each other twice and that players with the same score (as defined by the weighting above) are most likely to play each other
* Saves data on device in localStorage
* Drop players from the tournament with the option to readd them at any time
* Review and edit pairings before each round
* Manually adjust players scores
* Byes handled automatically as 2-0 win
* Can be "Added to Home Screen" on mobile to simulate app feel and function
* Handle multiple tournaments at once
* Sort players alphabetically or by current score


I once read somewhere that if you aren't midly embarrassed to deploy something, you waited too long. With that in mind, another list:
### Future Features
* Cloud Sync via Google Drive, Dropbox, and/or others
* Export Tournament data as Excel sheet
* Max Difference Pairing mode (pair players to maximize the average difference in scores)
* So much more testing


### Tech Stack
This was my first foray into modern javascript development so it's far from best practices but oh well, add best practices to 'Future Features'
* [Create React App](https://github.com/facebookincubator/create-react-app) (so React/Webpack/Babel/Jest etc.)
* [Redux](http://redux.js.org/)
* [Bootstrap v4](https://v4-alpha.getbootstrap.com/)
* [Reactstrap](https://github.com/reactstrap/reactstrap) (Bootstrap v4 components)
* [EdmondsBlossom](https://github.com/mattkrick/EdmondsBlossom) for pairing algorithm
* Sass styles loosly inspired by Superhero [Bootswitch](https://bootswatch.com) theme
* [ReactSidebar](https://github.com/balloob/react-sidebar) for app sidebar

