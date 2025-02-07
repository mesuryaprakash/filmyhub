/*
TODO - MODULES
- signature() | DONE
- getGender() | DONE
- getEpisode() | DONE
- getMovie() | DONE
- getSeries() | DONE
- getIUFS() | DONE - IMDB URL For Series
- getSeason() | DONE
- getRating() | DONE
- getRuntime() | DONE
- getTBI() | DONE - TMDB ID by IMDB ID
- searchSeries() | DONE
- searchMovie() | DONE
- checkDuplication() | DONE
- createMoviePage() | DONE
- createPersonPage() | DONE
- createCharacterPage() | 
- addCharacter() | 
- createSeriePage()
- createEpisodePage()
- createSeasonPage()
- getNOS() - Numbers of Season
- updateEpisode()
- addMovie()
- addSeries()
- addSeason()
- addEpisode()

TODD - FUNCTIONALITIES
- Check for season before using getSeason() or add season not available in catch. | getSeason() |
- Go back to Main Menu | searchMovie(), searchSeries()
- Show character name | createPersonPage()

*/

const axios = require('axios');
const {Client} = require('@notionhq/client')

const data = {
  secretKey : 'secret_bEHDdhVOcLZYqIkYGLeTYHpr3cX3fOBKXTePjufGy3P',
  tmdbAPI: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NzQ1NTk5YjcwNmE1NmYxNWVjMDAxY2Y1MTZmZjEzYSIsInN1YiI6IjYyZDJjM2NjMzc4MDYyMDQ5ZjVmNDAyZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HzLaAoMzywxpayJaF6dX66NJ6vH9mQch38MkCVz9F64',
  filmyhubDatabaseID: 'cde8197fbba548cfa26de06b231bb45e',
  seasonDatabaseID: '3a24fe21b3c04f339785fa55114efee8',
  episodeDatabaseID: '9c091cfd746d48a0b1a03bc439b60635',
  genreDatabaseID: 'fcabf793747d422cb9355f70d2beb0bb',
  characterDatabaseID: 'd869079c042c43fc8ee210c731b90d38',
  personDatabaseID: '6e4c70e164b6415d922972b9bc481566',
  moviePageID: '40903a1d5ccd4aa6b6aa14f876a9fb44',
  seriesPageID: 'fb63a54cc4a14032b30d6a4aa345a2b4',
}

const notion = new Client({ auth: data.secretKey })
const tmdbAuth = {
  accept: 'application/json',
  Authorization: `Bearer ${data.tmdbAPI}`
}

let arrays = {
  movieArray : [],
  seriesArray : [],
  seasonArray: [],
  episodeArray: [],
  genreArray: [],
  characterArray: [],
  personArray: [],
  searchArray: [],
  genreArray: []
}

function signature(){
  console.log(' /\\_/\\ \n|_- -_|\n  \\_/')
} //first

function getRating(vote) {
  let ratingStars = Math.round(vote / 2);
  switch(ratingStars) {
    case 1:
      ratingStars = '⭐'
      break;
    case 2:
      ratingStars = '⭐⭐'
      break;
    case 3:
      ratingStars = '⭐⭐⭐'
      break;
    case 4:
      ratingStars = '⭐⭐⭐⭐'
      break;
    case 5:
      ratingStars = '⭐⭐⭐⭐⭐'
      break;
    default:
      ratingStars = null
  }

  return ratingStars;
} //first

function getRuntime(minutes) {
  let runtime ;
  if(minutes == null) {
    runtime = null
  } else {
    if(minutes < 60 ){
      runtime = minutes + "m" 
    } else if(minutes >= 60 && minutes<1440){
      runtime = Math.floor(minutes / 60)+"h "+(minutes%60)+"m"
    } else {
      runtime = Math.floor(Math.floor(minutes / 60)/24) + "d "+ Math.floor(Math.floor(minutes / 60)%24)+"h "+ (minutes %60) +"m"   
    }
  }
  return runtime;
}

function getGender(number) {
  switch(number){
    case 1:
      return 'FEMALE'
      break
    case 2:
      return 'MALE'
      break
    case 3:
      return 'NON-BINARY'
      break
    default:
      return 'NOT SET'
  }
}

async function getIUFS(tmdbID) {
  const option = {
    method : 'GET',
    url : `https://api.themoviedb.org/3/tv/${tmdbID}/external_ids`,
    headers : tmdbAuth
  }

  try{
    const response = await axios.request(option)
    
    return `https://www.imdb.com/title/${response.data.imdb_id}`
    
  } catch(error) {
    console.log(error)
  }
}

async function getTBI() {
  let imdbID = prompt('Enter IMDB ID: ')
  const option = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/find/${imdbID}?external_source=imdb_id`,
    headers: tmdbAuth
  }

  try {
    const response = await axios.request(option);
    const name = response.data
    // console.log(name)
    return name
  } catch(error) {
    console.log(error)
  }
}

async function checkingAddMovie(){
  let tmdbID = parseInt(prompt('Enter TMDB ID: '))
  await getMovie(tmdbID)
}

async function getMovie(tmdbID) {
  arrays.movieArray.length = 0
  arrays.genreArray.length = 0
  
  const option = {
    method : 'GET',
    url : `https://api.themoviedb.org/3/movie/${tmdbID}`,
    headers : tmdbAuth
  }

  try {
    let check, genrePageID;
    const response = await axios.request(option)
    const item = response.data

    for(let genre of item.genres){
      check = await checkDuplication(genre.id,genre.name,data.genreDatabaseID)
      if(isNaN(check)){
        genrePageID = {
          "id" : check.slice(check.lastIndexOf("-")+1)
        }
        arrays.genreArray.push(genrePageID)
      } else {
        createGenrePage(genre)
        // const response = await notion.pages.create({
        //   "parent" : {
        //     "type": "database_id",
        //     "database_id" : data.genreDatabaseID
        //   },
        //   "properties" : {
        //     "Name": {
        //       "title" : [{
        //         "type": "text",
        //         "text": {
        //           "content" : genre.name
        //         }
        //       }]
        //     },
        //     "TMDB ID": {
        //       "type": "number",
        //       "number" : genre.id
        //     }
        //   }
        // })
        check = await checkDuplication(genre.id,genre.name,data.genreDatabaseID)
        genrePageID = {
          "id" : check.slice(check.lastIndexOf("-")+1)
        }
        arrays.genreArray.push(genrePageID)
      }
    }

    // console.log(arrays.genreArray)
      
    const movieDetail = {
      // adult : item.adult == false ? null : {"name": 'A',"color" : "red"},
      cover : `https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${item.backdrop_path}`,
      genres : arrays.genreArray,
      imdbURL : `https://www.imdb.com/title/${item.imdb_id}/`,
      releaseDate : item.release_date ,
      title : item.title,
      overview : item.overview,
      tmdbID : item.id,
      runtime : getRuntime(item.runtime),
      poster : `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${item.poster_path}`,
      rating : getRating(item.vote_average),
      status : item.status
    }

    // console.log(movieDetail.genres)

    arrays.movieArray.push(movieDetail)
    console.log("Get Movie worked.")
    // console.log(arrays.movieArray)
    return arrays.movieArray
  } catch (error) {
    console.log('Invalid TMDB ID.')
    return false
  }
}

async function getSeries(tmdbID) {
  
  arrays.seriesArray.length = 0
  arrays.genreArray.length = 0
  
  const option = {
    method: 'GET',
    url : `https://api.themoviedb.org/3/tv/${tmdbID}`,
    headers : tmdbAuth
  };

  try {
    const response = await axios.request(option)
    const item = response.data

    let check, genrePageID;
    
    for(let genre of item.genres){
      check = await checkDuplication(genre.id,genre.name,data.genreDatabaseID)
      if(isNaN(check)){
        genrePageID = {
          "id" : check.slice(check.lastIndexOf("-")+1)
        }
        arrays.genreArray.push(genrePageID)
      } else {
        await createGenrePage(genre)
        check = await checkDuplication(genre.id,genre.name,data.genreDatabaseID)
        genrePageID = check.slice(check.lastIndexOf("-")+1)
        arrays.genreArray.push(genrePageID)
      }
    }

    const seriesDetail = {
      cover : `https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${item.backdrop_path}`,
      genres : arrays.genreArray,
      imdbURL : await getIUFS(tmdbID),
      releaseDate : item.first_air_date ,
      title : item.name,
      overview : item.overview,
      tmdbID : item.id,
      poster : `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${item.poster_path}`,
      rating : getRating(item.vote_average),
      status : item.status,
      seasons : item.seasons,
      NOS : item.number_of_seasons
    }

    arrays.seriesArray.push(seriesDetail)
    // console.log(seriesDetail)
    return arrays.seriesArray
    
  } catch (error) {
    console.log('Invalid TMDB ID.')
    return false
  }
}

async function getSeason(tmdbID, seasonNo) {
  arrays.seasonArray.length = 0
  
  const option = {
    method: 'GET',
    url : `https://api.themoviedb.org/3/tv/${tmdbID}/season/${seasonNo}`,
    headers : tmdbAuth
  };

  try {
    const response = await axios.request(option)
    const item = response.data 
    // console.log(item)
    
    const seasonDetail = {
      releaseDate : item.air_date ,
      title : item.name,
      overview : item.overview,
      tmdbID : item.id,
      seasonNo : item.season_number,
      poster : `https://www.themoviedb.org/t/p/w130_and_h195_bestv2${item.poster_path}`,
      episode: item.episodes,
      checkSeason : item.episodes[0].runtime
    }

    arrays.seasonArray.push(seasonDetail)
    return arrays.seasonArray
  } catch(error) {
    return false;
  }
}

async function getEpisode(tmdbID,seasonNo,episodeNo) {
  arrays.episodeArray.length = 0
  const option = {
    method: 'GET',
    url : `https://api.themoviedb.org/3/tv/${tmdbID}/season/${seasonNo}/episode/${episodeNo}`,
    headers : tmdbAuth
  };

  try {
    const response = await axios.request(option)
    const item = response.data

    const episodeDetail = {
      releaseDate : item.air_date ,
      episodeNo : item.episode_number,
      title : item.name,
      overview : item.overview,
      tmdbID : item.id,
      runtime : getRuntime(item.runtime),
      seasonNo : item.season_number,
      poster : `https://www.themoviedb.org/t/p/w500_and_h282_face${item.still_path}`,
      rating : getRating(item.vote_average)
    }

    arrays.episodeArray.push(episodeDetail)
    // console.log(arrays.episodeArray)
    return arrays.episodeArray
    
  } catch (error) {
    // console.log(error)
    return false;
  }
}

async function getCredit(type, tmdbID) {
  arrays.characterArray.length = 0
   const option = {
    method : 'GET',
    url : `https://api.themoviedb.org/3/${type}/${tmdbID}/credits`,
    headers : tmdbAuth
  }

  const response = await axios.request(option)
  let crewDetail;
  const cast = response.data.cast
  const crew = response.data.crew
  for(let i in crew){
    if(crew[i].job == "Director" || crew[i].job == "Writer" || crew[i].job == "Producer" || crew[i].job == "Editor" || crew[i].job == "Sound Designer" ) {
      crewDetail = {
        gender : crew[i].gender,
        name : crew[i].name,
        characterName : crew[i].name,
        profile : `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${crew[i].profile_path}`,
        role : crew[i].job,
        tmdbID : crew[i].id
      }
      arrays.characterArray.push(crewDetail)
    }
  }
  if(cast.length > 10) {
    for(let i  = 0 ; i < 10 ; i++){
      let obj = {
        gender : cast[i].gender,
        tmdbID : cast[i].id,
        role : cast[i].known_for_department,
        name : cast[i].name,
        characterName : cast[i].character,
        profile : `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${cast[i].profile_path}`
      }
      arrays.characterArray.push(obj)
    }
  } else {
    for (let i in cast){
      let obj = {
        gender : cast[i].gender,
        tmdbID : cast[i].id,
        role : cast[i].known_for_department,
        name : cast[i].name,
        characterName : cast[i].character,
        profile : `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${cast[i].profile_path}`
      }
      arrays.characterArray.push(obj)
    }
  }
  return arrays.characterArray
  
}

async function searchSeries() {
  arrays.searchArray.length = 0
  
  let input = prompt('Enter series name: ')
  const option = {
    method : 'GET',
    url : `https://api.themoviedb.org/3/search/tv?query=${input.replaceAll('%','%25').replaceAll(':','%3A').replaceAll(' ','%20')}`,
    headers: tmdbAuth
  }
  const response = await axios.request(option);
  const series = response.data

  if(series.results.length == 0) {
    console.log('No result Found. Search again.')
    return await searchSeries()
  } else {
    console.log('0. Search again.')
    for(let i = 0; i < series.results.length ; i++) {
      let obj = {
        id: series.results[i].id,
        title: series.results[i].name,
        date: series.results[i].first_air_date
      }
      console.log(`${i+1}. ${obj.title} \tRelease Date - ${obj.date}`)
      arrays.searchArray.push(obj)
    }
    let select = parseInt(prompt('Select: '))
    for(;isNaN(select) || select < 0 || select > arrays.searchArray.length;) {
      console.log("Invalid Selection")
      select = parseInt(prompt('Select: '))
    }
    return select === 0 ? await searchSeries() : arrays.searchArray[select-1]
  }  
}

async function searchMovie() {
  arrays.searchArray.length = 0
  
  let input = prompt('Enter movie name: ')
  const option = {
    method : 'GET',
    url : `https://api.themoviedb.org/3/search/movie?query=${input.replaceAll('%','%25').replaceAll(':','%3A').replaceAll(' ','%20')}`,
    headers: tmdbAuth
  }
  const response = await axios.request(option);
  const movie = response.data
  if(movie.results.length == 0) {
    console.log('No result Found. Search again.')
    return searchMovie()
  } else {
    console.log('0. Search again.')
    for(let i = 0; i < movie.results.length ; i++) {
      let obj = {
        id: movie.results[i].id,
        title: movie.results[i].title,
        date: movie.results[i].release_date
      }
      console.log(`${i+1}. ${obj.title} \tRelease Date - ${obj.date}`)
      arrays.searchArray.push(obj)
    }
    let select = parseInt(prompt('Select: '))
    for(;isNaN(select) || select < 0 || select > arrays.searchArray.length;) {
      console.log("Invalid Selection")
      select = parseInt(prompt('Select: '))
    }
    // console.log(select === 0 ? await searchMovie() : arrays.searchArray[select-1])
    console.log("Search worked")
    return select === 0 ? await searchMovie() : arrays.searchArray[select-1]
  }  
}

const checkDuplication = async (tmdbID,title,databaseID) => {
  const response = await notion.databases.query({
    database_id: databaseID,
    filter: {
      "and" : [
        {
          property: "TMDB ID",
          number: {
            equals: tmdbID
          }
        },
        {
          property: "Name",
          "rich_text": {
            "equals" : title
          }
        }
       ] 
    }
  });
  // console.log(response.results[0].properties)
  return response.results.length === 0 ? tmdbID  : response.results[0].url 
}

async function createGenrePage(genre) {
  const response = await notion.pages.create({
    "parent" : {
      "type": "database_id",
      "database_id" : data.genreDatabaseID
    },
    "properties" : {
      "NAME": {
        "title" : [{
          "type": "text",
          "text": {
            "content" : genre.name
          }
        }]
      },
      "TMDB ID": {
        "type": "number",
        "number" : genre.id
      }
    }
  })
}

async function createMoviePage(tmdbID) {
  const details = await getMovie(tmdbID);
  for (let item of details) {
    console.log(`Creating ${item.title} page.`)
    let releaseDate;
    if(item.releaseDate == null) {
      releaseDate = null
    } else if(item.releaseDate === '') {
      releaseDate = null
    } else {
      releaseDate = {
        "start" : item.releaseDate
      }
    }
    let rating = item.rating == null ? null : {"name": item.rating,"color" : "purple"}
    
    const response = await notion.pages.create({
      "parent": {
        "type": "database_id",
        "database_id": data.filmyhubDatabaseID
      },
      "cover" : {
        "type" : "external",
        "external" : {
          "url": item.cover
        }
      },
      "icon" : {
        "type" : "external",
        "external" : {
          "url": item.poster
        }
      },
      "properties": {
        "NAME": {
          "title": [
            {
              "type": "text",
              "text": {
                "content": item.title
              }
            }
          ]
        },
        "IMDB RATING": {
          "rich_text" : [
            {
              "type" : "text",
              "text" : {
                "content" : rating
              }
            }
          ]
        },
        "STATUS" : {
          "rich_text" : [
            {
              "type" : "text",
              "text" : {
                "content" : item.status
              }
            }
          ]
        },
        "RUNTIME" : {
          "rich_text" : [
            {
              "type" : "text",
              "text" : {
                "content" : item.runtime
              }
            }
          ]
        },
        "RELEASE DATE" : {
          "type" : "date",
          "date" : releaseDate
        },
        "POSTER" : {
          "type" : "files",
          "files": [
            {
              "name":"poster",
              "type": "external",
              "external": {
                "url": item.poster
              }
            }
          ]
        },
        "IMDB URL" : {
          "type" : "url",
          "url" : item.imdbURL
        },
        "GENRE": {
          "relation" : item.genres
        },
        "TMDB ID" : {
          "type" : "number",
          "number" : item.tmdbID
        },
        "OVERVIEW" : {
          "rich_text" : [
            {
              "type" : "text",
              "text" : {
                "content" : item.overview
              }
            }
          ]
        },
        "CATEGORY": {
          "type": "relation",
          "relation": [{
            "id" : data.moviePageID
          }]
        },
      }
    })
  }
}

async function createSeriesPage(tmdbID) {
  const details = await getSeries(tmdbID);
  for (let item of details) {
    // console.log(`Creating ${item.title} page.`)
    let releaseDate;
    if(item.releaseDate == null) {
      releaseDate = null
    } else if(item.releaseDate === '') {
      releaseDate = null
    } else {
      releaseDate = {
        "start" : item.releaseDate
      }
    }
    let rating = item.rating == null ? null : {"name": item.rating,"color" : "purple"}
    
    const response = await notion.pages.create({
      "parent": {
        "type": "database_id",
        "database_id": data.filmyhubDatabaseID
      },
      "cover" : {
        "type" : "external",
        "external" : {
          "url": item.cover
        }
      },
      "icon" : {
        "type" : "external",
        "external" : {
          "url": item.poster
        }
      },
      "properties": {
        "NAME": {
          "title": [
            {
              "type": "text",
              "text": {
                "content": item.title
              }
            }
          ]
        },
        "IMDB RATING": {
          "type": "select",
          "select": rating
        },
        "STATUS" : {
          "rich_text" : [
            {
              "type" : "text",
              "text" : {
                "content" : item.status
              }
            }
          ]
        },
        "RELEASE DATE" : {
          "type" : "date",
          "date" : releaseDate
        },
        "POSTER" : {
          "type" : "files",
          "files": [
            {
              "name":"poster",
              "type": "external",
              "external": {
                "url": item.poster
              }
            }
          ]
        },
        "IMDB URL" : {
          "type" : "url",
          "url" : item.imdbURL
        },
        "GENRE": {
          "relation" : item.genres
        },
        "TMDB ID" : {
          "type" : "number",
          "number" : item.tmdbID
        },
        "OVERVIEW" : {
          "rich_text" : [
            {
              "type" : "text",
              "text" : {
                "content" : item.overview
              }
            }
          ]
        },
        "CATEGORY": {
          "type": "relation",
          "relation": [{
            "id" : data.seriesPageID
          }]
        },
      }
    })
    console.log(`${item.title} is added in FilmyHub`)
  }
}

async function createSeasonPage(tmdbID, seasonNo, seriesPageID) {
  const details = await getSeason(tmdbID, seasonNo);
  // console.log(details)
  if(details[0].checkSeason === null && seasonNo > 0) {
    return null;
  } else {
    // console.log(details)
     for (let item of details) {
      let releaseDate = item.releaseDate == null ? null : {"start" : item.releaseDate}
      const response = await notion.pages.create({
        "parent": {
          "type": "database_id",
          "database_id": data.seasonDatabaseID
        },
        // "cover" : {
        //   "type" : "external",
        //   "external" : {
        //     "url": item.poster
        //   }
        // },
        "icon" : {
          "type" : "external",
          "external" : {
            "url": item.poster
          }
        },
        "properties": {
          "NAME": {
            "title": [
              {
                "type": "text",
                "text": {
                  "content": item.title
                }
              }
            ]
          },
          "TMDB ID" : {
            "type" : "number",
            "number" : item.tmdbID
          },
          "OVERVIEW" : {
            "rich_text" : [
              {
                "type" : "text",
                "text" : {
                  "content" : item.overview
                }
              }
            ]
          },
          "RELEASE DATE" : {
            "type" : "date",
            "date" : releaseDate
          },
          "POSTER" : {
            "type" : "files",
            "files": [
              {
                "name":"poster",
                "type": "external",
                "external": {
                  "url": item.poster
                }
              }
            ]
          },
          "SEASON" : {
            "type": "select",
            "select": {
              "name": "SEASON "+seasonNo,
              "color" : "default"
            }
          },
          "MOVIES & SERIES": {
              "type": "relation",
              "relation": [{
                "id" : seriesPageID
              }]
            },
        }
      })
      
    }
  }
}

async function createEpisodePage(tmdbID,seasonNo,episodeNo,seriesPageID,seasonPageID) {
  const details = await getEpisode(tmdbID, seasonNo, episodeNo);
  if(details[0].runtime === null) {
    return null;
  } else {
    for (let item of details) {
      let releaseDate = item.releaseDate == null ? null : {"start" : item.releaseDate}
      let rating = item.rating == null ? null : {"name": item.rating,"color" : "purple"}
      
      const response = await notion.pages.create({
        "parent": {
          "type": "database_id",
          "database_id": data.episodeDatabaseID
        },
        // "cover" : {
        //   "type" : "external",
        //   "external" : {
        //     "url": item.cover
        //   }
        // },
        "icon" : {
          "type" : "external",
          "external" : {
            "url": item.poster
          }
        },
        "properties": {
          "NAME": {
            "title": [
              {
                "type": "text",
                "text": {
                  "content": item.title
                }
              }
            ]
          },
          "IMDB RATING": {
            "type": "select",
            "select": rating
          },
          "RELEASE DATE" : {
            "type" : "date",
            "date" : releaseDate
          },
          "POSTER" : {
            "type" : "files",
            "files": [
              {
                "name":"poster",
                "type": "external",
                "external": {
                  "url": item.poster
                }
              }
            ]
          },
          "EPISODE" : {
            "type": "select",
            "select": {
              "name": "EPISODE "+episodeNo,
              "color" : "default"
            }
          },
          "TMDB ID" : {
            "type" : "number",
            "number" : item.tmdbID
          },
          "OVERVIEW" : {
            "rich_text" : [
              {
                "type" : "text",
                "text" : {
                  "content" : item.overview
                }
              }
            ]
          },
          "MOVIES & SERIES": {
            "type": "relation",
            "relation": [{
              "id" : seriesPageID
            }]
          },
          "SEASON": {
            "type": "relation",
            "relation": [{
              "id" : seasonPageID
            }]
          },
          "RUNTIME" : {
            "rich_text" : [
              {
                "type" : "text",
                "text" : {
                  "content" : item.runtime
                }
              }
            ]
          },
        }
      })
    }
  }
}

async function createPersonPage(personID,type) {
  const option = {
    method : 'GET',
    url : `https://api.themoviedb.org/3/person/${personID}`,
    headers : tmdbAuth
  }

  let responsetmdb = await axios.request(option)
  const person = responsetmdb.data
  let birthday = person.birthday == null ? null : {"start" : person.birthday}
  let response = await notion.pages.create({
    "parent": {
      "type": "database_id",
      "database_id": data.personDatabaseID
    },
    "icon" : {
      "type" : "external",
      "external" : {
        "url": `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${person.profile_path}`
      }
    },
    "properties": {
      "NAME": {
        "title": [
          {
            "type": "text",
            "text": {
              "content": person.name
            }
          }
        ]
      },
      "GENDER": {
        "type": "select",
        "select": {
          "name": getGender(person.gender),
          "color" : "gray"
        }
      },
      "BIRTHDAY" : {
        "type" : "date",
        "date" : birthday
      },
      "PROFILE" : {
        "type" : "files",
        "files": [
          {
            "name":"poster",
            "type": "external",
            "external": {
              "url": `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${person.profile_path}`
            }
          }
        ]
      },
      "TMDB ID" : {
        "type" : "number",
        "number" : person.id
      },
      "KNOWN FOR" : {
        "type": "select",
        "select": {
          "name": person.known_for_department,
          "color" : "gray"
        }
      }
    }
  }) 
}

async function addMovie(tmdbID) {
  // console.log('addMovie Starts')
  let movie = await getMovie(tmdbID)
  if(movie == null) {
    return null
  } else {
    let title = movie[0].title
    let type = "movie"
    let check
    console.log('Checking for duplication.')
    check = await checkDuplication(tmdbID,title,data.filmyhubDatabaseID)
    if(isNaN(check)) {
      console.log(`${title}, already Exist in FilmyHub.`)
      console.log(check)
      main()
      return 'Already Exist'
    } else {
      console.log(`Adding ${title} in FilmyHub.`)
      await createMoviePage(tmdbID)
      console.log(`${title} is added in FilmyHub.`)
      let personConfirmation = prompt('Want to add characters & crew members? [Y/N] : ').toLowerCase()
      if(personConfirmation === 'y') {
        check = await checkDuplication(tmdbID,title,data.filmyhubDatabaseID)
        let moviePageID = check.slice(check.lastIndexOf("-")+1)
        console.log('Adding character & crew members.')
        await addCharacter(type, tmdbID, moviePageID)
      }
    }
  }
}

async function addMovieByTMDB() {
  let tmdbID,checkTmdbID;
  do {
    tmdbID = parseInt(prompt('Enter TMDB ID: '))
    checkTmdbID = await getMovie(tmdbID)
  } while( checkTmdbID === false )
  return await addMovie(tmdbID)
}

async function addMovieByIMDB(){
  let result = await getTBI()
  // console.log(result)
  if(result.movie_results.length == 0) {
    console.log('Invalid IMDB ID.')
    await addMovieByIMDB()
  } else {
    let tmdbID = result.movie_results[0].id
    // let movie = await getMovie(tmdbID)
    // let title = movie[0].title
    await addMovie(tmdbID, title)
  }
}

async function addSeries(tmdbID) {
  let series = await getSeries(tmdbID)
  if(series == null) {
    return null
  } else {
    let title = series[0].title
    let seasonPageID, check;
    let type = "tv"
    console.log('Checking for duplication.')
     check = await checkDuplication(tmdbID,title,data.filmyhubDatabaseID)
    if(isNaN(check)) {
      console.log(`${title} found in FilmyHub.`)
      console.log(check)
    } else {
      console.log(`Adding ${title} in FilmyHub.`)
      await createSeriesPage(tmdbID)
      check = await checkDuplication(tmdbID,title,data.filmyhubDatabaseID)
      let seriesPageID = check.slice(check.lastIndexOf("-")+1)
      // console.log(seriesPageID)
      let personConfirmation = prompt('Want to add characters & crew members?[Y/N]: ').toLowerCase()
      if(personConfirmation === 'y') {
        console.log(`Adding characters in ${title}`)
        await addCharacter(type, tmdbID, seriesPageID)
      }
      let seasonConfirmation = prompt('Want to add seasons & episodes?[Y/N]: ').toLowerCase()
      // console.log(arrays.seriesArray)
      if(seasonConfirmation === 'y') {
        for(let season of arrays.seriesArray[0].seasons) {
          let checkSeason = await  createSeasonPage(tmdbID, season.season_number, seriesPageID)
          if(checkSeason === null) {
            break
          } else {
            let seasonTmdbID =  arrays.seasonArray[0].tmdbID
            let seasonTitle = arrays.seasonArray[0].title
            console.log(`${seasonTitle} added.`)
            check = await checkDuplication(seasonTmdbID,seasonTitle,data.seasonDatabaseID)
            let seasonPageID = check.slice(check.lastIndexOf("-")+1)
            // console.log(arrays.seasonArray[0].episode)
            for(let episode of arrays.seasonArray[0].episode) {
              await createEpisodePage(tmdbID,season.season_number,episode.episode_number,seriesPageID,seasonPageID)
              console.log(`\tEpisode ${episode.episode_number} added.`)
            }
          }
        }
      }  
    }
  }
}

async function addSeriesByTMDB() {
  let tmdbID,checkTmdbID;
  do {
    tmdbID = parseInt(prompt('Enter TMDB ID: '))
    checkTmdbID = await getSeries(tmdbID)
  } while( checkTmdbID === false )
  return await addSeries(tmdbID)
}

async function addSeriesByIMDB() {
  let result = await getTBI()
  // console.log(result)
  if(result.tv_results.length == 0) {
    console.log('Invalid IMDB ID.')
    await addSeriesByIMDB()
  } else {
    let tmdbID = result.tv_results[0].id
    // let series = await getSeries(tmdbID)
    // let title = series[0].title
    await addSeries(tmdbID)
  }
}

async function addSeason() {
  let check;
  let tmdbID = parseInt(prompt('Enter TMDB ID: '))
  let seasonNo = parseInt(prompt('Enter season number: '))

  let series = await getSeries(tmdbID)
  let seriesTitle = series[0].title;
  check = await checkDuplication(tmdbID, seriesTitle, data.filmyhubDatabaseID)
  if (isNaN(check)) {
    console.log('Series Found.');
    let seriesPageID = check.slice(check.lastIndexOf('-') + 1);
      // console.log(seriesPageID)
    let season = await getSeason(tmdbID, seasonNo);
    if(season === false ){
      console.log(`Season ${seasonNo} not exist.`)
      main()
    } else{
      let seasonTmdbID = season[0].tmdbID;
      let seasonTitle = season[0].title;
      check = await checkDuplication(seasonTmdbID, seasonTitle, data.seasonDatabaseID);
      if (isNaN(check)) {
        console.log('Season already exist in FilmyHub.');
        console.log(check)
        main()
        
      } else {
        console.log(`Getting ${seasonTitle} detail.`);
        let createSeason = await createSeasonPage(tmdbID, seasonNo, seriesPageID);
        if(createSeason === null) {
          console.log('Season is not released yet.')
          main()
        } else  {
          console.log(`${seasonTitle} added.`)
          check = await checkDuplication(seasonTmdbID, seasonTitle, data.seasonDatabaseID);
          let seasonPageID = check.slice(check.lastIndexOf('-') + 1);
          for(let episode of arrays.seasonArray[0].episode) {
            await createEpisodePage(tmdbID,seasonNo,episode.episode_number,seriesPageID,seasonPageID)
            console.log(`\tEpisode ${episode.episode_number} added.`)
          }
          main()
        }
      }
    }
  } else  {
    console.log('Series Not Found.')
    let seriesConfirmation = prompt('Want to add series?[Y/N]: ').toLowerCase()
      if(seriesConfirmation === 'y')  {
        await addSeries(tmdbID)
        main()
      } else {
        main()
      }
  }
}

async function addEpisode() {
  let check;
  let tmdbID = parseInt(prompt('Enter Series TMDB ID: '))
  let seasonNo = parseInt(prompt('Enter Season Number: '))
  let episodeNo = parseInt(prompt('Enter Episode Number: '))
  let series = await getSeries(tmdbID)
  let seriesTitle = series[0].title;
  check = await checkDuplication(tmdbID, seriesTitle, data.filmyhubDatabaseID)
  if (isNaN(check)) {
    console.log('Series Found.');
    let seriesPageID = check.slice(check.lastIndexOf('-') + 1);
    
    let season = await getSeason(tmdbID, seasonNo)
    if(season === false ){
      console.log(`Season ${seasonNo} not exist.`)
      main()
    } else{
      let seasonTmdbID = season[0].tmdbID;
      let seasonTitle = season[0].title;
      check = await checkDuplication(seasonTmdbID, seasonTitle, data.seasonDatabaseID);
      if(isNaN(check)){
        console.log('Season Found.')
        let seasonPageID = check.slice(check.lastIndexOf('-') + 1);
        let episode = await getEpisode(tmdbID,seasonNo,episodeNo)
        if(episode === false){
          console.log(`Episode ${episodeNo} not exist.`)
          main()
        } else {
          let episodeTmdbID = episode[0].tmdbID;
          let episodeTitle = episode[0].title;
          check = await checkDuplication(episodeTmdbID, episodeTitle, data.episodeDatabaseID);
          if(isNaN(check)){
            console.log(`Episode ${episodeNo} is already exist in FilmyHub.`)
            console.log(check)
            main()
          } else{
            console.log(`Getting Episode ${episodeNo} detail.`);
            let createEpisode = await createEpisodePage(tmdbID,seasonNo,episodeNo,seriesPageID,seasonPageID)
            if(createEpisode === null) {
              console.log('Episode is not released yet.')
              main()
            } else  {
              console.log(`${episodeNo} added.`)
              main()
            }
          }
        }
      } else {
        console.log('Season not found in FilmyHub')
        main()
      }
      
    }
    
  } else {
    console.log('Series Not Found.')
    let seriesConfirmation = prompt('Do you want to add series?[Y/N]: ').toLowerCase()
    if(seriesConfirmation === 'y')  {
      await addSeries(tmdbID)
      main()
    } else {
      main()
    }
  }
}

async function addCharacter(type, tmdbID, pageID) {
  let personPageID, check;
  let characterArray = await getCredit(type, tmdbID)
  for(let character of characterArray) {
    check = await checkDuplication(character.tmdbID, character.name, data.personDatabaseID)
    if(isNaN(check)) {
      personPageID = check.slice(check.lastIndexOf("-")+1)
      let response = await notion.pages.create({
        "parent": {
          "type": "database_id",
          "database_id": data.characterDatabaseID
        },
        "icon" : {
          "type" : "external",
          "external" : {
            "url": `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${character.profile}`
          }
        },
        "properties": {
          "Name": {
            "title": [
              {
                "type": "text",
                "text": {
                  "content": character.characterName
                }
              }
            ]
          },
          "Gender": {
            "type": "select",
            "select": {
              "name": getGender(character.gender),
              "color" : "gray"
            }
          },
          "Profile" : {
            "type" : "files",
            "files": [
              {
                "name":"poster",
                "type": "external",
                "external": {
                  "url": `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${character.profile}`
                }
              }
            ]
          },
          "Role" : {
            "type": "select",
            "select": {
              "name": character.role,
              "color" : "gray"
            }
          },
          "Person": {
            "type": "relation",
            "relation": [{
              "id" : personPageID
            }]
          },
          "FilmyHub": {
            "type": "relation",
            "relation": [{
              "id" : pageID
            }]
          },
        }
      }) 
      console.log(`${character.name} added as ${character.characterName}`)
    } else {
      await createPersonPage(character.tmdbID)
      check = await checkDuplication(character.tmdbID, character.name, data.personDatabaseID)
      personPageID = check.slice(check.lastIndexOf("-")+1)
      let response = await notion.pages.create({
        "parent": {
          "type": "database_id",
          "database_id": data.characterDatabaseID
        },
        "icon" : {
          "type" : "external",
          "external" : {
            "url": `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${character.profile}`
          }
        },
        "properties": {
          "Name": {
            "title": [
              {
                "type": "text",
                "text": {
                  "content": character.characterName
                }
              }
            ]
          },
          "Gender": {
            "type": "select",
            "select": {
              "name": getGender(character.gender),
              "color" : "gray"
            }
          },
          "Profile" : {
            "type" : "files",
            "files": [
              {
                "name":"poster",
                "type": "external",
                "external": {
                  "url": `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${character.profile}`
                }
              }
            ]
          },
          "Role" : {
            "type": "select",
            "select": {
              "name": character.role,
              "color" : "gray"
            }
          },
          "Person": {
            "type": "relation",
            "relation": [{
              "id" : personPageID
            }]
          },
          "FilmyHub": {
            "type": "relation",
            "relation": [{
              "id" : pageID
            }]
          },
        }
      })
      console.log(`${character.name} added as ${character.characterName}`)
    }
  }
}

async function movieMenu() {
  let tmdbID, title, movie;

  console.log('0. Back to main menu.\n1. Search movie\n2. Add by TMDB ID\n3. Add by IMDBID')
  let movieOption = parseInt(prompt('Select option: '))
  let addMovieReturn
  switch (movieOption) {
    case 0:
      main()
      break
    case 1:
      let searchResult = await searchMovie()
      tmdbID = searchResult.id
      title = searchResult.title
      // console.log('Search Result Ended')
      addMovieReturn = await addMovie(tmdbID, title)
      if(addMovieReturn !== 'Already Exist') {
        movieRollback()
      } 
      break
    case 2:
      addMovieReturn = await addMovieByTMDB()
      // console.log(addMovieReturn)
      // console.log(addMovieReturn)
      if(addMovieReturn !== 'Already Exist') {
        movieRollback()
      }
      break
    case 3:
      await addMovieByIMDB()
      movieRollback()
      break
    default:
      console.log('Invalid selection.')
      movieMenu()    
  }      
}

async function seriesMenu() {
  let tmdbID, title, movie;

  console.log('0. Back to main menu.\n1. Search series\n2. Add by TMDB ID\n3. Add by IMDB ID')
  let seriesOption = parseInt(prompt('Select option: '))
  let addSeriesReturn;
  switch (seriesOption) {
    case 0:
      main()
      break
    case 1:
      let searchResult = await searchSeries()
      // console.log(searchResult)
      tmdbID = searchResult.id
      title = searchResult.title
      addSeriesReturn = await addSeries(tmdbID)
      if(addSeriesReturn !== 'Already Exist') {
        seriesRollback()
      }
      break
    case 2:
      addSeriesReturn = await addSeriesByTMDB()
      // console.log(addMovieReturn)
      // console.log(addMovieReturn)
      if(addSeriesReturn !== 'Already Exist') {
        seriesRollback()
      }
    case 3:
      await addSeriesByIMDB()
      seriesRollback()
      break
    default:
      console.log('Invalid selection.')
      seriesMenu()
  }
} 

async function movieRollback() {
  console.log('1. Back to Movie Menu\n2. Back to Main Menu\n3. End')
  let option = parseInt(prompt('Select option: '))
  switch(option) {
    case 1:
      movieMenu()
      break
    case 2:
      main()
      break
    case 3:
      signature()
      break
    case 4:
      console.log('Invalid selection.')
      movieRollback()
  }
}

async function seriesRollback(){
  console.log('1. Back to Series Menu\n2. Back to Main Menu\n3. End')
  let option = parseInt(prompt('Select option: '))
  switch(option) {
    case 1:
      seriesMenu()
      break
    case 2:
      main()
      break
    case 3:
      signature()
      break
    default :
      console.log('Invalid selection.') 
  }
}

async function main() {
  console.log('1. Add Movie\n2. Add Series\n3. Add Season\n4. Add Episode\n5. End')
  let option = parseInt(prompt('Select option: '))
  switch(option) {
    case 1:
      await movieMenu()
      break
    case 2:
      seriesMenu()
      break
    case 3: 
      await addSeason()
      break
    case 4:
      await addEpisode()
      break
    case 5:
      signature()
      break
    default:
      console.log('Invalid Selection')
      main()
  }
}

console.log('Welcome to FilmyHub 2.0 - NotionBoy')
main()




// searchMovie()
// seriesMenu()
// searchMovie()
// getTBI('tt2085059')
// createMoviePage(916224)
// getMovie(8734974573738)
// createPersonPage(15841)
// getCredit(872585)
// addSeries(77169)
// getSeries(114472)
// getSeason(84958,2)
// createSeasonPage(84958,2,'sf')
// addSeason(114472,1)
// getSeason(85937,1)
// getIMDBURLforSeries(114472)
// getEpisode(114472,1,4)
// addMovie(550)
// addMovieByTMDB()