const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Actor = require('./models/actor');

const getActorData = async imdbId => {
  const actorURL = `https://www.imdb.com/name/${imdbId}`;
  try {
    const res = await fetch(actorURL).then(res => res.text());
    const $ = cheerio.load(res);

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
      console.log(`title: ${title}`);
      actor.name = title;
      actor.images = [url];
    });

    const more = '/mediaindex?ref_=nm_phs_md_sm';
    // /mediaindex?ref_=nm_phs_md_sm <-- 1st page
    // /mediaindex?page=5&ref_=nmmi_mi_sm <-- next pages (make a for loop)
    const moreRes = await fetch(actorURL + more).then(res => res.text());

    const $more = cheerio.load(moreRes);

    $more('div.media_index_thumb_list')
      .children()
      .children()
      .each(function(i, element) {
        sm = $(this).attr('src');

        const end = sm.split('._V1').pop();
        const lg = sm.replace('._V1' + end, '.jpg');
        //console.log(lg);

        actor.images.push({ sm: sm, lg: lg });
      });
    actor.save(e => {
      console.log('saved');
      if (e) {
        console.log('somethings wrong', e);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

const getTopActors1000 = async function(no) {
  const Url = 'https://www.imdb.com/search/name?gender=male,female&start=' + no;

  try {
    const res = await fetch(Url).then(res => res.text());
    const $ = cheerio.load(res);

    $('h3.lister-item-header')
      .children()
      .next()
      .each(async function(i, element) {
        const a = $(this).attr('href');
        const b = $(this).text();

        const id = a.split('/name/').pop();

        //actor.id.push(id)
        await getActorData(id);
      });
    if (no < 1000) {
      no += 50;
      getTopActors1000(no);
    }
  } catch (error) {
    console.error(error);
  }
};

getTopActors1000(1);
