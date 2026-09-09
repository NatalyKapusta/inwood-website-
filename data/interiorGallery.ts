export type GalleryPhoto = {
  colorSlug: string | null;
  colorLabel: string | null;
  swatchImage: string | null;
  src: string;
};

export type GalleryModel = {
  code: string;
  photos: GalleryPhoto[];
};

export type GalleryCollection = {
  key: string;
  label: string;
  models: GalleryModel[];
};

export const galleryCollections: GalleryCollection[] = [
  {
    "key": "etalon",
    "label": "ETALON",
    "models": [
      {
        "code": "ET-01",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-01-astana-marle.png",
            "src": "/photos/gallery/etalon/et-01-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-01-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-01-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-01-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-01-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-01-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-01-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-01-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-01-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-01-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-01-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-01-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-01-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-01-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-01-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-01-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-01-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-01-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-01-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-01-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-01-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-01-white.png",
            "src": "/photos/gallery/etalon/et-01-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-01-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-01-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-02",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-02-astana-marle.png",
            "src": "/photos/gallery/etalon/et-02-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-02-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-02-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-02-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-02-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-02-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-02-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-02-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-02-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-02-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-02-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-02-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-02-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-02-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-02-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-02-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-02-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-02-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-02-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-02-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-02-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-02-white.png",
            "src": "/photos/gallery/etalon/et-02-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-02-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-02-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-03",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-03-astana-marle.png",
            "src": "/photos/gallery/etalon/et-03-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-03-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-03-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-03-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-03-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-03-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-03-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-03-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-03-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-03-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-03-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-03-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-03-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-03-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-03-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-03-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-03-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-03-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-03-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-03-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-03-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-03-white.png",
            "src": "/photos/gallery/etalon/et-03-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-03-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-03-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-04",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-04-astana-marle.png",
            "src": "/photos/gallery/etalon/et-04-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-04-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-04-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-04-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-04-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-04-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-04-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-04-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-04-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-04-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-04-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-04-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-04-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-04-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-04-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-04-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-04-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-04-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-04-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-04-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-04-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-04-white.png",
            "src": "/photos/gallery/etalon/et-04-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-04-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-04-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-05",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-05-astana-marle.png",
            "src": "/photos/gallery/etalon/et-05-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-05-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-05-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-05-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-05-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-05-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-05-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-05-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-05-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-05-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-05-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-05-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-05-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-05-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-05-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-05-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-05-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-05-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-05-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-05-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-05-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-05-white.png",
            "src": "/photos/gallery/etalon/et-05-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-05-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-05-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-06",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-06-astana-marle.png",
            "src": "/photos/gallery/etalon/et-06-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-06-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-06-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-06-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-06-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-06-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-06-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-06-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-06-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-06-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-06-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-06-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-06-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-06-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-06-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-06-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-06-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-06-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-06-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-06-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-06-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-06-white.png",
            "src": "/photos/gallery/etalon/et-06-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-06-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-06-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-07",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-07-astana-marle.png",
            "src": "/photos/gallery/etalon/et-07-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-07-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-07-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-07-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-07-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-07-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-07-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-07-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-07-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-07-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-07-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-07-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-07-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-07-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-07-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-07-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-07-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-07-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-07-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-07-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-07-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-07-white.png",
            "src": "/photos/gallery/etalon/et-07-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-07-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-07-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-08",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-08-astana-marle.png",
            "src": "/photos/gallery/etalon/et-08-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-08-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-08-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-08-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-08-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-08-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-08-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-08-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-08-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-08-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-08-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-08-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-08-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-08-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-08-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-08-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-08-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-08-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-08-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-08-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-08-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-08-white.png",
            "src": "/photos/gallery/etalon/et-08-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-08-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-08-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-09",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-09-astana-marle.png",
            "src": "/photos/gallery/etalon/et-09-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-09-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-09-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-09-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-09-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-09-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-09-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-09-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-09-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-09-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-09-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-09-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-09-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-09-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-09-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-09-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-09-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-09-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-09-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-09-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-09-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-09-white.png",
            "src": "/photos/gallery/etalon/et-09-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-09-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-09-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-10",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-10-astana-marle.png",
            "src": "/photos/gallery/etalon/et-10-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-10-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-10-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-10-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-10-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-10-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-10-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-10-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-10-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-10-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-10-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-10-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-10-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-10-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-10-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-10-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-10-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-10-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-10-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-10-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-10-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-10-white.png",
            "src": "/photos/gallery/etalon/et-10-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-10-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-10-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-11",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-11-astana-marle.png",
            "src": "/photos/gallery/etalon/et-11-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-11-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-11-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-11-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-11-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-11-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-11-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-11-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-11-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-11-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-11-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-11-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-11-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-11-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-11-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-11-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-11-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-11-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-11-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-11-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-11-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-11-white.png",
            "src": "/photos/gallery/etalon/et-11-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-11-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-11-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-12",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-12-astana-marle.png",
            "src": "/photos/gallery/etalon/et-12-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-12-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-12-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-12-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-12-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-12-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-12-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-12-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-12-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-12-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-12-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-12-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-12-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-12-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-12-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-12-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-12-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-12-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-12-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-12-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-12-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-12-white.png",
            "src": "/photos/gallery/etalon/et-12-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-12-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-12-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-13",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-13-astana-marle.png",
            "src": "/photos/gallery/etalon/et-13-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-13-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-13-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-13-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-13-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-13-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-13-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-13-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-13-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-13-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-13-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-13-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-13-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-13-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-13-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-13-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-13-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-13-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-13-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-13-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-13-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-13-white.png",
            "src": "/photos/gallery/etalon/et-13-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-13-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-13-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-14",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-14-astana-marle.png",
            "src": "/photos/gallery/etalon/et-14-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-14-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-14-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-14-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-14-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-14-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-14-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-14-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-14-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-14-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-14-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-14-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-14-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-14-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-14-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-14-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-14-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-14-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-14-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-14-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-14-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-14-white.png",
            "src": "/photos/gallery/etalon/et-14-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-14-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-14-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-15",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-15-astana-marle.png",
            "src": "/photos/gallery/etalon/et-15-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-15-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-15-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-15-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-15-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-15-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-15-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-15-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-15-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-15-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-15-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-15-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-15-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-15-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-15-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-15-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-15-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-15-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-15-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-15-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-15-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-15-white.png",
            "src": "/photos/gallery/etalon/et-15-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-15-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-15-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-16",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-16-astana-marle.png",
            "src": "/photos/gallery/etalon/et-16-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-16-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-16-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-16-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-16-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-16-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-16-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-16-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-16-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-16-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-16-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-16-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-16-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-16-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-16-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-16-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-16-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-16-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-16-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-16-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-16-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-16-white.png",
            "src": "/photos/gallery/etalon/et-16-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-16-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-16-zriz-kameniu.jpg"
          }
        ]
      },
      {
        "code": "ET-17",
        "photos": [
          {
            "colorSlug": "astana-marle",
            "colorLabel": "астана марле",
            "swatchImage": "/photos/etalon/et-17-astana-marle.png",
            "src": "/photos/gallery/etalon/et-17-astana-marle.jpg"
          },
          {
            "colorSlug": "beton-siryi",
            "colorLabel": "бетон сірий",
            "swatchImage": "/photos/etalon/et-17-beton-siryi.png",
            "src": "/photos/gallery/etalon/et-17-beton-siryi.jpg"
          },
          {
            "colorSlug": "beton-temnyi",
            "colorLabel": "бетон темний",
            "swatchImage": "/photos/etalon/et-17-beton-temnyi.png",
            "src": "/photos/gallery/etalon/et-17-beton-temnyi.jpg"
          },
          {
            "colorSlug": "bila-teksturna",
            "colorLabel": "біла текстурна",
            "swatchImage": "/photos/etalon/et-17-bila-teksturna.png",
            "src": "/photos/gallery/etalon/et-17-bila-teksturna.jpg"
          },
          {
            "colorSlug": "chorna-korka",
            "colorLabel": "чорна корка",
            "swatchImage": "/photos/etalon/et-17-chorna-korka.png",
            "src": "/photos/gallery/etalon/et-17-chorna-korka.jpg"
          },
          {
            "colorSlug": "karpatska-ialyna",
            "colorLabel": "карпатська ялина",
            "swatchImage": "/photos/etalon/et-17-karpatska-ialyna.png",
            "src": "/photos/gallery/etalon/et-17-karpatska-ialyna.jpg"
          },
          {
            "colorSlug": "popeliastyi-softach",
            "colorLabel": "попелястий софтач",
            "swatchImage": "/photos/etalon/et-17-popeliastyi-softach.png",
            "src": "/photos/gallery/etalon/et-17-popeliastyi-softach.jpg"
          },
          {
            "colorSlug": "rustyk-zolotyi",
            "colorLabel": "рустик золотий",
            "swatchImage": "/photos/etalon/et-17-rustyk-zolotyi.png",
            "src": "/photos/gallery/etalon/et-17-rustyk-zolotyi.jpg"
          },
          {
            "colorSlug": "shpon-korychnevyi",
            "colorLabel": "шпон коричневий",
            "swatchImage": "/photos/etalon/et-17-shpon-korychnevyi.png",
            "src": "/photos/gallery/etalon/et-17-shpon-korychnevyi.jpg"
          },
          {
            "colorSlug": "sosna-provans",
            "colorLabel": "сосна прованс",
            "swatchImage": "/photos/etalon/et-17-sosna-provans.png",
            "src": "/photos/gallery/etalon/et-17-sosna-provans.jpg"
          },
          {
            "colorSlug": "venhe-pivdenne-tysnene",
            "colorLabel": "венге південне тиснене",
            "swatchImage": "/photos/etalon/et-17-venhe-pivdenne-tysnene.png",
            "src": "/photos/gallery/etalon/et-17-venhe-pivdenne-tysnene.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/etalon/et-17-white.png",
            "src": "/photos/gallery/etalon/et-17-white.jpg"
          },
          {
            "colorSlug": "zriz-kameniu",
            "colorLabel": "зріз каменю",
            "swatchImage": "/photos/etalon/et-17-zriz-kameniu.png",
            "src": "/photos/gallery/etalon/et-17-zriz-kameniu.jpg"
          }
        ]
      }
    ]
  },
  {
    "key": "nominal",
    "label": "NOMINAL",
    "models": [
      {
        "code": "NL-01",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "Антрацит",
            "swatchImage": "/photos/nominal/nl-01-antratsyt.png",
            "src": "/photos/gallery/nominal/nl-01-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "Дуб немо лате",
            "swatchImage": "/photos/nominal/nl-01-dub-nemo-late.png",
            "src": "/photos/gallery/nominal/nl-01-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-nemo-sribliastyi",
            "colorLabel": "Дуб немо сріблястий",
            "swatchImage": "/photos/nominal/nl-01-dub-nemo-sribliastyi.png",
            "src": "/photos/gallery/nominal/nl-01-dub-nemo-sribliastyi.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "Дуб пасадена",
            "swatchImage": "/photos/nominal/nl-01-dub-pasadena.png",
            "src": "/photos/gallery/nominal/nl-01-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "Дуб шато",
            "swatchImage": "/photos/nominal/nl-01-dub-shato.png",
            "src": "/photos/gallery/nominal/nl-01-dub-shato.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "Оксид світлий",
            "swatchImage": "/photos/nominal/nl-01-oksyd-svitlyi.png",
            "src": "/photos/gallery/nominal/nl-01-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "Оксид темний",
            "swatchImage": "/photos/nominal/nl-01-oksyd-temnyi.png",
            "src": "/photos/gallery/nominal/nl-01-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/nominal/nl-01-white.png",
            "src": "/photos/gallery/nominal/nl-01-white.jpg"
          }
        ]
      },
      {
        "code": "NL-02",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "Антрацит",
            "swatchImage": "/photos/nominal/nl-02-antratsyt.png",
            "src": "/photos/gallery/nominal/nl-02-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "Дуб немо лате",
            "swatchImage": "/photos/nominal/nl-02-dub-nemo-late.png",
            "src": "/photos/gallery/nominal/nl-02-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-nemo-sribliastyi",
            "colorLabel": "Дуб немо сріблястий",
            "swatchImage": "/photos/nominal/nl-02-dub-nemo-sribliastyi.png",
            "src": "/photos/gallery/nominal/nl-02-dub-nemo-sribliastyi.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "Дуб пасадена",
            "swatchImage": "/photos/nominal/nl-02-dub-pasadena.png",
            "src": "/photos/gallery/nominal/nl-02-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "Дуб шато",
            "swatchImage": "/photos/nominal/nl-02-dub-shato.png",
            "src": "/photos/gallery/nominal/nl-02-dub-shato.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "Оксид світлий",
            "swatchImage": "/photos/nominal/nl-02-oksyd-svitlyi.png",
            "src": "/photos/gallery/nominal/nl-02-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "Оксид темний",
            "swatchImage": "/photos/nominal/nl-02-oksyd-temnyi.png",
            "src": "/photos/gallery/nominal/nl-02-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/nominal/nl-02-white.png",
            "src": "/photos/gallery/nominal/nl-02-white.jpg"
          }
        ]
      },
      {
        "code": "NL-03",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "Антрацит",
            "swatchImage": "/photos/nominal/nl-03-antratsyt.png",
            "src": "/photos/gallery/nominal/nl-03-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "Дуб немо лате",
            "swatchImage": "/photos/nominal/nl-03-dub-nemo-late.png",
            "src": "/photos/gallery/nominal/nl-03-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-nemo-sribliastyi",
            "colorLabel": "Дуб немо сріблястий",
            "swatchImage": "/photos/nominal/nl-03-dub-nemo-sribliastyi.png",
            "src": "/photos/gallery/nominal/nl-03-dub-nemo-sribliastyi.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "Дуб пасадена",
            "swatchImage": "/photos/nominal/nl-03-dub-pasadena.png",
            "src": "/photos/gallery/nominal/nl-03-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "Дуб шато",
            "swatchImage": "/photos/nominal/nl-03-dub-shato.png",
            "src": "/photos/gallery/nominal/nl-03-dub-shato.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "Оксид світлий",
            "swatchImage": "/photos/nominal/nl-03-oksyd-svitlyi.png",
            "src": "/photos/gallery/nominal/nl-03-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "Оксид темний",
            "swatchImage": "/photos/nominal/nl-03-oksyd-temnyi.png",
            "src": "/photos/gallery/nominal/nl-03-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/nominal/nl-03-white.png",
            "src": "/photos/gallery/nominal/nl-03-white.jpg"
          }
        ]
      },
      {
        "code": "NL-04",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "Антрацит",
            "swatchImage": "/photos/nominal/nl-04-antratsyt.png",
            "src": "/photos/gallery/nominal/nl-04-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "Дуб немо лате",
            "swatchImage": "/photos/nominal/nl-04-dub-nemo-late.png",
            "src": "/photos/gallery/nominal/nl-04-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-nemo-sribliastyi",
            "colorLabel": "Дуб немо сріблястий",
            "swatchImage": "/photos/nominal/nl-04-dub-nemo-sribliastyi.png",
            "src": "/photos/gallery/nominal/nl-04-dub-nemo-sribliastyi.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "Дуб пасадена",
            "swatchImage": "/photos/nominal/nl-04-dub-pasadena.png",
            "src": "/photos/gallery/nominal/nl-04-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "Дуб шато",
            "swatchImage": "/photos/nominal/nl-04-dub-shato.png",
            "src": "/photos/gallery/nominal/nl-04-dub-shato.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "Оксид світлий",
            "swatchImage": "/photos/nominal/nl-04-oksyd-svitlyi.png",
            "src": "/photos/gallery/nominal/nl-04-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "Оксид темний",
            "swatchImage": "/photos/nominal/nl-04-oksyd-temnyi.png",
            "src": "/photos/gallery/nominal/nl-04-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/nominal/nl-04-white.png",
            "src": "/photos/gallery/nominal/nl-04-white.jpg"
          }
        ]
      },
      {
        "code": "NL-05",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "Антрацит",
            "swatchImage": "/photos/nominal/nl-05-antratsyt.png",
            "src": "/photos/gallery/nominal/nl-05-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "Дуб немо лате",
            "swatchImage": "/photos/nominal/nl-05-dub-nemo-late.png",
            "src": "/photos/gallery/nominal/nl-05-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-nemo-sribliastyi",
            "colorLabel": "Дуб немо сріблястий",
            "swatchImage": "/photos/nominal/nl-05-dub-nemo-sribliastyi.png",
            "src": "/photos/gallery/nominal/nl-05-dub-nemo-sribliastyi.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "Дуб пасадена",
            "swatchImage": "/photos/nominal/nl-05-dub-pasadena.png",
            "src": "/photos/gallery/nominal/nl-05-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "Дуб шато",
            "swatchImage": "/photos/nominal/nl-05-dub-shato.png",
            "src": "/photos/gallery/nominal/nl-05-dub-shato.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "Оксид світлий",
            "swatchImage": "/photos/nominal/nl-05-oksyd-svitlyi.png",
            "src": "/photos/gallery/nominal/nl-05-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "Оксид темний",
            "swatchImage": "/photos/nominal/nl-05-oksyd-temnyi.png",
            "src": "/photos/gallery/nominal/nl-05-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/nominal/nl-05-white.png",
            "src": "/photos/gallery/nominal/nl-05-white.jpg"
          }
        ]
      }
    ]
  },
  {
    "key": "frezzatti",
    "label": "FREZZATTI",
    "models": [
      {
        "code": "FZ-01",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-01-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-01-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-01-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-01-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-01-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-01-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-01-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-01-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-01-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-01-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-01-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-01-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-01-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-01-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-01-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-01-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-01-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-01-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-01-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-01-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-01-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-01-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-01-white.png",
            "src": "/photos/gallery/frezzatti/fz-01-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-02",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-02-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-02-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-02-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-02-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-02-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-02-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-02-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-02-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-02-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-02-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-02-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-02-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-02-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-02-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-02-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-02-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-02-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-02-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-02-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-02-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-02-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-02-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-02-white.png",
            "src": "/photos/gallery/frezzatti/fz-02-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-03",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-03-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-03-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-03-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-03-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-03-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-03-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-03-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-03-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-03-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-03-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-03-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-03-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-03-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-03-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-03-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-03-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-03-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-03-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-03-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-03-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-03-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-03-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-03-white.png",
            "src": "/photos/gallery/frezzatti/fz-03-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-04",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-04-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-04-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-04-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-04-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-04-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-04-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-04-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-04-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-04-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-04-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-04-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-04-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-04-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-04-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-04-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-04-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-04-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-04-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-04-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-04-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-04-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-04-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-04-white.png",
            "src": "/photos/gallery/frezzatti/fz-04-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-05",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-05-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-05-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-05-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-05-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-05-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-05-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-05-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-05-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-05-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-05-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-05-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-05-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-05-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-05-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-05-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-05-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-05-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-05-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-05-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-05-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-05-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-05-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-05-white.png",
            "src": "/photos/gallery/frezzatti/fz-05-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-06",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-06-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-06-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-06-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-06-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-06-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-06-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-06-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-06-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-06-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-06-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-06-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-06-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-06-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-06-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-06-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-06-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-06-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-06-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-06-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-06-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-06-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-06-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-06-white.png",
            "src": "/photos/gallery/frezzatti/fz-06-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-07",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-07-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-07-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-07-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-07-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-07-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-07-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-07-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-07-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-07-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-07-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-07-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-07-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-07-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-07-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-07-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-07-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-07-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-07-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-07-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-07-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-07-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-07-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-07-white.png",
            "src": "/photos/gallery/frezzatti/fz-07-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-08",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-08-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-08-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-08-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-08-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-08-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-08-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-08-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-08-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-08-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-08-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-08-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-08-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-08-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-08-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-08-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-08-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-08-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-08-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-08-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-08-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-08-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-08-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-08-white.png",
            "src": "/photos/gallery/frezzatti/fz-08-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-09",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-09-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-09-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-09-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-09-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-09-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-09-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-09-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-09-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-09-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-09-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-09-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-09-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-09-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-09-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-09-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-09-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-09-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-09-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-09-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-09-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-09-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-09-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-09-white.png",
            "src": "/photos/gallery/frezzatti/fz-09-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-10",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-10-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-10-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-10-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-10-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-10-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-10-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-10-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-10-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-10-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-10-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-10-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-10-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-10-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-10-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-10-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-10-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-10-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-10-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-10-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-10-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-10-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-10-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-10-white.png",
            "src": "/photos/gallery/frezzatti/fz-10-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-11",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-11-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-11-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-11-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-11-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-11-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-11-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-11-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-11-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-11-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-11-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-11-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-11-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-11-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-11-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-11-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-11-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-11-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-11-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-11-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-11-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-11-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-11-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-11-white.png",
            "src": "/photos/gallery/frezzatti/fz-11-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-12",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-12-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-12-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-12-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-12-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-12-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-12-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-12-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-12-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-12-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-12-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-12-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-12-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-12-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-12-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-12-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-12-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-12-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-12-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-12-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-12-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-12-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-12-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-12-white.png",
            "src": "/photos/gallery/frezzatti/fz-12-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-13",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-13-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-13-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-13-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-13-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-13-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-13-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-13-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-13-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-13-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-13-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-13-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-13-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-13-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-13-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-13-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-13-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-13-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-13-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-13-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-13-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-13-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-13-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-13-white.png",
            "src": "/photos/gallery/frezzatti/fz-13-white.jpg"
          }
        ]
      },
      {
        "code": "FZ-14",
        "photos": [
          {
            "colorSlug": "antratsyt",
            "colorLabel": "антрацит",
            "swatchImage": "/photos/frezzatti/fz-14-antratsyt.png",
            "src": "/photos/gallery/frezzatti/fz-14-antratsyt.jpg"
          },
          {
            "colorSlug": "dub-nemo-late",
            "colorLabel": "дуб немо лате",
            "swatchImage": "/photos/frezzatti/fz-14-dub-nemo-late.png",
            "src": "/photos/gallery/frezzatti/fz-14-dub-nemo-late.jpg"
          },
          {
            "colorSlug": "dub-pasadena",
            "colorLabel": "дуб пасадена",
            "swatchImage": "/photos/frezzatti/fz-14-dub-pasadena.png",
            "src": "/photos/gallery/frezzatti/fz-14-dub-pasadena.jpg"
          },
          {
            "colorSlug": "dub-portovyi",
            "colorLabel": "дуб портовий",
            "swatchImage": "/photos/frezzatti/fz-14-dub-portovyi.png",
            "src": "/photos/gallery/frezzatti/fz-14-dub-portovyi.jpg"
          },
          {
            "colorSlug": "dub-shato",
            "colorLabel": "дуб шато",
            "swatchImage": "/photos/frezzatti/fz-14-dub-shato.png",
            "src": "/photos/gallery/frezzatti/fz-14-dub-shato.jpg"
          },
          {
            "colorSlug": "dub-sribliastyi",
            "colorLabel": "дуб сріблястий",
            "swatchImage": "/photos/frezzatti/fz-14-dub-sribliastyi.png",
            "src": "/photos/gallery/frezzatti/fz-14-dub-sribliastyi.jpg"
          },
          {
            "colorSlug": "feldhrau",
            "colorLabel": "фельдграу",
            "swatchImage": "/photos/frezzatti/fz-14-feldhrau.png",
            "src": "/photos/gallery/frezzatti/fz-14-feldhrau.jpg"
          },
          {
            "colorSlug": "oksyd-bilyi",
            "colorLabel": "оксид білий",
            "swatchImage": "/photos/frezzatti/fz-14-oksyd-bilyi.png",
            "src": "/photos/gallery/frezzatti/fz-14-oksyd-bilyi.jpg"
          },
          {
            "colorSlug": "oksyd-svitlyi",
            "colorLabel": "оксид світлий",
            "swatchImage": "/photos/frezzatti/fz-14-oksyd-svitlyi.png",
            "src": "/photos/gallery/frezzatti/fz-14-oksyd-svitlyi.jpg"
          },
          {
            "colorSlug": "oksyd-temnyi",
            "colorLabel": "оксид темний",
            "swatchImage": "/photos/frezzatti/fz-14-oksyd-temnyi.png",
            "src": "/photos/gallery/frezzatti/fz-14-oksyd-temnyi.jpg"
          },
          {
            "colorSlug": "venhe",
            "colorLabel": "венге",
            "swatchImage": "/photos/frezzatti/fz-14-venhe.png",
            "src": "/photos/gallery/frezzatti/fz-14-venhe.jpg"
          },
          {
            "colorSlug": "white",
            "colorLabel": "white",
            "swatchImage": "/photos/frezzatti/fz-14-white.png",
            "src": "/photos/gallery/frezzatti/fz-14-white.jpg"
          }
        ]
      }
    ]
  },
  {
    "key": "perfetto",
    "label": "PERFETTO",
    "models": [
      {
        "code": "PF-01",
        "photos": [
          {
            "colorSlug": null,
            "colorLabel": null,
            "swatchImage": null,
            "src": "/photos/gallery/perfetto/pf-01.jpg"
          }
        ]
      },
      {
        "code": "PF-02",
        "photos": [
          {
            "colorSlug": null,
            "colorLabel": null,
            "swatchImage": null,
            "src": "/photos/gallery/perfetto/pf-02.jpg"
          }
        ]
      }
    ]
  }
];
