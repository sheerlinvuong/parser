const request = require('request');
const cheerio = require('cheerio');
const Actor = require('./models/actor');
const actorURL = 'https://www.imdb.com/name/nm0425005';

request(actorURL, function(error, response, html) {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    const parsedResults = [];

    let actor = new Actor();

    $('h1.header').each(function(i, element) {
      // Select the element
      const a = $(this);
      // Parse the actor title
      const title = a.children().text();

      // get to where the profile pic is
      const pic = a
        .parent()
        .prev()
        .children()
        .children()
        .children();
      // Parse the href attribute from the "a" element
      const url = pic.attr('src');
      actor.name = title;
      actor.images = [url];

      // Our parsed meta data object
      var metadata = {
        title: title,
        profilepic: url,
      };
      // Push meta-data into parsedResults array
      parsedResults.push(metadata);
    });

    const more = '/mediaindex?ref_=nm_phs_md_sm';
    // /mediaindex?ref_=nm_phs_md_sm <-- 1st page
    // /mediaindex?page=5&ref_=nmmi_mi_sm <-- next pages (make a for loop)
    request(actorURL + more, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $('div.media_index_thumb_list')
          .children()
          .children()
          .each(function(i, element) {
            sm = $(this).attr('src');

            const end = sm.split('._V1_').pop();
            const lg = sm.replace('._V1_' + end, '.jpg');
            //console.log(lg);

            actor.images.push({ sm: sm, lg: lg });

            //parsedResults.push(mpic);
          });
        actor.save(e => {
          console.log('saved');
          if (e) {
            console.log('somethings wrong', e);
          }
        });
      }
    });

    // Log our finished parse results in the terminal
    //console.log(parsedResults);
  }
});
