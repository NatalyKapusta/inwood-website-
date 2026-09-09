import type { Locale } from "@/lib/i18n";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  blocks: BlogBlock[];
};

const uaPosts: BlogPost[] = [
  {
    slug: "yak-obraty-mizhkimnatni-dveri",
    title: "Як обрати міжкімнатні двері: що краще — фарбовані, ПВХ, приховані чи фрезеровані?",
    excerpt:
      "Розбираємо покриття, конструкцію та монтаж міжкімнатних дверей по черзі — так, як це робить консультант у салоні, коли справді хоче допомогти, а не просто продати.",
    blocks: [
      {
        type: "p",
        text: "Коли доходить до вибору дверей, більшість людей губляться. У каталозі десятки моделей, менеджери сипають термінами — «прихована система», «фрезеровка», «ПВХ» — і незрозуміло, за що взагалі платиш гроші.",
      },
      {
        type: "p",
        text: "Насправді все простіше, ніж здається. Є кілька ключових параметрів, які впливають на вигляд, ціну і те, як довго двері служитимуть. Розберемо їх по черзі — так, як це робить консультант у салоні, коли справді хоче допомогти, а не просто продати.",
      },
      { type: "h2", text: "Фарбовані двері чи ПВХ-плівка: у чому різниця" },
      { type: "p", text: "Це перше питання, яке варто вирішити, бо воно стосується самого покриття полотна." },
      { type: "h3", text: "Фарбовані двері" },
      {
        type: "p",
        text: "Такі двері вкривають фарбою — найчастіше емаллю. Поверхня виходить рівною, глибокою за кольором і без стиків плівки. Саме тому фарбовані двері люблять за естетику: колір можна підібрати практично під будь-яке рішення інтер'єру, а матові або напівматові варіанти виглядають дорого і стримано.",
      },
      {
        type: "ul",
        items: [
          "Плюси: багатий вибір кольорів і відтінків;",
          "гладка, «жива» поверхня без швів;",
          "гарно виглядають у мінімалістичних та сучасних інтер'єрах.",
        ],
      },
      {
        type: "ul",
        items: [
          "Що варто врахувати: фарбоване покриття чутливіше до подряпин і сколів, ніж плівка;",
          "пошкодження на фарбі помітніші, особливо на темних кольорах;",
          "догляд вимагає трохи більшої акуратності — без абразивних засобів для миття.",
        ],
      },
      { type: "h3", text: "Двері з ПВХ-покриттям" },
      {
        type: "p",
        text: "Тут полотно обклеюють плівкою ПВХ, яка імітує текстуру дерева, бетону чи однотонні кольори. Це практичний і популярний варіант для тих, хто цінує невибагливість у щоденному використанні.",
      },
      {
        type: "ul",
        items: [
          "Плюси: стійкість до вологи та щоденних навантажень;",
          "легкий догляд — досить протерти вологою ганчіркою;",
          "зазвичай доступніша ціна порівняно з фарбованими аналогами.",
        ],
      },
      {
        type: "ul",
        items: [
          "Що варто врахувати: вибір фактур і кольорів дещо обмежений тим, що пропонує виробник;",
          "за глибиною тону плівка рідко зрівняється з фарбою.",
        ],
      },
      {
        type: "p",
        text: "Простий приклад: якщо у вас коридор, яким щодня проходить уся родина з дітьми та собакою, ПВХ-двері витримають цей ритм життя без зайвих турбот. А якщо потрібні двері в спальню чи кабінет, де важливий саме вигляд і атмосфера — фарбовані двері розкриють інтер'єр глибше.",
      },
      { type: "h2", text: "Двері прихованого монтажу: коли простір важливіший за деталі" },
      {
        type: "p",
        text: "Двері прихованого монтажу — це конструкція, у якій коробка та наличники сховані під штукатурку або гіпсокартон. Зовні залишається тільки рівне полотно, яке ніби виростає зі стіни — без видимих лиштв і зазорів.",
      },
      { type: "h3", text: "Переваги такого рішення" },
      {
        type: "ul",
        items: [
          "Двері «зливаються» зі стіною, створюючи ефект суцільної поверхні — це особливо цінують шанувальники мінімалізму та сучасного стилю.",
          "Простір візуально виглядає більшим і охайнішим, бо немає зайвих ліній та рамок.",
          "Такі двері можна пофарбувати в колір стіни, і вони стануть майже непомітними.",
        ],
      },
      { type: "h3", text: "Коли варто обирати саме приховану систему" },
      { type: "p", text: "Цей варіант підійде, якщо:" },
      {
        type: "ul",
        items: [
          "ви робите ремонт «під нуль» і закладаєте комунікації та коробки ще на етапі чорнових робіт;",
          "інтер'єр витриманий у стилі мінімалізм, лофт або сучасна класика;",
          "хочеться максимально «чистих» ліній без декоративних елементів.",
        ],
      },
      {
        type: "p",
        text: "Важливий нюанс: двері прихованого монтажу монтуються до фінішного оздоблення стін, тому їх складно «докупити» в уже готовий ремонт. Це рішення варто планувати заздалегідь разом із дизайнером чи будівельниками.",
      },
      { type: "h2", text: "Фрезеровані двері: коли хочеться фактури й характеру" },
      {
        type: "p",
        text: "Фрезеровані двері — це полотна з рельєфним малюнком, який наносять за допомогою фрезерування — тобто вирізають візерунок безпосередньо на поверхні. Найчастіше це геометричні лінії, філенки чи класичні візерунки.",
      },
      { type: "h3", text: "Чим вони відрізняються від гладких дверей" },
      {
        type: "p",
        text: "Гладкі двері — це рівне полотно без жодного рельєфу. Вони універсальні і добре вписуються практично в будь-який стиль, від класики до мінімалізму.",
      },
      {
        type: "p",
        text: "Фрезеровані двері, навпаки, додають інтер'єру виразності. Рельєф створює гру світла й тіні, тому двері виглядають більш «дорого» і по-своєму декоративно.",
      },
      { type: "p", text: "Коли обирати фрезеровані двері:" },
      {
        type: "ul",
        items: [
          "якщо інтер'єр тяжіє до класики, неокласики чи ар-деко, де важлива деталізація;",
          "якщо хочеться, щоб двері стали окремим акцентом кімнати, а не просто функціональним елементом;",
          "у просторих кімнатах, де рельєф не «загубиться».",
        ],
      },
      { type: "p", text: "Коли краще обрати гладкі двері:" },
      {
        type: "ul",
        items: [
          "у невеликих приміщеннях, де зайва деталізація візуально «перевантажує» простір;",
          "у мінімалістичних і сучасних інтер'єрах, де цінується простота ліній.",
        ],
      },
      { type: "h2", text: "На що звернути увагу під час вибору" },
      { type: "p", text: "Коли визначаєтесь із конкретною моделлю, тримайте в голові кілька практичних моментів:" },
      {
        type: "ul",
        items: [
          "Прохідність приміщення. Для коридорів і кімнат з активним використанням практичніше обрати ПВХ-покриття.",
          "Стиль інтер'єру. Мінімалізм тяжіє до гладких і прихованих рішень, класика — до фрезерованих і фарбованих дверей.",
          "Розмір приміщення. У маленьких кімнатах рельєфні двері та яскраві акценти можуть візуально «звужувати» простір.",
          "Етап ремонту. Якщо стіни вже готові, прихований монтаж, найімовірніше, доведеться відкласти до наступного ремонту.",
          "Догляд. Якщо для вас важлива простота у прибиранні — придивіться до ПВХ-покриття.",
        ],
      },
      { type: "h2", text: "Підсумок" },
      {
        type: "p",
        text: "Немає «правильних» чи «неправильних» дверей — є двері, які підходять саме під ваші умови. Якщо цінуєте практичність і легкий догляд — придивіться до ПВХ-покриття. Якщо хочете глибокий колір і естетику — фарбовані двері не розчарують. Для сучасного мінімалістичного простору варто розглянути приховану систему монтажу, а якщо інтер'єр тяжіє до класики й хочеться характеру — зверніть увагу на фрезеровані моделі.",
      },
      {
        type: "p",
        text: "Головна порада проста: перед покупкою подумайте, як саме ви користуватиметесь дверима щодня, у якому стилі витриманий інтер'єр і на якому етапі перебуває ваш ремонт. Відповіді на ці три питання самі підкажуть, який варіант стане для вас найкращим.",
      },
    ],
  },
  {
    slug: "hto-zamovliaie-mizhkimnatni-dveri",
    title: "Хто замовляє міжкімнатні двері: приватні клієнти, бізнес і державні заклади",
    excerpt:
      "Двері купують не тільки для однієї квартири. Розповідаємо, хто ще звертається по міжкімнатні двері — від забудовників і дизайнерів до готелів та кав'ярень.",
    blocks: [
      {
        type: "p",
        text: "Коли думаєш про покупця дверей, зазвичай уявляєш людину, яка робить ремонт у власній квартирі. Насправді коло значно ширше — двері замовляють приватні особи, бізнес і навіть державні та комунальні заклади. У кожного — свої вимоги до об'єму, термінів і того, на що звертати увагу в першу чергу.",
      },
      { type: "h2", text: "Приватні клієнти" },
      {
        type: "p",
        text: "Це найзрозуміліша категорія — люди, які купують двері для себе.",
      },
      {
        type: "ul",
        items: [
          "Власники нових квартир — найчастіше міняють двері «від забудовника», якщо ті невисокої якості, або обирають двері з нуля під час ремонту в новобудові.",
          "Ті, хто робить косметичний чи капітальний ремонт — замінюють старі, зношені двері на нові під оновлений інтер'єр.",
        ],
      },
      { type: "h2", text: "Бізнес і оптові покупці" },
      {
        type: "p",
        text: "Тут вимоги інші: важливі не тільки дизайн і якість, а й здатність виробника закрити великий обсяг у прогнозовані терміни.",
      },
      {
        type: "ul",
        items: [
          "Забудовники та будівельні компанії — закуповують міжкімнатні двері оптом для нових житлових комплексів і котеджних містечок.",
          "Архітектори та дизайнери інтер'єру — підбирають двері під конкретний проєкт клієнта, часто орієнтуючись на колір і фактуру, а не тільки на ціну.",
          "Виконроби та ремонтні бригади — нерідко самі беруть на себе закупівлю дверей під час капітального ремонту квартири чи будинку замовника.",
          "Комерційні приміщення — офіси, готелі, ресторани та кафе, яким потрібні двері зі стильним і водночас зносостійким виглядом.",
        ],
      },
      { type: "h2", text: "Державні та комунальні заклади" },
      {
        type: "p",
        text: "Школи, дитячі садки, лікарні та інші заклади теж регулярно оновлюють двері — найчастіше через тендерні закупівлі. Це окремий сегмент ринку зі своїми вимогами до документації та строків, і не кожен виробник із ним працює.",
      },
      { type: "h2", text: "З ким працює IN WOOD" },
      {
        type: "p",
        text: "Ми спеціалізуємось на міжкімнатних дверях і будуємо співпрацю з дилерами, дистриб'юторами, забудовниками житлової та комерційної нерухомості, дизайнерами інтер'єру, а також готелями та апарт-комплексами. Якщо впізнали себе в одній із цих категорій — на сторінці «Співпраця» можна залишити заявку та отримати персональні умови.",
      },
    ],
  },
  {
    slug: "shhytovi-chy-tsargovi-dveri",
    title: "Щитові чи царгові двері: у чому різниця і як не заплутатися у виборі",
    excerpt:
      "Пояснюємо, чим відрізняється конструкція дверей «зсередини» — і чому продавці взагалі використовують ці терміни.",
    blocks: [
      {
        type: "p",
        text: "«Щитові» і «царгові» — перші слова, які можна почути від консультанта, щойно мова заходить про конструкцію дверей. Але мало хто пояснює, що це насправді означає і чому взагалі варто це знати перед покупкою.",
      },
      { type: "h2", text: "Щитові двері" },
      {
        type: "p",
        text: "Полотно щитових дверей — це суцільна конструкція: дерев'яний брус усередині, заповнений стільниковим наповнювачем, і облицювання з МДФ зверху. Поверхня виходить рівною — гладкою або з декором: молдингом, фрезеруванням, дзеркальними вставками. Це найпоширеніший тип міжкімнатних дверей на ринку.",
      },
      { type: "h2", text: "Царгові двері" },
      {
        type: "p",
        text: "Тут інша логіка: полотно збирають із цільнодерев'яних вертикальних стійок, з'єднаних між собою горизонтальними елементами — царгами. Часто в такій конструкції передбачені скляні вставки — сатин або чорне скло.",
      },
      { type: "h2", text: "Яка різниця на практиці" },
      {
        type: "ul",
        items: [
          "Зовнішній вигляд — щитові двері зазвичай виглядають більш лаконічно й однорідно, царгові — рельєфніше, за рахунок видимих стійок і царг.",
          "Скляні вставки — частіше зустрічаються саме в царгових моделях.",
          "Декор — щитова конструкція дозволяє молдинг, фрезерування, дзеркальні вставки на суцільній поверхні полотна.",
        ],
      },
      { type: "h2", text: "Що виробляє IN WOOD" },
      {
        type: "p",
        text: "Увесь асортимент IN WOOD — щитової конструкції: колекції ETALON, NOMINAL, FREZZATTI, PERFETTO та двері прихованого монтажу. В основі — дерев'яний брус 80×27 мм, стільниковий наповнювач із коміркою 18 мм, облицювання МДФ (4–6 мм залежно від колекції) та алюмінієва крайка для захисту від вологи й пошкоджень. Покриття — ПВХ-плівка або фарбування за картами RAL/NCS, залежно від колекції.",
      },
      { type: "h2", text: "Підсумок" },
      {
        type: "p",
        text: "Якщо консультант каже «щитові» чи «царгові» — тепер зрозуміло, про що йдеться. Для більшості інтер'єрів щитова конструкція — практичний і перевірений вибір: вона стабільна, добре тримає форму і дає простір для декору без зайвого ускладнення монтажу.",
      },
    ],
  },
];

const ruPosts: BlogPost[] = [
  {
    slug: "yak-obraty-mizhkimnatni-dveri",
    title: "Как выбрать межкомнатные двери: что лучше — крашеные, ПВХ, скрытые или фрезерованные?",
    excerpt:
      "Разбираем покрытие, конструкцию и монтаж межкомнатных дверей по порядку — так, как это делает консультант в салоне, когда действительно хочет помочь, а не просто продать.",
    blocks: [
      {
        type: "p",
        text: "Когда доходит до выбора дверей, большинство людей теряются. В каталоге десятки моделей, менеджеры сыпят терминами — «скрытая система», «фрезеровка», «ПВХ» — и непонятно, за что вообще платишь деньги.",
      },
      {
        type: "p",
        text: "На самом деле всё проще, чем кажется. Есть несколько ключевых параметров, которые влияют на внешний вид, цену и то, как долго прослужат двери. Разберём их по порядку — так, как это делает консультант в салоне, когда действительно хочет помочь, а не просто продать.",
      },
      { type: "h2", text: "Крашеные двери или ПВХ-плёнка: в чём разница" },
      { type: "p", text: "Это первый вопрос, который стоит решить, ведь он касается самого покрытия полотна." },
      { type: "h3", text: "Крашеные двери" },
      {
        type: "p",
        text: "Такие двери покрывают краской — чаще всего эмалью. Поверхность получается ровной, глубокой по цвету и без стыков плёнки. Именно поэтому крашеные двери любят за эстетику: цвет можно подобрать практически под любое решение интерьера, а матовые или полуматовые варианты выглядят дорого и сдержанно.",
      },
      {
        type: "ul",
        items: [
          "Плюсы: богатый выбор цветов и оттенков;",
          "гладкая, «живая» поверхность без швов;",
          "хорошо смотрятся в минималистичных и современных интерьерах.",
        ],
      },
      {
        type: "ul",
        items: [
          "Что стоит учитывать: крашеное покрытие чувствительнее к царапинам и сколам, чем плёнка;",
          "повреждения на краске заметнее, особенно на тёмных цветах;",
          "уход требует чуть большей аккуратности — без абразивных средств для мытья.",
        ],
      },
      { type: "h3", text: "Двери с ПВХ-покрытием" },
      {
        type: "p",
        text: "Здесь полотно оклеивают плёнкой ПВХ, которая имитирует текстуру дерева, бетона или однотонные цвета. Это практичный и популярный вариант для тех, кто ценит неприхотливость в повседневном использовании.",
      },
      {
        type: "ul",
        items: [
          "Плюсы: стойкость к влаге и ежедневным нагрузкам;",
          "лёгкий уход — достаточно протереть влажной тряпкой;",
          "обычно более доступная цена по сравнению с крашеными аналогами.",
        ],
      },
      {
        type: "ul",
        items: [
          "Что стоит учитывать: выбор фактур и цветов несколько ограничен тем, что предлагает производитель;",
          "по глубине тона плёнка редко сравнится с краской.",
        ],
      },
      {
        type: "p",
        text: "Простой пример: если у вас коридор, по которому каждый день ходит вся семья с детьми и собакой, ПВХ-двери выдержат этот ритм жизни без лишних хлопот. А если нужны двери в спальню или кабинет, где важен именно внешний вид и атмосфера — крашеные двери раскроют интерьер глубже.",
      },
      { type: "h2", text: "Двери скрытого монтажа: когда пространство важнее деталей" },
      {
        type: "p",
        text: "Двери скрытого монтажа — это конструкция, в которой коробка и наличники спрятаны под штукатурку или гипсокартон. Снаружи остаётся только ровное полотно, которое как будто вырастает из стены — без видимых наличников и зазоров.",
      },
      { type: "h3", text: "Преимущества такого решения" },
      {
        type: "ul",
        items: [
          "Двери «сливаются» со стеной, создавая эффект сплошной поверхности — это особенно ценят поклонники минимализма и современного стиля.",
          "Пространство визуально выглядит больше и аккуратнее, потому что нет лишних линий и рамок.",
          "Такие двери можно покрасить в цвет стены, и они станут почти незаметными.",
        ],
      },
      { type: "h3", text: "Когда стоит выбирать именно скрытую систему" },
      { type: "p", text: "Этот вариант подойдёт, если:" },
      {
        type: "ul",
        items: [
          "вы делаете ремонт «с нуля» и закладываете коммуникации и коробки ещё на этапе черновых работ;",
          "интерьер выдержан в стиле минимализм, лофт или современная классика;",
          "хочется максимально «чистых» линий без декоративных элементов.",
        ],
      },
      {
        type: "p",
        text: "Важный нюанс: двери скрытого монтажа устанавливаются до финишной отделки стен, поэтому их сложно «докупить» в уже готовый ремонт. Это решение стоит планировать заранее вместе с дизайнером или строителями.",
      },
      { type: "h2", text: "Фрезерованные двери: когда хочется фактуры и характера" },
      {
        type: "p",
        text: "Фрезерованные двери — это полотна с рельефным рисунком, который наносят с помощью фрезеровки — то есть вырезают узор непосредственно на поверхности. Чаще всего это геометрические линии, филёнки или классические узоры.",
      },
      { type: "h3", text: "Чем они отличаются от гладких дверей" },
      {
        type: "p",
        text: "Гладкие двери — это ровное полотно без какого-либо рельефа. Они универсальны и хорошо вписываются практически в любой стиль, от классики до минимализма.",
      },
      {
        type: "p",
        text: "Фрезерованные двери, наоборот, добавляют интерьеру выразительности. Рельеф создаёт игру света и тени, поэтому двери выглядят более «дорого» и по-своему декоративно.",
      },
      { type: "p", text: "Когда выбирать фрезерованные двери:" },
      {
        type: "ul",
        items: [
          "если интерьер тяготеет к классике, неоклассике или ар-деко, где важна детализация;",
          "если хочется, чтобы двери стали отдельным акцентом комнаты, а не просто функциональным элементом;",
          "в просторных комнатах, где рельеф не «потеряется».",
        ],
      },
      { type: "p", text: "Когда лучше выбрать гладкие двери:" },
      {
        type: "ul",
        items: [
          "в небольших помещениях, где лишняя детализация визуально «перегружает» пространство;",
          "в минималистичных и современных интерьерах, где ценится простота линий.",
        ],
      },
      { type: "h2", text: "На что обратить внимание при выборе" },
      { type: "p", text: "Когда определяетесь с конкретной моделью, держите в голове несколько практических моментов:" },
      {
        type: "ul",
        items: [
          "Проходимость помещения. Для коридоров и комнат с активным использованием практичнее выбрать ПВХ-покрытие.",
          "Стиль интерьера. Минимализм тяготеет к гладким и скрытым решениям, классика — к фрезерованным и крашеным дверям.",
          "Размер помещения. В маленьких комнатах рельефные двери и яркие акценты могут визуально «сужать» пространство.",
          "Этап ремонта. Если стены уже готовы, скрытый монтаж, скорее всего, придётся отложить до следующего ремонта.",
          "Уход. Если для вас важна простота уборки — присмотритесь к ПВХ-покрытию.",
        ],
      },
      { type: "h2", text: "Итог" },
      {
        type: "p",
        text: "Нет «правильных» или «неправильных» дверей — есть двери, которые подходят именно под ваши условия. Если цените практичность и лёгкий уход — присмотритесь к ПВХ-покрытию. Если хотите глубокий цвет и эстетику — крашеные двери не разочаруют. Для современного минималистичного пространства стоит рассмотреть скрытую систему монтажа, а если интерьер тяготеет к классике и хочется характера — обратите внимание на фрезерованные модели.",
      },
      {
        type: "p",
        text: "Главный совет прост: перед покупкой подумайте, как именно вы будете пользоваться дверьми каждый день, в каком стиле выдержан интерьер и на каком этапе находится ваш ремонт. Ответы на эти три вопроса сами подскажут, какой вариант станет для вас лучшим.",
      },
    ],
  },
  {
    slug: "hto-zamovliaie-mizhkimnatni-dveri",
    title: "Кто заказывает межкомнатные двери: частные клиенты, бизнес и государственные учреждения",
    excerpt:
      "Двери покупают не только для одной квартиры. Рассказываем, кто ещё обращается за межкомнатными дверями — от застройщиков и дизайнеров до отелей и кафе.",
    blocks: [
      {
        type: "p",
        text: "Когда думаешь о покупателе дверей, обычно представляешь человека, который делает ремонт в собственной квартире. На самом деле круг намного шире — двери заказывают частные лица, бизнес и даже государственные и коммунальные учреждения. У каждого — свои требования к объёму, срокам и тому, на что обращать внимание в первую очередь.",
      },
      { type: "h2", text: "Частные клиенты" },
      {
        type: "p",
        text: "Это самая понятная категория — люди, которые покупают двери для себя.",
      },
      {
        type: "ul",
        items: [
          "Владельцы новых квартир — чаще всего меняют двери «от застройщика», если те невысокого качества, или выбирают двери с нуля во время ремонта в новостройке.",
          "Те, кто делает косметический или капитальный ремонт — заменяют старые, изношенные двери на новые под обновлённый интерьер.",
        ],
      },
      { type: "h2", text: "Бизнес и оптовые покупатели" },
      {
        type: "p",
        text: "Здесь требования другие: важны не только дизайн и качество, но и способность производителя закрыть большой объём в прогнозируемые сроки.",
      },
      {
        type: "ul",
        items: [
          "Застройщики и строительные компании — закупают межкомнатные двери оптом для новых жилых комплексов и коттеджных городков.",
          "Архитекторы и дизайнеры интерьера — подбирают двери под конкретный проект клиента, часто ориентируясь на цвет и фактуру, а не только на цену.",
          "Прорабы и ремонтные бригады — нередко сами берут на себя закупку дверей во время капитального ремонта квартиры или дома заказчика.",
          "Коммерческие помещения — офисы, отели, рестораны и кафе, которым нужны двери со стильным и при этом износостойким видом.",
        ],
      },
      { type: "h2", text: "Государственные и коммунальные учреждения" },
      {
        type: "p",
        text: "Школы, детские сады, больницы и другие учреждения тоже регулярно обновляют двери — чаще всего через тендерные закупки. Это отдельный сегмент рынка со своими требованиями к документации и срокам, и не каждый производитель с ним работает.",
      },
      { type: "h2", text: "С кем работает IN WOOD" },
      {
        type: "p",
        text: "Мы специализируемся на межкомнатных дверях и строим сотрудничество с дилерами, дистрибьюторами, застройщиками жилой и коммерческой недвижимости, дизайнерами интерьера, а также отелями и апарт-комплексами. Если узнали себя в одной из этих категорий — на странице «Сотрудничество» можно оставить заявку и получить персональные условия.",
      },
    ],
  },
  {
    slug: "shhytovi-chy-tsargovi-dveri",
    title: "Щитовые или царговые двери: в чём разница и как не запутаться в выборе",
    excerpt:
      "Объясняем, чем отличается конструкция дверей «изнутри» — и почему продавцы вообще используют эти термины.",
    blocks: [
      {
        type: "p",
        text: "«Щитовые» и «царговые» — первые слова, которые можно услышать от консультанта, как только речь заходит о конструкции дверей. Но мало кто объясняет, что это на самом деле значит и почему вообще стоит это знать перед покупкой.",
      },
      { type: "h2", text: "Щитовые двери" },
      {
        type: "p",
        text: "Полотно щитовых дверей — это цельная конструкция: деревянный брус внутри, заполненный сотовым наполнителем, и облицовка из МДФ сверху. Поверхность получается ровной — гладкой или с декором: молдингом, фрезеровкой, зеркальными вставками. Это самый распространённый тип межкомнатных дверей на рынке.",
      },
      { type: "h2", text: "Царговые двери" },
      {
        type: "p",
        text: "Здесь другая логика: полотно собирают из цельнодеревянных вертикальных стоек, соединённых между собой горизонтальными элементами — царгами. Часто в такой конструкции предусмотрены стеклянные вставки — сатин или чёрное стекло.",
      },
      { type: "h2", text: "Какая разница на практике" },
      {
        type: "ul",
        items: [
          "Внешний вид — щитовые двери обычно выглядят более лаконично и однородно, царговые — рельефнее, за счёт видимых стоек и царг.",
          "Стеклянные вставки — чаще встречаются именно в царговых моделях.",
          "Декор — щитовая конструкция позволяет молдинг, фрезеровку, зеркальные вставки на цельной поверхности полотна.",
        ],
      },
      { type: "h2", text: "Что производит IN WOOD" },
      {
        type: "p",
        text: "Весь ассортимент IN WOOD — щитовой конструкции: коллекции ETALON, NOMINAL, FREZZATTI, PERFETTO и двери скрытого монтажа. В основе — деревянный брус 80×27 мм, сотовый наполнитель с ячейкой 18 мм, облицовка МДФ (4–6 мм в зависимости от коллекции) и алюминиевая кромка для защиты от влаги и повреждений. Покрытие — ПВХ-плёнка или окраска по картам RAL/NCS, в зависимости от коллекции.",
      },
      { type: "h2", text: "Итог" },
      {
        type: "p",
        text: "Если консультант говорит «щитовые» или «царговые» — теперь понятно, о чём речь. Для большинства интерьеров щитовая конструкция — практичный и проверенный выбор: она стабильна, хорошо держит форму и даёт простор для декора без лишнего усложнения монтажа.",
      },
    ],
  },
];

const enPosts: BlogPost[] = [
  {
    slug: "yak-obraty-mizhkimnatni-dveri",
    title: "How to choose interior doors: painted, PVC-film, flush-mount or milled?",
    excerpt:
      "We break down door finish, construction and installation one by one — the way a showroom consultant does when they genuinely want to help, not just sell.",
    blocks: [
      {
        type: "p",
        text: "When it comes to choosing doors, most people get lost. The catalogue has dozens of models, and staff throw around terms like \"flush system\", \"milling\", \"PVC\" — and it's unclear what you're actually paying for.",
      },
      {
        type: "p",
        text: "In reality it's simpler than it looks. There are a few key parameters that affect the look, the price, and how long the doors will last. Let's go through them one by one — the way a showroom consultant does when they genuinely want to help, not just sell.",
      },
      { type: "h2", text: "Painted doors or PVC film: what's the difference" },
      { type: "p", text: "This is the first question worth settling, since it concerns the door leaf's finish itself." },
      { type: "h3", text: "Painted doors" },
      {
        type: "p",
        text: "These doors are coated with paint — most often enamel. The surface comes out even, deep in colour, with no film seams. That's exactly why painted doors are loved for their aesthetics: the colour can be matched to almost any interior, and matte or semi-matte finishes look expensive and understated.",
      },
      {
        type: "ul",
        items: [
          "Pros: a rich choice of colours and shades;",
          "a smooth, \"living\" surface with no seams;",
          "look great in minimalist and modern interiors.",
        ],
      },
      {
        type: "ul",
        items: [
          "Worth considering: a painted finish is more sensitive to scratches and chips than film;",
          "damage is more visible on paint, especially on dark colours;",
          "care requires a bit more attention — no abrasive cleaning products.",
        ],
      },
      { type: "h3", text: "PVC-film doors" },
      {
        type: "p",
        text: "Here the door leaf is covered with PVC film that imitates wood texture, concrete, or solid colours. It's a practical and popular option for those who value low-maintenance everyday use.",
      },
      {
        type: "ul",
        items: [
          "Pros: resistance to moisture and daily wear;",
          "easy care — just wipe with a damp cloth;",
          "usually a more accessible price than painted equivalents.",
        ],
      },
      {
        type: "ul",
        items: [
          "Worth considering: the choice of textures and colours is somewhat limited to what the manufacturer offers;",
          "film rarely matches paint in depth of tone.",
        ],
      },
      {
        type: "p",
        text: "A simple example: if you have a hallway that the whole family, kids and dog walk through every day, PVC doors will handle that pace of life without extra fuss. But if you need a door for a bedroom or study, where the look and atmosphere matter most, painted doors will bring out the interior more deeply.",
      },
      { type: "h2", text: "Flush-mount doors: when space matters more than detail" },
      {
        type: "p",
        text: "Flush-mount doors are a construction where the frame and casings are hidden under plaster or drywall. From the outside, only a flat leaf remains, appearing to grow out of the wall — with no visible casings or gaps.",
      },
      { type: "h3", text: "Advantages of this solution" },
      {
        type: "ul",
        items: [
          "The door \"merges\" with the wall, creating the effect of a continuous surface — especially valued by fans of minimalism and modern style.",
          "The space visually looks bigger and neater, since there are no extra lines or frames.",
          "Such doors can be painted the colour of the wall, making them almost invisible.",
        ],
      },
      { type: "h3", text: "When to choose a flush system specifically" },
      { type: "p", text: "This option suits you if:" },
      {
        type: "ul",
        items: [
          "you're renovating \"from scratch\" and can lay in the ductwork and frames at the rough-construction stage;",
          "your interior is minimalist, loft, or modern classic style;",
          "you want the cleanest possible lines with no decorative elements.",
        ],
      },
      {
        type: "p",
        text: "An important nuance: flush-mount doors are installed before the final wall finishing, so they're hard to \"add on\" to an already finished renovation. This solution should be planned in advance together with a designer or builders.",
      },
      { type: "h2", text: "Milled doors: when you want texture and character" },
      {
        type: "p",
        text: "Milled doors are leaves with a relief pattern applied by milling — that is, the pattern is cut directly into the surface. Most often these are geometric lines, panel mouldings, or classic patterns.",
      },
      { type: "h3", text: "How they differ from flat doors" },
      {
        type: "p",
        text: "Flat doors are an even leaf with no relief at all. They're versatile and fit almost any style, from classic to minimalist.",
      },
      {
        type: "p",
        text: "Milled doors, on the other hand, add expressiveness to the interior. The relief creates a play of light and shadow, so the doors look more \"expensive\" and decorative in their own way.",
      },
      { type: "p", text: "When to choose milled doors:" },
      {
        type: "ul",
        items: [
          "if your interior leans toward classic, neoclassical, or art deco style, where detail matters;",
          "if you want the door to become a standalone accent of the room rather than just a functional element;",
          "in spacious rooms, where the relief won't get \"lost\".",
        ],
      },
      { type: "p", text: "When flat doors are the better choice:" },
      {
        type: "ul",
        items: [
          "in small rooms, where extra detail can visually \"overload\" the space;",
          "in minimalist and modern interiors, where simplicity of line is valued.",
        ],
      },
      { type: "h2", text: "What to pay attention to when choosing" },
      { type: "p", text: "When settling on a specific model, keep a few practical points in mind:" },
      {
        type: "ul",
        items: [
          "Foot traffic. For hallways and heavily used rooms, PVC finish is the more practical choice.",
          "Interior style. Minimalism leans toward flat and flush solutions; classic style toward milled and painted doors.",
          "Room size. In small rooms, relief doors and bold accents can visually \"narrow\" the space.",
          "Renovation stage. If the walls are already finished, flush-mount installation will most likely need to wait for the next renovation.",
          "Care. If ease of cleaning matters to you, take a closer look at PVC finish.",
        ],
      },
      { type: "h2", text: "In summary" },
      {
        type: "p",
        text: "There's no \"right\" or \"wrong\" door — only a door that fits your particular conditions. If you value practicality and easy care, take a closer look at PVC finish. If you want deep colour and aesthetics, painted doors won't disappoint. For a modern minimalist space, consider a flush-mount system, and if your interior leans classic and you want character, look at milled models.",
      },
      {
        type: "p",
        text: "The main advice is simple: before buying, think about how exactly you'll use the door every day, what style your interior is in, and what stage your renovation is at. The answers to these three questions will point you to the best option for you.",
      },
    ],
  },
  {
    slug: "hto-zamovliaie-mizhkimnatni-dveri",
    title: "Who orders interior doors: private clients, businesses and public institutions",
    excerpt:
      "Doors aren't just bought for a single apartment. Here's who else orders interior doors — from developers and designers to hotels and cafes.",
    blocks: [
      {
        type: "p",
        text: "When you picture a door buyer, you probably imagine someone renovating their own apartment. In reality, the circle is much wider — doors are ordered by private individuals, businesses, and even public and municipal institutions. Each group has its own requirements for volume, timelines, and what matters most.",
      },
      { type: "h2", text: "Private clients" },
      {
        type: "p",
        text: "This is the most straightforward category — people buying doors for themselves.",
      },
      {
        type: "ul",
        items: [
          "New apartment owners — most often replace the \"developer-grade\" doors if they're low quality, or choose doors from scratch during a new-build renovation.",
          "Anyone doing a cosmetic or major renovation — replacing old, worn doors with new ones as part of an interior refresh.",
        ],
      },
      { type: "h2", text: "Business and wholesale buyers" },
      {
        type: "p",
        text: "Here the requirements differ: design and quality matter, but so does the manufacturer's ability to deliver a large volume within a predictable timeframe.",
      },
      {
        type: "ul",
        items: [
          "Developers and construction companies — purchase interior doors wholesale for new residential complexes and cottage communities.",
          "Architects and interior designers — select doors for a specific client project, often prioritising colour and texture over price alone.",
          "Site managers and renovation crews — often take on door procurement themselves during a client's major renovation.",
          "Commercial spaces — offices, hotels, restaurants and cafes that need doors with a stylish yet durable look.",
        ],
      },
      { type: "h2", text: "Public and municipal institutions" },
      {
        type: "p",
        text: "Schools, kindergartens, hospitals and other institutions also update their doors regularly — most often through tender procurement. This is a distinct market segment with its own documentation and timeline requirements, and not every manufacturer works with it.",
      },
      { type: "h2", text: "Who IN WOOD works with" },
      {
        type: "p",
        text: "We specialise in interior doors and build partnerships with dealers, distributors, residential and commercial developers, interior designers, as well as hotels and apartment complexes. If you recognised yourself in one of these categories, you can leave a request on the Partnership page and get personalised terms.",
      },
    ],
  },
  {
    slug: "shhytovi-chy-tsargovi-dveri",
    title: "Panel vs. stile-and-rail doors: what's the difference and how to choose",
    excerpt:
      "We explain how door construction differs \"on the inside\" — and why sales staff use these terms in the first place.",
    blocks: [
      {
        type: "p",
        text: "\"Panel\" and \"stile-and-rail\" are usually the first terms you'll hear from a showroom consultant as soon as door construction comes up. Few people explain what they actually mean, or why it's worth knowing before you buy.",
      },
      { type: "h2", text: "Panel doors" },
      {
        type: "p",
        text: "A panel door leaf is a solid construction: a wooden frame filled with a honeycomb core, faced with MDF. The surface comes out flat — smooth, or decorated with moulding, milling, or mirror inserts. This is the most common type of interior door on the market.",
      },
      { type: "h2", text: "Stile-and-rail doors" },
      {
        type: "p",
        text: "The logic here is different: the leaf is assembled from solid-wood vertical stiles joined together by horizontal elements called rails (tsargas). This construction often includes glass inserts — satin or black glass.",
      },
      { type: "h2", text: "What the difference means in practice" },
      {
        type: "ul",
        items: [
          "Look — panel doors tend to look more streamlined and uniform, while stile-and-rail doors look more textured, thanks to the visible stiles and rails.",
          "Glass inserts — more common in stile-and-rail models.",
          "Decor — panel construction allows moulding, milling and mirror inserts across a solid door face.",
        ],
      },
      { type: "h2", text: "What IN WOOD manufactures" },
      {
        type: "p",
        text: "IN WOOD's entire range is panel construction: the ETALON, NOMINAL, FREZZATTI and PERFETTO collections, plus flush-mount doors. The core is a wooden frame at 80×27 mm, a honeycomb core with an 18 mm cell, MDF facing (4–6 mm depending on the collection), and an aluminium edge for protection against moisture and damage. The finish is PVC film or RAL/NCS painted colour, depending on the collection.",
      },
      { type: "h2", text: "In summary" },
      {
        type: "p",
        text: "So when a consultant says \"panel\" or \"stile-and-rail\", now you know what they mean. For most interiors, panel construction is a practical, proven choice — it's stable, holds its shape well, and leaves plenty of room for decor without complicating installation.",
      },
    ],
  },
];

export const blogPosts: Record<Locale, BlogPost[]> = {
  ua: uaPosts,
  ru: ruPosts,
  en: enPosts,
};

export function getBlogPost(locale: Locale, slug: string): BlogPost | undefined {
  return blogPosts[locale].find((p) => p.slug === slug);
}
