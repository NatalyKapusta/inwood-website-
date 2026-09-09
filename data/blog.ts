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
];

export const blogPosts: Record<Locale, BlogPost[]> = {
  ua: uaPosts,
  ru: ruPosts,
  en: enPosts,
};

export function getBlogPost(locale: Locale, slug: string): BlogPost | undefined {
  return blogPosts[locale].find((p) => p.slug === slug);
}
